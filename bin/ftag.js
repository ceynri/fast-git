#! /usr/bin/env node
const { Executor } = require('../util');
const { program } = require('commander');

// 设置该工具的版本号
const version = require('../package.json').version;
program.version(version);

program
  .arguments('[msg]')
  .description('auto name tag and push to remote repository', {
    msg: '(optional) all unadded files will be added if you add msg',
  })
  .option(
    '-L, --lerna',
    'lerna mode, version number will concat the part of the branch name in front as tag name'
  )
  .option(
    '-s, --small',
    '(default) update PATCH version when you make backwards compatible bug fixes'
  )
  .option(
    '-m, --medium',
    'update MINOR version when you add functionality in a backwards compatible manner'
  )
  .option(
    '-l, --large',
    'update MAJOR version when you make incompatible API changes'
  )
  .option(
    '-n, --notupdate',
    'use current version, not update package.json version'
  )
  .option(
    '-i, --input',
    'input any version number yourself'
  )
  .option(
    '-d, --debug',
    '(not implemented) show more console information'
  )
  // .option(
  //   '-p, --push',
  //   'push new tag to remote repository at last'
  // )
  .action((msg, args) => {
    (new Executor(msg, args)).tag();
    // console.warn('unsupported commands, you can enter "ftag --help" to view more help information');
  })
;

// program
//   .command('test')
//   .action(async () => {
//     const git = require('simple-git')();
//     console.log(await git.fetch());
//   })
// ;

program.parse(process.argv);
