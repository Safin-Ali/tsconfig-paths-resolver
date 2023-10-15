import { parse } from '@babel/parser';

const createAST = (code: string) => {
	const ast = parse(code, {
		sourceType: 'unambiguous',
	});

};

const transform = (code:string) => createAST(code);

export default transform