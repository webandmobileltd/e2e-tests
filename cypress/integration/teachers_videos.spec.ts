import { v4 as uuid } from 'uuid';
import { TeachersHomepage } from '../page_objects/teachers';
import {
  clearLoginCookies,
  preserveLoginCookiesBetweenTests,
} from '../page_objects/teachers/CookiesUtils';

context('Teachers App Videos Journey', () => {
  const homepage = new TeachersHomepage();

  const username = `${uuid()}@boclips.com`;
  const password = `${uuid()}Aa1$`;

  const MINUTE_PHYSICS = 'Minute Physics';
  const SUBJECT = 'Biology';

  before(() => {
    clearLoginCookies();
    homepage
      .log('creating an account')
      .visit()
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

  specify('Search, Filtering, Browsing & Rating', () => {
    const nonEducationalSearchQuery = 'Celebrities on the red carpet';
    const queryWithNewsAndNonNews = 'richard';

    homepage
      .log('searching non educational videos')
      .menu()
      .search(nonEducationalSearchQuery)
      .noVideosShown()

      .log('testing paging')
      .menu()
      .search(MINUTE_PHYSICS)
      .isOnPage(1)
      .goToPage(2)
      .isOnPage(2)
      .goToPage(1)
      .isOnPage(1)

      .log('testing subject filter')
      .applySubjectFilter(SUBJECT)
      .inspectResults(videos => {
        expect(videos.length).to.be.eq(3, `There are three videos showing`);
      })
      .removeFilterTag(SUBJECT)

      .log('testing duration filter')
      .applyDurationFilter(0, 240)
      .inspectResults(videos => {
        expect(videos.length).to.be.eq(8, `There are eight videos showing`);
      })
      .removeFilterTag('0m-4m')

      .log('testing age range filter')
      .applyAgeRangeFilter(3, 11)
      .inspectResults(videos => {
        expect(videos.length).to.be.eq(3, `There are three videos showing`);
      })
      .removeFilterTag('3-11')

      .log('testing video rating')
      .rateAndTagVideo(2, 'Hook')
      .assertRatingOnFirstVideo(2)
      .assertPedagogicalTagOnFirstVideo('Hook')
      .goToFirstVideo()
      .then(videoDetailsPage => {
        videoDetailsPage
          .visit()
          .hasTitle()
          .hasContentPartnerName()
          .assertRating(2);
      });
  });
});
