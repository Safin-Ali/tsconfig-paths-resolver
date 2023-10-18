import { CMDArgFlag, CMDArgShape } from '../types/types';

/**
 * The default argument object.
 * @type {CMDArgShape}
 */
let argObj: CMDArgShape = {
	destination: '',
	srcArg: 'dist'
}

// get argument from cli
const processArg = process.argv;

processArg.forEach((arg, idx) => {
	const cmdArg = arg as CMDArgFlag
	switch (cmdArg) {
		case '-s':
			/**
			 * Set the source argument.
			 * @type {CMDArgShape}
			 */
			argObj = { ...argObj, srcArg: processArg[idx + 1] }
			break;
		case '-ds':
			/**
			 * Set the destination path.
			 * @type {CMDArgShape}
			 */
			argObj = { ...argObj, destination: processArg[idx + 1] }
			break;
	}
})

/**
 * The final argument object.
 * @type {CMDArgShape}
 */
export default argObj;
