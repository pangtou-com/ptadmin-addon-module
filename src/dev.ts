import { defineHostSdk } from '@pangtou/host-sdk'
import { pluginModule } from './module'

/**
 * 独立开发时使用的 mock 宿主。
 * 这里的目标不是还原完整宿主，而是保证页面开发、按钮动作和请求链路能跑起来。
 */
const mockHostSDK = defineHostSdk({
    auth: {
        getToken: () => 'plugin-dev-token',
        getUser: () => ({ id: 1, username: 'plugin-dev', nickname: '插件开发用户' }),
        hasRole: () => true,
        hasPermission: () => true,
    },
    request: {
        raw: async <T>(config: Record<string, any>) => config as T,
        sse: async () => [],
        get: async <T>() => ({ code: 0, data: [] }) as T,
        post: async <T>() => ({ code: 0, message: '操作成功' }) as T,
        put: async <T>() => ({ code: 0, message: '操作成功' }) as T,
        delete: async <T>() => ({ code: 0, message: '操作成功' }) as T,
    },
    ui: {
        success: (message: string) => console.log('[plugin-dev:success]', message),
        error: (message: string) => console.error('[plugin-dev:error]', message),
        warning: (message: string) => console.warn('[plugin-dev:warning]', message),
        info: (message: string) => console.info('[plugin-dev:info]', message),
    },
    router: {
        push: (path: string, query?: Record<string, any>) => console.log('[plugin-dev:router.push]', path, query),
        replace: (path: string, query?: Record<string, any>) => console.log('[plugin-dev:router.replace]', path, query),
        back: () => console.log('[plugin-dev:router.back]'),
    },
    tabs: {
        open: (tab) => console.log('[plugin-dev:tabs.open]', tab),
        close: (path: string) => console.log('[plugin-dev:tabs.close]', path),
        refresh: (path?: string) => console.log('[plugin-dev:tabs.refresh]', path ?? 'current'),
    },
    runtime: {
        getBaseURL: () => '/mock-api',
        getUploadURL: () => '/mock-api/upload',
        getRequestMode: () => 'mock',
        getRouteMode: () => 'static',
        getLayoutMode: () => 'left',
        isDark: () => false,
        getThemeTokens: () => ({
            '--ptadmin-theme-color': '#2274ff',
        }),
        getModuleConfig: (moduleKey: string) => moduleKey === pluginModule.name
            ? {
                preview: true,
            }
            : null,
    },
})

/**
 * 独立预览上下文。
 * App.vue 会直接使用这份对象渲染插件自身的元数据和页面。
 */
export const pluginModulePreview = {
    sdk: mockHostSDK,
    module: pluginModule,
}
