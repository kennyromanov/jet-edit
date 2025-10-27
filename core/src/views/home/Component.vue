<script setup lang="ts">

import { ref } from 'vue';
import { Button } from '@/shadcn/components/ui/button';
import Editor from '@/components/Editor.vue';


// Constants

const TOOLBAR_SELECTOR = '[data-ui="toolbar"]';


// Defining the variables

const toolbarEl = ref<any>(document.querySelector(TOOLBAR_SELECTOR));

</script>

<template>
  <Editor class="jetedit_home_view h-full">
    <template #controls="{ tiptap }">
      <Teleport :to="toolbarEl">
        <div class="jetedit_controls w-full flex flex-col gap-[var(--jetedit-editor-padding)]">
          <div class="jet_edit_control flex gap-1" aria-label="History">
            <Button
                variant="secondary"
                size="sm"
                :disabled="!tiptap.can().chain().focus().undo().run()"
                @click="tiptap.chain().focus().undo().run()"
            >
              Undo
            </Button>

            <Button
                variant="secondary"
                size="sm"
                :disabled="!tiptap.can().chain().focus().redo().run()"
                @click="tiptap.chain().focus().redo().run()"
            >
              Redo
            </Button>
          </div>

          <div class="jet_edit_control flex gap-1" aria-label="Text formatting">
            <Button
                size="sm"
                :variant="tiptap.isActive('bold') ? 'default' : 'secondary'"
                :disabled="!tiptap.can().chain().focus().toggleBold().run()"
                @click="tiptap.chain().focus().toggleBold().run()"
            >
              <b>B</b>
            </Button>

            <Button
                size="sm"
                :variant="tiptap.isActive('italic') ? 'default' : 'secondary'"
                :disabled="!tiptap.can().chain().focus().toggleItalic().run()"
                @click="tiptap.chain().focus().toggleItalic().run()"
            >
              <i>I</i>
            </Button>

            <Button
                size="sm"
                :variant="tiptap.isActive('underline') ? 'default' : 'secondary'"
                :disabled="!tiptap.can().chain().focus().toggleBlockquote().run()"
                @click="tiptap.chain().focus().toggleUnderline().run()"
            >
              <span class="underline">U</span>
            </Button>
          </div>

          <div class="jet_edit_control flex gap-1" aria-label="Headings">
            <!--<Button-->
            <!--    size="sm"-->
            <!--    :variant="tiptap.isActive('paragraph') ? 'default' : 'secondary'"-->
            <!--    @click="tiptap.chain().focus().setParagraph().run()"-->
            <!--&gt;-->
            <!--  Text-->
            <!--</Button>-->

            <Button
                size="sm"
                :variant="tiptap.isActive('heading', { level: 2 }) ? 'default' : 'secondary'"
                @click="tiptap.chain().focus().toggleHeading({ level: 2 }).run()"
            >
              Title
            </Button>

            <Button
                size="sm"
                :variant="tiptap.isActive('heading', { level: 3 }) ? 'default' : 'secondary'"
                @click="tiptap.chain().focus().toggleHeading({ level: 3 }).run()"
            >
              Heading
            </Button>

            <Button
                size="sm"
                :variant="tiptap.isActive('heading', { level: 4 }) ? 'default' : 'secondary'"
                @click="tiptap.chain().focus().toggleHeading({ level: 4 }).run()"
            >
              Subheading
            </Button>
          </div>

          <div class="jet_edit_control flex gap-1" aria-label="Blocks">
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