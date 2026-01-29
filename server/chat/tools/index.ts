import type { H3Event } from 'h3'
import { createPostTool } from './post'
import { createPostsTool } from './posts'
import { createSearchTool } from './search'
import { createWeatherTool } from './weather'

export {
  createPostsTool,
  createPostTool,
  createSearchTool,
  createWeatherTool,
}

export function createTools(event: H3Event) {
  return {
    weather: createWeatherTool(),
    post: createPostTool(event),
    posts: createPostsTool(event),
    search: createSearchTool(event),
  }
}
