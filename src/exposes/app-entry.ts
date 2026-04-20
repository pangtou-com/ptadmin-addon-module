/**
 * 远端暴露完整模块应用入口。
 * 宿主如果要在加载时注入 SDK、执行 mount / unmount，应使用这个入口。
 */
export { createPluginModuleApplication } from '../entries/app-entry'
export { createPluginModuleApplication as default } from '../entries/app-entry'
