import { Command } from 'commander'
import { join } from 'path'
import { exec, mkdir } from 'shelljs'
import { readJSON, writeContent, writeJSON } from '../utils/files'
import { gen } from '../utils/npm'
import { rolldeps } from '../utils/rollup'
import babel from './opt/babel'
import tsc from './opt/tsc'
import * as bbMain from './tpl/mod/bb.main'
import bbRollup from './tpl/mod/bb.rollup'
import * as tsMain from './tpl/mod/ts.main'
import tsRollup from './tpl/mod/ts.rollup'
import tsconfig from './tpl/mod/tsconfig'

export default function (name: string, cmd: Command) {
  const dir = gen(name)
  const opt = cmd.opts()

  if (opt.ts) {
    tsc(dir)
  } else {
    babel(dir)
  }

  template(dir, opt.ts)
  mod(dir, opt.ts)
}

function template(dir: string, ts: boolean) {
  const src = join(dir, 'src')
  const opt = ts ? tsMain : bbMain
  const ext = ts ? 'ts' : 'js'

  mkdir('-p', src)

  writeContent(src, `module.${ext}`, opt.module)
  writeContent(src, `umd.${ext}`, opt.umd)
}

function mod(dir: string, ts: boolean) {
  const pack = readJSON(dir, 'package.json')
  const deps = ['rollup-plugin-esmin']

  pack.main = 'dist/umd.js'
  pack.esnext = 'dist/module.js'
  pack.module = 'dist/module.js'
  pack.scripts.dist = 'run-s dist:*'
  pack.scripts['dist:lint'] = 'npm run lint'
  pack.scripts['dist:clean'] = 'npm run clean'
  pack.scripts['dist:build'] = 'rollup -c'

  if (ts) {
    pack.types = 'dist/module.d.ts'
    pack.scripts['dist:types'] = 'tsc --removeComments --emitDeclarationOnly'

    deps.push('@rollup/plugin-typescript', 'tslib')

    writeJSON(dir, 'tsconfig.json', tsconfig, 2)
  }

  const install = rolldeps(dir, ...deps)

  writeContent(dir, 'rollup.config.js', ts ? tsRollup : bbRollup)
  writeJSON(dir, 'package.json', pack, 2)
  exec(install)
}
