# tsconfig-paths-resolver

## 📑 Overview

[![npm version](https://badgen.net/npm/v/tsconfig-paths-resolver)](https://www.npmjs.com/package/tsconfig-paths-resolver)
[![npm version](https://badgen.net/github/license/Safin-Ali/tsconfig-paths-resolver)](https://github.com/Safin-Ali/tsconfig-paths-resolver/blob/main/LICENSE)
[![npm version](https://badgen.net/npm/dw/tsconfig-paths-resolver)](https://www.npmjs.com/package/tsconfig-paths-resolver)

The `tsconfig-paths-resolver` is a powerful tool that allows you to resolve TypeScript module paths at build time using your `tsconfig.json` file. This is particularly useful when you have complex module structures or when you want to optimize your build process.

| dependency                          | weekly downloads                                         |
| ----------------------------------- | -------------------------------------------------------- |
| [@babel/parser](https://www.npmjs.com/package/@babel/parser)   | ![npm version](https://badgen.net/npm/dw/@babel/parser)
| [@babel/generator](https://www.npmjs.com/package/@babel/generator) | ![npm version](https://badgen.net/npm/dw/@babel/generator)
| [json-to-js-obj](https://www.npmjs.com/package/json-to-js-obj) | ![npm version](https://badgen.net/npm/dw/json-to-js-obj)

## 💎 Features

- **Easy Configuration**: Integrates seamlessly into your existing TypeScript project by utilizing the `tsconfig.json` file.

- **Relative Path**: Programmatically resolve paths into the relative path `./ || ../` based on `baseUrl`.

- **Support Alias**: Ability to resolve both `fix` > `@app/app.ts` **and** `root` > `@utility/*.ts` aliases

- **File Type**: Resolve only `JavaScript` codes.

## 🔧 Installation

You can install `tsconfig-paths-resolver` via npm:

```bash
npm install --save-dev tsconfig-paths-resolver
```
### or
```bash
yarn add tsconfig-paths-resolver --dev
```

## 🧑‍💻 Usage:

### you can add your `package.json` this line

```json
"scripts": {
	"build": "npx tsc && npx tspr -s dist -ds resolved-file"
}
```


## 🔩 Options:

|    flag     |               description               |  default  |
|-------------|-----------------------------------------|-----------|
|     -s      |   typescript compiled codes directory   |    dist   |
|    -ds      | destination path for the resolved codes |    none   |


> If you want to use `custom direcotry ` using -s flag `npx tspr -s lib`

> You can `emit` resolved files into separte direcotry using -ds flag `npx tspr -s lib -ds resolved-path`

## 📌 Note:

```
remember it -s <here will be typescript compiler output directory>
that means if your compiled codes .js file inside the src directory
then you should use -s src
```

## 📞 Contact

If you have any questions, feedback, or need assistance with this package, feel free to reach out:

- Author: Safin Ali
- Email: safin.ali.7205@gmail.com
- GitHub: [github.com/Safin-Ali](https://github.com/Safin-Ali)
- Website: [https://safin-ali.vercel.app](https://safin-ali.vercel.app/)


😊😁
*Please review it and let me know if you have any specific concerns or if you'd like further changes.*