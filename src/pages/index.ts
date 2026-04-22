import type { ModulePageEntry } from '@pangtou/shared'
import ExamplePage from './ExamplePage.vue'

/**
 * 页面注册项用于告诉宿主：
 * 1. 哪个 page_key 对应哪个页面组件
 * 2. 页面是否标记为 schema 页面
 *
 * 页面真实访问路径、标题、图标和菜单层级均以后端资源树为准。
 */
export const pluginModulePages: ModulePageEntry[] = [
    {
        key: 'your-plugin.page.index',
        module: 'your-plugin',
        component: ExamplePage,
        schemaKey: 'your-plugin.schema.example',
    },
]
