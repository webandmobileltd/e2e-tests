export function preserveLoginCookiesBetweenTests() {
  Cypress.Cookies.preserveOnce(
    'AUTH_SESSION_ID',
    'KEYCLOAK_IDENTITY',
    'KEYCLOAK_SESSION',
  );
}

export function clearLoginCookies() {
  cy.clearCookies();
}
