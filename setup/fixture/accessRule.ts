export type AccessRuleType =
  | 'IncludedCollections'
  | 'IncludedVideos'
  | 'ExcludedVideoTypes';

export interface AccessRuleFixture {
  type: AccessRuleType;
  name: string;
}

export interface IncludedCollectionsAccessRuleFixture
  extends AccessRuleFixture {
  collectionIds: string[];
}

export interface IncludedVideosAccessRuleFixture extends AccessRuleFixture {
  videoIds: string[];
}

export type VideoTypes = 'NEWS' | 'STOCK' | 'INSTRUCTIONAL';
export interface ExcludedVideoTypesAccessRuleFixture extends AccessRuleFixture {
  videoTypes: VideoTypes[];
}

export function ltiIncludedCollectionsAccessRuleFixture(
  collectionIds: string[],
): IncludedCollectionsAccessRuleFixture {
  return {
    type: 'IncludedCollections',
    name: 'LTI Selected Collections',
    collectionIds,
  };
}

export const INCLUDED_VIDEOS_ACCESS_RULE_NAME =
  'Selected Videos AccessRuleFixture';

export function includedVideosAccessRuleFixture(
  videoIds: string[],
): IncludedVideosAccessRuleFixture {
  return {
    name: INCLUDED_VIDEOS_ACCESS_RULE_NAME,
    type: 'IncludedVideos',
    videoIds,
  };
}

export function excludedVideoTypesAccessRuleFixture(
  videoTypes: VideoTypes[],
  name: string,
): ExcludedVideoTypesAccessRuleFixture {
  return {
    name,
    videoTypes,
    type: 'ExcludedVideoTypes',
  };
}
