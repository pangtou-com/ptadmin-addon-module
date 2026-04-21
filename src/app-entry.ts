import { bootstrap } from './bootstrap'
import type { ModuleApplication } from '@pangtou/module-runtime'
import { pluginModule } from './module'

/**
 * 远端挂载入口。
 * 宿主通过它把 sdk 注入进来，插件只依赖 `host-sdk` 协议，不依赖宿主内部实现。
 */
export function createPluginModuleApplication(): ModuleApplication {
    return {
        module: pluginModule,
        mount(props) {
            bootstrap(props.sdk)
        },
        unmount() {
            return
        },
    }
}
