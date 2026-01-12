<script setup lang="ts">

import { ref } from 'vue';


// Constants

const TOOLBAR_LABEL_SELECTOR = '[data-jetedit="toolbarAfterLabel"]';

const TOOLBAR_SELECTOR = '[data-jetedit="toolbarInner"]';


// Defining the variables

const toolbarLabelEl = ref<any>(document.querySelector(TOOLBAR_LABEL_SELECTOR));
const toolbarEl = ref<any>(document.querySelector(TOOLBAR_SELECTOR));

</script>

<template>
  <Teleport :to="toolbarLabelEl">
    <slot name="label" />
  </Teleport>

  <Teleport :to="toolbarEl">
    <slot />
  </Teleport>
</template>