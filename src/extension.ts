'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {RunCommand} from './runcommand'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "run-command" is now active!');

    let command = new RunCommand.RunCommand();
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let executeShellCommand = vscode.commands.registerCommand('extension.run-command', () => {
        // The code you place here will be executed every time your command is executed
        vscode.window.showInputBox({placeHolder:"Please input shell command.", prompt:""} ).then((param)=>{
            command.executeShellCommand(param);
        });
    });
    let executeShellCommandFromHistory = vscode.commands.registerCommand('extension.run-history', () => {
        command.executeShellCommandFromHistory();
    });
    context.subscriptions.push(executeShellCommand);
    context.subscriptions.push(executeShellCommandFromHistory);
}

// this method is called when your extension is deactivated
export function deactivate() {
}