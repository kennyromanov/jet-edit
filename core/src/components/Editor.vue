<script setup lang="ts">

import { ref, computed, HTMLAttributes } from 'vue';
import { cn } from '@/shadcn/lib/utils';
import { Obj } from '@/types';
import Editor from 'vue-edit';


// Defining the emits

const emit = defineEmits<{
  (e: 'input', val: string|null): void,
  (e: 'change', val: string|null): void,
  (e: 'update:from', val: number|null): void,
  (e: 'update:to', val: number|null): void,
  (e: 'update:position', val: number|null): void,
  (e: 'update:modelValue', val: string|null): void,
}>();


// Defining the props

const props = defineProps<{
  class?: HTMLAttributes['class'] | null,

  hint?: string|null,
  from?: number|string|null,
  to?: number|string|null,
  position?: number|string|null,

  extensions?: Obj[] | null,
  modelValue?: string|null,
}>();


// Defining the variables

const editorEl = ref<any>(null);


// Defining the functions

const dbg = (val: any): void => console.log(val);


// Defining the computed

const val = computed({
  get(): string|null {
    return props.modelValue ?? null;
  },
  set(_val: string|null): void {
    emit('update:modelValue', _val);
  },
});

const from = computed({
  get(): number|string|null {
    return props.from ?? null;
  },
  set(_val: number|string|null): void {
    emit('update:from', Number(_val));
  },
});

const to = computed({
  get(): number|string|null {
    return props.to ?? null;
  },
  set(_val: number|string|null): void {
    emit('update:to', Number(_val));
  },
});

const position = computed({
  get(): number|string|null {
    return props.position ?? null;
  },
  set(_val: number|string|null): void {
    emit('update:position', Number(_val));
  },
});


// Defining the expose

defineExpose({
  focus: (): void => editorEl.value?.focus(),
});

</script>

<template>
  <Editor
      :class="cn('jetedit_editor flex flex-row gap-0 overflow-y-hidden', props.class)"
      :hint="props.hint"
      :extensions="extensions"
      v-slot="{ EditorComponent, tiptap }"
      v-model:from="from"
      v-model:to="to"
      v-model:position="position"
      v-model="val"
      @input="v => emit('input', v)"
      @change="v => emit('change', v)"
      @compile="dbg"
      no-default
      ref="editorEl"
  >
    <slot :EditorComponent="EditorComponent" :tiptap="tiptap">
      <div class="jetedit_editor_inner w-full h-full cursor-text overflow-y-scroll">
        <component :is="EditorComponent" />
      </div>

      <slot name="controls" :tiptap="tiptap" />
    </slot>
  </Editor>
</template>

<style scoped>

.jetedit_editor {
  :deep(.tiptap) {
    padding: var(--jetedit-editor-padding) var(--jetedit-editor-controls-half-spacing);
  }
}

</style>