# fast-tag

一个简单的 cli 工具，快速命名 git tag、更新 package.json 中的版本号并推送到远程存储库。

[English](./README.md) | 简体中文

## 安装

### 全局安装（推荐）

全局安装以使其可以在任何地方使用。

```bash
npm install fast-tag --global
```

### 局部安装

在项目文件夹下打开命令行，安装 fast-tag：

```bash
npm install fast-tag --save-dev
```

在 package.json 中添加 script：

```json
{
  // ...
  "script": {
    "tag": "ftag"
  }
}
```

然后使用命令 `npm run tag` 即可执行该工具。

> ⚠ 注意
>
> 由于 `npm run xxx` 的形式不支持透传参数，故本工具的功能将受到限制，使用上并不灵活：
>
> ```json
> {
>   "script": {
>     "tag": "ftag",
>     "tag:lerna": "ftag -L",
>     "tag:m": "ftag -m"
>   }
> }
> ```
>
> 如果需要使用更多参数，推荐全局安装。

## 依赖关系

需要安装 [git](https://git-scm.com/downloads)，并且可以使用 `git` 命令来调用它。

Fast Tag 会对 package.json 进行自动的版本号更新，因此它只能在 npm 项目中使用。

## 用法

### 简介

```bash
ftag [options] [msg]
```

当您输入`ftag`时，Fast Tag 将：

- 从远程仓库更新本地代码并尝试合并
- 从最近的 package.json 获取版本
- 根据 options 增加版本号（默认情况下会升级小版本号）
- 将新版本号保存在 package.json 文件中并提交该更新至远端（提交消息：`ci: version ${version}`）
- 然后使用新版本号作为 `git tag` 的标签名并提交至远端

你可以添加 `msg` 作为提交消息，Fast Tag 将会为此提交所有未提交的更改。如果没有未提交的更改，则将使用 `msg` 作为更新 package.json 时的提交信息。

当然，推荐在使用 fast tag 之前，就已经做好了相关文件的 commit、更新同步远程代码（pull）到本地，而不是指望用一条 ftag 命令来完成这些事，这可以保持每个命令的独立性。

### 举例

简单用法：

```bash
ftag
```

对于 lerna 仓库的子项目的用法：

```bash
ftag -L
```

想要更新次版本号：

```bash
ftag -m
```

想要顺便提交所有修改并打 tag 然推送到远程仓库：

```bash
ftag 'feat: 添加某某新特性'
```

### 选项

| 缩写 | 全称        | 作用                                                 |
| ---- | ----------- | ---------------------------------------------------- |
| -s   | --small     | 递增（默认）修订号：当你做了向下兼容的问题修正       |
| -m   | --medium    | 递增次版本号：当你做了向下兼容的功能性新增           |
| -l   | --large     | 递增主版本号：当你做了不兼容的 API 修改              |
| -i   | --input     | 自行输入指定版本号                                   |
| -n   | --notupdate | 使用当前 package.json 中记录的版本，不更新该版本号   |
| -b   | --branch    | 在版本号前面拼接分支名的部分信息\*作为完整的标签名称 |
| -L   | --lerna     | lerna 模式，效果等同于 `--branch`                    |
| -d   | --debug     | 显示更多调试信息                                     |
| -h   | --help      | 获取命令帮助                                         |

> 部分信息\*: 如果分支名中含有`_`或者`/`符号，则截断分支名并取前面的字符串作为分支信息

## 借助库

- [Simple Git](https://github.com/steveukx/git-js) - node.js 版本的轻量级 git 接口
- [Commander.js](https://github.com/tj/commander.js) - node.js 环境下的 cli 工具解决方案

> ⚠ 注意
>
> Simple Git 使用了较新的 js 语法，导致在 node12 以下的版本环境下使用本工具可能会遇到某些方法报错的问题。
>
> 推荐使用 node12 及以上的版本。如果低版本情况下遇到该问题也可以提交 issue，本项目将会在后续版本添加相应的 polyfill。

## 一些问题

> 这个工具的目的是什么？

编写该命令行工具的初始原因是：目前正在开发的前端项目打 tag 次数较为频繁而繁琐，如果需要规范地使用语义化版本号进行 tag 版本的命名，每次都要翻看之前的 tag 版本到了多少，再在其基础上递增。

如果再有其他要求，例如多项目类型的 lerna 仓库，我们想要以 `${branchName}_${version}` 的拼接形式作为 tag 名；或者我们想要打 tag 的时候顺便更新 package.json 文件的版本号，这时候又是反复查看之前的命名、又是手动输入校对名称是否符合规范，在体验上是不够舒服的。

于是 Fast Tag 诞生了。

> 还会提供其他功能不？

目前仅想做好打 tag 这件事。

因为大部分功能都能用 git 实现，诸如“一键 git add、commit、push”的功能，或者“将难记的一长串指令简化”的类 alias 功能，我都并不认为是一种好的使用习惯。推荐记忆 git 的原生语句，能让 git 工具的使用更加灵活。

<br>
