import { v4 as uuidv4 } from 'uuid';
import { MarketingCollectionListPage } from '../page_objects/marketing/MarketingCollectionPage';

context('Marketing Collections', () => {
  const title = uuidv4();
  const expectedCollection = {
    title,
    description: 'A new collection description!',
    videos: [{ title: 'a new title', description: 'a new description' }],
  };

  it('marketing collection journey', () => {
    const marketingCollectionListPage = new MarketingCollectionListPage();
    marketingCollectionListPage
      .visit()
      .logIn()
      .goToCreateCollection()
      .setTitle(title)
      .setDescription('A new collection description!')
      .addVideo({
        id: '535',
        title: 'video title',
        description: 'video description',
      })
      .expectVideoCount(1)
      .addVideo({
        id: '536',
        title: 'second video title',
        description: 'second video description',
      })
      .expectVideoCount(2)
      .withVideos(videos =>
        expect(videos).to.deep.eq([
          { title: 'video title', description: 'video description' },
          {
            title: 'second video title',
            description: 'second video description',
          },
        ]),
      )
      .deleteVideo('536')
      .expectVideoCount(1)
      .withVideos(videos =>
        expect(videos).to.deep.eq([
          { title: 'video title', description: 'video description' },
        ]),
      )
      .setVideoTitle('535', 'a new title')
      .setVideoDescription('535', 'a new description')
      .withVideos(videos =>
        expect(videos).to.deep.eq([
          { title: 'a new title', description: 'a new description' },
        ]),
      )
      .goToPublicCollection()
      .withMarketingCollection(marketingCollection =>
        expect(marketingCollection).to.deep.eq(expectedCollection),
      );

    const marketingSummaryRow = {
      title,
      description: 'A new collection description!',
      numberOfVideos: 1,
    };

    marketingCollectionListPage
      .visit()
      .withMarketingCollections(collections =>
        expect(collections).to.contain(marketingSummaryRow),
      )
      .deleteCollectionWithTitle(title);
  });
});
