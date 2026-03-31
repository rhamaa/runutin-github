/**
 * @file github1s commands
 * @author netcon
 */

import { getExtensionContext } from '@/helpers/context';
// import { registerRefCommands } from './ref'; // Disabled: branch switching not allowed in simplified mode
import { registerCodeReviewCommands } from './code-review';
import { registerCommitCommands } from './commit';
import { registerEditorCommands } from './editor';
import { registerBlameCommands } from './blame';
import { registerGlobalCommands } from './global';
import { registerDownloadCommands } from './download';

export const registerGitHub1sCommands = () => {
	const context = getExtensionContext();

	// registerRefCommands(context); // Disabled: branch switching not allowed
	registerEditorCommands(context);
	// registerCodeReviewCommands(context); // Disabled: code review not shown
	// registerCommitCommands(context); // Disabled: commit history not shown
	// registerBlameCommands(context); // Disabled: blame not shown
	registerGlobalCommands(context);
	registerDownloadCommands(context);
};
