import { v4 as uuid } from "uuid";
import { CollectionPage } from "../page_objects/teachers/CollectionPage";
import { TeachersHomepage } from "../page_objects/teachers/TeachersHomepage";
import { TeachersVideoDetailsPage } from "../page_objects/teachers/TeachersVideoDetailsPage";
import ViewPort from "../page_objects/types/ViewPort";

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
    cy.viewport(1000, 660);
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
          .hasContentPartnerName();
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

  const sizes: ViewPort[] = [
    { height: 660, width: 1000, isMobile: false },
    { height: 667, width: 375, isMobile: true }
  ];

  sizes.forEach((size: ViewPort) => {
    it(`seperating news journey for: ${
      size.isMobile ? "mobile" : "desktop"
    } view`, () => {
      const homepage = new TeachersHomepage();

      const queryWithNewsAndNonNews = "richard";

      cy.viewport(size.width, size.height);

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
        .goToNewsPage(size.isMobile)
        .inspectResults(videos => {
          expect(videos.length).to.be.greaterThan(
            0,
            `There are no videos showing`
          );
        })
        .goBackToMainSearchPage(size.isMobile)
        .inspectResults(videos => {
          expect(videos.length).to.be.greaterThan(
            0,
            `There are no videos showing`
          );
        });
    });
  });

  sizes.forEach((size: ViewPort) => {
    it(`collections journey for: ${
      size.isMobile ? "mobile" : "desktop"
    } view`, () => {
      cy.viewport(size.width, size.height);

      new TeachersHomepage()
        .visit()
        .logIn(username, password)
        .search(validSearchQuery)
        .addVideoToDefaultCollection(0)
        .itShowsNotification("saved to your video collection")
        .isInDefaultCollection(0)
        .addVideoToDefaultCollection(1)
        .itShowsNotification("saved to your video collection")
        .isInDefaultCollection(1)
        .reload()
        .removeVideoFromDefaultCollection(1)
        .goToDefaultCollection(!size.isMobile);

      new CollectionPage()
        .inspectItems(videos => expect(videos).to.have.length(1))
        .reload()
        .inspectItems(videos => expect(videos).to.have.length(1))
        .removeVideo(0)
        .isEmpty()
        .reload()
        .isEmpty();
    });
  });
});
