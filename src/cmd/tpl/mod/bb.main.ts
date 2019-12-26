export const module = `export function log(...messages) {
  console.log(...messages)
}

export function dir(data) {
  console.dir(data)
}

export function table(data) {
  console.table(data)
}
`

export const umd = `import * as module from './module'

export default module
`
