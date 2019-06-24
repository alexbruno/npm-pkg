import { exec } from 'shelljs';
import { writeContent } from '../../utils/files';
import ignore from '../tpl/git/ignore';

export default function(dir: string) {
  const init = `cd ${dir} && git init`;

  exec(init);
  writeContent(dir, '.gitignore', ignore);
}
