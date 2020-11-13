# Fast Tag

A simple cli tool that names tag, updates npm versions, and pushes to remote repository fastly.

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

Enter `ftag` to see how to use it.

```bash
$ ftag
Usage: ftag [options] [command]

Options:
  -V, --version        output the version number
  -h, --help           display help for command

Commands:
  tag [options] [msg]  auto name tag and push to remote repository
  help [command]       display help for command
```

### `ftag tag`

```bash
$ ftag help tag
Usage: ftag tag [options] [msg]

auto name tag and push to remote repository

Options:
  -s, --small      (default) update PATCH version when you make backwards compatible bug fixes
  -m, --medium     update MINOR version when you add functionality in a backwards compatible manner
  -l, --large      update MAJOR version when you make incompatible API changes
  -n, --notupdate  use current version, not update package.json version
  -p, --push       push new tag to remote repository at last
  -h, --help       display help for command
```

When you enter `ftag tag`, fast tag will:

- get the version from nearest package.json
- increment the version number according to the options (Upgrade patch version by default)
- save the new version in the package.json file and commit it (commit message: `ci: update version ${version}`)
- and then use the new version as the tag name for `git tag`

You can add some infomation as commit message, fast tag will commit ALL uncommitted changes.

Of course, it is a better habit to submit the changes by yourself, which can maintain the independence of each command.

<br>
