import type { Module } from '@pangtou/module-runtime'
import { pluginRoutes } from '../routes'
import { pluginModulePages } from '../pages'
import { pluginModuleWidgets } from '../widgets'

/**
 * 这是插件对宿主暴露的核心模块定义。
 * 宿主只需要拿到这份对象，就可以收集页面、路由和 widget 元数据。
 */
export const pluginModule: Module = {
    name: 'your-plugin',
    version: '0.1.0',
    title: '示例插件',
    description: '用于演示模块插件脚手架的最小实现。',
    routes: pluginRoutes,
    pages: pluginModulePages,
    widgets: pluginModuleWidgets,
    permissions: ['your-plugin.index'],
    install() {
        return
    },
}
