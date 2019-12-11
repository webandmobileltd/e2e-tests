export interface SelectedCollectionsContract {
  type: 'SelectedCollections';
  name: string;
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
