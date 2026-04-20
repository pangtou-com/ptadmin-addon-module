import type { ModulePageEntry } from '@pangtou/shared'
import ExamplePage from './ExamplePage.vue'

/**
 * 页面注册项用于告诉宿主：
 * 1. 哪个页面组件对应哪个 path
 * 2. 页面是否标记为 schema 页面
 */
export const pluginModulePages: ModulePageEntry[] = [
    {
        key: 'your-plugin.page.index',
        title: '示例页面',
        module: 'your-plugin',
        path: '/your-plugin',
        component: ExamplePage,
        schemaKey: 'your-plugin.schema.example',
    },
]
