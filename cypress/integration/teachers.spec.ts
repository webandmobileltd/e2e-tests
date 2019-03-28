import { v4 as uuid } from 'uuid';
import { CollectionPage } from '../page_objects/teachers/CollectionPage';
import { CollectionsPage } from '../page_objects/teachers/CollectionsPage';
import { TeachersHomepage } from '../page_objects/teachers/TeachersHomepage';
import { TeachersVideoDetailsPage } from '../page_objects/teachers/TeachersVideoDetailsPage';
import ViewPort from '../page_objects/types/ViewPort';

context('Teachers', () => {
  const username = `${uuid()}@boclips.com`;
  const password = uuid();
  const validSearchQuery = 'TED Talks';

  before(() => {
    new TeachersHomepage()
      .visit()
      .createAccount(username, password)
      .accountCreated();
  });

  afterEach(() => {
    cy.viewport(1000, 660);
    new TeachersHomepage().visit().logOut();
  });

  specify('search journey', () => {
    const email = 'test@test.com';
    const homepage = new TeachersHomepage();
    const invalidSearchQuery = 'asdfghjklkjhgf';

    homepage
      .visit()
      .logIn(username, password)
      .search(invalidSearchQuery)
      .enterEmail(email)
      .searchWithAutocomplete('ted', 'TED Talks')
      .inspectResults(videos => {
        expect(videos.length).to.be.greaterThan(
          0,
          `There are no videos showing`,
        );
      })
      .isOnPage(1)
      .goToNextPage()
      .isOnPage(2)
      .goToPreviousPage()
      .isOnPage(1)
      .goToFirstVideo();

    cy.location()
      .then(location => {
        const pathname = location.pathname;
        const parts = pathname.split('/');
        const id = parts[parts.length - 1];
        return id;
      })
      .then(id => {
        return new TeachersVideoDetailsPage(id);
      })
      .then(videoDetailsPage => {
        videoDetailsPage
          .visit()
          .hasTitle()
          .hasContentPartnerName();
      });
  });

  it('shows only educational videos', () => {
    const nonEducationalSearchQuery = 'Celebrities on the red carpet';
    const homepage = new TeachersHomepage();
    homepage
      .visit()
      .logIn(username, password)
      .search(nonEducationalSearchQuery)
      .noVideosShown();
  });

  const sizes: ViewPort[] = [
    { height: 660, width: 1000, isMobile: false },
    { height: 667, width: 375, isMobile: true },
  ];

  sizes.forEach((size: ViewPort) => {
    specify(
      `separating news journey for: ${
        size.isMobile ? 'mobile' : 'desktop'
      } view`,
      () => {
        const homepage = new TeachersHomepage();

        const queryWithNewsAndNonNews = 'richard';

        cy.viewport(size.width, size.height);

        homepage
          .visit()
          .logIn(username, password)
          .search(queryWithNewsAndNonNews)
          .inspectResults(videos => {
            expect(videos.length).to.be.greaterThan(
              0,
              `There are no videos showing`,
            );
          })
          .goToNewsPage(size.isMobile)
          .inspectResults(videos => {
            expect(videos.length).to.be.greaterThan(
              0,
              `There are no videos showing`,
            );
          })
          .goBackToMainSearchPage(size.isMobile)
          .inspectResults(videos => {
            expect(videos.length).to.be.greaterThan(
              0,
              `There are no videos showing`,
            );
          });
      },
    );
  });

  sizes.forEach((size: ViewPort) => {
    specify(
      `collections journey for: ${size.isMobile ? 'mobile' : 'desktop'} view`,
      () => {
        const collectionTitle = uuid();

        cy.viewport(size.width, size.height);

        new TeachersHomepage()
          .visit()
          .logIn(username, password)
          .search(validSearchQuery)
          .createCollectionFromVideo(0, collectionTitle)
          .isVideoInCollection(0, collectionTitle)
          .addVideoToCollection(1, collectionTitle)
          .isVideoInCollection(1, collectionTitle)
          .reload()
          .removeVideoFromCollection(1, collectionTitle)
          .goToCollections();

        new CollectionsPage()
          .inspectCollections(collections =>
            expect(collections).to.have.length(1),
          )
          .goToCollectionDetails(collectionTitle);

        const newCollectionName = uuid();

        new CollectionPage()
          .setName(newCollectionName)
          .itHasName(newCollectionName)
          .itHasCorrectiVisiblity(false)
          .setVisibility(true)
          .itHasCorrectiVisiblity(true)
          .setVisibility(false)
          .itHasCorrectiVisiblity(false)
          .inspectItems(videos => expect(videos).to.have.length(1))
          .reload()
          .itHasName(newCollectionName)
          .inspectItems(videos => expect(videos).to.have.length(1))
          .removeVideo(0)
          .isEmpty()
          .reload()
          .isEmpty()
          .goToCollections();

        new CollectionsPage()
          .deleteCollection(newCollectionName)
          .itShowsNotification(
            `Your collection "${newCollectionName}" has been deleted`,
          )
          .isEmpty();
      },
    );
  });

  sizes.forEach((size: ViewPort) => {
    const secondUsername = `${uuid()}@boclips.com`;

    specify(
      `public collections journey for: ${
        size.isMobile ? 'mobile' : 'desktop'
      } view`,
      () => {
        cy.viewport(size.width, size.height);
        const collectionTitle = uuid();

        new TeachersHomepage()
          .visit()
          .logIn(username, password)
          .search(validSearchQuery)
          .createCollectionFromVideo(0, collectionTitle)
          .goToCollections();

        new CollectionsPage().goToCollectionDetails(collectionTitle);

        new CollectionPage().setVisibility(true).logOut();

          new TeachersHomepage()
              .visit()
              .createAccount(secondUsername, password)
              .visit()
              .logIn(secondUsername, password)
              .inspectPublicCollections(collections =>
                  expect(collections.map(c => c.title)).to.include(collectionTitle),
              )
              .bookmarkCollection(collectionTitle)
              .inspectPublicCollections(collections =>
                  expect(collections.filter(c => c.title === collectionTitle)[0].bookmarked).to.equal(true)
            )
          .logOut();

        new TeachersHomepage()
          .visit()
          .logIn(username, password)
          .goToCollections();

        new CollectionsPage().deleteCollection(collectionTitle);
      },
    );
  });
});
