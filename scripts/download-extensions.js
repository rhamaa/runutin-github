/**
 * @file Download VS Code extensions from Open VSX registry
 * Downloads Atomize theme and Material Icon Theme as builtin extensions
 */

import path from 'path';
import https from 'https';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');

const EXTENSIONS_TO_DOWNLOAD = [
	{ publisher: 'PKief', name: 'material-icon-theme', dir: 'material-icon-theme' },
	{ publisher: 'emroussel', name: 'atomize-atom-one-dark-theme', dir: 'atomize-atom-one-dark-theme' },
];

const httpsGet = (url, options = {}) =>
	new Promise((resolve, reject) => {
		https
			.get(url, options, (res) => {
				if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
					return httpsGet(res.headers.location, options).then(resolve).catch(reject);
				}
				resolve(res);
			})
			.on('error', reject);
	});

const fetchJson = async (url) => {
	const res = await httpsGet(url, { headers: { Accept: 'application/json' } });
	return new Promise((resolve, reject) => {
		let data = '';
		res.on('data', (chunk) => (data += chunk));
		res.on('end', () => {
			try {
				resolve(JSON.parse(data));
			} catch (e) {
				reject(e);
			}
		});
	});
};

const downloadFile = (url, dest) =>
	new Promise((resolve, reject) => {
		const handleResponse = (res) => {
			if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
				https.get(res.headers.location, handleResponse).on('error', reject);
				return;
			}
			const file = fs.createWriteStream(dest);
			res.pipe(file);
			file.on('finish', () => file.close(resolve));
			file.on('error', reject);
		};
		https.get(url, handleResponse).on('error', reject);
	});

const downloadExtension = async ({ publisher, name, dir }) => {
	const extensionPath = path.join(PROJECT_ROOT, 'extensions', dir);

	if (fs.existsSync(path.join(extensionPath, 'package.json'))) {
		console.log(`  [skip] ${publisher}.${name} already exists.`);
		return;
	}

	console.log(`  [download] ${publisher}.${name}...`);

	try {
		const info = await fetchJson(`https://open-vsx.org/api/${publisher}/${name}`);
		const downloadUrl = info?.files?.download;

		if (!downloadUrl) {
			throw new Error(`No download URL found in Open VSX response for ${publisher}.${name}`);
		}

		const vsixPath = path.join(PROJECT_ROOT, 'extensions', `_${name}-download.vsix`);
		await downloadFile(downloadUrl, vsixPath);

		const { default: AdmZip } = await import('adm-zip');
		const zip = new AdmZip(vsixPath);
		const tempDir = path.join(PROJECT_ROOT, 'extensions', `_${name}-temp`);

		zip.extractAllTo(tempDir, true);

		const innerExtDir = path.join(tempDir, 'extension');
		if (fs.existsSync(innerExtDir)) {
			fs.copySync(innerExtDir, extensionPath, { overwrite: true });
			fs.removeSync(innerExtDir);
		} else {
			throw new Error(`Unexpected VSIX structure: no 'extension/' folder found in ${name}.vsix`);
		}

		fs.removeSync(tempDir);
		fs.removeSync(vsixPath);

		console.log(`  [done] ${publisher}.${name}`);
	} catch (err) {
		console.error(`  [error] Failed to download ${publisher}.${name}: ${err.message}`);
	}
};

const main = async () => {
	console.log('Downloading VS Code marketplace extensions...');
	for (const ext of EXTENSIONS_TO_DOWNLOAD) {
		await downloadExtension(ext);
	}
	console.log('Extension download complete.');
};

main();
