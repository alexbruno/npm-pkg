export default `#!/usr/bin/env node

import commander from 'commander'
import pack from '../package.json'

commander
  .version(pack.version)
  .description(pack.description)

commander
  .command('log <name>')
  .description('Log a message on terminal')
  .option('-p, --param', 'Param test')
  .action((name, cmd) => {
    console.log(name, cmd.opts())
  })

commander.parse(process.argv)

if (!commander.args.length) { commander.help() }
`;
