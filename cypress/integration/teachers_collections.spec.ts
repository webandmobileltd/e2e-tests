import { v4 as uuid } from 'uuid';
import { TeachersHomepage } from '../page_objects/teachers';
import {
  clearLoginCookies,
  preserveLoginCookiesBetweenTests,
} from '../page_objects/teachers/CookiesUtils';

context('Teachers App Collections Journey', () => {
  const homepage = new TeachersHomepage();

  const username = `${uuid()}@boclips.com`;
  const password = `${uuid()}Aa1$`;

  const MINUTE_PHYSICS = 'Minute Physics';
  const SUBJECT = 'Biology';

  const existingPublicCollectionTitle = MINUTE_PHYSICS;

  before(() => {
    clearLoginCookies();
    homepage
      .configureHubspotCookie()
      .log('creating an account')
      .visitRegistrationPage()
      .createAccount(username, password)
      .accountCreated()

      .log('logging in')
      .visit()
      .logIn(username, password)

      .log('activating account')
      .activateAccount()
      .accountActivated();
  });

  beforeEach(preserveLoginCookiesBetweenTests);

  specify('Management, Discover & Bookmarking', () => {
    const collectionTitle = uuid();
    const newCollectionTitle = uuid();

    homepage
      .log('bookmarking collection')
      .visit()
      .bookmarkCollection(existingPublicCollectionTitle)
      .unbookmarkCollection(existingPublicCollectionTitle)
      .bookmarkCollection(existingPublicCollectionTitle)

      .log('checking bookmarks')
      .menu()
      .goToBookmarkedCollections()
      .goToHomepage()
      .reload()
      .checkCollectionBookmarkStatus(existingPublicCollectionTitle, true)

      .log('creating a collection')
      .menu()
      .search(MINUTE_PHYSICS)
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
      .setVisibility(true)
      .setSubject(SUBJECT)
      .setName(newCollectionTitle)
      .itHasCorrectVisibility(true)
      .itHasName(newCollectionTitle)

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
      .goToDiscoverBySubject(SUBJECT)
      .hasCollectionTitle(newCollectionTitle)

      .log('deleting a collection')
      .menu()
      .goToCollections()
      .deleteCollection(newCollectionTitle);
  });
});
