import {TeachersHomepage} from "../page_objects/teachers/TeachersHomepage";
import {v4 as uuid} from 'uuid';
import {CollectionsPage} from "../page_objects/teachers/CollectionsPage";
import {CollectionPage} from "../page_objects/teachers/CollectionPage";
import {TeachersVideoDetailsPage} from "../page_objects/teachers/TeachersVideoDetailsPage";
import Video from "../page_objects/domain/Video";

context('Accessibility Checks for Teachers', () => {

  afterEach(() => {
    new TeachersHomepage().visit().logOut();
  });

  specify('Check a11y on the main pages', () => {
    const username = `${uuid()}@boclips.com`;
    const password = uuid();
    const collectionName = uuid();
    const validSearchQuery = 'Minute Physics';

    new TeachersHomepage()
      .visit()
      .checkA11yOnLoginPage(6)
      .goToRegistrationPage()
      .checkA11yOnRegistrationPage(5)
      .createAccount(username, password)
      .visit()
      .logIn(username, password)
      .checkA11yOnHomePage(7)
      .searchWithAutocomplete(validSearchQuery, 'Minute Physics')
      .checkA11yOnSearchPage(5)
      .createCollectionFromVideo(0, `${collectionName}`)
      .goToCollections();

    new CollectionsPage()
      .goToCollectionDetails(collectionName);

    new CollectionPage()
      .checkA11yOnCollectionPage(7)
      .inspectItems((videos: Video[]) => {
        expect(videos.length).to.be.greaterThan(0);
        const video: Video = videos[0];
        new TeachersVideoDetailsPage(video.id as string)
          .visit()
          .checkA11yOnVideoPage(5)
      })

  });
});
