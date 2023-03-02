const tsconfigPaths = require('tsconfig-paths');
const tsconfig = require('./tsconfig.json');

const baseUrl = './build';

tsconfigPaths.register({
  baseUrl,
  paths: tsconfig.compilerOptions.paths,
});
