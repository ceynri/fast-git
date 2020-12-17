const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

class Utils {
  /**
   * 更新版本号
   * @param {Array} updateArray 更新数组，用三个状态位表示更新哪个等级的版本号
   * @returns {String} 新的版本号
   */
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
    return verArray.join('.');
  }

  /**
   * 将版本号写入 package.json 中
   * @param {String} version 新版本号
   */
  writeVersion(version) {
    const pkg = this.getPkg();
    pkg.version = version;

    // 获取原始文件的缩进大小
    const pkgPath = this.getPkgPath();
    const indentSize = this.getIndentSize(pkgPath);
    // 将package序列化为json字符串
    const pkgJson = JSON.stringify(pkg, null, indentSize);
    // 将修改后的内容写入package.json
    fs.writeFile(pkgPath, pkgJson, (err) => {
      if (err) {
        console.log(chalk.red(err));
        return '';
      }
      console.log('update package.json version:', chalk.green(version));
    });
  }

  /**
   * 获取版本号
   * @returns {String|null} 版本字符串（"X.Y.Z"）
   */
  getVersion() {
    return this.getPkg() && this.getPkg().version;
  }

  /**
   * 获取 package.json 文件对象
   * @returns {Object} package.json 反序列化得到的对象
   */
  getPkg() {
    const pkgPath = this.getPkgPath();
    if (pkgPath) {
      try {
        return JSON.parse(fs.readFileSync(pkgPath));
      } catch (e) {
        console.log(chalk.red(e));
        process.exit(1);
      }
    }
    console.log(chalk.yellow('package.json file not found!'));
    process.exit(1);
  }

  /**
   * 获取最近的 package.json 文件路径
   * @param {String} currentDir 当前路径
   * @returns {String} package.json 绝对路径
   */
  getPkgPath(currentDir = process.cwd()) {
    // 获取package.json对象
    const pkgPath = path.resolve(currentDir, './package.json');
    const parentDir = path.dirname(currentDir);
    if (fs.existsSync(pkgPath)) {
      return pkgPath;
    }
    if (parentDir !== currentDir) {
      return this.getPkgPath(parentDir);
    }
    return '';
  }

  /**
   * 判断是否是 monoRepo 类型（指 lerna 仓库）
   * @returns {Boolean} 是否是嵌套多仓类型仓库
   */
  isMonoRepo() {
    const currentPkgPath = this.getPkgPath();
    const parentPath = path.resolve(currentPkgPath, '../../');
    const parentPkgPath = this.getPkgPath(parentPath);
    return !!parentPkgPath;
  }

  /**
   * 获取文件的缩进大小
   * @param {String} path 文件路径
   * @param {Number} defaultSize 兜底的默认缩进大小
   * @returns {Number} 缩进大小
   */
  getIndentSize(path, defaultSize = 2) {
    const fileString = fs.readFileSync(path);
    const regex = /^{\n(\s+)/;
    const res = regex.exec(fileString);
    if (!res) {
      console.log(chalk.red(`Failed to detect indentation size of package.json, use the default value "${defaultSize}"`));
      return defaultSize;
    }
    const spaceSize = res[1].length;
    console.debug('indent size:', spaceSize);
    return spaceSize;
  }
}

exports.utils = new Utils();
exports.Executor = require('./executor');
