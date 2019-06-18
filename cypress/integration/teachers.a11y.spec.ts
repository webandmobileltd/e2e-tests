import { v4 as uuid } from 'uuid';
import Video from '../page_objects/domain/Video';
import { CollectionPage } from '../page_objects/teachers/CollectionPage';
import { CollectionsPage } from '../page_objects/teachers/CollectionsPage';
import { TeachersHomepage } from '../page_objects/teachers/TeachersHomepage';
import { TeachersVideoDetailsPage } from '../page_objects/teachers/TeachersVideoDetailsPage';

context('Accessibility Checks for Teachers', () => {
  specify('Boclips Teachers is accessible', () => {
    const username = `${uuid()}@boclips.com`;
    const password = uuid();
    const collectionName = uuid();
    const validSearchQuery = 'Minute Physics';

    new TeachersHomepage()
      .visit()
      .checkA11yOnLoginPage(7)
      .goToRegistrationPage()
      .checkA11yOnRegistrationPage(6)
      .createAccount(username, password)
      .visit()
      .logIn(username, password)
      .checkA11yOnHomePage(9)
      .searchWithAutocomplete(validSearchQuery, 'Minute Physics')
      .checkA11yOnSearchPage(9)
      .createCollectionFromVideo(0, `${collectionName}`)
      .goToCollections();

    new CollectionsPage().goToCollectionDetails(collectionName);

    new CollectionPage()
      .checkA11yOnCollectionPage(9)
      .inspectItems((videos: Video[]) => {
        expect(videos.length).to.be.greaterThan(0);
        const video: Video = videos[0];
        new TeachersVideoDetailsPage(video.id as string)
          .visit()
          .checkA11yOnVideoPage(6);
      });
  });
});
