const withTM = require('next-transpile-modules')(['@lation/components', '@lation/utils'])
const { nextI18NextRewrites } = require('next-i18next/rewrites')

const localeSubpaths = {
  'en': 'en',
  'zh-TW': 'zh-TW',
}

module.exports = withTM({
  target: 'serverless',
  rewrites: async () => nextI18NextRewrites(localeSubpaths),
  publicRuntimeConfig: {
    localeSubpaths,
  },
})
