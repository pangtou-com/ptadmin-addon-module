import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { parseFrontendManifest } from './frontend-manifest.mjs'
import { readJSON, syncManifestFiles } from './project-manifest.mjs'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(currentDir, '..')
const releaseRoot = path.join(projectRoot, 'release')

function copyDirectory(sourceDir, targetDir) {
    fs.mkdirSync(targetDir, { recursive: true })

    for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
        const sourcePath = path.join(sourceDir, entry.name)
        const targetPath = path.join(targetDir, entry.name)

        if (entry.isDirectory()) {
            copyDirectory(sourcePath, targetPath)
            continue
        }

        fs.copyFileSync(sourcePath, targetPath)
    }
}

function run(command, args) {
    const result = spawnSync(command, args, {
        cwd: projectRoot,
        stdio: 'inherit',
    })

    if (result.status !== 0) {
        process.exit(result.status ?? 1)
    }
}

function fail(message) {
    console.error(`[pack] ${message}`)
    process.exit(1)
}

function main() {
    syncManifestFiles()
    const packageJSON = readJSON('package.json')
    const pluginManifest = readJSON('manifest.json')
    const manifest = parseFrontendManifest(readJSON('frontend.json'))
    const packageManager = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'

    run(packageManager, ['run', 'build'])
    run(packageManager, ['run', 'manifest:check'])

    const remoteEntryPath = path.join(projectRoot, 'dist', 'assets', 'remoteEntry.js')
    if (!fs.existsSync(remoteEntryPath)) {
        fail('Expected build output "dist/assets/remoteEntry.js" was not found.')
    }

    const archiveBaseName = `${manifest.code}-${packageJSON.version}`
    const stageDir = path.join(releaseRoot, archiveBaseName)
    const archivePath = path.join(releaseRoot, `${archiveBaseName}.zip`)

    fs.rmSync(stageDir, { recursive: true, force: true })
    fs.rmSync(archivePath, { force: true })
    fs.mkdirSync(stageDir, { recursive: true })

    copyDirectory(path.join(projectRoot, 'dist'), path.join(stageDir, 'dist'))
    fs.copyFileSync(path.join(projectRoot, 'manifest.json'), path.join(stageDir, 'manifest.json'))
    fs.copyFileSync(path.join(projectRoot, 'frontend.json'), path.join(stageDir, 'frontend.json'))
    fs.copyFileSync(path.join(projectRoot, 'package.json'), path.join(stageDir, 'package.json'))
    fs.copyFileSync(path.join(projectRoot, 'README.md'), path.join(stageDir, 'README.md'))
    fs.writeFileSync(
        path.join(stageDir, 'release.json'),
        JSON.stringify({
            code: manifest.code,
            name: manifest.name,
            version: packageJSON.version,
            description: pluginManifest.description || '',
            kind: manifest.kind,
            runtime: manifest.runtime,
            packedAt: new Date().toISOString(),
        }, null, 2),
    )

    const zipResult = spawnSync('zip', ['-qr', archivePath, archiveBaseName], {
        cwd: releaseRoot,
        stdio: 'inherit',
    })

    if (zipResult.status !== 0) {
        fail('Failed to create release archive. Ensure "zip" is available in your environment.')
    }

    fs.rmSync(stageDir, { recursive: true, force: true })
    console.log(`[pack] created ${archivePath}`)
}

main()
