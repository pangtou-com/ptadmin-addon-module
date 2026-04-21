#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(currentDir, '..')
const packageJsonPath = path.join(projectRoot, 'package.json')
const frontendManifestPath = path.join(projectRoot, 'frontend.json')
const projectManifestPath = path.join(projectRoot, 'manifest.json')

const sdkPackageNames = [
    '@pangtou/host-sdk',
    '@pangtou/module-runtime',
    '@pangtou/shared',
]

function fail(message) {
    console.error(`[sync-sdk-version] ${message}`)
    process.exit(1)
}

function parseArgs(argv) {
    let version = ''

    for (let index = 0; index < argv.length; index += 1) {
        const current = argv[index]

        if (current === '--version') {
            version = argv[index + 1] || ''
            index += 1
            continue
        }

        fail(`Unknown argument: ${current}`)
    }

    return version
}

function assertVersion(version) {
    if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
        fail(`Invalid version: "${version}"`)
    }
}

function readJSON(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function writeJSON(filePath, value) {
    fs.writeFileSync(filePath, `${JSON.stringify(value, null, 4)}\n`, 'utf8')
}

function updateDependencyVersions(manifest, version) {
    if (!manifest.dependencies || typeof manifest.dependencies !== 'object') {
        return false
    }

    let changed = false

    for (const packageName of sdkPackageNames) {
        if (manifest.dependencies[packageName] !== version) {
            manifest.dependencies[packageName] = version
            changed = true
        }
    }

    return changed
}

function updateTemplateVersion(packageJson, frontendManifest, projectManifest, version) {
    let changed = false

    if (packageJson.version !== version) {
        packageJson.version = version
        changed = true
    }

    if (frontendManifest.version !== version) {
        frontendManifest.version = version
        changed = true
    }

    if (projectManifest.version !== version) {
        projectManifest.version = version
        changed = true
    }

    const compatibilityVersion = `>=${version}`

    if (!frontendManifest.compatibility || typeof frontendManifest.compatibility !== 'object') {
        frontendManifest.compatibility = {}
    }

    if (frontendManifest.compatibility.console !== compatibilityVersion) {
        frontendManifest.compatibility.console = compatibilityVersion
        changed = true
    }

    return changed
}

function main() {
    const version = parseArgs(process.argv.slice(2))

    if (!version) {
        fail('Missing required --version')
    }

    assertVersion(version)

    const packageJson = readJSON(packageJsonPath)
    const frontendManifest = readJSON(frontendManifestPath)
    const projectManifest = readJSON(projectManifestPath)
    const dependencyChanged = updateDependencyVersions(packageJson, version)
    const versionChanged = updateTemplateVersion(packageJson, frontendManifest, projectManifest, version)

    if (!dependencyChanged && !versionChanged) {
        console.log(`[sync-sdk-version] already up to date: ${version}`)
        return
    }

    writeJSON(packageJsonPath, packageJson)
    writeJSON(frontendManifestPath, frontendManifest)
    writeJSON(projectManifestPath, projectManifest)
    console.log(`[sync-sdk-version] updated template version and sdk dependencies to ${version}`)
}

main()
