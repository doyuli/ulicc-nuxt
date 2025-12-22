---
title: UniApp 请求封装
description: 使用 uni.request 封装请求，支持全局配置和拦截器
language: javascript
tags: [uni-app, request]
---

::code-group

```ts [request.ts]
import { isHttp } from './utils'

export interface Data<T> {
  code: number
  data: T
  message: string
}

const DEFAULT_CONFIG = {
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000,
}

function requestInterceptor(options: UniApp.RequestOptions) {
  options.url = isHttp(options.url) ? options.url : `${DEFAULT_CONFIG.baseURL}${options.url}`
  options.timeout = DEFAULT_CONFIG.timeout

  const token = uni.getStorageSync('token')
  options.header = {
    Authorization: token ? `Bearer ${token}` : '',
    ...options.header,
  }

  return options
}

export function http<T>(options: UniApp.RequestOptions) {
  const interceptedOptions = requestInterceptor(options)
  return new Promise<Data<T>>((resolve, reject) => {
    uni.request({
      ...interceptedOptions,
      success(res) {
        handleResponse(res, resolve, reject)
      },
      fail(err) {
        handleError(err, reject)
      },
    })
  })
}

function handleResponse<T>(
  resp: UniApp.RequestSuccessCallbackResult,
  resolve: (value: Data<T>) => void,
  reject: (reason?: any) => void
) {
  const { data: result, statusCode } = resp

  if (isSuccessStatusCode(statusCode)) {
    resolve(result as Data<T>)
  }
  else if (statusCode === 401) {
    uni.removeStorageSync('token')
    uni.navigateTo({ url: '/login' })
    reject(resp)
  }
  else {
    showErrorToast(resp.data as Data<T>)
    reject(resp)
  }
}

function handleError(err: UniApp.GeneralCallbackResult, reject: (reason?: any) => void) {
  uni.showToast({
    icon: 'none',
    title: '网络可能开小差了~',
  })
  reject(err)
}

function isSuccessStatusCode(code: number) {
  return code >= 200 && code < 300
}

function showErrorToast<T>(data: Data<T>) {
  uni.showToast({
    icon: 'none',
    title: data.message || '请求错误',
  })
}
```

```ts [utils.ts]
export function isHttp(str: string): boolean {
  return /^https?:\/\//.test(str)
}
```

```ts [type.d.ts]
export interface PageParam {
  pagesize?: number
  page?: number
}

export interface PageResult<T> {
  list: T[]
  total: number
}

export interface ExamplePageParams extends PageParam {
  keyword?: string
}

export interface ExamplePageItem {
  label: string
  value: string
}

export type ExamplePageResult = PageResult<Required<ExamplePageItem>>
```

```ts [api.ts]
import type { ExamplePageParams, ExamplePageResult } from './type'
import { http } from './request'

export function getExampleList(data?: ExamplePageParams) {
  return http<ExamplePageResult>({
    method: 'GET',
    url: '/example/page',
    data,
  })
}
```

::
