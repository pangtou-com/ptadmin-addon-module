/**
 * 远端只暴露模块元数据的入口。
 * 宿主如果只需要收集 routes / pages / widgets，可以直接消费这个文件。
 */
export { pluginModule } from '../module'
export { pluginModule as default } from '../module'
