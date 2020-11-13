# Fast Tag

一个简单的 cli 工具，快速命名 git tag、更新 package.json 中的版本号并推送到远程存储库。

[English](./README.md) | 简体中文

## 安装

通过[npm](https://www.npmjs.com/)安装：

```bash
npm i fast-tag -g
```

全局安装以使其可以在任何地方使用。

## 依赖关系

需要安装 [git](https://git-scm.com/downloads)，并且可以使用 `git` 命令来调用它。

Fast Tag 会对 package.json 进行自动的版本号更新，因此它只能在 npm 项目中使用。

## 用法

### `ftag tag`

自动命名标签并推送到远程存储库。

用法：

```bash
ftag tag [options] [msg]
```

选项：

| 缩写 | 全称        | 作用                                               |
| ---- | ----------- | -------------------------------------------------- |
| -s   | --small     | （默认）修订号：当你做了向下兼容的问题修正         |
| -m   | --medium    | 次版本号：当你做了向下兼容的功能性新增             |
| -l   | --large     | 主版本号：当你做了不兼容的 API 修改                |
| -n   | --notupdate | 使用当前 package.json 中记录的版本，不更新该版本号 |
| -p   | --push      | 将新标签推送到远程存储库                           |

当您输入`ftag tag`时，Fast Tag 将：

- 从最近的 package.json 获取版本
- 根据 options 增加版本号（默认情况下会升级小版本号）
- 将新版本号保存在 package.json 文件中并提交（提交消息：`ci：update version ${version}`）
- 然后使用新版本号作为 `git tag` 的标签名

你可以添加一些信息作为提交消息，Fast Tag 将会为此提交所有未提交的更改。

当然，如果你的改动较为复杂，最好还是自己单独去提交更改，而不是一下子全部糅合在一条 tag 命令中，这可以保持每个命令的独立性。

## 借助库

- [Simple Git](https://github.com/steveukx/git-js) node.js 版本的轻量级 git 接口
- [Commander.js](https://github.com/tj/commander.js) node.js 环境下的 cli 工具解决方案

## 一些问题

> 这个工具的目的是什么？

编写该命令行工具的初始原因是：目前正在开发的前端项目打 tag 次数较为频繁而繁琐，如果需要规范地使用语义化版本号进行 tag 版本的命名，每次都要翻看之前的 tag 版本到了多少，再在其基础上递增。

如果再有其他要求，例如多项目单仓类型的 lerna 仓库，我们约定 tag 命名规则按照 `${projectName}_${version}` 的形式拼接；或者我们想要打 tag 的时候顺便更新 package.json 文件的版本号，这时候又是反复查看之前的命名、又是手动输入校对名称是否符合规范，在体验上是不够舒服的。

于是 Fast Tag 诞生了。

> 还会提供其他功能不？

目前仅以自用为标准，因为大部分功能都能用 git 实现，诸如“一键 git add、commit、push”的功能，或者“将难记的一长串指令简化”的类 alias 功能，我都并不认为是一种好的使用习惯。推荐记忆 git 的原生语句，能让 git 工具的使用更加灵活。

<br>
