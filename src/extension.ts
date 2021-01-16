import * as vscode from 'vscode';
let isEnableQuickOpenExtension = true;

export function activate(context: vscode.ExtensionContext) {

	updateConfiguration();

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'quickopen-with-selection.run', openQuickOpenPanel));
	context.subscriptions.push(
		vscode.commands.registerCommand(
			'quickopen-with-selection.toggleEnable', toggleOpenQuickOpenPanel));

	vscode.workspace.onDidChangeConfiguration(() => {
		updateConfiguration();
	});
}

export function deactivate() { }

function updateConfiguration() {
	isEnableQuickOpenExtension = vscode.workspace.getConfiguration('quickopenWithSelection').get('prefillWithSelection') ?? true;
}

function openQuickOpenPanel() {
	let selectedText = "";

	const editor = vscode.window.activeTextEditor;

	if (editor && isEnableQuickOpenExtension) {
		selectedText = editor.selections
			.map(s => editor.document.getText(s))
			.join('');
	}

	vscode.commands.executeCommand(
		'workbench.action.quickOpen', selectedText);
}

function toggleOpenQuickOpenPanel() {
	isEnableQuickOpenExtension = !isEnableQuickOpenExtension;

	// Update configuration
	vscode.workspace
		.getConfiguration('quickopenWithSelection')
		.update('prefillWithSelection', isEnableQuickOpenExtension);

	// Notify to user
	const current = isEnableQuickOpenExtension ? "Enable" : "Disable";
	vscode.window.showInformationMessage(
		`Extension "QuickOpen with selected text" is now ${current}`
	);
}