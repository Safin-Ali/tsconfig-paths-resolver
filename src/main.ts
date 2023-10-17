import { extname } from 'path';
import { isDir, pathJoin, readDir, readFile, resolveWithRoot, thorwError,} from './utilities/common-utilities';
import transform from './utilities/transformer';
import startExecute from './utilities/terminal-loader';
import argObj from './utilities/command-handler';
import logger from './utilities/color-logger';


/**
 * this function wrapped for terminal can show loading animation sync
 * start path resolving
 */

const run = () => startExecute(()=>{

	let status:boolean = false;

/**
 * Recursively loops through a directory and performs an action on each file.
 * @param {string} loopPath - The path of the directory to loop through.
 * @returns {void}
 */
const loopDir = (loopPath: string): void => {

	// store loopPath directory elements
	const allDir = readDir(loopPath);

	// after checking loopPath has not any js file print warning message
	if(!allDir.filter(elm => elm.endsWith('.mjs') || elm.endsWith('.js')  || elm.endsWith('.cjs')).length) return;

	try{

		allDir.forEach((elm) => {
			const currElmPath = pathJoin(loopPath, elm);

			if (!isDir(currElmPath)) {
				/**
				 * Check if the file extension is .js, .cjs, or .mjs.
				 * If true, invoke the transformer function.
				 */
				if (extname(elm) === '.js' || extname(elm) === '.cjs' || extname(elm) === '.mjs') {
					transform(readFile(currElmPath),currElmPath)
				}
			} else {
				// If 'currElmPath' is a directory, recursively call 'loopDir' on that directory.
				loopDir(pathJoin(loopPath, elm));
			}
		});

		status = true
	} catch (err:any) {
		thorwError(err.message);
	}
};

// Start the directory loop from the specified entry path.
loopDir(resolveWithRoot(argObj.srcArg));
// print status
	status ? logger.success(`\nTS alias to relative path convert successfull 😊`) : logger.warn(`\nnot founded any JS file in ${resolveWithRoot(argObj.srcArg)} 🥹 😥`)

});

export default run;