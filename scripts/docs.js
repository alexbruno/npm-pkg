const shell = require('shelljs')
const pack = require('../package.json')
const files = require('../dist/utils/files')

const root = process.cwd()
const read = 'README.md'

const help = shell.exec('node dist/main.js -h')
const cli = help.stdout.replace('main', pack.name)

const docs = `# ${pack.name}

${pack.description}

---

You can simply use it via NPX:

\`\`\`bash
npx ${pack.name} [command] [options] <name>
\`\`\`

Or install it globally on your environment:

\`\`\`bash
npm i -g ${pack.name}

${pack.name} [command] [options] <name>
\`\`\`

---

\`\`\`
${cli}
\`\`\`
`

files.writeContent(root, read, docs)
