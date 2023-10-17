export type ModuleLiteral = 'ESM' | 'CommonJS' | 'CESM';

export type CMDArgFlag = '-s' | '-ds'

export interface CMDArgShape {
	srcArg:string,
	destination:string
}