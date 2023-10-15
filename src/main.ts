import { extname } from 'path';
import { isDir, pathJoin, readDir, readFile, resolveWithRoot,} from './utilities/common-utilities';
import transform from './utilities/transformer';

/**
 * The entry path from cmd which to start the directory loop.
 */
const entrySrcPath = 'sample';

/**
 * Recursively loops through a directory and performs an action on each file.
 * @param {string} loopPath - The path of the directory to loop through.
 * @returns {void}
 */
const loopDir = (loopPath: string): void => {
    readDir(loopPath).forEach((elm) => {
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
};

// Start the directory loop from the specified entry path.
loopDir(resolveWithRoot(entrySrcPath));