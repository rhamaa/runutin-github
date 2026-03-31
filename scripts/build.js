#!/usr/bin/env node

import path from 'path';
import fs from 'fs-extra';
import cp from 'child_process';
import { executeCommand, PROJECT_ROOT } from './utils.js';

const main = () => {
	for (const extension of fs.readdirSync('extensions')) {
		const extensionPath = path.join(PROJECT_ROOT, 'extensions', extension);
		const packageJsonPath = path.join(extensionPath, 'package.json');
		if (!fs.existsSync(packageJsonPath)) continue;
		// Only compile extensions that have TypeScript source (tsconfig.json) - skip downloaded theme/icon extensions
		if (!fs.existsSync(path.join(extensionPath, 'tsconfig.json'))) continue;
		executeCommand('npm', ['run', 'compile'], extensionPath);
	}
	executeCommand('npx', ['webpack', '--mode=production'], PROJECT_ROOT);
};

main();
