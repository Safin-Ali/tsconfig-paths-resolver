import { parse } from '@babel/parser';
import generate from "@babel/generator";
import checkModuletype from './module-type-detector';

const changeModuleVal = (AST: any) => {

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

const createAST = (code: string) => {
	const ast = parse(code, {
		sourceType: 'unambiguous',
	});

	const modifiedAST = changeModuleVal(ast);

};

/**
 *
 * @param {string} code - the codes. which will be created AST.
 * @returns {void}
 */
const transform = (code: string): void => createAST(code);

export default transform