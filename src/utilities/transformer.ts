import { parse } from '@babel/parser';
import checkModuletype from './module-type-detector';
import { getRelativePath } from './path-converter';
import { thorwError, writeFileDes } from './common-utilities';
import logger from './color-logger';
import argObj from './command-handler';


/**
 * Changes module values in the AST based on module type.
 * @param {Object} AST - Abstract Syntax Tree object.
 * @param {string} jsFilePath - to resolve the current code alias to relative based on this.
 * @returns {any | Error} Modified AST.
 */

const changeModuleVal = (AST: any,jsFilePath:string): any => {
	try {
		for (const node of AST.program.body) {

			if (checkModuletype('ESM', node)) {
				const pathValue = node.source.value;

				node.source.value = getRelativePath(jsFilePath,pathValue);
			} else if (checkModuletype('CESM', node)) {
				const pathValue = node.declarations[0].init.arguments[0].arguments[0].value;
				node.declarations[0].init.arguments[0].arguments[0].value = getRelativePath(jsFilePath,pathValue);
			} else if (checkModuletype('CommonJS', node)) {
				const pathValue = node.declarations[0].init.arguments[0].value;
				node.declarations[0].init.arguments[0].value = getRelativePath(jsFilePath,pathValue);
			}
		}
		return AST
	} catch (err:any) {
		logger.error((err.message))
		thorwError()
	}
};

/**
 * Creates an Abstract Syntax Tree (AST) from the provided code.
 * @param {string} code - JavaScript code as a string.
 * @param {string} path - Path to the JavaScript file.
 */
const createAST = (code: string,path:string) => {
	const ast = parse(code, {
		sourceType: 'unambiguous',
	});

	// modified path value of JS ATS
	const modifiedAST = changeModuleVal(ast,path);

	// destination file path for which file will be write
	const destinationPath = argObj.destination ? path.replace(argObj.srcArg,argObj.destination) : path;

	// again write file with modifed js code
	writeFileDes(destinationPath,modifiedAST);
};

/**
 *
 * @param {string} code - the codes. which will be created AST.
 * @param {string} path - current code path. which will be resolved with aliases
 * @returns {void}
 */
const transform = (code: string,path:string): void => createAST(code,path);

export default transform