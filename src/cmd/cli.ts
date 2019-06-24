import { Command } from 'commander';
import { join } from 'path';
import { exec, mkdir } from 'shelljs';
import { readJSON, writeContent, writeJSON } from '../utils/files';
import { gen } from '../utils/npm';
import { babel } from './opt/babel';
import tsc from './opt/tsc';
import bbMain from './tpl/cli/bb.main';
import tsMain from './tpl/cli/ts.main';
import tsconfig from './tpl/cli/tsconfig';
import tslint from './tpl/cli/tslint';
import typings from './tpl/cli/typings';

export default function(name: string, cmd: Command) {
  const dir = gen(name);
  const opt = cmd.opts();

  if (opt.ts) {
    tsc(dir);
    writeJSON(dir, 'tsconfig.json', tsconfig, 2);
    writeJSON(dir, 'tslint.json', tslint, 2);
  } else {
    babel(dir, true);
  }

  exec(`cd ${dir} && npm i -S commander`);
  template(dir, opt.ts);
  cli(dir, opt.ts);
}

function template(dir: string, ts: boolean) {
  const src = join(dir, 'src');

  mkdir('-p', src);

  if (ts) {
    writeContent(src, 'main.ts', tsMain);
    writeContent(src, 'typings.d.ts', typings);
  } else {
    writeContent(src, 'main.js', bbMain);
  }
}

function cli(dir: string, ts: boolean) {
  const pack = readJSON(dir, 'package.json');

  pack.main = 'dist/main.js';
  pack.bin = {
    [pack.name]: pack.main,
  };

  pack.scripts.dist = 'run-s dist:*';
  pack.scripts['dist:lint'] = `npm run lint`;
  pack.scripts['dist:clean'] = `npm run clean`;
  pack.scripts['dist:build'] = ts ? 'tsc' : 'babel src -d dist';

  writeJSON(dir, 'package.json', pack, 2);
}
