export interface CollectionFixture {
  title: string;
  public: boolean;
}

export const collectionFixtures: CollectionFixture[] = [
  { title: 'Minute Physics', public: true },
  { title: 'Private collection', public: false },
];

export const ltiCollectionFixture: CollectionFixture = {
  title: 'LTI Collection',
  public: false,
};
