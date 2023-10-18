import generate from '@babel/generator';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { resolve, join, dirname } from 'path';
import argObj from './command-handler';

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
export const readDir = (path: string): string[] | [] => {
	return readdirSync(path);
};

/**
 * Checks if a given path corresponds to a directory.
 * @param {string} path - The path to check.
 * @returns {boolean}
 * @throws {Error} Throws an error if the path does not exist.
 */
export const isDir = (path: string): boolean => {
	const stats = statSync(path)
	return stats.isDirectory()
};

/**
 * Throws an Error with an optional message.
 *
 * @param {string} [message=''] - The error message (optional).
 * @throws {Error} Throws an Error with the provided message.
 */
export const thorwError = (message?: string) => {
	throw new Error(message)
};

/**
 * Joins one or more path components together and resolves them into an absolute path.
 * @param {...string} paths - The path components to join together.
 * @returns {string} The resolved absolute path.
 */
export const pathJoin = (...paths: string[]): string => {
	return join(...paths);
};

/**
 * Writes content to a specified file.
 * @param {string} fileDir - The directory path where the file will be append and write.
 * @param {any} content - The content to be written to the file.
 */
export const writeFileDes = (fileDir:string,content:any) => {

	// destination dir
	const desDir = pathJoin(rootDir,argObj.destination);

	// create destination dir if not exist
	if (argObj.destination && !existsSync(desDir)) mkdirSync(desDir);

	// create each file nested direcotry if not exist
	if(argObj.destination && !existsSync(dirname(fileDir))) mkdirSync(dirname(fileDir));

	// write relative path as JS file
	writeFileSync(fileDir, generate(content).code, {
		flag: 'w+'
	});
};