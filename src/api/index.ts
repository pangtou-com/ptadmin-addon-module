import { getHostSdk } from '@pangtou/host-sdk'
import type { ExamplePluginHealthPayload } from '../types'

/**
 * 插件内部的 API 访问建议统一从这里出发。
 * 这样页面层不需要直接关心宿主 sdk 的细节，后续切换接口也更容易。
 */
export function getPluginApi() {
    const sdk = getHostSdk()

    return {
        async getHealth() {
            return sdk.request.get<ExamplePluginHealthPayload>('/your-plugin/health')
        },
    }
}
