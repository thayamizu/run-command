import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as fs from 'fs';
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

		private _commandHistory : History;

		/**
		 * constructor
		 */
		constructor() {
			try {
				this._configuration = new Configuration('run-command');

				this._commandHistory  = new History(this._configuration);

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
			
			let outputChannel = this.createOutputChannel(parameter); ;

			cp.exec(parameter,{cwd:path, encoding:this._configuration.encoding, env:null}, (error, stdout, stderr) => {
				if (error) {
					vscode.window.showErrorMessage(error.message);
				}
				if (stdout) {
					let data = iconv.decode(stdout,this._configuration.encoding);
					outputChannel.appendLine(data);
				}
			});

			this._commandHistory.push(parameter);
		}

		public executeShellCommandFromHistory() {
			let commands = this._commandHistory.commandHistory;
			vscode.window.showQuickPick(commands).then((param)=> {
				this.executeShellCommand(param);
			});
		}		
		/**
		 * createOutputChannel
		 */
		private createOutputChannel(param : string) : vscode.OutputChannel {
			let outputName : string = `${param}`;
			let resultDocument : vscode.OutputChannel = vscode.window.createOutputChannel(outputName);
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

	/**
	 * History
	 */
	export class History
	{
		/**
		 * history Size
		 */
		private _historySize : number;
		public get historySize() : number{
			return this._historySize;
		}

		/**
		 * command History
		 */
		private _commandHistory : string[];
		public get commandHistory() : string[] {
			return this._commandHistory;	
		}

		/**
		 * constructor
		 */
		constructor(conf : Configuration) {
				this._historySize = conf.historySize;
				this._commandHistory = new Array<string>();
		}

		/**
		 * push
		 */
		public push(command : string) {
			if (this.commandHistory.length + 1 > this.historySize) {
				this.commandHistory.shift();
			}
			this.commandHistory.push(command);
		}
	}
}