module.exports = {
  API_URL: process.env.CYPRESS_API_BASE_URL || Cypress.env('API_BASE_URL'),
  OPERATOR_USERNAME: process.env.CYPRESS_OPERATOR_USERNAME || Cypress.env('OPERATOR_USERNAME'),
  OPERATOR_PASSWORD: process.env.CYPRESS_OPERATOR_PASSWORD || Cypress.env('OPERATOR_PASSWORD'),
  TOKEN_URL: process.env.CYPRESS_TOKEN_URL || Cypress.env('TOKEN_URL')
};
