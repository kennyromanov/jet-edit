<script setup lang="ts">

import { computed, HTMLAttributes } from 'vue';
import { cn } from '@/shadcn/lib/utils';
import Editor from 'vue-edit';


// Defining the emits

const emit = defineEmits<{
  (e: 'input', val: string|null): void,
  (e: 'change', val: string|null): void,
  (e: 'update:modelValue', val: string|null): void,
}>();


// Defining the props

const props = defineProps<{
  class?: HTMLAttributes['class'] | null,
  modelValue?: string|null,
}>();


// Defining the computed

const val = computed({
  get(): string|null {
    return props.modelValue ?? null;
  },
  set(_val: string|null): void {
    emit('update:modelValue', _val);
  },
});

</script>


<template>
  <Editor
      :class="cn('jetedit_editor flex flex-row gap-0 overflow-y-hidden', props.class)"
      v-slot="{ EditorComponent, tiptap }"
      v-model="val"
      @input="v => emit('input', v)"
      @change="v => emit('change', v)"
      no-default
  >
    <slot :EditorComponent="EditorComponent" :tiptap="tiptap">
      <div class="jetedit_editor_inner w-full h-full py-[var(--jetedit-editor-padding)] px-[var(--jetedit-editor-controls-half-spacing)] cursor-text overflow-y-scroll">
        <component :is="EditorComponent" />
      </div>

      <slot name="controls" :tiptap="tiptap" />
    </slot>
  </Editor>
</template>