const tsconfigPaths = require('tsconfig-paths');
const tsconfig = require('./tsconfig.json');

const baseUrl = './dist';

tsconfigPaths.register({
  baseUrl,
  paths: tsconfig.compilerOptions.paths,
});
