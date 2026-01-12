import { mergeAttributes, Mark, InputRule, PasteRule } from '@tiptap/core';
import { BaseWarning } from '@/errors';


// Types

export type Argument = {
    name?: string|null,
    value: string|number|boolean|null,
};


// Constants

export const MODULE_NAME = 'flextPut';

export const PUT_STATEMENT = /{{\s+put\s+(?<field>.+?)(?<fallbackToken>\s+"(?<fallback>.+?)")?(?<argsToken>\s+(?<args>.+))?\s+}}/;

export const NUMBER_BOOL_OR_NULL_ARGUMENT = /(?<nameToken>(?<name>.+)=)?(?<value>.+)/;

export const STRING_ARGUMENT = /(?<nameToken>(?<name>.+)=)?("?<value>.+")/;

export const FALLBACK_DESCR = 'here';


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
    const { name = null, value = null } = matches?.groups ?? {};

    return { name, value };
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

    const { name = null, value = null } = matches?.groups ?? {};


    return { name, value };
}

export function getRuleData(val: any): any {
    const { state, range, match } = val ?? {};
    const { tr } = state ?? {};
    const field = match?.groups?.field || 'unknown';
    const fallback = match?.groups?.fallback ?? null;
    const argsStr = match?.groups?.args || '';
    const argsArr = argsStr?.split(' ')?.filter(a => !!a?.trim()) ?? [];
    const args = argsArr.map(strToArg);


    // Adding the mark

    const value = fallback ? fallback : `'${field}' ${FALLBACK_DESCR}`;

    tr.insertText(value, range.from, range.to);

    tr.addMark(range.from, range.from + value.length, state.schema.marks[MODULE_NAME].create({ field: field, args: JSON.stringify(args) }));


    return tr;
}


export const FlextPut = Mark.create({
    name: MODULE_NAME,

    inclusive: false,

    addAttributes() {
        return {
            field: {
                default: null,
                parseHTML: el => el.getAttribute( 'data-jetedit-field') ?? el.textContent,
                renderHTML: attrs => ({ 'data-jetedit-field': attrs.field }),
            },
            args: {
                default: null,
                parseHTML: el => el.getAttribute( 'data-jetedit-args') ?? el.textContent,
                renderHTML: attrs => ({ 'data-jetedit-args': attrs.args }),
            },
        };
    },

    addInputRules() {
        return [
            new InputRule({
                find: PUT_STATEMENT,
                handler: getRuleData,
            }),
        ];
    },

    addPasteRules() {
        return [
            new PasteRule({
                find: PUT_STATEMENT,
                handler: getRuleData,
            }),
        ];
    },

    parseHTML() {
        return [
            { tag: `span[data-jetedit="${MODULE_NAME}"]` },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'span',
            mergeAttributes(HTMLAttributes, {
                'class': 'text-blue-500',
                'data-jetedit': MODULE_NAME,
            }),
            0,
        ];
    },
});

export default FlextPut;
