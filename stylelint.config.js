export default {
  extends: ['stylelint-config-standard'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'theme', 'apply', 'utilities'],
      },
    ],
    'no-descending-specificity': null,
    'import-notation': null,
    'custom-property-pattern': null,
  },
};
