# Smart rename

A simple utility for bulk renaming using search and replace.

## Installation

```
npm i -g smart-rename
```

## Example with directory

```
smart-rename --path . --from user --to customer
smart-rename --path . --from User --to Customer
```

##### Before:

<img src="./images/dir_example_before.png"/>

##### After:

<img src="./images/dir_example_after.png"/>

## Example with git stage

```
smart-rename --gitStage --from user --to customer
```

##### Before:

<img src="./images/git_example_before.png"/>

##### After:

<img src="./images/git_example_after.png"/>

## Flags

```
Usage: smart-rename [options]

Options:
      --path      Directory path (search includes directory path and all recursive paths inside)
      --gitStage  Whether to use paths from git stage
  -f, --from      Replace from
  -t, --to        Replace to
```
