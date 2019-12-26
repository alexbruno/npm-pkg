import { exec } from 'shelljs'
import { readJSON, writeJSON } from '../../utils/files'

export default function babel(dir: string, cli?: boolean) {
  const pack = readJSON(dir, 'package.json')
  const install = [
    `cd ${dir} &&`,
    'npm i -D',
    '@babel/preset-env',
    '@babel/core',
  ]
  const config = {
    presets: ['@babel/preset-env'],
  }

  pack.scripts.lint = "prettier --config .prettierrc.json --write 'src/**/*.js'"

  if (cli) {
    install.push('@babel/cli')
  }

  writeJSON(dir, '.babelrc', config, 2)
  writeJSON(dir, 'package.json', pack, 2)
  exec(install.join(' '))
}
