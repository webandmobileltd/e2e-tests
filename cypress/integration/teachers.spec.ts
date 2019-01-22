import { TeachersHomepage } from "../page_objects/teachers/TeachersHomepage";
import { TeachersVideoDetailsPage } from "../page_objects/teachers/TeachersVideoDetailsPage";
import { v4 as uuid } from "uuid";

context("Teachers", () => {
  const validSearchQuery = "Ted";
  const invalidSearchQuery = "asdfghjklkjhgf";
  const nonEducationalSearchQuery = "Celebrities on the red carpet";
  const email = "test@test.com";

  const username = `${uuid()}@boclips.com`;
  const password = uuid();

  before(function() {
    new TeachersHomepage()
      .visit()
      .createAccount(username, password)
      .logOut();
  });

  afterEach(function() {
    new TeachersHomepage().visit().logOut();
  });

  it("search journey", () => {
    const homepage = new TeachersHomepage();
    homepage
      .visit()
      .logIn(username, password)
      .search(invalidSearchQuery)
      .enterEmail(email)
      .search(validSearchQuery)
      .inspectResults(videos => {
        expect(videos.length).to.be.greaterThan(
          0,
          `There are no videos showing`
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
        const parts = pathname.split("/");
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
          .hasContentPartnerName()
      });
  });

  it("shows only educational videos", () => {
    const homepage = new TeachersHomepage();
    homepage
      .visit()
      .logIn(username, password)
      .search(nonEducationalSearchQuery)
      .noVideosShown();
  });

  it("seperating news journey", () => {
    const homepage = new TeachersHomepage();

    const queryWithNewsAndNonNews = "richard";

    homepage
      .visit()
      .logIn(username, password)
      .search(queryWithNewsAndNonNews)
      .inspectResults(videos => {
        expect(videos.length).to.be.greaterThan(
          0,
          `There are no videos showing`
        );
      })
      .goToNewsPage()
      .inspectResults(videos => {
        expect(videos.length).to.be.greaterThan(
          0,
          `There are no videos showing`
        );
      })
      .goBackToMainSearchPage()
      .inspectResults(videos => {
        expect(videos.length).to.be.greaterThan(
          0,
          `There are no videos showing`
        );
      });
  });

  it('collections journey', () => {
    const homepage = new TeachersHomepage();
    homepage.visit()
      .logIn(username, password)
      .search(validSearchQuery)
      .addVideoToDefaultCollection(0).isInDefaultCollection(0)
      .addVideoToDefaultCollection(1).isInDefaultCollection(1)
      .reload()
      .removeVideoFromDefaultCollection(1)
  });
});
