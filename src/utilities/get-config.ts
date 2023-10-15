import jsonParse from 'json-to-js-obj';
import { readFile, resolveWithRoot } from './common-utilities';
import logger from './color-logger';

/**
 * Reads and parses the contents of the 'tsconfig.json' file in the root directory.
 * @throws {Error} Throws an error if 'tsconfig.json' is not found or cannot be parsed.
 * @returns {Record<string, any>} The parsed contents of 'tsconfig.json'.
 */
const TSconfigFile = (function () {
    try {
        return readFile(resolveWithRoot('tsconfig.json'));
    } catch (err:any) {
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
        return jsonParse(TSconfigFile);
    } catch (err:any) {
        logger.error(`for debug check points of below \n 1. unnecessary "comma ," in tsconfig.json \n 2. not found paths property in tsconfig.json`);
    }
})();

export default parseTSConfig;
