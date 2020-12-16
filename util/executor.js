require('array-flat-polyfill'); // simple-git 使用 flatMap 等较新的语法，旧版本需要 polyfill
const git = require('simple-git')();
const inquirer = require('inquirer');

const { utils } = require('./index');

class Executor {
  /**
   * 指令执行器
   * @param {String} msg commit信息
   * @param {Array} args 参数数组
   */
  constructor(msg, args) {
    this.msg = msg;
    this.args = args;
    this.nocommit = false;
    this.version = '';
  }

  /**
   * 获取当前分支名
   */
  async getBranchName() {
    return (await git.branch()).current;
  }

  /**
   * tag指令
   * （目前只有该功能）
   */
  async tag() {
    try {
      // 推送更新
      await this.pushUpdate();
      // 推送tag
      await this.pushTag();
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * 更新版本号并提交所有暂存改动，推送到远程仓库
   */
  async pushUpdate() {
    // 如果输入了msg信息，则帮忙提交所有未暂存的文件
    if (this.msg) {
      await this.commitAll();
    }

    // 检查当前仓库是否是最新版本
    await this.checkNewest();

    // 是否不更新版本号
    if (this.args.notupdate) {
      this.version = utils.getVersion();
      if (!this.nocommit) {
        await this.push('commit');
      }
      return;
    }

    // 是否需要自己输入版本号
    if (this.args.input) {
      this.version = utils.getVersion();
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'inputVersion',
          message: `Please input new version (current version is ${this.version}):`,
          validate: (value) => {
            if(/^\d+\.\d+\.\d+$/.test(value)) {
              return true;
            }
            return 'The version format is "X.Y.Z"';
          },
        },
      ]);
      this.version = answers.inputVersion;
    } else {
      // 自动更新版本号
      this.version = utils.updateVersion([
        this.args.large,
        this.args.medium,
        this.args.small,
      ]);
    }
    utils.writeVersion(this.version);
    await git.add('./package.json');

    // 提交更新
    const msg = this.nocommit ? this.msg : `ci: version ${this.version}`;
    await git.commit(msg);
    console.log(`[commit] message: "${msg}"`);

    // 推送到远程仓库
    await this.push('commit');
  }

  /**
   * 暂存所有已修改的文件
   */
  async commitAll() {
    await git.add('-A');
    console.log('[add] add all changes');
    const { branch, commit } = await git.commit(this.msg);
    if (commit) {
      console.log(`[commit] ${branch} ${commit}: "${this.msg}"`);
    } else {
      this.nocommit = true;
    }
  }

  /**
   * 更新为最新的仓库
   */
  async checkNewest() {
    try {
      const res = await git.pull();
      if (!res.files || res.files.length) {
        console.log('[pull]', res);
      }
    } catch (e) {
      console.error('[pull]', e.message);
      console.log('Please merge conflicts manually and try again');
      process.exit(1);
    }
    // const res = await git.fetch();
    // if (res.raw) {
    //   console.log(`[fetch] ${res.raw}`);
    //   const answers = await inquirer.prompt([
    //     {
    //       type: 'confirm',
    //       name: 'pull',
    //       message: 'repo is not newest, merge it?(Y/n)',
    //     },
    //   ]);
    //   if (!['n', 'N', 'no'].includes(answers.pull)) {
    //     await this.merge();
    //   }
    // }
  }

  // async merge() {
  //   try {
  //     const res = await git.merge(['--commit']);
  //     console.log('[merge]', res);
  //   } catch (err) {
  //     // err.message - the string summary of the error
  //     // err.stack - some stack trace detail
  //     // err.git - where a parser was able to run, this is the parsed content
  //     console.error(err);
  //     console.error(err.message);
  //     process.exit(1);
  //   }
  // }

  /**
   * 获取新tag名并推送至远程仓库
   */
  async pushTag() {
    // 获取tag名
    const tagName = await this.getTagName();
    // 打tag
    await git.addTag(tagName);
    console.log(`[tag] ${tagName}`);
    // 推送到远程仓库
    await this.push('tag', tagName);
  }

  /**
   * 获取tag名
   * 当存在参数lerna时，会在前面拼接分支名中的“/”、“_”之前的信息
   */
  async getTagName() {
    let tagName = `v${this.version}`;
    // 兼容提示逻辑，后续版本去除
    if (!this.args.lerna && utils.isMonoRepo()) {
      const answers = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'lernaMode',
          message: 'Detected this project may be a lerna repo, enable lerna mode?',
          default: false,
        },
      ]);
      if (answers.lernaMode) {
        this.args.lerna = true;
        console.log('tips: command with "--lerna" or "-L" param can directly enable lerna mode');
      }
    }
    if (this.args.lerna) {
      // lerna类型仓库支持
      const branchName = await this.getBranchName();
      const projectName = branchName.split('/')[0].split('_')[0];
      tagName = `${projectName}_${tagName}`;
    }
    return tagName;
  }

  /**
   * 推送至远程仓库的包装函数
   * @param {String} type 推送类型
   * @param  {...any} args push参数（可选）
   */
  async push(type = 'commit', ...args) {
    console.log(`[push] pushing ${type} to remote repository...`);
    await git.push(['origin', ...args], (err, res) => {
      if (err) throw err;
      console.log(`push successfully: ${res.repo}`);
    });
  }
}

module.exports = Executor;
