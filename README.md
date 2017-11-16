# vscode-devdocs README

**WARNING: Due to restriction imposed by `vscode.previewHtml`, all preferences and offline data for DevDocs will be lost after VSCode restart. It is not recommended to use this extension any more.**

Search documentation on devdocs.io inside VSCode

## Commands

Name                 | Description                                                 | Keybindings
-------------------- | ----------------------------------------------------------- | ------------
devdocs.quickSearch  | Search DevDocs with the word under cursor or selected words | `alt+shift+d`
devdocs.search       | Search DevDocs with keywords                                |
devdocs.home         | Open DevDocs home                                           |
devdocs.settings     | Open DevDocs settings page                                  | 
devdocs.offline      | Open DevDocs offline data page                              |

## General Notes

This is a simple wrapper around devdocs.io. All documentations are provided and hosted by devdocs.io.
The extension has no control over DevDocs. For best user experience, you should configure it manually:

* <del>Run `devdocs.settings`. You can choose enabled documents, use dark theme and/or hide sidebar as needed</del>
* <del>Run `devdocs.offline` to cache documentations locally</del>

For further information, please refer to [DevDocs Help](http://devdocs.io/help).

## Known Issues

* Document list in `devdocs.settings` page might be buggy (lose scroll position on first click)
* All preferences and offline data for DevDocs will be lost after VSCode restart due to recent changes to vscode #4

## Release Notes

### 1.0.0

Initial release