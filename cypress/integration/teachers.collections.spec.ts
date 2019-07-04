import { v4 as uuid } from 'uuid';
import {
  CollectionPage,
  CollectionsPage,
  TeachersHomepage,
} from '../page_objects/teachers';
import ViewPort from '../page_objects/types/ViewPort';
import { sizes } from './viewports';

const validSearchQuery = 'Minute';
const expectedCompletion = 'Minute Physics';

context('Bookmarked collections', () => {
  const collectionName = uuid();

  // before(() => {
  //   const username = `${uuid()}@boclips.com`;
  //   const password = uuid();
  //
  //   new TeachersHomepage()
  //     .visit()
  //     .goToRegistrationPage()
  //     .createAccount(username, password)
  //     .accountCreated()
  //     .visit()
  //     .logIn(username, password)
  //     .searchWithAutocomplete(validSearchQuery, expectedCompletion)
  //     .createCollectionFromVideo(0, `${collectionName}`)
  //     .menu()
  //     .goToCollections()
  //     .goToCollectionDetails(collectionName)
  //     .setVisibility(true)
  //     .menu()
  //     .logOut();
  // });

  // afterEach(() => {
  //   new TeachersHomepage()
  //     .visit()
  //     .menu()
  //     .logOut();
  // });

  // TODO: address flicker before reintroducing
  // specify('users can bookmark collections from other users', () => {
  //   const username = `${uuid()}@boclips.com`;
  //   const password = uuid();
  //
  //   new TeachersHomepage()
  //     .visit()
  //     .goToRegistrationPage()
  //     .createAccount(username, password)
  //     .accountCreated()
  //     .visit()
  //     .logIn(username, password)
  //     .bookmarkCollection(collectionName)
  //     .unbookmarkCollection(collectionName)
  //     .bookmarkCollection(collectionName)
  //     .goToBookmarkedCollections()
  //     .reload()
  //     .checkCollectionBookmarkStatus(collectionName, true);
  // });
});

context('Collections', () => {
  specify('collection journey', () => {
    const collectionTitle = uuid();
    const newCollectionTitle = uuid();
    const username = `${uuid()}@boclips.com`;
    const password = uuid();

    new TeachersHomepage()
      .log('creating an account')
      .visit()
      .goToRegistrationPage()
      .createAccount(username, password)
      .accountCreated()

      .log('logging in')
      .visit()
      .logIn(username, password)

      .log('creating a collection')
      .menu()
      .search(expectedCompletion)
      .createCollectionFromVideo(0, collectionTitle)

      .log('managing collection videos')
      .addVideoToCollection(1, collectionTitle)
      .isVideoInCollection(1, collectionTitle)
      .reload()
      .removeVideoFromCollection(1, collectionTitle)

      .log('editing a collection')
      .menu()
      .goToCollections()
      .inspectCollections(collections => expect(collections).to.have.length(1))
      .goToCollectionDetails(collectionTitle)
      .setName(newCollectionTitle)
      .setVisibility(true)
      .setSubject('Biology')
      .itHasName(newCollectionTitle)
      .itHasCorrectVisiblity(true)

      .log('verifying and managing videos')
      .inspectItems(videos => expect(videos).to.have.length(1))
      .reload()
      .itHasName(newCollectionTitle)
      .inspectItems(videos => expect(videos).to.have.length(1))
      .removeVideo(0)
      .isEmpty()
      .reload()
      .isEmpty()

      .log('verifying collection in discipline subject page')
      .menu()
      .goToHomepage()
      .goToDiscoverBySubject('Biology')
      .hasCollectionTitle(newCollectionTitle)

      .log('deleting a collection')
      .menu()
      .goToCollections()
      .deleteCollection(newCollectionTitle);
  });
});
