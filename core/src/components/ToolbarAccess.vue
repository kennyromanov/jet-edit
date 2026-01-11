<script setup lang="ts">

import { ref } from 'vue';


// Constants

const TOOLBAR_SELECTOR = '[data-jetedit="toolbarInner"]';

const TOOLBAR_LABEL_SELECTOR = '[data-jetedit="toolbarAfterLabel"]';


// Defining the variables

const toolbarEl = ref<any>(document.querySelector(TOOLBAR_SELECTOR));
const toolbarLabelEl = ref<any>(document.querySelector(TOOLBAR_LABEL_SELECTOR));

</script>

<template>
  <Teleport :to="toolbarLabelEl">
    <slot name="label" />
  </Teleport>

  <Teleport :to="toolbarEl">
    <slot />
  </Teleport>
</template>