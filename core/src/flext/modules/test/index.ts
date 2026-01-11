import { nodeInputRule, nodePasteRule, Node } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import { Obj } from '@/types';
import { isset, inarr, has, isNumber } from '@/lib';
import { BaseWarning } from '@/errors';
import View from './View.vue';


// Types

export type Argument = {
    name?: string|null,
    value: string|number|boolean|null,
};


// Constants

export const EDITOR_MODULE_NAME = 'flextTest';

export const MODULE_NAME = 'test';

export const ATTRIBUTE_PREFIX = 'jetedit-' + EDITOR_MODULE_NAME;

export const TEST_STATEMENT = /{{\s+test\s+(?<field>.+?)(?<argsToken>\s+(?<args>.+))?\s+}}/;

export const NUMBER_BOOL_OR_NULL_ARGUMENT = /(?<nameToken>(?<name>.+)=)?(?<value>.+)/;

export const STRING_ARGUMENT = /(?<nameToken>(?<name>.+)=)?("?<value>.+")/;


// Classes

export class NotAnAttrWarning extends BaseWarning {
    public name = 'NotAnAttrWarning';

    constructor(message: string = 'The given string is not attribute') {
        super(message);
    }
}


// Functions

export function strToNumberBoolOrNullArg(val: string): Argument {
    const matches: any = val?.match(NUMBER_BOOL_OR_NULL_ARGUMENT) ?? {};
    return matches?.groups ?? {};
}

export function strToArg(val: string): Argument {

    // If the value is number, boor or null

    if (NUMBER_BOOL_OR_NULL_ARGUMENT.test(val))
        return strToNumberBoolOrNullArg(val);


    // Doing some checks

    if (!STRING_ARGUMENT.test(val))
        throw new NotAnAttrWarning(`Unable to get attribute: String '${val}' is not an attribute: This might be an internal error`);


    // Getting the data

    const matches: any = val?.match(STRING_ARGUMENT) ?? {};


    return matches?.groups ?? {};
}

export function objToArgs(val: Obj): Argument[] {
    const result: Argument[] = [];


    // Defining the functions

    const add = (name: string, value?: string|number|boolean|null): void => {
        if (isNumber(name))
            result.push({ value });
        else
            result.push({ name, value });
    };


    // Getting the tokens

    for (const attrName in val) {
        if (!has(val, attrName)) continue;

        const attrValue = val[attrName];

        add(attrName, attrValue);
    }


    return result;
}

export function argToStr(arg: Argument): string {
    if (!arg?.name && inarr(typeof arg.value, 'number', 'boolean', 'null'))
        return String(arg.value);
    else if (!arg?.name)
        return `"${arg.value}"`;
    else if (inarr(typeof arg.value, 'number', 'boolean', 'null'))
        return arg.name + '=' + arg.value;
    else
        return `${arg.name}="${arg.value}"`;
}

export function getRule(node: any): any {
    return {
        find: TEST_STATEMENT,
        type: node.type,
        getAttributes: m => {
            const field = m?.groups?.field ?? null;
            const argsStr = m?.groups?.args || '';
            const argsArr = argsStr?.split(' ')?.filter(a => !!a?.trim()) ?? [];
            const args = argsArr.map(strToArg);


            // Getting the data

            const attrs: Obj<string> = {};

            const add = (name: string|number, value?: string|null): void => { attrs[ATTRIBUTE_PREFIX + '-' + name] = isset(value) ? value : ''; };

            for (const [ i, arg ] of args.entries()) {
                if (arg?.name)
                    add(arg?.name ?? 'unknown', arg?.value ?? null);
                else
                    add(i, arg?.value ?? null);
            }


            return { field, ...attrs };
        },
    };
}


export const FlextTest = Node.create({
    name: 'flextTest',
    group: 'inline*',
    inline: true,
    atom: false,

    addAttributes() {
        return {
            field: {
                default: null,
                parseHTML: el => el.getAttribute(`data-${ATTRIBUTE_PREFIX}-field`),
                renderHTML: attrs => ({ 'data-jetedit-test-field': attrs?.field ?? null }),
            },
        };
    },

    addInputRules() {
        return [ nodeInputRule(getRule(this)) ];
    },

    addPasteRules() {
        return [ nodePasteRule(getRule(this)) ];
    },

    parseHTML() {
        return [
            { tag: `span[data-jetedit="${EDITOR_MODULE_NAME}"]` },
        ];
    },

    renderHTML() {
        return [ MODULE_NAME, { 'data-jetedit': EDITOR_MODULE_NAME } ];
    },

    renderText({ node }) {
        const field = node.attrs?.field ?? null;
        const argTokens: string[] = [];


        // Defining the functions

        const add = (arg: Argument): void => { argTokens.push(argToStr(arg)); };


        // Getting the tokens

        for (const name in node.attrs) {
            if (!has(node.attrs, name)) continue;

            const value = node.attrs[name];

            add({ name, value });
        }


        if (argTokens.length > 0)
            return `{{ ${MODULE_NAME} ${field} ${argTokens.join(' ')} }}`;
        else
            return `{{ ${MODULE_NAME} ${field} }}`;
    },

    addNodeView() {
        return VueNodeViewRenderer(View);
    },

    // @ts-ignore
    addCommands() {
        return {
            insertTest: (attrs: { id: string }) => ({ commands }) => commands.insertContent({
                type: this.name,
                attrs,
            }),
        };
    },
});

export default FlextTest;
