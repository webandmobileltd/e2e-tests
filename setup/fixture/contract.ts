export type ContractType = 'SelectedCollections' | 'SelectedVideos';

export interface ContractFixture {
  type: ContractType;
  name: string;
}

export interface SelectedCollectionsContractFixture extends ContractFixture {
  collectionIds: string[];
}

export interface SelectedVideosContractFixture extends ContractFixture {
  videoIds: string[];
}

export function ltiSelectedCollectionsContractFixture(
  collectionIds: string[],
): SelectedCollectionsContractFixture {
  return {
    type: 'SelectedCollections',
    name: 'LTI Selected Collections',
    collectionIds,
  };
}

export const SELECTED_VIDEOS_CONTRACT_NAME = 'Selected Videos ContractFixture';

export function selectedVideosContractFixture(
  videoIds: string[],
): SelectedVideosContractFixture {
  return {
    name: SELECTED_VIDEOS_CONTRACT_NAME,
    type: 'SelectedVideos',
    videoIds,
  };
}
