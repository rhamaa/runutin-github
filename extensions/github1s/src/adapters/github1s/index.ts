/**
 * @file GitHub1s adapter
 * @author netcon
 */

import * as vscode from 'vscode';
import { setVSCodeContext } from '@/helpers/vscode';
import { GitHub1sDataSource } from './data-source';
import { GitHub1sRouterParser } from './router-parser';
import { GitHub1sSettingsViewProvider } from './settings';
import { GitHub1sAuthenticationView } from './authentication';
import { Adapter, CodeReviewType, PlatformName } from '../types';
import { SourcegraphDataSource } from '../sourcegraph/data-source';
import { getCurrentRepo } from './parse-path';

export class GitHub1sAdapter implements Adapter {
	public scheme: string = 'github1s';
	public platformName = PlatformName.GitHub;
	public codeReviewType = CodeReviewType.PullRequest;

	resolveDataSource() {
		return Promise.resolve(GitHub1sDataSource.getInstance());
	}

	resolveRouterParser() {
		return Promise.resolve(GitHub1sRouterParser.getInstance());
	}

	activateAsDefault() {
		// Simplified mode: only file explorer, hide settings and SCM views
		// All view contexts set to false for minimal UI
		setVSCodeContext('github1s:views:settings:visible', false);
		setVSCodeContext('github1s:views:codeReviewList:visible', false);
		setVSCodeContext('github1s:views:commitList:visible', false);
		setVSCodeContext('github1s:views:fileHistory:visible', false);
		setVSCodeContext('github1s:features:gutterBlame:enabled', false);

		// Note: Settings view provider disabled for simplified UI
		// Authentication command kept for private repos
		vscode.commands.registerCommand('github1s.commands.openGitHub1sAuthPage', () => {
			return GitHub1sAuthenticationView.getInstance().open();
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
