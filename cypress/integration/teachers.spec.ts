import { TeachersHomepage } from "../page_objects/teachers/TeachersHomepage";
import { TeachersVideoDetailsPage } from "../page_objects/teachers/TeachersVideoDetailsPage";

context("Teachers", () => {
  const validSearchQuery = "Ted";
  const invalidSearchQuery = "asdfghjklkjhgf";
  const nonEducationalSearchQuery = "Celebrities on the red carpet";
  const email = "test@test.com";

  before(function() {
    new TeachersHomepage().visit().createAccount();
  });

  it("search journey", () => {
    const homepage = new TeachersHomepage();
    homepage
      .visit()
      .logIn()
      .search(invalidSearchQuery)
      .enterEmail(email)
      .search(validSearchQuery)
      .showsVideo(videos => {
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
          .showsTitle("Michael Shermer: Why people believe weird things")
          .showsContentPartnerName("TeD")
          .showsSubject("Maths");
      });
  });

  it("shows only educational videos", () => {
    const homepage = new TeachersHomepage();
    homepage
      .visit()
      .logIn()
      .search(nonEducationalSearchQuery)
      .noVideosShown();
  });

  it("seperating news journey", () => {
    const homepage = new TeachersHomepage();

    const queryWithNewsAndNonNews = "richard";

    homepage
      .visit()
      .logIn()
      .search(queryWithNewsAndNonNews)
      .showsVideo(videos => {
        expect(videos.length).to.be.greaterThan(
          0,
          `There are no videos showing`
        );
      })
      .goToNewsPage()
      .showsVideo(videos => {
        expect(videos.length).to.be.greaterThan(
          0,
          `There are no videos showing`
        );
      })
      .goBackToMainSearchPage()
      .showsVideo(videos => {
        expect(videos.length).to.be.greaterThan(
          0,
          `There are no videos showing`
        );
      });
  });
});
