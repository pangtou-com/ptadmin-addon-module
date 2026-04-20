import type { ModuleRouteEntry } from '@pangtou/shared'

/**
 * 模块路由元数据。
 * 这里不需要直接创建 vue-router 实例，宿主会把这些元数据合并成最终路由树。
 */
export const pluginRoutes: ModuleRouteEntry[] = [
    {
        name: 'your-plugin-index',
        path: '/your-plugin',
        title: '示例页面',
    },
]
