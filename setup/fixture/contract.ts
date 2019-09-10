export interface SelectedContentContract {
  type: 'SelectedContent';
  name: string;
  collectionIds: string[];
}

export function ltiSelectedContentContractFixture(
  collectionIds: string[],
): SelectedContentContract {
  return {
    type: 'SelectedContent',
    name: 'LTI Selected Content',
    collectionIds,
  };
}
