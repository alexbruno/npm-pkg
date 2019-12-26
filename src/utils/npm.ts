import { join } from 'path'
import { exec, mkdir, rm } from 'shelljs'
import git from '../cmd/opt/git'
import ignore from '../cmd/tpl/npm/ignore'
import { readJSON, writeContent, writeJSON } from './files'

const base = process.cwd()

const prettier = {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
}

export function npm(dir: string) {
  const init = `cd ${dir} && npm init -y && npm i -D husky npm-run-all shx prettier`

  exec(init)
  writeContent(dir, '.npmignore', ignore)

  const pack = readJSON(dir, 'package.json')

  delete pack.scripts.test

  pack.version = '0.0.0'
  pack.husky = {
    hooks: {
      'pre-commit': 'npm run lint && git add .',
    },
  }

  Object.assign(pack.scripts, {
    clean: 'shx rm -rf dist',
    major: 'npm version major && npm run push',
    minor: 'npm version minor && npm run push',
    patch: 'npm version patch && npm run push',
    prepare: 'npm run dist',
    push: 'git push && git push --tags',
  })

  delete pack.main

  writeJSON(dir, '.prettierrc.json', prettier, 2)
  writeJSON(dir, 'package.json', pack, 2)
}

export function gen(name: string) {
  const dir = join(base, name)

  if (name !== '.' && name !== './') {
    rm('-rf', dir)
    mkdir('-p', dir)
  }

  git(dir)
  npm(dir)

  return dir
}
