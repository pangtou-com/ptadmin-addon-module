import { createApp } from 'vue'
import App from './app.vue'
import { bootstrap } from './bootstrap'
import { pluginModulePreview } from './dev'

import './styles/index.scss'

/**
 * 独立开发入口：
 * 1. 使用 dev.ts 中的 mock host sdk
 * 2. 注入最小化 Host SDK 运行时
 * 3. 挂载一个轻量预览页，而不是依赖主应用壳
 */
const app = createApp(App)
bootstrap(pluginModulePreview.sdk)
app.mount('#app')
