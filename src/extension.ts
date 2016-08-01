'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as cp  from 'child_process';
var iconv = require('iconv-lite');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "run-command" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.run-command', () => {
        // The code you place here will be executed every time your command is executed
        vscode.window.showInputBox({placeHolder:"Please input shell command.", prompt:""} ).then(executeShellCommand);
    });

    context.subscriptions.push(disposable);
}


function executeShellCommand(parameter : string) {
    let path = vscode.workspace.rootPath;

    let resultDocument = vscode.window.createOutputChannel("Shell Command Result");
    resultDocument.show(true);

    var p = cp.spawn("cmd.exe", ["/c", parameter], {cwd:path, env:null});
    var content : string = "";
    p.stdout.on('data', function (data) {
        let line = iconv.decode(data, "Shift_JIS");
        content += line;
    });
    p.stdout.on('close', function (){
        resultDocument.appendLine(content);
    });
}

// this method is called when your extension is deactivated
export function deactivate() {
}