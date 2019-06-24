export const module = `export function log(...messages: any[]) {
  console.log(...messages);
}

export function dir(data: any) {
  console.dir(data);
}

export function table(data: object[]) {
  console.table(data);
}
`;

export const umd = `import * as module from './module';

export default module;
`;
