export interface ApiIntegrationFixture {
  name: string;
  role: string;
  contractIds: string[];
}

export function ltiApiIntegrationFixture(
  contractIds: string[],
): ApiIntegrationFixture {
  return {
    name: 'E2E Tests LTI Api Integration',
    role: 'ROLE_E2E_TESTS_LTI',
    contractIds,
  };
}
