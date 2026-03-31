/**
 * @file GitLab1s adapter
 * @author netcon
 */

import * as vscode from 'vscode';
import { GitLab1sRouterParser } from './router-parser';
import { GitLab1sDataSource } from './data-source';
import { SourcegraphDataSource } from '../sourcegraph/data-source';
import { Adapter, CodeReviewType, PlatformName } from '../types';
import { GitLab1sSettingsViewProvider } from './settings';
import { GitLab1sAuthenticationView } from './authentication';
import { setVSCodeContext } from '@/helpers/vscode';
import { getCurrentRepo } from './parse-path';

export class GitLab1sAdapter implements Adapter {
	public scheme: string = 'gitlab1s';
	public platformName = PlatformName.GitLab;
	public codeReviewType = CodeReviewType.MergeRequest;

	resolveDataSource() {
		return Promise.resolve(GitLab1sDataSource.getInstance());
	}

	resolveRouterParser() {
		return Promise.resolve(GitLab1sRouterParser.getInstance());
	}

	activateAsDefault() {
		// Simplified mode: hide all SCM and settings views
		setVSCodeContext('github1s:views:settings:visible', false);
		setVSCodeContext('github1s:views:codeReviewList:visible', false);
		setVSCodeContext('github1s:views:commitList:visible', false);
		setVSCodeContext('github1s:views:fileHistory:visible', false);
		setVSCodeContext('github1s:features:gutterBlame:enabled', false);

		// Note: Settings view provider disabled for simplified UI
		// Authentication command kept for private repos
		vscode.commands.registerCommand('github1s.commands.openGitLab1sAuthPage', () => {
			return GitLab1sAuthenticationView.getInstance().open();
		});
	}

	deactivateAsDefault() {
		setVSCodeContext('github1s:views:settings:visible', false);
		setVSCodeContext('github1s:views:codeReviewList:visible', false);
		setVSCodeContext('github1s:views:commitList:visible', false);
		setVSCodeContext('github1s:views:fileHistory:visible', false);
		setVSCodeContext('github1s:features:gutterBlame:enabled', false);
	}
}
