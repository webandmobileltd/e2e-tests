export const API_URL: string =
  process.env.CYPRESS_API_BASE_URL || Cypress.env('API_BASE_URL');

export const TOKEN_URL: string =
  process.env.CYPRESS_TOKEN_URL || Cypress.env('TOKEN_URL');

export const OPERATOR_USERNAME: string =
  process.env.CYPRESS_OPERATOR_USERNAME || Cypress.env('OPERATOR_USERNAME');

export const OPERATOR_PASSWORD: string =
  process.env.CYPRESS_OPERATOR_PASSWORD || Cypress.env('OPERATOR_PASSWORD');

export const SELECTED_VIDEOS_TEST_USERNAME: string =
  process.env.CYPRESS_SELECTED_VIDEOS_TEST_USERNAME ||
  Cypress.env('SELECTED_VIDEOS_TEST_USERNAME');

export const SELECTED_VIDEOS_TEST_PASSWORD: string =
  process.env.CYPRESS_SELECTED_VIDEOS_TEST_PASSWORD ||
  Cypress.env('SELECTED_VIDEOS_TEST_PASSWORD');
