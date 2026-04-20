interface ExampleSchemaField {
    name: string
    type: string
    label: string
    placeholder?: string
}

interface ExampleSchema {
    name: string
    title: string
    fields: ExampleSchemaField[]
}

/**
 * 这里保留一个最小 schema 示例。
 * 当前模板只通过页面上的 `schemaKey` 标识 schema 页面，
 * 真正的动态拉取和专用容器切换由宿主后续实现。
 */
export const examplePluginSchema: ExampleSchema = {
    name: 'yourPluginExampleSchema',
    title: '示例 Schema',
    fields: [
        {
            name: 'title',
            type: 'text',
            label: '标题',
            placeholder: '请输入标题',
        },
    ],
}
