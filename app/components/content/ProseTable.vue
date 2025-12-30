<script setup lang="ts"></script>

<template>
  <div class="relative my-5 overflow-x-auto">
    <table class="w-full border-separate border-spacing-0 rounded-md" v-bind="$attrs">
      <slot />
    </table>
  </div>
</template>
