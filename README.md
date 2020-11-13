# Fast Tag

A simple cli tool that names tag, updates the version number in package.json and pushes to remote repository.

English | [简体中文](./README_zh-CN.md)

## Installation

Easiest way is through [npm](https://www.npmjs.com/):

```bash
npm i fast-tag -g
```

Install it globally to allow it to be used anywhere.

## Dependencies

Requires [git](https://git-scm.com/downloads) to be installed and that it can be called using the command `git`.

Fast tag expects to do automatic version number update for package.json flie, so it only can use in the npm project.

## Usage

### `ftag tag`

```bash
ftag tag [options] [msg]
```

Options:

| abbr | full        | effect                                                                           |
| ---- | ----------- | -------------------------------------------------------------------------------- |
| -s   | --small     | (default) update PATCH version when you make backwards compatible bug fixes      |
| -m   | --medium    | update MINOR version when you add functionality in a backwards compatible manner |
| -l   | --large     | update MAJOR version when you make incompatible API changes                      |
| -n   | --notupdate | use current version, not update package.json version number                      |
| -p   | --push      | push new tag to remote repository at last                                        |
| -h   | --help      | display help for command                                                         |

When you enter `ftag tag`, fast tag will:

- get the version number from nearest package.json
- increment the version number according to the options (Upgrade patch version by default)
- save the new version number in the package.json file and commit it (commit message: `ci: update version ${version}`)
- and then use the new version number as the tag name for `git tag`

You can add some infomation as commit message, fast tag will commit ALL uncommitted changes.

example:

```bash
ftag tag -p 'docs: update README'
```

Of course, if your changes are complex, it is better to commit the changes individually instead of combining them all in one ftag command at once, which can maintain the independence of each command.

<br>
