import { ModuleLiteral } from '../types/types';


/**
 * Checks the module type based on the provided module literal and node.
 * @param {ModuleLiteral} module - The module literal (e.g., 'ESM', 'CESM', 'CommonJS').
 * @param {any} node - The node to be checked.
 * @returns {boolean} Returns true if the node matches the specified module type, otherwise false.
 */
const checkModuleType = (module: ModuleLiteral, node: any):boolean => {
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
};

export default checkModuleType;
