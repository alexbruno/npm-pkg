import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

export function readContent(dir: string, file: string) {
  const path = join(dir, file)
  const utf8 = readFileSync(path, 'utf8')

  return utf8
}

export function writeContent(dir: string, file: string, data: any) {
  const path = join(dir, file)

  writeFileSync(path, data, 'utf8')
}

export function readJSON(dir: string, file: string) {
  const json = readContent(dir, file)

  return JSON.parse(json)
}

export function writeJSON(
  dir: string,
  file: string,
  data: any,
  indent: number,
) {
  const json = JSON.stringify(data, null, indent)

  writeContent(dir, file, json)
}
