import { Command } from 'commander';
import { join } from 'path';
import { exec, mkdir } from 'shelljs';
import { readJSON, writeContent, writeJSON } from '../utils/files';
import { gen } from '../utils/npm';
import { rolldeps } from '../utils/rollup';
import { babel } from './opt/babel';
import tsc from './opt/tsc';
import * as bbMain from './tpl/mod/bb.main';
import bbRollup from './tpl/mod/bb.rollup';
import * as tsMain from './tpl/mod/ts.main';
import tsRollup from './tpl/mod/ts.rollup';
import tsconfig from './tpl/mod/tsconfig';
import tslint from './tpl/mod/tslint';

export default function(name: string, cmd: Command) {
  const dir = gen(name);
  const opt = cmd.opts();

  if (opt.ts) {
    tsc(dir);
  } else {
    babel(dir);
  }

  template(dir, opt.ts);
  mod(dir, opt.ts);
}

function template(dir: string, ts: boolean) {
  const src = join(dir, 'src');

  mkdir('-p', src);

  if (ts) {
    writeContent(src, 'module.ts', tsMain.module);
    writeContent(src, 'umd.ts', tsMain.umd);
  } else {
    writeContent(src, 'module.js', bbMain.module);
    writeContent(src, 'umd.js', bbMain.umd);
  }
}

function mod(dir: string, ts: boolean) {
  const pack = readJSON(dir, 'package.json');
  const deps = ['rollup-plugin-esmin'];
  let config;

  pack.main = 'dist/umd.js';
  pack.esnext = 'dist/module.js';
  pack.module = 'dist/module.js';
  pack.scripts.dist = 'run-s dist:*';
  pack.scripts['dist:lint'] = 'npm run lint';
  pack.scripts['dist:clean'] = 'npm run clean';
  pack.scripts['dist:build'] = 'rollup -c';

  if (ts) {
    config = tsRollup();
    pack.types = 'dist/module.d.ts';
    pack.scripts['dist:types'] = 'tsc --removeComments --emitDeclarationOnly';

    deps.push('rollup-plugin-typescript', 'tslib');

    writeJSON(dir, 'tsconfig.json', tsconfig, 2);
    writeJSON(dir, 'tslint.json', tslint, 2);
  } else {
    config = bbRollup();
  }

  const install = rolldeps(dir, ...deps);

  writeContent(dir, 'rollup.config.js', config);
  writeJSON(dir, 'package.json', pack, 2);
  exec(install);
}
