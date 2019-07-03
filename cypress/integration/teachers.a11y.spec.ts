import { v4 as uuid } from 'uuid';
import { TeachersHomepage } from '../page_objects/teachers/TeacherPages';

context.skip('Accessibility Checks for Teachers', () => {
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
      .menu()
      .goToCollections()
      .goToCollectionDetails(collectionName)
      .checkA11yOnCollectionPage(9)
      .goToFirstVideo()
      .then(videoDetailsPage =>
        videoDetailsPage.visit().checkA11yOnVideoPage(6),
      );
  });
});
