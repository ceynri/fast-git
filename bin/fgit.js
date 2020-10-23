const git = require('simple-git')();

class Operation {
  async push() {
    try {
      await git.push();
    } catch (e) {
      console.error(e);
    }
  }
  async tagPush() {
    try {
      await git.push();
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = new Operation();
