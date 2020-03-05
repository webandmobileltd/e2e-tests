export interface ApiIntegrationFixture {
  name: string;
  role: string;
  accessRuleIds: string[];
}

export function ltiApiIntegrationFixture(
  accessRuleIds: string[],
): ApiIntegrationFixture {
  return {
    name: 'E2E Tests LTI Api Integration',
    role: 'ROLE_PEARSON_MYREALIZE',
    accessRuleIds,
  };
}

export function selectedVideosApiIntegrationFixture(
  accessRuleIds: string[],
): ApiIntegrationFixture {
  return {
    name: 'E2E Tests Selected Videos API Integration',
    role: 'ROLE_SELECTED_VIDEOS_API_INTEGRATION',
    accessRuleIds,
  };
}
