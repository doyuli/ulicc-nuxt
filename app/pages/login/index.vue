<script setup lang="ts">
import { ArrowLeftIcon } from 'lucide-vue-next'
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'vue-input-otp'
import { toast } from 'vue-sonner'

definePageMeta({
  layout: 'blank',
  middleware: 'guest',
})

usePageMeta({
  title: '登陆',
})

const route = useRoute()

const { fetch: fetchSession } = useUserSession()

const code = shallowRef('')
const isLoading = shallowRef(false)

function resetCode() {
  code.value = ''
}

async function login() {
  isLoading.value = true
  try {
    await $fetch('/api/login', {
      method: 'POST',
      body: { code: code.value },
    })

    await fetchSession()

    const redirect = (route.query.redirect as string) || '/'
    await navigateTo(decodeURIComponent(redirect), { replace: true })
  }
  catch (e: any) {
    resetCode()
    toast.error(e.data?.message || '验证失败，请检查代码是否正确', { duration: 1000 })
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center relative min-h-svh w-full p-6 md:p-10">
    <Button as-child size="icon" variant="outline" class="absolute top-8 left-8 z-10">
      <NuxtLink to="/">
        <ArrowLeftIcon class="size-4 shrink-0" />
      </NuxtLink>
    </Button>
    <div class="flex flex-col w-full text-center max-w-md">
      <h4 class="text-2xl font-bold tracking-tight">
        欢迎回来
      </h4>
      <p class="mt-2 mb-6 text-sm">
        请输入访问代码或使用 GitHub 登录以继续
      </p>
      <Card class="py-8">
        <CardHeader class="px-8">
          <CardDescription>访问代码</CardDescription>
        </CardHeader>
        <CardContent class="px-8">
          <form class="flex flex-col gap-6" @submit.prevent="login">
            <InputOTP
              v-model="code"
              :disabled="isLoading"
              autofocus
              class="self-center"
              :maxlength="6"
              :pattern="REGEXP_ONLY_DIGITS_AND_CHARS"
              @complete="login"
            >
              <InputOTPGroup>
                <InputOTPSlot v-for="(_, i) in 6" :key="i" class="size-9 md:size-12" :index="i" />
              </InputOTPGroup>
            </InputOTP>
            <CardDescription>输入您的 6 位访问代码</CardDescription>

            <div class="relative">
              <div class="absolute inset-0 flex items-center" aria-hidden="true">
                <div class="w-full border-t" />
              </div>
              <div class="relative flex justify-center text-xs font-medium uppercase">
                <span class="bg-card px-4 text-muted-foreground">第三方登录</span>
              </div>
            </div>

            <div class="flex flex-col gap-3">
              <Button as-child size="lg" variant="outline" :disabled="isLoading" type="button">
                <NuxtLink to="/api/auth/github" external>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                      fill="currentColor"
                    />
                  </svg>
                  Github 账号登陆
                </NuxtLink>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
