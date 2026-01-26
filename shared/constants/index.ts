export enum AUTH_LOGIN_TYPE {
  GITHUB = 'github',
}

export const RATE_LIMIT_ERROR = {
  statusCode: 429,
  message: '请求过于频繁，请稍后再试',
}
