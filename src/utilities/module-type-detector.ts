import { ModuleLiteral } from '../types/types';
import logger from './color-logger';
import { thorwError } from './common-utilities';


/**
 * Checks the module type based on the provided module literal and node.
 * @param {ModuleLiteral} module - The module literal (e.g., 'ESM', 'CESM', 'CommonJS').
 * @param {Object|any} node - The node to be checked.
 * @returns {boolean | Error} Returns true if the node matches the specified module type, otherwise false.
 */
const checkModuleType = (module: ModuleLiteral, node: any):boolean | any => {
	try{
		if (module === 'ESM') {
			return node.type === 'ImportDeclaration';
		} else if (module === 'CESM' || module === 'CommonJS') {
			const isVariableDeclaration =
				node.type === 'VariableDeclaration' &&
				node.declarations[0]?.init?.type === 'CallExpression';

			if (module === 'CESM') {
				return isVariableDeclaration && node.declarations[0].init.callee.name === '__importDefault';
			} else if (module === 'CommonJS') {
				return isVariableDeclaration && node.declarations[0].init.callee.name === 'require';
			}
		}

		return false; // Handle other cases or invalid module types
	} catch (err:any) {
		logger.error((err.message))
		thorwError(`Module Type Detecting Failed`);
	}
};

export default checkModuleType;
