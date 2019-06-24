export function rolldeps(dir: string, ...deps: string[]) {
  const cmd = [`cd ${dir} &&`, 'npm i -D rollup', ...deps];

  return cmd.join(' ');
}
