import { parseFrontendManifest } from './frontend-manifest.mjs'
import { syncManifestFiles } from './project-manifest.mjs'

function fail(message) {
    console.error(`[manifest:check] ${message}`)
    process.exit(1)
}

function main() {
    const { manifest: pluginManifest, frontendManifest, packageJSON } = syncManifestFiles()
    const manifest = parseFrontendManifest(frontendManifest)

    if (manifest.kind !== 'module') {
        fail(`Expected frontend kind "module", received "${manifest.kind}".`)
    }

    if (manifest.runtime === 'wujie') {
        fail('Module template should not use runtime "wujie".')
    }

    if (!manifest.capabilities.pages && !manifest.capabilities.widgets && !manifest.capabilities.settings) {
        fail('Module frontend manifest should expose at least one capability.')
    }

    if (typeof packageJSON.version !== 'string' || packageJSON.version.trim() === '') {
        fail('package.json version is required.')
    }

    if (manifest.version !== packageJSON.version) {
        fail(`frontend.json version "${manifest.version}" must match package.json version "${packageJSON.version}".`)
    }

    if (manifest.code !== pluginManifest.code || manifest.name !== pluginManifest.name) {
        fail('frontend.json shared fields must stay aligned with manifest.json.')
    }

    console.log(`[manifest:check] ok: ${manifest.code}@${manifest.version} (${manifest.runtime})`)
}

main()
