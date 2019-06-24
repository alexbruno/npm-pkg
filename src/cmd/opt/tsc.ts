import { exec } from 'shelljs';
import { readJSON, writeJSON } from '../../utils/files';

export default function(dir: string) {
  const pack = readJSON(dir, 'package.json');
  const install = [
    `cd ${dir} &&`,
    'npm i -D',
    'typescript',
    'tslint',
    '@types/node',
  ].join(' ');

  pack.scripts.lint = 'tsc --noEmit && tslint -p . -c tslint.json --fix';

  writeJSON(dir, 'package.json', pack, 2);
  exec(install);
}
