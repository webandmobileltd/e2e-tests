export type ContractType = 'SelectedCollections' | 'SelectedVideos';

export interface Contract {
  type: ContractType;
  name: string;
}

export interface SelectedCollectionsContract extends Contract {
  collectionIds: string[];
}

export function ltiSelectedCollectionsContractFixture(
  collectionIds: string[],
): SelectedCollectionsContract {
  return {
    type: 'SelectedCollections',
    name: 'LTI Selected Collections',
    collectionIds,
  };
}

export interface SelectedVideosContract extends Contract {
  videoIds: string[];
}

export function selectedVideosContractFixture(
  videoIds: string[],
): SelectedVideosContract {
  return {
    name: 'Selected Videos Contract',
    type: 'SelectedVideos',
    videoIds,
  };
}
