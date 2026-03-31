/**
 * @file config for different platform
 * @author netcon
 */

import downloadIconUrl from './assets/download.svg';

const createFolderWorkspace = (scheme: string) => ({
	folderUri: { scheme, authority: '', path: '/', query: '', fragment: '' },
});

const createWindowIndicator = (label: string) => ({
	tooltip: label || '',
	label: label || '$(remote)',
	command: 'github1s.commands.openRepository',
});

const createConfigurationDefaults = (disableSomeAnyCodeFeatures: boolean) => {
	const configurationDefaults = {
		'workbench.colorTheme': 'Atomize',
		'workbench.iconTheme': 'material-icon-theme',
		'telemetry.telemetryLevel': 'off',
		'window.menuBarVisibility': 'hidden',
		'window.commandCenter': false,
		'workbench.startupEditor': 'readme',
		'workbench.editorAssociations': { '*.md': 'vscode.markdown.preview.editor' },
		'markdown.preview.doubleClickToSwitchToEditor': false,
		// Hide SCM (Source Control) view
		'scm.showActionButton': false,
		'scm.alwaysShowRepositories': false,
		// Disable Settings UI access
		'workbench.settings.enableNaturalLanguageSearch': false,
		// Hide status bar items
		'workbench.statusBar.visible': false,
		// Disable extension recommendations
		'extensions.ignoreRecommendations': true,
		'extensions.showRecommendationsOnlyOnDemand': true,
		// Disable debug features
		'debug.enableStatusBarColor': false,
		// Make it read-only
		'files.readOnlyFromPermissions': true,
		'workbench.editor.enablePreview': true,
	} as Record<string, any>;

	// disable some anycode features when we can use sourcegraph instead
	if (disableSomeAnyCodeFeatures) {
		configurationDefaults['anycode.language.features'] = {
			completions: false,
			definitions: false,
			references: false,
			highlights: true,
			outline: true,
			workspaceSymbols: true,
			folding: false,
			diagnostics: false,
		};
	}
	return configurationDefaults;
};

export enum Platform {
	GitHub = 'GitHub',
	GitLab = 'GitLab',
	Bitbucket = 'Bitbucket',
	npm = 'npm',
}

const buildDownloadZipUrl = (platform: Platform, repository: string): string => {
	if (!repository) return '';
	const pathParts = window.location.pathname.split('/').filter(Boolean);
	const ref = pathParts[2] === 'tree' && pathParts[3] ? pathParts[3] : 'HEAD';
	const repo = repository.split('/')[1] || repository;
	if (platform === Platform.GitLab) {
		return `https://gitlab.com/${repository}/-/archive/${ref}/${repo}-${ref}.zip`;
	}
	if (platform === Platform.Bitbucket) {
		return `https://bitbucket.org/${repository}/get/${ref}.zip`;
	}
	return `https://github.com/${repository}/archive/${ref === 'HEAD' ? 'HEAD' : `refs/heads/${ref}`}.zip`;
};

export const createVSCodeWebConfig = (platform: Platform, repository: string): any => {
	if (platform === Platform.GitLab) {
		return {
			hideTextFileLabelDecorations: !!repository,
			workspace: repository ? createFolderWorkspace('gitlab1s') : undefined,
			workspaceId: repository ? 'gitlab1s:' + repository : '',
			workspaceLabel: repository,
			logo: {
				title: 'Download Repository as ZIP',
				icon: downloadIconUrl,
				onClick: () => repository && window.open(buildDownloadZipUrl(platform, repository), '_blank'),
			},
		};
	}

	if (platform === Platform.Bitbucket) {
		return {
			hideTextFileLabelDecorations: !!repository,
			workspace: repository ? createFolderWorkspace('bitbucket1s') : undefined,
			workspaceId: repository ? 'bitbucket1s:' + repository : '',
			workspaceLabel: repository,
			logo: {
				title: 'Download Repository as ZIP',
				icon: downloadIconUrl,
				onClick: () => repository && window.open(buildDownloadZipUrl(platform, repository), '_blank'),
			},
		};
	}

	if (platform === Platform.npm) {
		return {
			hideTextFileLabelDecorations: !!repository,
			workspace: repository ? createFolderWorkspace('npmjs1s') : undefined,
			workspaceId: repository ? 'npmjs1s:' + repository : '',
			workspaceLabel: repository,
			logo: {
				title: 'Download Package as ZIP',
				icon: downloadIconUrl,
				onClick: () =>
					repository &&
					window.open(`https://registry.npmjs.org/${repository}/-/${repository.split('/').pop()}-latest.tgz`, '_blank'),
			},
		};
	}

	const isOnlineEditor = repository === 'editor';
	return {
		hideTextFileLabelDecorations: !isOnlineEditor,
		workspace: !isOnlineEditor ? createFolderWorkspace(repository ? 'github1s' : 'ossinsight') : undefined,
		workspaceId: !isOnlineEditor ? 'github1s:' + (repository || 'trending') : '',
		workspaceLabel: repository || (isOnlineEditor ? '' : 'GitHub Trending'),
		logo: {
			title: 'Download Repository as ZIP',
			icon: downloadIconUrl,
			onClick: () => repository && !isOnlineEditor && window.open(buildDownloadZipUrl(platform, repository), '_blank'),
		},
	};
};

export const createWorkbenchOptions = (platform: Platform, repository: string): any => {
	if (platform === Platform.GitLab) {
		return {
			windowIndicator: createWindowIndicator(repository),
			configurationDefaults: createConfigurationDefaults(!!repository),
		};
	}

	// bitbucket is not available now
	if (platform === Platform.Bitbucket) {
		return {
			windowIndicator: createWindowIndicator(repository),
			configurationDefaults: createConfigurationDefaults(!!repository),
		};
	}

	if (platform === Platform.npm) {
		return {
			windowIndicator: createWindowIndicator(repository),
			configurationDefaults: createConfigurationDefaults(false),
		};
	}

	return {
		windowIndicator: createWindowIndicator(repository),
		configurationDefaults: createConfigurationDefaults(!!repository),
	};
};
