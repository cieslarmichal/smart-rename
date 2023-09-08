# Rename paths

A simple utility to quickly replace all occurrences in path names.

## Installation

```
npm i -g rename-paths
```

## Example with directory

```
rps ./userRepository --from user --to customer
```

## Example with git

```
rps git --from user --to customer
```

## Flags

```
rps <source>

Replace all occurences in paths names.

Positionals:
  source  Directory path or 'git' (staged files) to replace all occurrences
                                                                        [string]

Options:
      --version  Show version number                                   [boolean]
  -f, --from     Rename from                                 [string] [required]
  -t, --to       Rename to                                   [string] [required]
  -e, --exclude  Directories/files names to be excluded from search      [array]
      --help     Show help                                             [boolean]
```
