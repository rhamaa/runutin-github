/**
 * @file Download repository as ZIP
 * @author github1s
 */

import * as vscode from 'vscode';

const getZipDownloadUrl = async (): Promise<{ url: string; filename: string }> => {
	const browserUrl: string = await vscode.commands.executeCommand('github1s.commands.vscode.getBrowserUrl');
	const url = new URL(browserUrl);
	const hostname = url.hostname;
	const pathParts = url.pathname.split('/').filter(Boolean);

	const owner = pathParts[0] || '';
	const repo = pathParts[1] || '';
	// pathParts[2] is 'tree', pathParts[3] is branch/tag/commit
	const ref = pathParts[3] || 'HEAD';

	if (!owner || !repo) {
		throw new Error('Could not determine repository from current URL');
	}

	if (hostname.includes('gitlab1s')) {
		return {
			url: `https://gitlab.com/${owner}/${repo}/-/archive/${ref}/${repo}-${ref}.zip`,
			filename: `${repo}-${ref}.zip`,
		};
	}

	if (hostname.includes('bitbucket1s')) {
		return {
			url: `https://bitbucket.org/${owner}/${repo}/get/${ref}.zip`,
			filename: `${repo}-${ref}.zip`,
		};
	}

	// Default: GitHub
	const archiveRef = ref === 'HEAD' ? 'HEAD' : `refs/heads/${ref}`;
	return {
		url: `https://github.com/${owner}/${repo}/archive/${archiveRef}.zip`,
		filename: `${repo}-${ref}.zip`,
	};
};

export const commandDownloadZip = async () => {
	try {
		const { url } = await getZipDownloadUrl();
		await vscode.commands.executeCommand('github1s.commands.vscode.openUrl', url);
	} catch (err: any) {
		vscode.window.showErrorMessage(`Download failed: ${err.message}`);
	}
};

export const registerDownloadCommands = (context: vscode.ExtensionContext) => {
	return context.subscriptions.push(
		vscode.commands.registerCommand('github1s.commands.downloadZip', commandDownloadZip),
	);
};
