const git = require('simple-git')();
require('array-flat-polyfill'); // simple-git 使用 flatMap 等较新的语法，旧版本需要 polyfill

const inquirer = require('inquirer');
const chalk = require('chalk');

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

    // 参数branch与lenra等同
    this.args.branch = this.args.lerna = this.args.branch || this.args.lerna;

    this.nocommit = false;
    this.version = '';
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
      console.error(chalk.red(e));
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

    // 保存版本号至 package.json
    utils.writeVersion(this.version);
    
    // 提交更新
    await git.add('./package.json');
    let commitHeader = 'ci';
    if (this.args.lerna) {
      const branchNameInfo = await this.getBranchNameInfo();
      commitHeader += `(${branchNameInfo})`;
    }
    const msg = this.nocommit ? this.msg : `${commitHeader}: version ${this.version}`;
    await git.commit(msg);
    this.infoLog('commit', 'message:', chalk.green(`"${msg}"`));

    // 推送到远程仓库
    await this.push('commit');
  }

  /**
   * 暂存所有已修改的文件
   */
  async commitAll() {
    await git.add('-A');
    this.infoLog('add', 'add all changes');
    const { branch, commit } = await git.commit(this.msg);
    if (commit) {
      this.infoLog('commit', `${branch} ${commit}:`, chalk.green(`"${this.msg}"`));
    } else {
      // 输入了 msg，但没有为暂存的文件
      this.nocommit = true;
      // 后续将使用 msg 作为打 tag 时的 commit 信息
    }
  }

  /**
   * 更新为最新的仓库
   */
  async checkNewest() {
    try {
      const res = await git.pull();
      this.debugLog('pull result:', res);
      if (!res.files || res.files.length) {
        this.infoLog('pull', res);
      }
    } catch (e) {
      this.debugLog('pull error:', e);
      this.infoLog('pull', chalk.red(e.message));
      console.warn(chalk.magenta('Please check git status and try again'));
      process.exit(1);
    }
  }

  /**
   * 获取新tag名并推送至远程仓库
   */
  async pushTag() {
    // 获取tag名
    const tagName = await this.getTagName();
    // 打tag
    await git.addTag(tagName);
    this.infoLog('tag', 'tag name:', chalk.green(tagName));
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
        console.info(chalk.gray('[tips] command with "--lerna" or "-L" param can directly enable lerna mode'));
      }
    }
    if (this.args.lerna) {
      // lerna类型仓库支持
      const branchNameInfo = await this.getBranchNameInfo();
      tagName = `${branchNameInfo}_${tagName}`;
    }
    return tagName;
  }


  async getBranchNameInfo() {
    const branchName = await this.getBranchName();
    return branchName.split('/')[0].split('_')[0];
  }

  /**
   * 获取当前分支名
   */
  async getBranchName() {
    const branchInfo = await git.branch();
    this.debugLog('git branch:', branchInfo);
    return branchInfo.current;
  }

  /**
   * 推送至远程仓库的包装函数
   * @param {String} type 推送类型
   * @param  {...any} args push参数（可选）
   */
  async push(type = 'commit', ...args) {
    this.debugLog(`pushing ${type} to remote repository...`);
    await git.push(['origin', ...args], (err, res) => {
      this.debugLog('push result:', res);
      if (err) throw err;
      this.infoLog('push', `push ${type} succeeded`);
    });
  }
  
  /**
   * 输出美化后的信息内容
   * @param {String} header 头部信息，一般为具体的操作名
   * @param  {...any} logs 具体信息
   */
  infoLog(header, ...logs) {
    console.log(chalk.blue(`[${header}]`), ...logs);
  }

  /**
   * debug模式下输出更多的执行信息
   * @param  {...any} logs 需要被打印的信息
   */
  debugLog(...logs) {
    if (this.args && !this.args.debug) {
      return;
    }
    for (let i = 0; i < logs.length; i++) {
      if (logs[i] instanceof Object) {
        logs[i] = JSON.stringify(logs[i], null, 2);
      }
    }
    console.debug(chalk.yellow('[debug]', ...logs))
  }
}

module.exports = Executor;
