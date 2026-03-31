/**
 * @file Bitbucket adapter
 * @author netcon
 */

import { BitbucketRouterParser } from './router-parser';
import { SourcegraphDataSource } from '../sourcegraph/data-source';
import { Adapter, CodeReviewType, PlatformName } from '../types';
import { setVSCodeContext } from '@/helpers/vscode';

export class BitbucketAdapter implements Adapter {
	public scheme: string = 'bitbucket1s';
	public platformName = PlatformName.Bitbucket;
	public codeReviewType = CodeReviewType.PullRequest;

	resolveDataSource() {
		return Promise.resolve(SourcegraphDataSource.getInstance('bitbucket'));
	}

	resolveRouterParser() {
		return Promise.resolve(BitbucketRouterParser.getInstance());
	}

	activateAsDefault() {
		// Simplified mode: hide all SCM views
		setVSCodeContext('github1s:views:commitList:visible', false);
		setVSCodeContext('github1s:views:fileHistory:visible', false);
		setVSCodeContext('github1s:features:gutterBlame:enabled', false);
	}

	deactivateAsDefault() {
		setVSCodeContext('github1s:views:commitList:visible', false);
		setVSCodeContext('github1s:views:fileHistory:visible', false);
		setVSCodeContext('github1s:features:gutterBlame:enabled', false);
	}
}
