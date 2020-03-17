export interface ApiIntegrationFixture {
  name: string;
  role: string;
  contentPackageId: string;
}

export function ltiApiIntegrationFixture(
  contentPackageId: string,
): ApiIntegrationFixture {
  return {
    name: 'E2E Tests LTI Api Integration',
    role: 'ROLE_TESTING_LTI',
    contentPackageId,
  };
}

export function includedVideosApiIntegrationFixture(
  contentPackageId: string,
): ApiIntegrationFixture {
  return {
    name: 'E2E Tests Selected Videos API Integration',
    role: 'ROLE_SELECTED_VIDEOS_API_INTEGRATION',
    contentPackageId,
  };
}
