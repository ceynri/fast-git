const path = require('path');
const fs = require('fs');

class Utils {
  /**
   * 更新 package.json 版本号
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
        return '';
      }
      console.log(`update project version: ${newVer}`);
    });

    return newVer;
  }

  /**
   * 获取版本号
   */
  getVersion() {
    return this.getPkg() && this.getPkg().version;
  }

  /**
   * 获取 package.json 文件对象
   */
  getPkg() {
    const pkgPath = this.getPkgPath();
    if (pkgPath) {
      try {
        return JSON.parse(fs.readFileSync(pkgPath));
      } catch (e) {
        console.error(e.message);
        console.error('Please merge conflicts manually and try again');
        process.exit(1);
      }
    }
    console.error('package.json file not found!');
    process.exit(1);
  }

  /**
   * 获取最近的 package.json 文件路径
   * @param {String} currentDir 当前路径
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
   */
  getIndentSize(path) {
    // TODO 获取json文件的缩进大小
    // fs.readFileSync(path)
    return 2;
  }
}

exports.utils = new Utils();
exports.Executor = require('./executor');
