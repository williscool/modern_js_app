// babeling it isn't supported
// https://github.com/postcss/postcss-loader/issues/192

module.exports = {
  plugins: {
    "postcss-cssnext": {},
    "postcss-hexrgba": {},
    "postcss-import": {},
    precss: {}
  }
};
