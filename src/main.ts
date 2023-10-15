import { extname } from 'path';
import { isDir, pathJoin, readDir, resolveWithRoot,} from './utilities/common-utilities';

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
    readDir(loopPath).forEach((dir) => {
        const elmsType = pathJoin(loopPath, dir);

        if (!isDir(elmsType)) {
            /**
             * Check if the file extension is .js, .cjs, or .mjs.
             * If true, invoke the transformer function.
             */
            if (extname(dir) === '.js' || extname(dir) === '.cjs' || extname(dir) === '.mjs') {
                // TODO: Call the transformer function here.
            }
        } else {
			// If 'elmsType' is a directory, recursively call 'loopDir' on that directory.
            loopDir(pathJoin(loopPath, dir));
        }
    });
};

// Start the directory loop from the specified entry path.
loopDir(resolveWithRoot(entrySrcPath));
