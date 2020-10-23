const fgit = require('./bin/fgit.js');
const { program } = require('commander');
program.version('0.0.1');

program
  .option('-p, --push', 'commit & push')
  .option('-t, --tag', 'commit & tag & push')
  .option('-T, --only-tag', 'tag & push');

program.parse(process.argv);

if (program.push) {

}
