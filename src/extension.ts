'use strict'
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'

import { Query, SCHEME, DevDocsContentProvider, encodeDevDocsUri } from './ContentProvider/DevDocs'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    let devdocs = new DevDocsContentProvider()
    let registration = vscode.workspace.registerTextDocumentContentProvider(SCHEME, devdocs)

    const getColumn = () => {
        const column = vscode.workspace.getConfiguration('devdocs').get<number>('column');
        return column < 1 || column > 3
            ? vscode.ViewColumn.Two
            : <vscode.ViewColumn>column
    }

    const openHtml = (uri: vscode.Uri, title) => {
        return vscode.commands.executeCommand('vscode.previewHtml', uri, getColumn(), title)
            .then((success) => {
            }, (reason) => {
                vscode.window.showErrorMessage(reason)
            })
    }

    const openDevDocs = (query?: Query, title = 'DevDocs', editor = vscode.window.activeTextEditor) =>
        openHtml(encodeDevDocsUri(query), title)

    const getKeywordFromEditor = (editor = vscode.window.activeTextEditor): string => {
        let value = ''

        if (!!editor) {
            let sel = editor.selection
            // No selection
            if (sel.isEmpty) {
                // Get word at cursor position
                let range = editor.document.getWordRangeAtPosition(sel.start)
                value = editor.document.getText(range)
            } else if (sel.start.line === sel.end.line) {
                // Get single-line selection
                value = editor.document.getText(new vscode.Range(sel.start, sel.end))
            }
        }

        return value
    }

    const getLanguageFromEditor = (editor = vscode.window.activeTextEditor): string => {
        let value = ''

        if (!!editor) {
            value = editor.document.languageId
        }

        return value
    }

    let homeCommand = vscode.commands.registerCommand('devdocs.home', () => {
        return openDevDocs()
    })

    let searchCommand = vscode.commands.registerTextEditorCommand('devdocs.search', (editor) => {
        let value = getKeywordFromEditor(editor)
        const language = getLanguageFromEditor(editor)
        return vscode.window.showInputBox({
            prompt: 'Keyword',
            value
        })
            .then((keyword) => openDevDocs({ keyword, language }, `DevDocs : Search${value !== '' ? ` - ${value}` : ''}`))
    })

    let quickSearchCommand = vscode.commands.registerTextEditorCommand('devdocs.quickSearch', (editor) => {
        let keyword = getKeywordFromEditor(editor)
        const language = getLanguageFromEditor(editor)

        return typeof keyword === 'string' && keyword !== ''
            ? openDevDocs({ keyword, language }, `DevDocs : Search${keyword !== '' ? ` - ${keyword}` : ''}`)
            : vscode.window.showInformationMessage('No search keywords found for DevDocs at current cursor position')
    })


    let settingCommand = vscode.commands.registerCommand('devdocs.settings', () =>
        openDevDocs({ route: '/settings' }, 'DevDocs: Settings')
    )

    let offlineCommand = vscode.commands.registerCommand('devdocs.offline', () =>
        openDevDocs({ route: '/offline' }, 'DevDocs: Offline Data')
    )

    context.subscriptions.push(homeCommand, searchCommand, settingCommand, offlineCommand, registration)
}

// this method is called when your extension is deactivated
export function deactivate() {
}