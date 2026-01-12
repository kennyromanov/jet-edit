<script setup lang="ts">

import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { Sidebar, PanelRight, Plus } from 'lucide-vue-next';
import { DocumentRecord } from '@/types';
import { audit, isset, nanoid, ensureAsync } from '@/lib';
import { Input } from '@/shadcn/components/ui/input';
import { Button } from '@/shadcn/components/ui/button';
import store from '@/pinia/store';


// Third-parties

const appStore = store.useApp();


// Defining the variables

const { documents, document, selectDocumentHandler } = storeToRefs(appStore);
const titleInput = ref<any>(null);
const isSidebarShown = ref<boolean>(true);
const isToolbarShown = ref<boolean>(true);
const isEditingTitle = ref<boolean>(false);


// Defining the functions

const onSelectDocument = async (val: DocumentRecord): Promise<void> => {

  // Getting the handler

  const handler = val?.get ?? null;

  if (!handler) {
    console.warn('Unable to get document: The record is missing loader: ' + audit(val));
    return;
  }


  // Getting the data

  const handle = ensureAsync<string>(handler);

  const data = await handle();


  appStore.setEditorDocument({ ...val, data });
};

const onSelectFile = async (): Promise<void> => {

  // Getting the handler

  const handler = selectDocumentHandler.value ?? null;

  if (!handler) {
    console.warn(`Unable to open file: The 'getEditorDocument' handler is not set`);
    return;
  }


  // Getting the document

  const handle = ensureAsync(handler);

  const _document = await handle();

  if (!_document) {
    console.log('Unable to open file: The handler returned nothing');
    return;
  }


  // Getting the loader

  const data = _document?.data || '';

  const get = (): string => data;


  // Updating the data

  appStore.addDocument({ ..._document, get });

  appStore.setEditorDocument(_document);
};

const onSubmitTitle = (val: string): void => {

  // Doing some checks

  if (!isset(document.value)) {

    // Adding the document

    const _id = nanoid();

    const get = (): string => '';

    appStore.addDocument({ id: _id, name: val, get: get });


    // Updating the data

    appStore.setEditorDocument({ id: _id, name: val, data: '' });

    isEditingTitle.value = false;


    return;
  }

  if (!val) {
    console.log('Unable to submit title: The title is invalid: ' + audit(val));
    return;
  }


  // Updating the data

  appStore.setDocumentById(id.value, { ...document.value, name: val });

  appStore.setEditorDocument({ ...document.value, name: val });

  isEditingTitle.value = false;
};


// Defining the computed

const id = computed<string|null>(() => document.value?.id ?? null);


// Defining the watchers

watch(isEditingTitle, async (val: boolean): Promise<void> => {
  if (!val) return;

  setTimeout(() => titleInput.value?.$el?.focus(), 50);
});

</script>

