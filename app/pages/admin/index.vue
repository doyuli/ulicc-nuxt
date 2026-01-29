<script setup lang="ts">
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Database,
  FileText,
  RefreshCw,
  Server,
  Terminal,
} from 'lucide-vue-next'
import { cn } from '~/lib/utils'

definePageMeta({
  middleware: 'auth',
})

usePageMeta({
  title: '系统概览',
})

const { data: stats, refresh: refreshStats } = await useFetch('/api/admin/stats', {
  default: () => ({ totalPosts: 0, vectorized: 0, summarized: 0 }),
})

const currentPage = shallowRef(1)
const pagesize = 4
const { data: postsData, refresh: refreshPosts } = await useFetch('/api/admin/recent-posts', {
  query: {
    page: currentPage,
    pagesize,
  },
  default: () => ({ total: 0, posts: [] }),
  watch: [currentPage],
})
const recentPosts = computed(() => postsData.value.posts)
const totalPosts = computed(() => postsData.value.total)

const isSyncing = shallowRef(false)
const syncLogs = ref<string[]>([])

async function handleSync() {
  if (isSyncing.value)
    return

  isSyncing.value = true
  syncLogs.value = ['> 初始化同步进程...', '> 连接 Content 内容源...']

  const start = performance.now()

  try {
    const result = await $fetch('/api/admin/sync-vectors', {
      method: 'POST',
    })

    syncLogs.value.push(
      `> 扫描文章: ${result.total}`,
      `> ✅ 新增向量: ${result.added}`,
      `> 🔄 更新向量: ${result.updated}`,
      `> ⏭️ 跳过未变: ${result.skipped}`,
      `> 🗑️ 清理失效: ${result.deleted}`,
      `> 同步完成于 ${new Date().toLocaleTimeString()}`,
      `> 用时 ${Math.round(performance.now() - start)}ms`,
    )

    await Promise.all([refreshStats(), refreshPosts()])
  }
  catch (error: any) {
    syncLogs.value.push(`> ❌ 错误: ${error.message}`)
  }
  finally {
    isSyncing.value = false
  }
}

const systemLatency = shallowRef(0)
const systemStatus = shallowRef<'connected' | 'disconnected'>('connected')

async function checkHealth() {
  const start = performance.now()
  try {
    await $fetch('/api/admin/health')
    systemLatency.value = Math.round(performance.now() - start)
    systemStatus.value = 'connected'
  }
  catch {
    systemStatus.value = 'disconnected'
  }
}

const statCards = computed(() => {
  const total = stats.value.totalPosts || 1

  return [
    {
      title: '总文章数',
      icon: FileText,
      value: stats.value.totalPosts,
      subtext: 'Nuxt Content 本地源',
    },
    {
      title: '向量覆盖率',
      icon: Database,
      value: `${Math.round((stats.value.vectorized / total) * 100)}%`,
      subtext: `${stats.value.vectorized} / ${stats.value.totalPosts} 已索引`,
    },
    {
      title: 'AI 摘要覆盖率',
      icon: Server,
      value: `${Math.round((stats.value.summarized / total) * 100)}%`,
      subtext: `${stats.value.summarized} / ${stats.value.totalPosts} 已生成`,
    },
    {
      title: '系统状态',
      icon: Activity,
      value: systemStatus.value === 'connected' ? '运行正常' : '服务异常',
      subtext: `API 延迟: ${systemLatency.value}ms`,
      class: systemStatus.value === 'connected' ? 'text-foreground' : 'text-red-500',
    },
  ]
})

onMounted(checkHealth)
</script>

<template>
  <PageSection>
    <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <Card v-for="item in statCards" :key="item.title">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            {{ item.title }}
          </CardTitle>
          <component :is="item.icon" class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div :class="cn('text-2xl font-bold', item.class)">
            {{ item.value }}
          </div>
          <p class="text-xs text-muted-foreground">
            {{ item.subtext }}
          </p>
        </CardContent>
      </Card>
    </div>

    <div class="grid gap-4 grid-cols-1 lg:grid-cols-7">
      <Card class="col-span-4">
        <CardHeader>
          <CardTitle>向量数据库同步</CardTitle>
          <CardDescription>
            将 Markdown 内容增量同步至 PostgreSQL 向量库
          </CardDescription>
        </CardHeader>
        <CardContent class="flex-1 flex flex-col gap-4">
          <div class="flex items-center gap-4 p-4 border rounded-lg bg-card">
            <div class="grid gap-1 flex-1">
              <p class="text-sm font-medium leading-none">
                手动触发同步
              </p>
              <p class="text-sm text-muted-foreground">
                系统将计算 Content Updated，仅更新变更的文章。
              </p>
            </div>
            <Button
              :disabled="isSyncing"
              :class="{ 'opacity-80': isSyncing }"
              @click="handleSync"
            >
              <RefreshCw class="mr-2 h-4 w-4" :class="{ 'animate-spin': isSyncing }" />
              {{ isSyncing ? '同步中...' : '立即同步' }}
            </Button>
          </div>

          <div class="mt-4 rounded-md bg-zinc-950 p-4 font-mono text-xs text-zinc-50 overflow-hidden flex flex-col h-[200px]">
            <div class="flex items-center gap-2 border-b border-zinc-800 pb-2 mb-2 text-zinc-400">
              <Terminal class="h-3 w-3" />
              <span>sync-process.log</span>
            </div>
            <div class="flex-1 overflow-y-auto">
              <div class="space-y-1">
                <div v-if="syncLogs.length === 0" class="text-zinc-500 italic">
                  等待操作...
                </div>
                <div v-for="(log, i) in syncLogs" :key="i" class="break-all">
                  <span class="text-green-500 mr-2">$</span>
                  <span :class="{ 'text-red-400': log.includes('Error') }">
                    {{ log }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="col-span-3">
        <CardHeader>
          <CardTitle>最新文章状态</CardTitle>
          <CardDescription>监控最近发布的文章及其索引情况</CardDescription>
        </CardHeader>
        <CardContent class="flex-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>标题</TableHead>
                <TableHead class="text-right">
                  状态
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="post in recentPosts" :key="post.id">
                <TableCell>
                  <div class="font-medium truncate max-w-[180px]">
                    {{ post.title }}
                  </div>
                  <div class="text-xs text-muted-foreground">
                    {{ post.date }}
                  </div>
                </TableCell>
                <TableCell class="text-right">
                  <div class="flex flex-col items-end gap-1">
                    <Badge variant="secondary" :class="cn('text-xs', !post.summary && 'bg-chart-1/10')">
                      {{ post.summary ? 'SUMMARIZED' : 'NO SUMMARY' }}
                    </Badge>
                    <div v-if="post.vector" class="flex items-center text-[10px] text-muted-foreground">
                      <CheckCircle2 class="h-3 w-3 mr-1 text-green-500" />
                      已索引
                    </div>
                    <div v-else class="flex items-center text-[10px] text-muted-foreground">
                      <AlertCircle class="h-3 w-3 mr-1 text-yellow-500" />
                      待索引
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Pagination
            v-model:page="currentPage"
            :items-per-page="pagesize"
            :total="totalPosts"
          >
            <PaginationContent v-slot="{ items }">
              <PaginationFirst />
              <template v-for="(item, index) in items" :key="index">
                <PaginationItem v-if="item.type === 'page'" :value="item.value" :is-active="item.value === currentPage">
                  {{ item.value }}
                </PaginationItem>
                <PaginationEllipsis v-else-if="item.type === 'ellipsis'" :index="index" />
              </template>
              <PaginationLast />
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
    </div>
  </PageSection>
</template>
