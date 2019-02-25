import { v4 as uuid } from "uuid";
import { CollectionPage } from "../page_objects/teachers/CollectionPage";
import { TeachersHomepage } from "../page_objects/teachers/TeachersHomepage";
import { TeachersVideoDetailsPage } from "../page_objects/teachers/TeachersVideoDetailsPage";
import ViewPort from "../page_objects/types/ViewPort";
import { CollectionsPage } from "../page_objects/teachers/CollectionsPage";

context("Teachers", () => {
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

  specify("search journey", () => {
    const email = "test@test.com";
    const homepage = new TeachersHomepage();
    const invalidSearchQuery = "asdfghjklkjhgf";

    homepage
      .visit()
      .logIn(username, password)
      .search(invalidSearchQuery)
      .enterEmail(email)
      .searchWithAutocomplete("ted", "TED Talks")
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
    const nonEducationalSearchQuery = "Celebrities on the red carpet";
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
    specify(`separating news journey for: ${
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
    specify(`collections journey for: ${
      size.isMobile ? "mobile" : "desktop"
    } view`, () => {
      const collectionTitle = uuid();
      const validSearchQuery = "TED Talks";

      cy.viewport(size.width, size.height);

      new TeachersHomepage()
        .visit()
        .logIn(username, password)
        .search(validSearchQuery)
        .createCollectionFromVideo(0, collectionTitle)
        .itShowsNotification("has been created")
        .isVideoInCollection(0, collectionTitle)
        .addVideoToCollection(1, collectionTitle)
        .itShowsNotification("saved to your video collection")
        .isVideoInCollection(1, collectionTitle)
        .reload()
        .removeVideoFromCollection(1, collectionTitle)
        .goToCollections(!size.isMobile);

      new CollectionsPage()
        // Can check that whenever we clean after ourselves - delete collection
        // .inspectCollections(collections => expect(collections).to.have.length(1))
        .goToCollectionDetails(collectionTitle);

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
