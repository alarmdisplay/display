import globals from 'globals';
import mainConfig from '../eslint.config.mjs';

export default [
  ...mainConfig,
  {
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  }];