<template>
  <div
      class="jetedit_layout flex relative"
      :data-sidebar="Number(isSidebarShown)"
      :data-toolbar="Number(isToolbarShown)"
  >
    <div class="jetedit_layout_sidebar w-[var(--jetedit-editor-controls-size)] absolute top-0 left-0 bottom-0 overflow-x-hidden overflow-y-scroll">
      <div class="jetedit_layout_sidebar_header h-[var(--jetedit-editor-header-height)] pl-[var(--jetedit-editor-padding)] pr-[var(--jetedit-editor-controls-half-spacing)] flex items-center cursor-default shrink-0">
        <b>JetEdit</b>
      </div>

      <div class="jetedit_layout_sidebar_inner flex flex-col">
        <Button
            v-for="(_document, i) of documents"
            :key="i"
            class="w-full h-10 justify-start"
            variant="ghost"
            @click="onSelectDocument(_document)"
        >
          <span class="truncate">
            {{ _document?.name ?? 'Unknown Document' }}
          </span>
        </Button>

        <Button
            class="w-full h-10 justify-start text-[#4E5F7C9F]"
            variant="ghost"
            @click="onSelectFile"
        >
          <Plus />
          Open File
        </Button>
      </div>
    </div>

    <div
        class="jetedit_layout_toolbar w-[var(--jetedit-editor-controls-size)] absolute top-0 right-0 bottom-0 items-end overflow-x-hidden overflow-y-scroll"
        data-jetedit="toolbar"
        ref="toolbar"
    >
      <div
          class="jetedit_layout_toolbar_header h-[var(--jetedit-editor-header-height)] pl-[var(--jetedit-editor-controls-half-spacing)] pr-[var(--jetedit-editor-padding)] shrink-0"
          data-jetedit="toolbarHeader"
      >
        <div class="jetedit_layout_toolbar_header_inner h-full flex justify-between items-center" data-jetedit="toolbarHeaderInner">
          <b data-jetedit="toolbarLabel">Toolbar</b>

          <slot name="toolbarAfterLabel">
            <div data-jetedit="toolbarAfterLabel" />
          </slot>
        </div>
      </div>

      <slot name="toolbarInner">
        <div
            class="jetedit_layout_toolbar_inner py-[var(--jetedit-editor-padding)] pr-[var(--jetedit-editor-padding)] pl-[var(--jetedit-editor-controls-half-spacing)]"
            data-jetedit="toolbarInner"
        />
      </slot>
    </div>

    <main class="jetedit_layout_inner h-full absolute top-0 bottom-0 left-[var(--jetedit-editor-controls-size)] right-[var(--jetedit-editor-controls-size)] flex flex-col">
      <div class="jetedit_layout_header h-[var(--jetedit-editor-header-height)] px-[var(--jetedit-editor-header-padding)] flex justify-between items-center gap-[var(--jetedit-editor-header-inner-gap)] shrink-0">
        <div class="w-full flex items-center gap-[var(--jetedit-editor-header-inner-gap)]">
          <Button class="w-10 h-10" variant="ghost" @click="isSidebarShown = !isSidebarShown">
            <Sidebar />
          </Button>

          <Input
              v-if="isEditingTitle"
              class="font-medium"
              :model-value="document?.name || 'Unknown Document'"
              @blur="e => onSubmitTitle(String(e?.target?.value || ''))"
              @keydown.enter="e => onSubmitTitle(String(e?.target?.value || ''))"
              ref="titleInput"
          />

          <div
              v-else
              class="w-full cursor-text"
              @click="isEditingTitle = true"
          >
            <b>{{ document?.name ?? 'Unknown Document' }}</b>
          </div>
        </div>

        <Button class="w-10 h-10" variant="ghost" @click="isToolbarShown = !isToolbarShown">
          <PanelRight />
        </Button>
      </div>

      <div class="jetedit_layout_content h-full overflow-y-scroll">
        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped>

.jetedit_layout {
  &[data-sidebar="0"] {
    .jetedit_layout_sidebar {
      clip-path: polygon(
        0% 0%,
        0% 0%,
        0% 100%,
        0% 100%
      );
    }

    .jetedit_layout_inner {
      left: 0;
    }
  }

  &[data-toolbar="0"] {
    .jetedit_layout_inner {
      right: 0;
    }

    .jetedit_layout_toolbar {
      right: calc(-1 * var(--jetedit-editor-controls-size));
    }
  }


  .jetedit_layout_inner {
    transition: left var(--jetedit-editor-controls-animation), right var(--jetedit-editor-controls-animation);
  }

  .jetedit_layout_sidebar,
  .jetedit_layout_toolbar {
    transition: right var(--jetedit-editor-controls-animation);
  }

  .jetedit_layout_sidebar {
    clip-path: polygon(
      0% 0%,
      100% 0%,
      100% 100%,
      0% 100%
    );

    transition: clip-path var(--jetedit-editor-controls-animation);

    .jetedit_layout_sidebar_inner {
      padding:
        calc(var(--jetedit-editor-padding) - 0.5rem)
        calc(var(--jetedit-editor-controls-half-spacing) - 1rem)
        calc(var(--jetedit-editor-padding) - 1rem);
    }
  }
}

</style>