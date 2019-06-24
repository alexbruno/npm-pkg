import { exec } from 'shelljs';
import { readJSON, writeContent, writeJSON } from '../../utils/files';

export function babel(dir: string, cli?: boolean) {
  const pack = readJSON(dir, 'package.json');
  const install = [
    `cd ${dir} &&`,
    'npm i -D',
    'babel-eslint',
    'eslint',
    'eslint-config-standard',
    'eslint-plugin-import',
    'eslint-plugin-node',
    'eslint-plugin-promise',
    'eslint-plugin-standard',
  ];
  const config = {
    presets: ['@babel/preset-env'],
  };
  const eslint = {
    env: {
      es6: true,
    },
    extends: [
      'eslint:recommended',
      'standard',
    ],
    parserOptions: {
      ecmaVersion: 2018,
      parser: 'babel-eslint',
    },
    plugins: [
      'import',
      'standard',
    ],
    root: true,
    rules: {
      'no-console': 0,
    },
  };

  pack.scripts.lint = 'eslint \'src\' --color --fix';

  if (cli) {
    install.push('@babel/cli', '@babel/core', '@babel/preset-env');
  }

  writeContent(dir, '.eslintignore', 'dist');
  writeJSON(dir, '.eslintrc', eslint, 2);
  writeJSON(dir, '.babelrc', config, 2);
  writeJSON(dir, 'package.json', pack, 2);
  exec(install.join(' '));
}
