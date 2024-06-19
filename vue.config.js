const config = require('./shell/vue.config');

// Excludes the following plugins if there's no .env file.
let defaultExcludes = 'rancher-components';

if (process.env.RANCHER_ENV === 'llmos') {
  defaultExcludes = defaultExcludes.replace(', llmos', '');
}
const excludes = process.env.EXCLUDES_PKG || defaultExcludes;

module.exports = config(__dirname, {
  excludes: excludes.replace(/\s/g, '').split(','),
  excludes: ['llmos'] // comment out for multi-cluster dev
});
