<script setup lang="ts">

import { ref, watch, nextTick } from 'vue';
import { Sidebar, PanelRight } from 'lucide-vue-next';
import { Input } from '@/shadcn/components/ui/input';
import { Button } from '@/shadcn/components/ui/button';


// Defining the variables

const titleInput = ref<any>(null);

const isSidebarShown = ref<boolean>(true);

const isToolbarShown = ref<boolean>(true);

const isEditingTitle = ref<boolean>(false);


// Defining the watchers

watch(isEditingTitle, (val: boolean): void => {
  if (!val) return;

  nextTick(() => {
    titleInput.value?.$el?.focus();
  });
});

</script>

<template>
  <div
      class="jetedit_layout flex relative"
      :data-sidebar="Number(isSidebarShown)"
      :data-toolbar="Number(isToolbarShown)"
  >
    <div class="jetedit_layout_sidebar_wrapper w-[var(--jetedit-editor-controls-size)] absolute top-0 left-0 bottom-0 overflow-x-hidden overflow-y-scroll">
      <div class="jetedit_layout_sidebar min-w-[var(--jetedit-editor-controls-size)]">
        <div class="jetedit_layout_sidebar_header h-[var(--jetedit-editor-header-height)] pl-[var(--jetedit-editor-padding)] pr-[var(--jetedit-editor-controls-half-spacing)] flex items-center cursor-default shrink-0">
          <b>JetEdit</b>
        </div>

        <div class="jetedit_layout_sidebar_inner py-[var(--jetedit-editor-padding)]  flex flex-col">
          <Button
              v-for="i in 5"
              :key="i"
              class="w-full h-10 justify-start"
              variant="ghost"
          >
            Untitled.flext
          </Button>
        </div>
      </div>
    </div>

    <div class="jetedit_layout_toolbar_wrapper w-[var(--jetedit-editor-controls-size)] absolute top-0 right-0 bottom-0 items-end overflow-x-hidden overflow-y-scroll">
      <div class="jetedit_layout_toolbar min-w-[var(--jetedit-editor-controls-size)]">
        <div class="jetedit_layout_header h-[var(--jetedit-editor-header-height)] pl-[var(--jetedit-editor-controls-half-spacing)] pr-[var(--jetedit-editor-padding)] flex justify-between items-center shrink-0">
          <b>Toolbar</b>

          <slot name="toolbarAfterLabel">
            <div data-ui="toolbarAfterLabel" />
          </slot>
        </div>

        <slot name="toolbarInner">
          <div
              class="jetedit_layout_toolbar_inner py-[var(--jetedit-editor-padding)] pr-[var(--jetedit-editor-padding)] pl-[var(--jetedit-editor-controls-half-spacing)]"
              data-ui="toolbarInner"
          />
        </slot>
      </div>
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
              model-value="Untitled.flext"
              @blur="isEditingTitle = false"
              @keydown.enter="isEditingTitle = false"
              ref="titleInput"
          />

          <div
              v-else
              class="w-full cursor-text"
              @click="isEditingTitle = true"
          >
            <b>Untitled.flext</b>
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

<style>

.jetedit_layout {
  --jetedit-editor-controls-half-spacing: calc(0.5 * var(--jetedit-editor-controls-spacing));
  --jetedit-editor-header-icon-padding: 0.75rem;
  --jetedit-editor-header-padding: calc(var(--jetedit-editor-controls-half-spacing) - var(--jetedit-editor-header-icon-padding));
  --jetedit-editor-header-icon-height: 2.5rem;
  --jetedit-editor-header-height: calc(2 * var(--jetedit-editor-header-padding) + var(--jetedit-editor-header-icon-height));
  --jetedit-editor-header-inner-gap: calc(var(--jetedit-editor-padding) / 1.6);


  &[data-sidebar="0"] {
    .jetedit_layout_sidebar_wrapper {
      width: 0;
    }

    .jetedit_layout_inner {
      left: 0;
    }
  }

  &[data-toolbar="0"] {
    .jetedit_layout_inner {
      right: 0;
    }

    .jetedit_layout_toolbar_wrapper {
      width: 0;
    }
  }


  .jetedit_layout_sidebar_wrapper,
  .jetedit_layout_toolbar_wrapper {
    transition: width 0.3s;
  }

  .jetedit_layout_inner {
    transition: left 0.3s, right 0.3s;
  }

  .jetedit_layout_sidebar {
    .jetedit_layout_sidebar_inner {
      padding-right: calc(var(--jetedit-editor-controls-half-spacing) - 1rem);
      padding-left: calc(var(--jetedit-editor-padding) - 1rem);
    }
  }
}

</style>