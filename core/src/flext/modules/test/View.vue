<script setup lang="ts">

import { NodeViewWrapper, NodeViewProps } from '@tiptap/vue-3';

const props = defineProps<NodeViewProps>();

</script>

<template>
  <NodeViewWrapper class="jetedit_smart_test">
    {{ props.node.attrs['jetedit-test-fallback'] || '' }}
  </NodeViewWrapper>
</template>