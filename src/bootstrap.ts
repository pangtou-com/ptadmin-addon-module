import type { HostSdk } from '@pangtou/host-sdk'
import { defineHostSdk } from '@pangtou/host-sdk'

/**
 * 统一安装插件运行时依赖的基础能力。
 * 这里默认只注入 Host SDK，避免模板在起步阶段就把重型表单/编辑器运行时全部打进包里。
 * 如果你的插件后续需要 schema 渲染，再按需接入 framework-vue 和 material 适配器即可。
 */
export function bootstrap(sdk: HostSdk) {
    defineHostSdk(sdk)
}
