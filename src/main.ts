#!/usr/bin/env node

import commander from 'commander';
import pack from '../package.json';
import cli from './cmd/cli';
import mod from './cmd/mod';

commander
  .version(pack.version)
  .description(pack.description);

commander
  .command('cli <name>')
  .description('Setup for build CLI with Node/NPM')
  .option('-t, --ts', 'setup Typescript development')
  .action(cli);

commander
  .command('mod <name>')
  .description('Setup for build NPM script module')
  .option('-t, --ts', 'setup Typescript development')
  .action(mod);

commander.parse(process.argv);

if (!commander.args.length) {
  commander.help((help) => {
    return [
      help,
      'Command helper: clip [command] -h',
      null,
    ].join('\n');
  });
}
