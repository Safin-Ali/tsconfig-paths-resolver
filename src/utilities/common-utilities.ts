import { readFileSync, readdirSync, statSync } from 'fs';
import {resolve} from 'path';

/**
 * Gets the current working directory of the process.
 * @returns {string} The current working directory.
 */
export const rootDir = process.cwd();

/**
 * Resolves a path relative to the root directory.
 * @param {...string} paths - The path components to resolve.
 * @returns {string} The resolved path.
 */
export const resolveWithRoot = (...paths: string[]): string => resolve(rootDir, ...paths);

/**
 * Reads a file and returns its content as a string.
 * @param {...string} file - The path of the file to read.
 * @returns {string} The content of the file.
 */
export const readFile = (...file: string[]): string => {
    return readFileSync(resolve(rootDir, ...file), 'utf8');
};

/**
 * Reads the contents of a directory and returns an array of file names.
 * @param {string} path - The path of the directory to read.
 * @returns {string[]} An array of file names in the directory.
 */
export const readDir = (path: string): string[] => {
    return readdirSync(path);
};
