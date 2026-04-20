import { defineConfig } from 'vite'
// @ts-ignore
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

const federationSharedPackages = [
    'vue',    
    '@pangtou/shared',
    '@pangtou/host-sdk',
    '@pangtou/module-runtime',
] as const

/**
 * 第一版模板默认按 federation remote 输出。
 * 如果插件是通过 federation 挂到 console，宿主里已存在的运行时依赖应优先通过 shared 复用，
 * 避免 remote 重复打包 UI、engine 和 render 层。
 */
export default defineConfig({
    plugins: [
        vue(),
        federation({
            name: 'your_plugin_remote',
            filename: 'remoteEntry.js',
            exposes: {
                './module': './src/exposes/module.ts',
                './app': './src/exposes/app-entry.ts',
            },
            shared: [...federationSharedPackages],
        }),
    ],
    build: {
        target: 'esnext',
        modulePreload: false,
        minify: false,
    },
    preview: {
        host: '0.0.0.0',
        port: 4179,
        strictPort: true,
    },
})
