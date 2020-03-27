export interface CollectionFixture {
  title: string;
  public: boolean;
  promoted?: boolean;
}

export const collectionFixtures: CollectionFixture[] = [
  { title: 'Minute Physics', public: true, promoted: true },
  { title: 'Private collection', public: false },
];

export const ltiCollectionFixture: CollectionFixture = {
  title: 'LTI Collection',
  public: false,
};
