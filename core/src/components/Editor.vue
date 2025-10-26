<script setup lang="ts">

import { HTMLAttributes } from 'vue';
import { cn } from '@/shadcn/lib/utils';
import { Button } from '@/shadcn/components/ui/button';
import Editor from 'vue-edit';

const props = defineProps<{
  class?: HTMLAttributes['class'] | null,
}>();

</script>


<template>
  <Editor
      :class="cn('jet_edit flex flex-row gap-0 overflow-y-hidden', props.class)"
      v-slot="{ EditorComponent, tiptap }"
  >
    <div class="jet_edit_inner w-full h-full py-[var(--jetedit-editor-padding)] pl-[var(--jetedit-editor-padding)] cursor-text bg-[var(--jetedit-editor-background)] overflow-y-scroll">
      <component :is="EditorComponent" />
    </div>

    <div class="jet_edit_controls w-[var(--jetedit-editor-controls-size)] py-[var(--jetedit-editor-padding)] flex flex-col gap-[var(--jetedit-editor-padding)]">
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
  </Editor>
</template>