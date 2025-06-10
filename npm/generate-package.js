/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

'use strict'

async function executeAsync() {
  const fs = require('fs');
  const semver = require('semver');
  let incrementType = 'patch';

  // build a new clear package.json for NPM + Insomnia
  const dataJson = fs.readFileSync('package.json').toString();
  const dataObj = JSON.parse(dataJson);

  const args = process.argv.filter(str => str.includes('--'));
  if(args.length > 0) {
    incrementType = args[0].replace('--', '');
  }

  // versions auto builder
  const buildVersionAsync = async (incrementType) => {
    const currentVersion = dataObj.version;
    console.info(`Current version: ${currentVersion}`);

    const incrementedVersion = semver.inc(currentVersion, incrementType);
    console.info(`New version generated: ${incrementedVersion}`);
    dataObj.version = incrementedVersion;
    return incrementedVersion;
  }

  const version = await buildVersionAsync(incrementType);
  const resultObj = {
    name: dataObj.name,
    version: version,
    main: 'index.js',
    author: dataObj.author,
    license: dataObj.license,
    repository: dataObj.repository,
    bugs: dataObj.bugs,
    insomnia: dataObj.insomnia,
    dependencies: dataObj.dependencies,
  };

  const resultJson = JSON.stringify(resultObj, null, 2);
  if (!fs.existsSync('dist')) fs.mkdirSync('dist');
  fs.writeFileSync('dist/package.json', resultJson);
  fs.writeFileSync('package.json', JSON.stringify(dataObj, null, 2));
  console.info(`Updated package.json with ${incrementType}`);
}

executeAsync();
