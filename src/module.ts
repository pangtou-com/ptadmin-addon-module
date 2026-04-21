import type { Module } from '@pangtou/module-runtime'
import addonManifest from '../manifest.json'
import { pluginModulePages } from './pages'
import { pluginModuleWidgets } from './widgets'

/**
 * 这是插件对宿主暴露的核心模块定义。
 * 宿主只需要拿到这份对象，就可以收集页面和 widget 元数据。
 */
export const pluginModule: Module = {
    name: addonManifest.code,
    version: addonManifest.version,
    title: addonManifest.name,
    description: addonManifest.description,
    pages: pluginModulePages,
    widgets: pluginModuleWidgets,
    install() {
        return
    },
}
