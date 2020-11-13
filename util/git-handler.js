const git = require('simple-git')();
const { utils } = require('./index');

class GitHandler {
  async tag(msg, args) {
    try {
      let version = '';
      if (!args.notupdate) {
        // 获取新的版本号
        version = utils.updateVersion([args.large, args.medium, args.small]);
        // 提交更新后的版本号
        const commitMsg = `ci: update version ${version}`;
        await git.add('./package.json').commit(commitMsg);
        // TODO 此处如果已经有其他暂存文件，提示是否需要分别commit
        console.log(`commit: "${commitMsg}"`);
      } else {
        version = utils.getVersion();
      }
      // 如果输入了msg信息，则帮忙提交所有未暂存的文件
      if (msg) {
        await git.add('-A').commit(msg);
        console.log(`commit all change: "${msg}"`);
      }
      // 获取tag名
      let tagName = `v${version}`;
      if (utils.isMonoRepo()) {
        // lerna类型仓库支持
        const branchName = await this.getBranchName();
        const projectName = branchName.split('/')[0].split('_')[0];
        tagName = `${projectName}_${tagName}`;
      }
      // 打tag
      await git.addTag(tagName);
      console.log(`patch tag name: ${tagName}`);
      if (args.push) {
        git.push(['origin', tagName]);
        console.log('push tag to remote repository');
      }
    } catch (e) {
      console.error(e);
    }
  }
  async getBranchName() {
    return (await git.branch()).current;
  }

  // async push(msg, { force }) {
  //   try {
  //     console.log('ok', msg);
  //     const args = [];
  //     if (force) {
  //       args.push('-f')
  //     }
  //     git
  //       .add('./*')
  //       .commit(msg)
  //       .push([...args, 'origin', 'master'], (result) => {
  //         console.log(result);
  //       });
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }
}

module.exports = new GitHandler();
