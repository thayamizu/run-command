import * as vscode from 'vscode';
import * as cp from 'child_process';
var iconv = require('iconv-lite');

export namespace RunCommand
{
	/**
	 * RunCommand
	 */
	export class RunCommand {
		
		/**
		 * command configuration
		 */
		private _configuration : Configuration;

		private OUTPUT_CHANNEL_NAME : string = "Shell Command Result";

		/**
		 * constructor
		 */
		constructor() {
			try {
				this._configuration = new Configuration('run-command');
			} catch (error) {
				vscode.window.showErrorMessage(error.message);
			}
		}

		/**
		 * executeShellCommand
		 * @param parameter : string
		 */
		public executeShellCommand(parameter : string) {
			let path = vscode.workspace.rootPath;
			let resultDocument = this.createOutputChannel();

			cp.exec(parameter,{cwd:path, env:null}, (error, stdout, stderr) => {
				if (error) {
					vscode.window.showErrorMessage(error.message);
				}
				if (stdout) {
					let data = iconv.decode(stdout, this._configuration.encoding);
					resultDocument.appendLine(data);
				}
			});
		}
		
		/**
		 * executeShellCommandFromSelectedText
		 * @param parameter : string
		 */
		public executeShellComandFromSelectedText()  {
			let editor = vscode.window.activeTextEditor;
			if (editor.selection.isEmpty) {
				return;
			}

			const path = vscode.workspace.rootPath;
			const resultDocument = this.createOutputChannel();
			const text = editor.document.getText(new vscode.Range(
				editor.selection.start, 
				editor.selection.end));
			cp.exec(text, {cwd:path, env:null}, (error, stdout, stderr)=>{
				if (error) {
					vscode.window.showErrorMessage(error.message);            
				}
				if (stdout) {
					const data = iconv.decode(stdout, this._configuration.encoding);
					resultDocument.append(data);
				}
			});
		}
		
		/**
		 * createOutputChannel
		 */
		private createOutputChannel() : vscode.OutputChannel {
			let resultDocument : vscode.OutputChannel = vscode.window.createOutputChannel(this.OUTPUT_CHANNEL_NAME);
			resultDocument.show(true);
			return resultDocument;
		}
	}

	/**
	 * Configuration
	 */
	export class Configuration
	{
		/**
		 * constructor
		 */
		constructor(parameter : string) {
			try {
				let configuration = vscode.workspace.getConfiguration(parameter);
				this.historySize   = configuration.get<number>('history-size');
				this.encoding      = configuration.get<string>('encoding');	
			} catch (error) {
				vscode.window.showErrorMessage(error.message);
			}
		}

		/**
		 * Encoding
		 */
		private _encoding : string="SHIFT_JIS";
		public get encoding() : string {
			return this._encoding;
		}
		public set encoding(v : string) {
			this._encoding = v;
		}

		/**
		 * History Size
		 */
		private _historySize : number;
		public get historySize() : number {
			return this._historySize;
		}
		public set historySize(v : number) {
			this._historySize = v;
		}
	}
}