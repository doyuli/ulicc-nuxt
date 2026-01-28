import type { DefineComponent } from 'vue'
import { markRaw } from 'vue'
import ProseA from './ProseA.vue'
import ProseBlockquote from './ProseBlockquote.vue'
import ProseCode from './ProseCode.vue'
import ProseEm from './ProseEm.vue'
import ProseH1 from './ProseH1.vue'
import ProseH2 from './ProseH2.vue'
import ProseH3 from './ProseH3.vue'
import ProseH4 from './ProseH4.vue'
import ProseHr from './ProseHr.vue'
import ProseImg from './ProseImg.vue'
import ProseLi from './ProseLi.vue'
import ProseOl from './ProseOl.vue'
import ProseP from './ProseP.vue'
import ProsePreStream from './ProsePreStream.vue'
import ProseStrong from './ProseStrong.vue'
import ProseTable from './ProseTable.vue'
import ProseTbody from './ProseTbody.vue'
import ProseTd from './ProseTd.vue'
import ProseTh from './ProseTh.vue'
import ProseThead from './ProseThead.vue'
import ProseTr from './ProseTr.vue'
import ProseUl from './ProseUl.vue'

export const ChatProseComponents = {
  h1: markRaw(ProseH1),
  h2: markRaw(ProseH2),
  h3: markRaw(ProseH3),
  h4: markRaw(ProseH4),
  p: markRaw(ProseP),
  a: markRaw(ProseA),
  em: markRaw(ProseEm),
  strong: markRaw(ProseStrong),
  blockquote: markRaw(ProseBlockquote),
  hr: markRaw(ProseHr),
  ul: markRaw(ProseUl),
  ol: markRaw(ProseOl),
  li: markRaw(ProseLi),
  table: markRaw(ProseTable),
  thead: markRaw(ProseThead),
  tbody: markRaw(ProseTbody),
  tr: markRaw(ProseTr),
  th: markRaw(ProseTh),
  td: markRaw(ProseTd),
  img: markRaw(ProseImg),
  pre: markRaw(ProsePreStream),
  code: markRaw(ProseCode),
} as unknown as Record<string, DefineComponent>
