import jsonParse from 'json-to-js-obj';
import { pathJoin, readFile, resolveWithRoot, rootDir, thorwError } from './common-utilities';
import logger from './color-logger';
import { relative, sep, basename, } from 'path';

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
	try{
		return Object.keys(parseTSConfig.paths)
	} catch {
		logger.error(`you have not paths alias in tsconfig.json`)
		thorwError();
	}
})();

/**
 * - this function checking the alias or path value is TS config alias or not
 * @param {string} alsProp - The alias property.
 * @param {string} jsAlias - The alias value which are imported js file
 * @returns {any | Error} - An object with executeBool and TSPathAls properties.
 */
const isTSPathAlias = (alsProp: string, jsAlias: string): any => {
	try{
		let result = {
			executeBool: false,
			TSPathAls: ''
		}
		// by default store als prop without cut extension
		let rmvExt = alsProp;

		// if prop end with root extension then remove store again
		if (alsProp.endsWith(`*`)) {
			rmvExt = alsProp.replace('/*', '');
		}

		// checking the rmvExt includes inside the alias
		if (jsAlias.includes(rmvExt)) {
			result = {
				executeBool: true,
				TSPathAls: alsProp
			}
		}
		return result
	} catch (err:any) {
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
const generateRelativePath = (tsPathAlsArr:string[],path:string,jsAlias:string): string | any => {
	try{
		let relPath = '';

		// again store removed extension from TSPathAlsVal
		tsPathAlsArr = tsPathAlsArr.map(val => {
			let regex = /\/\*\.ts$|\/\*\.js$|\/\*$/g;

			if (regex.test(val)) {
				val = val.replace(regex, '')
			}

			return pathJoin(rootDir, 'sample', val)
		})

		// again loop the modified TSPathAlsVal and generate
		tsPathAlsArr.forEach((val) => {
			relPath = relative(path, pathJoin(val, basename(jsAlias)));
			relPath = relPath.replaceAll(sep,'/');
		})

		const relPathLeng  = relPath.split(`../`).slice(0,-1).length;

		if(relPathLeng !== 1) {
			/* if relPathLeng is more than 1 then
			it i will consider is path level up
			and alawasy remove first ../
			for perfectly match relative path
			*/
			relPath = relPath.replace('../','');
		} else {
			/* otherwise consider is path is not level up
			and replace ../ to ./
			*/
			relPath = relPath.replace('../','./');
		}

		return relPath;
	} catch (err:any) {
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
	try{
			// store path aliases obj
	const pathAliases = parseTSConfig.paths;

	// execution bool for looping
	let executeBool: boolean = false;

	// store removed extension alieses prop
	let TSPathAls: string = '';

	// looping path aliases all prop name array
	aliasesArr!.forEach(alsProp => {
		// check is it TS config alias
		let result = isTSPathAlias(alsProp, jsAlias);
		TSPathAls = result.TSPathAls;
		executeBool = result.executeBool
	})

	// executeBool false to return
	if (!executeBool) return jsAlias;

	// store the detected TS config alias prop value
	let TSPathAlsVal: string[] = pathAliases[TSPathAls];

	// generate relative path
	return generateRelativePath(TSPathAlsVal,path,jsAlias);
	} catch (err:any) {
		thorwError(err.message || `error occur while trying to get relative`)
	}
}


export default parseTSConfig;