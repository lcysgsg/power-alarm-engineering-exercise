// No dependencies beyond Node.js. Checks local tool availability, not network access.
import { spawnSync } from 'node:child_process'
const [major, minor] = process.versions.node.split('.').map(Number)
const nodeOk = major > 22 || (major === 22 && minor >= 12) || (major === 20 && minor >= 19)
let failed = !nodeOk
console.log((nodeOk ? 'OK   ' : 'MISS ') + 'Node ' + process.version)
for (const [command, args] of [['java', ['-version']], ['mvn', ['-version']], ['npm', ['--version']]]) {
  const result = spawnSync(command, args, { encoding: 'utf8', shell: process.platform === 'win32', timeout: 10000 })
  const ok = result.status === 0 && !result.error
  failed ||= !ok
  const output = ((result.stdout || '') + '\n' + (result.stderr || '')).trim().split(/\r?\n/)[0]
  console.log((ok ? 'OK   ' : 'MISS ') + command + ' ' + (output || 'not available'))
}
console.log('Check JDK >=17 and Maven >=3.6.3 in the versions above; Node 22.12+ is recommended.')
if (failed) {
  console.error('Environment blocked: ask the interviewer for help or use an available fallback.')
  process.exitCode = 1
}
