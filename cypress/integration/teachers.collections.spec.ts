import { v4 as uuid } from 'uuid';
import { CollectionPage } from '../page_objects/teachers/CollectionPage';
import { CollectionsPage } from '../page_objects/teachers/CollectionsPage';
import { TeachersHomepage } from '../page_objects/teachers/TeachersHomepage';
import ViewPort from '../page_objects/types/ViewPort';
import { sizes } from './viewports';

const validSearchQuery = 'Minute';
const expectedCompletion = 'Minute Physics';

context('Bookmarked collections', () => {
  const collectionName = uuid();

  before(() => {
    const username = `${uuid()}@boclips.com`;
    const password = uuid();

    new TeachersHomepage()
      .visit()
      .goToRegistrationPage()
      .createAccount(username, password)
      .accountCreated()
      .visit()
      .logIn(username, password)
      .searchWithAutocomplete(validSearchQuery, expectedCompletion)
      .createCollectionFromVideo(0, `${collectionName}`)
      .goToCollections();

    new CollectionsPage().goToCollectionDetails(collectionName);

    new CollectionPage().setVisibility(true).logOut();
  });

  afterEach(() => {
    new TeachersHomepage().visit().logOut();
  });


  specify('users can bookmark collections from other users', () => {
    const username = `${uuid()}@boclips.com`;
    const password = uuid();

    new TeachersHomepage()
      .visit()
      .goToRegistrationPage()
      .createAccount(username, password)
      .accountCreated()
      .visit()
      .logIn(username, password)
      .bookmarkCollection(collectionName)
      .unbookmarkCollection(collectionName)
      .bookmarkCollection(collectionName)
      .goToBookmarkedCollections()
      .reload()
      .checkCollectionBookmarkStatus(collectionName, true);
  });
});

context('Public collections', () => {
  const username = `${uuid()}@boclips.com`;
  const password = uuid();

  before(() => {
    new TeachersHomepage()
      .visit()
      .goToRegistrationPage()
      .createAccount(username, password)
      .accountCreated();
  });

  // TODO: address flicker before reintroducing
  // context('users can make collections public and private', () => {
  //   sizes.forEach((size: ViewPort) => {
  //     specify(
  //       `public collections journey for: ${
  //         size.isMobile ? 'mobile' : 'desktop'
  //       } view`,
  //       () => {
  //         cy.viewport(size.width, size.height);
  //         const collectionTitle = uuid();
  //
  //         new TeachersHomepage()
  //           .visit()
  //           .logIn(username, password)
  //           .search(expectedCompletion)
  //           .createCollectionFromVideo(0, collectionTitle)
  //           .goToCollections();
  //
  //         new CollectionsPage().goToCollectionDetails(collectionTitle);
  //
  //         new CollectionPage().setVisibility(true).goToCollections();
  //
  //         new CollectionsPage().deleteCollection(collectionTitle);
  //       },
  //     );
  //   });
  // });
});

context('Collection management', () => {
  const username = `${uuid()}@boclips.com`;
  const password = uuid();

  before(() => {
    new TeachersHomepage()
      .visit()
      .goToRegistrationPage()
      .createAccount(username, password)
      .accountCreated();
  });

  context('users can edit collections', () => {
    sizes.forEach((size: ViewPort) => {
      specify(
        `collections journey for: ${size.isMobile ? 'mobile' : 'desktop'} view`,
        () => {
          const collectionTitle = uuid();

          cy.viewport(size.width, size.height);

          new TeachersHomepage()
            .visit()
            .logIn(username, password)
            .searchWithAutocomplete(validSearchQuery, expectedCompletion)
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
            .itHasCorrectVisiblity(false)
            .setVisibility(true)
            .itHasCorrectVisiblity(true)
            .setVisibility(false)
            .itHasCorrectVisiblity(false)
            .inspectItems(videos => expect(videos).to.have.length(1))
            .reload()
            .itHasName(newCollectionName)
            .inspectItems(videos => expect(videos).to.have.length(1))
            .removeVideo(0)
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
  });
});
