#!/usr/bin/env node

import path from 'path';
import fs from 'fs-extra';
import { executeCommand, PROJECT_ROOT } from './utils.js';

const main = () => {
	const extensions = fs.readdirSync(path.join(PROJECT_ROOT, 'extensions'));
	// Use the same package manager as parent (npm/pnpm)
	const npmCmd = process.env.npm_execpath?.includes('pnpm') ? 'pnpm' : process.platform === 'win32' ? 'npm.cmd' : 'npm';
	for (const extension of extensions) {
		const extensionPath = path.join(PROJECT_ROOT, 'extensions', extension);
		const packageJsonPath = path.join(extensionPath, 'package.json');
		if (!fs.existsSync(packageJsonPath)) continue;
		// Only run npm install for extensions that have compile/build scripts (skip downloaded theme extensions)
		const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
		const scripts = packageJson.scripts || {};
		if (!scripts.compile && !scripts.build && !scripts.watch) continue;
		executeCommand(npmCmd, ['install'], extensionPath);
	}
};

main();
