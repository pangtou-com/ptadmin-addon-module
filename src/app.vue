<template>
    <main class="preview-page">
        <section class="hero">
            <div>
                <div class="eyebrow">Plugin Scaffold</div>
                <h1>{{ preview.module.title }}</h1>
                <p>{{ preview.module.description }}</p>
            </div>
            <div class="hero-side">
                <span>Pages</span>
                <strong>{{ preview.module.pages?.length || 0 }}</strong>
            </div>
        </section>

        <section class="meta-grid">
            <article class="meta-card">
                <h2>Routes</h2>
                <ul>
                    <li v-for="route in preview.module.routes || []" :key="route.path">
                        <strong>{{ route.title }}</strong>
                        <span>{{ route.path }}</span>
                    </li>
                </ul>
            </article>

            <article class="meta-card">
                <h2>Schema Pages</h2>
                <ul>
                    <li v-for="page in pageList.filter((item) => item.schemaKey)" :key="page.key">
                        <strong>{{ page.title }}</strong>
                        <span>{{ page.schemaKey }}</span>
                    </li>
                </ul>
            </article>
        </section>

        <section class="preview-card">
            <div class="page-tabs">
                <button
                    v-for="page in pageList"
                    :key="page.key"
                    type="button"
                    class="page-tab"
                    :class="{ active: page.key === activePageKey }"
                    @click="activePageKey = page.key"
                >
                    {{ page.title }}
                </button>
            </div>

            <div class="preview-surface">
                <component :is="activePage?.component" v-if="activePage" />
            </div>
        </section>
    </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { pluginModulePreview as preview } from './dev'

/**
 * 独立预览页只负责：
 * 1. 展示模块元数据
 * 2. 挂载当前页面组件
 * 3. 保证插件在脱离宿主时也能开发和调试
 */
const pageList = computed(() => preview.module.pages || [])
const activePageKey = ref(pageList.value[0]?.key || '')
const activePage = computed(() => pageList.value.find((page) => page.key === activePageKey.value) || pageList.value[0] || null)
</script>

<style scoped lang="scss">
.preview-page {
    min-height: 100vh;
    padding: 28px;
    display: grid;
    gap: 20px;
}

.hero {
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    gap: 20px;
    padding: 24px 28px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(34, 116, 255, 0.12);
    box-shadow: 0 18px 46px rgba(15, 23, 42, 0.08);
}

.eyebrow {
    display: inline-flex;
    align-items: center;
    padding: 6px 10px;
    border-radius: 999px;
    background: rgba(34, 116, 255, 0.12);
    color: #2274ff;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.hero h1 {
    margin: 10px 0 8px;
    font-size: 34px;
    line-height: 1.06;
}

.hero p {
    margin: 0;
    color: #526070;
    line-height: 1.7;
}

.hero-side {
    min-width: 160px;
    padding: 18px;
    border-radius: 20px;
    background: linear-gradient(135deg, rgba(34, 116, 255, 0.12), rgba(34, 116, 255, 0.04));
}

.hero-side span {
    display: block;
    font-size: 12px;
    color: #526070;
}

.hero-side strong {
    display: block;
    margin-top: 12px;
    font-size: 32px;
}

.meta-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
}

.meta-card,
.preview-card {
    padding: 22px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(34, 116, 255, 0.12);
    box-shadow: 0 18px 46px rgba(15, 23, 42, 0.08);
}

.meta-card h2 {
    margin: 0 0 14px;
    font-size: 18px;
}

.meta-card ul {
    margin: 0;
    padding: 0;
    display: grid;
    gap: 10px;
    list-style: none;
}

.meta-card li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 14px;
    border-radius: 14px;
    background: #f7f8fa;
}

.meta-card span {
    color: #526070;
    font-size: 13px;
}

.page-tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 18px;
}

.page-tab {
    border: 0;
    cursor: pointer;
    padding: 10px 14px;
    border-radius: 12px;
    background: #eef2ff;
    color: #334155;
    transition: all 0.2s ease;
}

.page-tab.active {
    background: #2274ff;
    color: #fff;
}

.preview-surface {
    min-height: 260px;
}

@media (max-width: 900px) {
    .hero,
    .meta-grid {
        grid-template-columns: 1fr;
        flex-direction: column;
    }
}
</style>
