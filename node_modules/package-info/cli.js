#!/usr/bin/env node
'use strict';
var pkg = require('./package.json');
var info = require('./');
var argv = process.argv.slice(2);
var input = argv[0];

function help() {
	console.log(pkg.description);
	console.log('');
	console.log('Usage');
	console.log('  $ package-info <package-name>');
	console.log('');
	console.log('Example');
	console.log('  $ package-info pageres');
}

if (!input || argv.indexOf('--help') !== -1) {
	help();
	return;
}

if (process.argv.indexOf('-v') !== -1 || process.argv.indexOf('--version') !== -1) {
	console.log(pkg.version);
	return;
}

info(input, function (err, version) {
	if (err) {
		console.error(err);
		process.exit(1);
		return;
	}

	console.log(version);
});
