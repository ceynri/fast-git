# fast-tag

A simple cli tool that names tag, updates the version number in package.json and pushes to remote repository.

English | [简体中文](https://github.com/ceynri/fast-tag/blob/master/README_zh-CN.md)

## Installation

### Global installation (recommended)

Install globally to used it anywhere.

```bash
npm install fast-tag --global
```

### local installation

Open command line in the project folder and install fast-tag:

```bash
npm install fast-tag --save-dev
```

Add script in package.json:

```json
{
  // ...
  "script": {
    "tag": "ftag"
  }
}
```

Then input command `npm run tag` to execute fast-tag.

> ⚠ Note
>
> Since `npm run xxx` does not support pass-through of params, fast-tag will be restricted in usage:
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
> If more params are needed, global installation is recommended.

## Dependencies

Requires [git](https://git-scm.com/downloads) to be installed and that it can be called using the command `git`.

Fast tag expects to do automatic version number update for package.json flie, so it only can use in the npm project.

## Usage

### Introduction

```bash
ftag [options] [msg]
```

When you enter `ftag`, fast tag will:

- update local repo from remote repo and try to merge
- get the version number from nearest package.json
- increment the version number according to the options (Upgrade patch version by default)
- save the new version number in the package.json file and push it to remote repo (commit message: `ci: version ${version}`)
- and then use the new version number as the tag name for `git tag` and pusn to remote repo

You can add `msg` as commit message, fast tag will commit ALL uncommitted changes. If there are no uncommitted changes, `msg` will be used as the package.json submit message.

Of course, it is recommended that before using the fast tag, you have already done the commit of the files, pull remote repo to the local, instead of relying on a ftag command to complete these things, which can maintain the independence of each command.

### Examples

simple usage:

```bash
ftag
```

lerna repo:

```bash
ftag -L
```

patch tag with update the minor version number:

```bash
ftag -m
```

patch tag with submit all changes:

```bash
ftag 'feat: add some new features'
```

### Options

| abbr | full        | effect                                                                           |
| ---- | ----------- | -------------------------------------------------------------------------------- |
| -s   | --small     | (default) update PATCH version when you make backwards compatible bug fixes      |
| -m   | --medium    | update MINOR version when you add functionality in a backwards compatible manner |
| -l   | --large     | update MAJOR version when you make incompatible API changes                      |
| -i   | --input     | input any version number by yourself                                             |
| -n   | --notupdate | use current version, not update package.json version number                      |
| -b   | --branch    | concatenate part of the branch name\* with version number as the tag name        |
| -L   | --lerna     | lerna mode, equal to `--branch`                                                  |
| -d   | --debug     | show more output information for debug                                           |
| -h   | --help      | display help for command                                                         |

> part of the branch name\*: If the branch name contains `_` or `/` symbol, the branch name will be truncated and the previous part will be used.

## Libraries

- [Simple Git](https://github.com/steveukx/git-js) - A lightweight interface for running git commands in any node.js application.
- [Commander.js](https://github.com/tj/commander.js) - The complete solution for node.js command-line interfaces.

> ⚠ Note
>
> Simple Git depends on node.js version 12 or above, use in a lower version of node will result in errors.
>
> It is recommended to use fast-tag in node.js version 12 or above. If you encounter this problem in the lower version, you can also submit an issue. The project will add polyfill in the later version.

## Questions

> What is the purpose of this tool?

The initial reason for coding this cli tool is: the front-end projects currently under development add git tag frequently and cumbersomely. If you need to use the semantic version to name the tag version in a standardized way, you have to look at the previous tag version every time, then increase on its basis.

If there are other requirements, for example, we want to concatenate branch name with version number as the tag name (like `development_v1.1.4`), or we want to tag and update version number of package.json at the same time, we have to find the previous tag version and handle these tasks manually, which is not comfortable enough in experience.

So Fast Tag was born.

> Will other commands be provided?

Currently, fast-tag only want to patch tag well.

By the way, most of the effect can be implemented with git, such as the "one-click git add, commit, push", or the "alias ​​long command". It is not considered a good habit. Recommend memorizing the native command of git to make the use of git more flexible.

<br>
