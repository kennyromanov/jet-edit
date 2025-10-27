<script setup lang="ts">

import { Sidebar, PanelRight } from 'lucide-vue-next';
import { Button } from '@/shadcn/components/ui/button';

</script>

<template>
  <div class="jetedit_layout flex overflow-y-hidden">
    <div class="jetedit_layout_sidebar w-[25%]">
      <div class="jetedit_layout_sidebar_header h-16 pl-[var(--jetedit-editor-padding)] pr-[var(--jetedit-editor-controls-half-gap)] flex items-center">
        <b>JetEdit</b>
      </div>
    </div>

    <main class="jetedit_layout_inner w-full h-full flex flex-col">
      <div class="jetedit_layout_header h-16 px-[var(--jetedit-editor-header-padding)] flex justify-between items-center gap-4">
        <div class="flex items-center gap-4">
          <Button class="w-10 h-10" variant="ghost">
            <Sidebar />
          </Button>

          <b>Untitled.flext</b>
        </div>

        <Button class="w-10 h-10" variant="ghost">
          <PanelRight />
        </Button>
      </div>

      <div class="jetedit_layout_content h-full overflow-y-scroll">
        <slot />
      </div>
    </main>

    <div class="jetedit_layout_toolbar w-[25%]">
      <div class="jetedit_layout_header h-16 pl-[var(--jetedit-editor-controls-half-gap)] pr-[var(--jetedit-editor-padding)] flex items-center">
        <b>Toolbar</b>
      </div>

      <div class="jetedit_layout_toolbar_inner py-[var(--jetedit-editor-padding)] pr-[var(--jetedit-editor-padding)] pl-[var(--jetedit-editor-controls-half-gap)]" />
    </div>
  </div>
</template>

<style>

.jetedit_layout {
  --jetedit-editor-controls-half-gap: calc(0.5 * var(--jetedit-editor-controls-gap));
  --jetedit-editor-header-padding: calc(var(--jetedit-editor-controls-half-gap) - 0.85em);
}

</style>