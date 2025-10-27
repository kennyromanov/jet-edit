<script setup lang="ts">

import { HTMLAttributes } from 'vue';
import { cn } from '@/shadcn/lib/utils';
import Editor from 'vue-edit';

const props = defineProps<{
  class?: HTMLAttributes['class'] | null,
}>();

</script>


<template>
  <Editor
      :class="cn('jetedit_editor flex flex-row gap-0 overflow-y-hidden', props.class)"
      v-slot="{ EditorComponent, tiptap }"
  >
    <slot :EditorComponent="EditorComponent" :tiptap="tiptap">
      <div class="jetedit_editor_inner w-full h-full py-[var(--jetedit-editor-padding)] px-[var(--jetedit-editor-controls-half-gap)] cursor-text overflow-y-scroll">
        <component :is="EditorComponent" />
      </div>

      <slot name="controls" :tiptap="tiptap" />
    </slot>
  </Editor>
</template>