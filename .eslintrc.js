import '@angular/localize/init';

module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: ['./tsconfig.json'], // Certifique-se de que o caminho do tsconfig.json está correto
      tsconfigRootDir: __dirname, 
    },
    plugins: ['@typescript-eslint'],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    rules: {
      // Suas regras personalizadas aqui
      'quotes': ['error', 'double'],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
    },
  };
  