var vscode = require('vscode');

class CustomContentProvider {
    constructor() {
        this.onDidChangeEvent = new vscode.EventEmitter();
        this.content = 'This is some custom content. ';
    }
    provideTextDocumentContent(uri) {
        return this.content;
    }
    get onDidChange() {
        return this.onDidChangeEvent.event;
    }
    update(uri, message) {
        if (message) this.content += `${message} `;
        this.onDidChangeEvent.fire(uri);
    }
}

function activate(context) {
    var scheme = 'purejs';
    var customUri = vscode.Uri.parse(`${scheme}://authority/CustomContent`);

    var customContentProvider = new CustomContentProvider();
    var registration = vscode.workspace
        .registerTextDocumentContentProvider(scheme, customContentProvider);

    vscode.workspace.openTextDocument(customUri)
        .then(function(doc) {
            return vscode.window.showTextDocument(doc, vscode.ViewColumn.Two, true);
        });

    var disposable = vscode.commands
        .registerCommand('extension.sayHello', function() {
            customContentProvider.update(customUri, 'a new message! ');
        });

    context.subscriptions.push(disposable, registration);
}
exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;