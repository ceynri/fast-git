const fgit = require('./bin/fgit.js');
const { program } = require('commander');

const version = require('./package.json').version;
program.version(version);

// program
//   .command('push <msg>')
//   .description('一键向远程仓库推送所有改动')
//   .option('-f, --force', '强制推送')
//   .action((msg, args) => {
//     fgit.push(msg, args);
//   })
// ;

program
  .command('tag [msg]')
  .description('auto name tag and push to remote repository')
  .option('-s, --small', '(default) update PATCH version when you make backwards compatible bug fixes')
  .option('-m, --medium', 'update MINOR version when you add functionality in a backwards compatible manner')
  .option('-l, --large', 'update MAJOR version when you make incompatible API changes')
  .option('-n, --notupdate', 'use current version, not update package.json version')
  .action((msg, args) => {
    fgit.tag(msg, args);
  })
;

program.parse(process.argv);
