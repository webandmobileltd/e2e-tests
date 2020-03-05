export type AccessRuleType = 'SelectedCollections' | 'SelectedVideos';

export interface AccessRuleFixture {
  type: AccessRuleType;
  name: string;
}

export interface SelectedCollectionsAccessRuleFixture
  extends AccessRuleFixture {
  collectionIds: string[];
}

export interface SelectedVideosAccessRuleFixture extends AccessRuleFixture {
  videoIds: string[];
}

export function ltiSelectedCollectionsAccessRuleFixture(
  collectionIds: string[],
): SelectedCollectionsAccessRuleFixture {
  return {
    type: 'SelectedCollections',
    name: 'LTI Selected Collections',
    collectionIds,
  };
}

export const SELECTED_VIDEOS_ACCESS_RULE_NAME =
  'Selected Videos AccessRuleFixture';

export function selectedVideosAccessRuleFixture(
  videoIds: string[],
): SelectedVideosAccessRuleFixture {
  return {
    name: SELECTED_VIDEOS_ACCESS_RULE_NAME,
    type: 'SelectedVideos',
    videoIds,
  };
}
