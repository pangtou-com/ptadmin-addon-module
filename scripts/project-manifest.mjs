import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
export const projectRoot = path.resolve(currentDir, '..')

function isRecord(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function readRequiredString(source, key, label) {
    const value = source[key]

    if (typeof value !== 'string' || !value.trim()) {
        throw new Error(`Invalid ${label}: field "${key}" is required.`)
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

export function readJSON(relativePath) {
    return JSON.parse(fs.readFileSync(path.join(projectRoot, relativePath), 'utf-8'))
}

function writeJSON(relativePath, value) {
    const filePath = path.join(projectRoot, relativePath)
    const nextContent = `${JSON.stringify(value, null, 4)}\n`
    const prevContent = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : null

    if (prevContent !== nextContent) {
        fs.writeFileSync(filePath, nextContent)
    }
}

export function resolvePluginManifest() {
    const manifest = readJSON('manifest.json')

    if (!isRecord(manifest)) {
        throw new Error('Invalid manifest.json: root value must be an object.')
    }

    const code = readRequiredString(manifest, 'code', 'manifest.json')
    const type = readRequiredString(manifest, 'type', 'manifest.json')

    if (type !== 'module') {
        throw new Error(`Invalid manifest.json: expected type "module", received "${type}".`)
    }

    return {
        ...manifest,
        id: readOptionalString(manifest, 'id') || code,
        code,
        name: readRequiredString(manifest, 'name', 'manifest.json'),
        version: readRequiredString(manifest, 'version', 'manifest.json'),
        description: readOptionalString(manifest, 'description') || '',
        develop: readBoolean(manifest, 'develop', false),
        type,
    }
}

function resolveFrontendConfig() {
    const config = readJSON('frontend.config.json')

    if (!isRecord(config)) {
        throw new Error('Invalid frontend.config.json: root value must be an object.')
    }

    return {
        enabled: readBoolean(config, 'enabled', true),
        runtime: readRequiredString(config, 'runtime', 'frontend.config.json'),
        routeBase: readOptionalString(config, 'routeBase'),
        meta: isRecord(config.meta) ? config.meta : {},
        entry: isRecord(config.entry) ? config.entry : {},
        capabilities: isRecord(config.capabilities) ? config.capabilities : {},
        compatibility: isRecord(config.compatibility) ? config.compatibility : {},
    }
}

export function buildFrontendManifest() {
    const manifest = resolvePluginManifest()
    const config = resolveFrontendConfig()

    return {
        id: manifest.id,
        code: manifest.code,
        name: manifest.name,
        version: manifest.version,
        enabled: config.enabled,
        kind: 'module',
        runtime: config.runtime,
        routeBase: config.routeBase || `/${manifest.code}`,
        meta: {
            ...config.meta,
            description: manifest.description,
            develop: manifest.develop,
        },
        entry: config.entry,
        capabilities: {
            routes: false,
            ...config.capabilities,
        },
        compatibility: config.compatibility,
    }
}

export function syncManifestFiles() {
    const manifest = resolvePluginManifest()
    const frontendManifest = buildFrontendManifest()
    const packageJSON = readJSON('package.json')

    packageJSON.version = manifest.version
    packageJSON.description = manifest.description

    writeJSON('package.json', packageJSON)
    writeJSON('frontend.json', frontendManifest)

    return {
        manifest,
        frontendManifest,
        packageJSON,
    }
}
