import jsonParse from 'json-to-js-obj';
import { pathJoin, readFile, resolveWithRoot, rootDir, thorwError } from './common-utilities';
import logger from './color-logger';
import { relative, sep, basename, } from 'path';
import argObj from './command-handler';
import { PathExistStatusShape } from 'types/types';

/**
 * Reads and parses the contents of the 'tsconfig.json' file in the root directory.
 * @throws {Error} Throws an error if 'tsconfig.json' is not found or cannot be parsed.
 * @returns {Record<string, any>} The parsed contents of 'tsconfig.json'.
 */
const TSconfigFile = (function () {
	try {
		return readFile(resolveWithRoot('tsconfig.json'));
	} catch (err: any) {
		logger.error(`tsconfig.json missing in your root directory`);
		throw new Error();
	}
})();

/**
 * Parses the contents of the 'tsconfig.json' file.
 * @throws {Error} Throws an error if there are issues with parsing, such as unnecessary commas or missing 'paths' property.
 * @returns {Record<string, any>} The parsed contents of 'tsconfig.json'.
 */
const parseTSConfig = (function () {
	try {
		return jsonParse(TSconfigFile).compilerOptions;
	} catch (err: any) {
		logger.error(`for debug check points of below \n 1. unnecessary "comma ," in tsconfig.json \n 2. not found paths property in tsconfig.json`);
		thorwError()
	}
})();

// store path aliases all prop name as array
const aliasesArr = (() => {
	try {
		return Object.keys(parseTSConfig.paths)
	} catch {
		logger.error(`you have not paths alias in tsconfig.json`)
		thorwError();
	}
})();

// store baseUrl from tsconfig.json
const TSbaseUrl = parseTSConfig.baseUrl;

if (!TSbaseUrl) thorwError('please add => baseUrl <= property in tsconfig.json file')

/**
 * - this function checking the alias or path value is TS config alias or not
 * @param {string} alsProp - The alias property.
 * @param {string} jsAlias - The alias value which are imported js file
 * @param {PathExistStatusShape} pathExistStatus - for confirm current alias property already checked or not
 * @returns {any | Error} - An object with executeBool and TSPathAls properties.
 */
const isTSPathAlias = (alsProp: string, jsAlias: string, pathExistStatus: PathExistStatusShape): any => {
	try {
		// by default store als prop without cut extension
		let rmvExt = alsProp;

		// if prop end with root extension then remove store again
		if (alsProp.endsWith(`*`)) {
			rmvExt = alsProp.replace('/*', '');
		}

		// checking the rmvExt includes inside the alias
		if (jsAlias.includes(rmvExt)) {
			pathExistStatus = {
				executeBool: true,
				TSPathAls: alsProp
			}
		}
		return pathExistStatus
	} catch (err: any) {
		thorwError(`TS Config Path Alias Checking Error`);
	}
};

/**
 * Generates the relative path.
 * @param {string[]} tsPathAlsArr - Array of TypeScript path aliases.
 * @param {string} path - The file path which are imported the ts-alias.
 * @param {string} jsAlias - The alias value path params ^ js files
 * @returns {string | Error} - The relative path.
 */
const generateRelativePath = (tsPathAlsArr: string[], path: string, jsAlias: string): string | any => {
	try {
		let relPath = '';

		// store removed extension from TSPathAlsVal
		tsPathAlsArr = tsPathAlsArr.map(val => {
			let regex = /\/\*([.][a-zA-Z]+)?$/g;

			if (regex.test(val)) {
				val = val.replace(regex, '')
			}

			// resolving baseUrl based on CMD SrcArg
			if (TSbaseUrl === './' || TSbaseUrl === '.') {
				const firstPath = val.split('/');
				val = firstPath.slice(1).join('/');
			}

			return pathJoin(rootDir, argObj.srcArg, val)
		})

		// again loop the modified TSPathAlsVal and generate
		tsPathAlsArr.forEach((val) => {

			// checking wheather is fixed alias or not
			if (!jsAlias.includes('/')) {
				val = val.replace(/\.ts$/, ".js")
				relPath = relative(path, pathJoin(val));
			} else {
				relPath = relative(path, pathJoin(val, basename(jsAlias)));
			}
			relPath = relPath.replaceAll(sep, '/');
		})

		const relPathLeng = relPath.split(`../`).slice(0, -1).length;

		if (relPathLeng !== 1) {
			/* if relPathLeng is more than 1 then
			it i will consider is path level up
			and alawasy remove first ../
			for perfectly match relative path
			*/
			relPath = relPath.replace('../', '');
		} else {
			/* otherwise consider is path is not level up
			and replace ../ to ./
			*/
			relPath = relPath.replace('../', './');
		}

		return relPath;
	} catch (err: any) {
		thorwError(`error occur while creating absolute to relative path`)
	}
};


/**
 * Gets the relative path.
 * @param {string} path - The file path which are imported the ts-alias.
 * @param {string} jsAlias - The alias value path params ^ js files
 * @returns {string | Error} - The relative path.
 */

export const getRelativePath = (path: string, jsAlias: string): string | any => {
	try {
		// store path aliases obj
		const pathAliases = parseTSConfig.paths;

		// execution bool for looping && removed extension alieses prop
		let pathExistStatus = {
			executeBool: false,
			TSPathAls: ''
		}

		// looping path aliases all prop name array
		aliasesArr!.forEach(alsProp => {
			// check is it TS config alias
			pathExistStatus = isTSPathAlias(alsProp, jsAlias, pathExistStatus);
		})

		// executeBool false to return
		if (!pathExistStatus.executeBool) return jsAlias;

		// store the detected TS config alias prop value
		let TSPathAlsVal: string[] = pathAliases[pathExistStatus.TSPathAls];

		// generate relative path
		return generateRelativePath(TSPathAlsVal, path, jsAlias);
	} catch (err: any) {
		thorwError(err.message || `error occur while trying to get relative path`)
	}
}


export default parseTSConfig;