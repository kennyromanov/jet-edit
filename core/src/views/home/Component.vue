<script setup lang="ts">

import { ref, computed, watch, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { Undo, Redo, Bold, Italic, Underline, Strikethrough, Zap } from 'lucide-vue-next';
import { Obj, DocumentRecord } from '@/types';
import { isset, nanoid } from '@/lib';
import { BaseError } from '@/errors';
import { Button } from '@/shadcn/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/components/ui/select';
import store from '@/pinia/store';
import Editor from '@/components/Editor.vue';
import ToolbarAccess from '@/components/ToolbarAccess.vue';
import FlextPut from '@/flext/modules/put';


// Third-parties

const appStore = store.useApp();


// Types

type Heading = 'title' | 'heading' | 'subheading' | 'body';


// Defining the variables

const appStoreRefs = storeToRefs(appStore);
const _document = appStoreRefs?.document ?? ref({});
const editorEl = ref<any>(null);
const extensions = ref<any[]>([ FlextPut ]);


// Defining the functions

const getLineHeading = (tiptap: any): Heading => {

  // Defining the functions

  const test = (level: number): boolean => !!tiptap?.isActive('heading', { level });


  // Getting the heading

  if (test(1))
    return 'title';

  else if (test(2))
    return 'title';

  else if (test(3))
    return 'heading';

  else if (test(4))
    return 'subheading';

  else
    return 'body';
};

const setLineHeading = (val: Heading, tiptap: any): void => {

  // Defining the functions

  const handle = (level: number): void => tiptap?.commands?.setHeading({ level });

  const rem = (): void => tiptap?.commands?.setParagraph();


  // Setting the heading

  switch (val) {
    case 'title':
      handle(2);
      break;

    case 'heading':
      handle(3);
      break;

    case 'subheading':
      handle(4);
      break;

    case 'body':
    default:
      rem();
  }
};

const addDocument = (name: string, data: string, _val: Obj = {}): void => {
  const _id = nanoid();

  const get = (): string => data;

  appStore.addDocument({ id: _id, name: name, get: get, ..._val });

  appStore.setEditorDocument({ id: _id, name: name, data: data, ..._val });
};

const setDocument = (_id: string, _val: Obj = {}): void => {

  // Getting the document

  const __document: DocumentRecord = appStore.getDocumentById(_id);

  if (!__document) throw new BaseError(`Unable to update the document: documentId '${_id}' does not exist`);


  // Updating the document

  appStore.setDocumentById(_id, { ...__document, ..._val } as any);

  appStore.setEditorDocument({ ...__document, ..._val } as any);
};

const setDocumentData = (_id: string, data: string|null = null): void => {
  setDocument(_id, { data });
};


// Defining the computed

const id = computed<string|null>(() => _document.value?.id ?? null);

const val = computed<string|null>({
  get(): string|null {
    return _document.value?.data ?? null;
  },
  async set(_val: string|null): Promise<void> {

    // Doing some checks

    if (!isset(_document.value)) {
      const len = _val?.length ?? 0;

      const extra = { position: len + 1 };

      addDocument('Unknown Document', _val, { extra });

      return;
    }

    if (!isset(_val)) {
      setDocumentData(id.value, '');
      return;
    }


    // Updating the data

    setDocumentData(id.value, _val);
  },
});

const position = computed<number|null>({
  get(): number|null {
    if (isset(_document.value))
      return _document.value?.extra?.position ?? null;
    else
      return null;
  },
  set(_val: number|null): void {
    if (!isset(_document.value)) return;

    const extra = { position: _val };

    setDocument(id.value, { extra });
  },
});


// Defining the watchers

watch(id, async () => {
  await nextTick();
  editorEl.value?.focus();
});

</script>

<template>
  <Editor
      :key="id"
      class="jetedit_home_view h-full"
      hint="Once upon a midnight dreary…"
      :extensions="extensions"
      v-model:position="position"
      v-model="val"
      ref="editorEl"
  >
    <template #controls="{ tiptap }">
      <ToolbarAccess>
        <template #label>
          <div class="jetedit_control flex select-none" aria-label="History">
            <Button
                size="sm"
                variant="ghost"
                :disabled="!tiptap.can().undo()"
                @click="tiptap.commands.undo()"
            >
              <Undo />
            </Button>

            <Button
                size="sm"
                variant="ghost"
                :disabled="!tiptap.can().redo()"
                @click="tiptap.commands.redo()"
            >
              <Redo />
            </Button>
          </div>
        </template>

        <div class="jetedit_controls w-full flex flex-col gap-[var(--jetedit-editor-padding)]">
          <div class="p-1 flex justify-between rounded-lg border-[1px] border-gray-200" aria-label="Text formatting">
            <Button
                class="jetedit_control w-9"
                size="sm"
                variant="ghost"
                :disabled="!tiptap.can().toggleBold()"
                :data-active="Number(tiptap.isActive('bold'))"
                @click="tiptap.commands.toggleBold()"
            >
              <Bold />
            </Button>

            <Button
                class="jetedit_control w-9"
                size="sm"
                variant="ghost"
                :disabled="!tiptap.can().toggleItalic()"
                :data-active="Number(tiptap.isActive('italic'))"
                @click="tiptap.commands.toggleItalic()"
            >
              <Italic />
            </Button>

            <Button
                class="jetedit_control w-9"
                size="sm"
                variant="ghost"
                :disabled="!tiptap.can().toggleBlockquote()"
                :data-active="Number(tiptap.isActive('underline'))"
                @click="tiptap.commands.toggleUnderline()"
            >
              <Underline />
            </Button>

            <Button
                class="jetedit_control w-9"
                size="sm"
                variant="ghost"
                :disabled="!tiptap.can().toggleStrike()"
                :data-active="Number(tiptap.isActive('strike'))"
                @click="tiptap.commands.toggleStrike()"
            >
              <Strikethrough />
            </Button>
          </div>

          <div class="jetedit_control flex gap-1" aria-label="Headings">
            <Select
                :model-value="getLineHeading(tiptap)"
                @update:model-value="h => setLineHeading(h as Heading, tiptap)"
            >
              <SelectTrigger class="w-full shadow-none">
                <SelectValue />
              </SelectTrigger>

              <SelectContent @closeAutoFocus.prevent>
                <SelectItem value="title">
                  Title
                </SelectItem>

                <SelectItem value="heading">
                  Heading
                </SelectItem>

                <SelectItem value="subheading">
                  Subheading
                </SelectItem>

                <SelectItem value="body">
                  Body
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="jetedit_control flex flex-wrap gap-1" aria-label="Blocks">
            <Button
                size="sm"
                :variant="tiptap.isActive('bulletList') ? 'default' : 'secondary'"
                @click="tiptap.commands.toggleBulletList()"
            >
              Bullet
            </Button>

            <Button
                size="sm"
                :variant="tiptap.isActive('orderedList') ? 'default' : 'secondary'"
                @click="tiptap.commands.toggleLink()"
            >
              List
            </Button>

            <Button
                size="sm"
                :variant="tiptap.isActive('codeBlock') ? 'default' : 'secondary'"
                @click="tiptap.commands.toggleCodeBlock()"
            >
              Code
            </Button>

            <Button
                size="sm"
                :variant="tiptap.isActive('blockquote') ? 'default' : 'secondary'"
                @click="tiptap.commands.toggleBlockquote()"
            >
              Quote
            </Button>
          </div>

          <div class="jetedit_control flex flex-wrap gap-1" aria-label="Blocks">
            <Button
                size="sm"
                :variant="tiptap.isActive('bulletList') ? 'default' : 'secondary'"
                @click="tiptap.commands.toggleBulletList()"
            >
              <Zap />
              Smart
            </Button>
          </div>
        </div>
      </ToolbarAccess>
    </template>
  </Editor>
</template>

<style scoped>

.jetedit_control {
  &[data-active="1"] {
    background: #4E5F7C33;
  }
}

</style>