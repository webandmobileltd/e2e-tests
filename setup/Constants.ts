export const API_URL: string =
  process.env.CYPRESS_API_BASE_URL || Cypress.env('API_BASE_URL');

export const OPERATOR_USERNAME: string =
  process.env.CYPRESS_OPERATOR_USERNAME || Cypress.env('OPERATOR_USERNAME');

export const OPERATOR_PASSWORD: string =
  process.env.CYPRESS_OPERATOR_PASSWORD || Cypress.env('OPERATOR_PASSWORD');

export const TOKEN_URL: string =
  process.env.CYPRESS_TOKEN_URL || Cypress.env('TOKEN_URL');
