// Packs dist/ for Hostinger: the files sit at the ZIP root, so extracting the
// archive into public_html/ puts index.html exactly where the server expects it.
import { existsSync, statSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const DIST = 'dist'
const OUT = 'furkankocatas-site.zip'

if (!existsSync(DIST)) {
  console.error('dist/ is missing — run `npm run build` first.')
  process.exit(1)
}

// PowerShell ships with Windows, so this needs no extra dependency.
execFileSync('powershell', [
  '-NoProfile',
  '-Command',
  `if (Test-Path '${OUT}') { Remove-Item '${OUT}' } ; ` +
    `Compress-Archive -Path '${DIST}\\*' -DestinationPath '${OUT}' -CompressionLevel Optimal`,
], { stdio: 'inherit' })

console.log(`${OUT} — ${(statSync(OUT).size / 1048576).toFixed(2)} MB`)
