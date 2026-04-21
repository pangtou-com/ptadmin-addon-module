import { syncManifestFiles } from './project-manifest.mjs'

const { manifest, frontendManifest } = syncManifestFiles()

console.log(`[manifest:sync] synced ${manifest.code}@${manifest.version} -> frontend.json (${frontendManifest.runtime})`)
