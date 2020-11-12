#! /usr/bin/env node
const git = require('simple-git')();
const path = require('path');
const fs = require('fs');

class Utils {
  getIndentSize(path) {
    // TODO 获取json文件的缩进大小
    // fs.readFileSync(path)
    return 2;
  }

  getPkgPath() {
    // 获取package.json对象
    const pkgPath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(pkgPath)) {
      throw Error('There is no package.json file in the current directory!');
    }
    return pkgPath;
  }
  
  getPkg() {
    const pkgPath = this.getPkgPath();
    if (pkgPath) {
      return require(pkgPath);
    }
    return null;
  }

  /**
   * 获取版本号
   */
  getVersion() {
    return this.getPkg() && this.getPkg().version;
  }

  updateVersion(updateArray) {
    // 获取版本号数组
    const verArray = this.getVersion().split('.', 3).map(Number);
    // 更新版本号
    if (updateArray[0]) {
      verArray[0] += 1;
      verArray[1] = 0;
      verArray[2] = 0;
    } else if (updateArray[1]) {
      verArray[1] += 1;
      verArray[2] = 0;
    } else {
      verArray[2] += 1;
    }
    const newVer = verArray.join('.');

    const pkg = this.getPkg();
    pkg.version = newVer;

    // 获取原始文件的缩进大小
    const pkgPath = this.getPkgPath();
    const indentSize = this.getIndentSize(pkgPath);
    // 将package序列化为json字符串
    const pkgJson = JSON.stringify(pkg, null, indentSize);
    // 将修改后的内容写入package.json
    fs.writeFile(pkgPath, pkgJson, (err) => {
      if (err) {
        console.error(err);
        return null;
      }
      console.log('success');
    });

    return newVer;
  }

  getGitBase(filePath = process.cwd()) {
    const gitFile = path.resolve(filePath, './.git');
    const parent = path.dirname(filePath);
    if (fs.existsSync(gitFile)) {
      return filePath;
    }
    if (parent !== filePath) {
      return this.getGitBase(path.dirname(filePath));
    }
    return null;
  }

  isMonoRepo() {
    const currentGitBase = this.getGitBase();
    const parentGitBase = this.getGitBase(path.dirname(currentGitBase));
    return !!parentGitBase;
  }
}

const utils = new Utils();

class Operation {
  async tag(msg, args) {
    try {
      let version = '';
      if (!args.nochange) {
        // 获取新的版本号
        version = utils.updateVersion([
          args.large,
          args.medium,
          args.small,
        ]);
        await git.add('./package.json').commit(`ci: update version ${version}`);
        // TODO 此处如果已经有其他暂存文件，提示是否需要分别commit
      } else {
        version = utils.getVersion();
      }
      // 如果输入了msg信息，则帮忙提交所有未暂存的文件
      if (msg) {
        await git.add('-A').commit(msg);
      }
      // 获取tag名
      let tagName = `v${version}`;
      if (utils.isMonoRepo()) {
        // lerna类型仓库支持
        const projectName = this.getBranchName().split('/')[0].split('_')[0];
        tagName = `${projectName}_${tagName}`;
      }
      // 打tag
      git.addTag(tagName);
    } catch (e) {
      console.error(e);
    }
  }
  async getBranchName() {
    return (currentBranch = (await git.branch()).current);
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

module.exports = new Operation();
