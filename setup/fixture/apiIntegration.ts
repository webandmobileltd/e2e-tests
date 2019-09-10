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
    role: 'ROLE_PEARSON_MYREALIZE',
    contractIds,
  };
}