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

<br>
