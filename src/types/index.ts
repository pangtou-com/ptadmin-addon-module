/**
 * 模板中的示例业务类型。
 * 后续把它们替换成你自己的页面数据结构即可。
 */
export interface ExamplePluginHealthPayload {
    code: number
    message?: string
    data?: {
        status: 'ok' | 'error'
        timestamp: string
    }
}
