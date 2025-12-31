<script setup lang="ts">

import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { Undo, Redo, Bold, Italic, Underline, Strikethrough } from 'lucide-vue-next';
import { isset } from '@/lib';
import { Button } from '@/shadcn/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/components/ui/select';
import store from '@/pinia/store';
import Editor from '@/components/Editor.vue';


// Third-parties

const appStore = store.useApp();


// Types

type Heading = 'title' | 'heading' | 'subheading' | 'body';


// Constants

const TOOLBAR_SELECTOR = '[data-ui="toolbarInner"]';

const TOOLBAR_LABEL_SELECTOR = '[data-ui="toolbarAfterLabel"]';


// Defining the variables

const appStoreRefs = storeToRefs(appStore);
const _document = appStoreRefs.document;
const toolbarEl = ref<any>(document.querySelector(TOOLBAR_SELECTOR));
const toolbarLabelEl = ref<any>(document.querySelector(TOOLBAR_LABEL_SELECTOR));


// Defining the functions

const getHeading = (tiptap: any): Heading => {
  const heading = (level: number): boolean => !!tiptap?.isActive('heading', { level });

  if (heading(1))
    return 'title';

  else if (heading(2))
    return 'title';

  else if (heading(3))
    return 'heading';

  else if (heading(4))
    return 'subheading';

  else
    return 'body';
};

const setHeading = (val: Heading, tiptap: any): void => {
  const heading = (level: number): void => tiptap?.chain()?.focus()?.setHeading({ level })?.run();

  const rem = (): void => tiptap?.chain()?.focus()?.setParagraph()?.run();

  switch (val) {
    case 'title':
      heading(2);
      break;

    case 'heading':
      heading(3);
      break;

    case 'subheading':
      heading(4);
      break;

    case 'body':
    default:
      rem();
  }
};


// Defining the computed

const val = computed({
  get(): string|null {
    return _document.value?.data ?? null;
  },
  set(_val: string|null): void {

    // Doing some checks

    if (!isset(_val)) {
      _document.value = null;
      return;
    }

    if (!isset(_document.value)) {
      appStore.addDocument({ id: '0', name: 'Unknown Document' });

      appStore.setDocument({ id: '0', name: 'Unknown Document', data: _val });

      return;
    }


    appStore.setDocument({ ..._document.value, data: _val });
  },
});

</script>

<template>
  <Editor class="jetedit_home_view h-full" v-model="val">
    <template #controls="{ tiptap }">
      <Teleport :to="toolbarLabelEl">
        <div class="jetedit_control flex select-none" aria-label="History">
          <Button
              size="sm"
              variant="ghost"
              :disabled="!tiptap.can().chain().focus().undo().run()"
              @click="tiptap.chain().focus().undo().run()"
          >
            <Undo />
          </Button>

          <Button
              size="sm"
              variant="ghost"
              :disabled="!tiptap.can().chain().focus().redo().run()"
              @click="tiptap.chain().focus().redo().run()"
          >
            <Redo />
          </Button>
        </div>
      </Teleport>

      <Teleport :to="toolbarEl">
        <div class="jetedit_controls w-full flex flex-col gap-[var(--jetedit-editor-padding)]">
          <div class="p-1 flex justify-between rounded-lg border-[1px] border-gray-200" aria-label="Text formatting">
            <Button
                class="jetedit_control w-9"
                size="sm"
                variant="ghost"
                :disabled="!tiptap.can().chain().focus().toggleBold().run()"
                :data-active="Number(tiptap.isActive('bold'))"
                @click="tiptap.chain().focus().toggleBold().run()"
            >
              <Bold />
            </Button>

            <Button
                class="jetedit_control w-9"
                size="sm"
                variant="ghost"
                :disabled="!tiptap.can().chain().focus().toggleItalic().run()"
                :data-active="Number(tiptap.isActive('italic'))"
                @click="tiptap.chain().focus().toggleItalic().run()"
            >
              <Italic />
            </Button>

            <Button
                class="jetedit_control w-9"
                size="sm"
                variant="ghost"
                :disabled="!tiptap.can().chain().focus().toggleBlockquote().run()"
                :data-active="Number(tiptap.isActive('underline'))"
                @click="tiptap.chain().focus().toggleUnderline().run()"
            >
              <Underline />
            </Button>

            <Button
                class="jetedit_control w-9"
                size="sm"
                variant="ghost"
                :disabled="!tiptap.can().chain().focus().toggleStrike().run()"
                :data-active="Number(tiptap.isActive('strike'))"
                @click="tiptap.chain().focus().toggleStrike().run()"
            >
              <Strikethrough />
            </Button>
          </div>

          <div class="jetedit_control flex gap-1" aria-label="Headings">
            <Select :model-value="getHeading(tiptap)" @update:model-value="h => setHeading(h as Heading, tiptap)">
              <SelectTrigger class="w-full shadow-none">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
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

          <div class="jetedit_control flex gap-1" aria-label="Blocks">
            <Button
                size="sm"
                :variant="tiptap.isActive('bulletList') ? 'default' : 'secondary'"
                @click="tiptap.chain().focus().toggleBulletList().run()"
            >
              Bullet
            </Button>

            <Button
                size="sm"
                :variant="tiptap.isActive('orderedList') ? 'default' : 'secondary'"
                @click="tiptap.chain().focus().toggleLink().run()"
            >
              List
            </Button>

            <Button
                size="sm"
                :variant="tiptap.isActive('codeBlock') ? 'default' : 'secondary'"
                @click="tiptap.chain().focus().toggleCodeBlock().run()"
            >
              Code
            </Button>

            <Button
                size="sm"
                :variant="tiptap.isActive('blockquote') ? 'default' : 'secondary'"
                @click="tiptap.chain().focus().toggleBlockquote().run()"
            >
              Quote
            </Button>
          </div>
        </div>
      </Teleport>
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