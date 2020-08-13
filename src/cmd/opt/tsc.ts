import { exec } from 'shelljs'
import { readJSON, writeJSON } from '../../utils/files'
import tsconfig from '../tpl/cli/tsconfig'

export default function (dir: string) {
  const pack = readJSON(dir, 'package.json')
  const install = [
    `cd ${dir} &&`,
    'npm i -D',
    'typescript',
    '@types/node',
  ].join(' ')

  pack.scripts.lint = 'run-s lint:*'
  pack.scripts['lint:tsc'] = 'tsc --noEmit'
  pack.scripts['lint:prettier'] =
    "prettier --config .prettierrc.json --write 'src/**/*.ts'"

  writeJSON(dir, 'tsconfig.json', tsconfig, 2)
  writeJSON(dir, 'package.json', pack, 2)
  exec(install)
}
