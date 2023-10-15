import { parse } from '@babel/parser';
import generate from "@babel/generator";
import checkModuletype from './module-type-detector';

/**
 * Changes module values in the AST based on module type.
 * @param {Object} AST - Abstract Syntax Tree object.
 * @param {string} path - to resolve the current code alias to relative based on this.
 * @returns {Object} Modified AST.
 */

const changeModuleVal = (AST: any,path:string):Object => {

	for (const node of AST.program.body) {

		if (checkModuletype('ESM', node)) {
			node.source.value = 'is esm';
		} else if (checkModuletype('CESM', node)) {
			node.declarations[0].init.arguments[0].arguments[0].value = 'is xx js';
		} else if (checkModuletype('CommonJS', node)) {
			node.declarations[0].init.arguments[0].value = 'is common js';
		}
	}
	return AST
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

	const modifiedAST = changeModuleVal(ast,path);

};

/**
 *
 * @param {string} code - the codes. which will be created AST.
 * @param {string} path - current code path. which will be resolved with aliases
 * @returns {void}
 */
const transform = (code: string,path:string): void => createAST(code,path);

export default transform