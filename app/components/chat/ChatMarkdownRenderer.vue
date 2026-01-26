<script setup lang="ts">
import type { DefineComponent } from 'vue'
import ProseA from '../content/ProseA.vue'
import ProseBlockquote from '../content/ProseBlockquote.vue'
import ProseCode from '../content/ProseCode.vue'
import ProseEm from '../content/ProseEm.vue'
import ProseH1 from '../content/ProseH1.vue'
import ProseH2 from '../content/ProseH2.vue'
import ProseH3 from '../content/ProseH3.vue'
import ProseH4 from '../content/ProseH4.vue'
import ProseHr from '../content/ProseHr.vue'
import ProseImg from '../content/ProseImg.vue'
import ProseLi from '../content/ProseLi.vue'
import ProseOl from '../content/ProseOl.vue'
import ProseP from '../content/ProseP.vue'
import ProsePreStream from '../content/ProsePreStream.vue'
import ProseStrong from '../content/ProseStrong.vue'
import ProseTable from '../content/ProseTable.vue'
import ProseTbody from '../content/ProseTbody.vue'
import ProseTd from '../content/ProseTd.vue'
import ProseTh from '../content/ProseTh.vue'
import ProseThead from '../content/ProseThead.vue'
import ProseTr from '../content/ProseTr.vue'
import ProseUl from '../content/ProseUl.vue'

defineProps<{
  cacheKey: string
  value: string
}>()

const components = {
  h1: ProseH1,
  h2: ProseH2,
  h3: ProseH3,
  h4: ProseH4,
  p: ProseP,
  a: ProseA,
  em: ProseEm,
  strong: ProseStrong,
  blockquote: ProseBlockquote,
  hr: ProseHr,
  ul: ProseUl,
  ol: ProseOl,
  li: ProseLi,
  table: ProseTable,
  thead: ProseThead,
  tbody: ProseTbody,
  tr: ProseTr,
  th: ProseTh,
  td: ProseTd,
  img: ProseImg,
  pre: ProsePreStream,
  code: ProseCode,
} as unknown as Record<string, DefineComponent>
</script>

<template>
  <MDCCached
    class="chat-markdown-renderer"
    :value="value"
    :cache-key="cacheKey"
    :components="components"
    :parser-options="{ highlight: false }"
  />
</template>

<style>
.chat-markdown-renderer {
  p,
  ul,
  ol {
    margin: 0;
  }
  ul {
    list-style-position: inside;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: 1.125rem;
    margin-top: 0.8rem;
    margin-bottom: 0.8rem;
  }
  h1 a,
  h2 a,
  h3 a,
  h4 a,
  h5 a,
  h6 a {
    cursor: default;
    pointer-events: none;
  }
  div,
  blockquote {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  a span {
    background-color: transparent;
  }
  a:not(h1 *, h2 *, h3 *, h4 *, h5 *, h6 *):hover {
    text-decoration: underline;
    text-underline-offset: 0.25rem;
  }
  strong {
    font-weight: 700;
    color: var(--color-foreground);
  }
}
</style>
