function isRecord(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function readRequiredString(source, key) {
    const value = source[key]

    if (typeof value !== 'string' || !value.trim()) {
        throw new Error(`Invalid frontend manifest: field "${key}" is required.`)
    }

    return value.trim()
}

function readOptionalString(source, key) {
    const value = source[key]
    return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function readBoolean(source, key, fallback = false) {
    const value = source[key]
    return typeof value === 'boolean' ? value : fallback
}

function normalizeRouteBase(value, fallbackCode) {
    const raw = (value || `/${fallbackCode}`).trim()
    const normalized = raw.startsWith('/') ? raw : `/${raw}`
    return normalized.length > 1 ? normalized.replace(/\/+$/, '') : normalized
}

export function parseFrontendManifest(input) {
    const parsed = typeof input === 'string' ? JSON.parse(input) : input

    if (!isRecord(parsed)) {
        throw new Error('Invalid frontend manifest: root value must be an object.')
    }

    const id = readRequiredString(parsed, 'id')
    const code = readOptionalString(parsed, 'code') || id
    const kind = readRequiredString(parsed, 'kind')
    const runtime = readRequiredString(parsed, 'runtime')
    const entry = isRecord(parsed.entry) ? parsed.entry : {}

    if (runtime === 'local' && !isRecord(entry.local)) {
        throw new Error(`Invalid frontend manifest "${id}": runtime "local" requires "entry.local".`)
    }

    if (runtime === 'federation' && !isRecord(entry.federation)) {
        throw new Error(`Invalid frontend manifest "${id}": runtime "federation" requires "entry.federation".`)
    }

    if (runtime === 'wujie' && !isRecord(entry.wujie)) {
        throw new Error(`Invalid frontend manifest "${id}": runtime "wujie" requires "entry.wujie".`)
    }

    return {
        id,
        code,
        name: readRequiredString(parsed, 'name'),
        version: readRequiredString(parsed, 'version'),
        enabled: readBoolean(parsed, 'enabled', true),
        kind,
        runtime,
        routeBase: normalizeRouteBase(readOptionalString(parsed, 'routeBase'), code),
        meta: isRecord(parsed.meta) ? parsed.meta : {},
        entry,
        capabilities: isRecord(parsed.capabilities) ? parsed.capabilities : {},
        compatibility: isRecord(parsed.compatibility) ? parsed.compatibility : {},
    }
}
