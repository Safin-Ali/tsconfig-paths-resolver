/**
 * Module for handling terminal loading animation and execution flow control.
 * @module terminalHandler
 */

import logger from './color-logger';

/**
 * Displays a loading animation in the terminal.
 * @param {string} message - The message to be displayed along with the animation.
 * @returns {Object} An object with a stop function to halt the animation.
 */

const showLoader = (message: string): { stop: () => void } => {
	let i = 0;
	let j = 0;
	logger.process(message);
	const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠤', '⠤', '⠆', '⠆'];
	const colors = ['\x1b[31m', '\x1b[32m', '\x1b[33m', '\x1b[34m']; // ANSI color codes


	const interval = setInterval(() => {
		const coloredCharacter = `${colors[j]}${frames[i]}\x1b[0m`;
		process.stdout.clearLine(0);
		process.stdout.cursorTo(0);
		process.stdout.write(`Processing ${coloredCharacter} `);

		i = (i + 1) % frames.length;
		if (i === 0) {
			j = (j + 1) % colors.length;
		}
	}, 100);

	return {
		stop: () => {
			clearInterval(interval);
			process.stdout.clearLine(0);
			process.stdout.cursorTo(0);
		},
	};
};

// instance of showLoader interval
const loader = showLoader('TS config path alias convert to relative');

/**
 * Stops a previously started loader animation and logs a success message.
 * @param {Object} loader - The loader object returned by showLoader.
 * @param {string} [message] - Optional success message.
 */

const stopLoader = (loader: { stop: () => void }, message?: string): void => {
	loader.stop();
	logger.success(message || '');
};

/**
 * Starts a parent interval that executes a callback function after a short delay.
 * @param {function} exeFunc - The callback function to be executed.
 */
const startExecute = (exeFunc: () => void): void => {
	let load = false;
	const parentIntervalID = setInterval(() => {

		if (!load) {
			load = true;
		} else {
			try {
				clearInterval(parentIntervalID);
				exeFunc();
				logger.success(`TS alias to relative path convert successfull 😊`)
			} catch (err: any) {
				logger.error(err.message)
			} finally {
				setTimeout(() => {
					stopLoader(loader);
					process.exit();
				}, 1000)
			}
		}

	}, 100);
};

export default startExecute;
