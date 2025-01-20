const baseConfig = require('../../eslint.config.cjs');

module.exports = [
    ...baseConfig,
    {
        rules: {
            '@nx/enforce-module-boundaries': [
              'error',
              {
                enforceBuildableLibDependency: true,
                allow: [
                  '^.*/eslint(\\.base)?\\.config\\.[cm]?js$',
                  "@deploy/api"
                ],
                depConstraints: [
                  {
                    sourceTag: '*',
                    onlyDependOnLibsWithTags: ['*'],
                  },
                ],
              },
            ]
        }
    }
];
