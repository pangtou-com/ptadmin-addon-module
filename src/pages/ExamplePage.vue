<template>
    <section class="example-page">
        <article class="surface-card">
            <header class="card-header">
                <span>插件示例页面</span>
                <span class="template-badge">Template</span>
            </header>

            <div class="content">
                <p>当前页面用于演示插件如何读取宿主用户信息、触发宿主 UI，并发起统一请求。</p>

                <div class="info-grid">
                    <div class="info-item">
                        <span>当前用户</span>
                        <strong>{{ currentUserLabel }}</strong>
                    </div>
                    <div class="info-item">
                        <span>请求模式</span>
                        <strong>{{ requestMode }}</strong>
                    </div>
                </div>

                <div class="actions">
                    <button type="button" class="action-button action-button-primary" @click="handleHostToast">触发宿主提示</button>
                    <button type="button" class="action-button" @click="handleOpenTab">触发宿主标签页</button>
                    <button type="button" class="action-button" :disabled="loading" @click="handleMockRequest">
                        {{ loading ? '请求中...' : '调用统一请求' }}
                    </button>
                </div>

                <pre v-if="responseText" class="response-block">{{ responseText }}</pre>
            </div>
        </article>
    </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { getHostSdk } from '@pangtou/host-sdk'
import { getPluginApi } from '../api'

/**
 * 页面层只拿宿主能力和 API 封装，不直接散落请求细节。
 * 这样后续替换 mock、切换接口或接入远端宿主时改动会更集中。
 */
const hostSDK = getHostSdk()
const pluginApi = getPluginApi()
const loading = ref(false)
const responseText = ref('')

const currentUserLabel = computed(() => {
    const user = hostSDK.auth.getUser()
    return user?.nickname || user?.username || '匿名用户'
})

const requestMode = computed(() => hostSDK.runtime.getRequestMode())

/**
 * 示例统一请求调用。
 * 真实业务里可以继续沿用这个模式，把 response 交给页面自己展示。
 */
async function handleMockRequest() {
    loading.value = true

    try {
        const response = await pluginApi.getHealth()
        responseText.value = JSON.stringify(response, null, 2)
        hostSDK.ui.success('请求已完成')
    }
    catch (error) {
        hostSDK.ui.error(error instanceof Error ? error.message : '请求失败')
    }
    finally {
        loading.value = false
    }
}

/**
 * 演示插件复用宿主 UI 通知能力，而不是自行维护一套提示组件协议。
 */
function handleHostToast() {
    hostSDK.ui.info('这里演示的是插件对宿主 UI 能力的复用')
}

/**
 * 演示插件通过宿主标签页体系打开页面。
 * 如果宿主没有 tabs 能力，也可以在 SDK 层做降级实现。
 */
function handleOpenTab() {
    hostSDK.tabs.open({
        title: '示例页面',
        path: '/your-plugin',
    })
}
</script>

<style scoped lang="scss">
.example-page {
    display: grid;
}

.surface-card {
    padding: 22px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(34, 116, 255, 0.12);
    box-shadow: 0 18px 46px rgba(15, 23, 42, 0.08);
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.template-badge {
    display: inline-flex;
    align-items: center;
    padding: 6px 10px;
    border-radius: 999px;
    background: rgba(15, 118, 110, 0.12);
    color: #0f766e;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
}

.content {
    margin-top: 18px;
    display: grid;
    gap: 18px;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
}

.info-item {
    display: grid;
    gap: 6px;
    padding: 14px 16px;
    border-radius: 14px;
    background: #f7f8fa;
}

.info-item span {
    font-size: 12px;
    color: #526070;
}

.info-item strong {
    font-size: 15px;
    color: #0f172a;
}

.actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

.action-button {
    border: 0;
    cursor: pointer;
    padding: 11px 14px;
    border-radius: 12px;
    background: #e5edf9;
    color: #0f172a;
    font: inherit;
    transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.action-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
}

.action-button:disabled {
    opacity: 0.7;
    cursor: wait;
}

.action-button-primary {
    background: #2274ff;
    color: #fff;
}

.response-block {
    margin: 0;
    padding: 14px 16px;
    border-radius: 14px;
    background: #0f172a;
    color: #e2e8f0;
    overflow: auto;
    font-size: 12px;
    line-height: 1.7;
}
</style>
