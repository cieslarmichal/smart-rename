# Smart rename

A simple utility for bulk renaming using search and replace.

## Installation

```
npm i -g smart-rename
```

## Example with directory

```
smart-rename . --from user --to customer
smart-rename . --from User --to Customer
```

##### Before:

<img src="./images/dir_example_before.png"/>

##### After:

<img src="./images/dir_example_after.png"/>

## Example with git (current staged files)

```
smart-rename git --from user --to customer
```

##### Before:

<img src="./images/git_example_before.png"/>

##### After:

<img src="./images/git_example_after.png"/>

## Flags

```
smart-rename <source>

Replace all occurences in paths names.

Positionals:
  source  Directory path or 'git' (staged files) to replace all occurrences

Options:
      --version  Show version number
  -f, --from     Rename from
  -t, --to       Rename to
  -e, --exclude  Directories/files names to be excluded from search
      --help     Show help
```
