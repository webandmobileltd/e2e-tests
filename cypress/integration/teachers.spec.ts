import { TeachersHomepage } from "../page_objects/teachers/TeachersHomepage";
import { TeachersVideoDetailsPage } from "../page_objects/teachers/TeachersVideoDetailsPage";

context("Teachers", () => {
  const validSearchQuery = "Ted";
  const invalidSearchQuery = "asdfghjklkjhgf";
  const nonEducationalSearchQuery = "Celebrities on the red carpet";
  const email = "test@test.com";

  it("search journey", () => {
    const homepage = new TeachersHomepage();
    homepage
      .visit()
      .createAccount()
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
  });

  it("shows only educational videos", () => {
    const homepage = new TeachersHomepage();
    homepage
      .visit()
      .logIn()
      .search(nonEducationalSearchQuery)
      .noVideosShown();
  });

  it("video details", () => {
    const videoDetailsPage = new TeachersVideoDetailsPage("535");
    videoDetailsPage
      .visit()
      .showsTitle("Richard St. John: 8 secrets of success")
      .showsContentPartnerName("TeD")
      .showsSubject("Maths");
  });

  it("seperating news journey", () => {
    const homepage = new TeachersHomepage();

    const newsQuery = "news";

    homepage
      .visit()
      .logIn()
      .search(newsQuery)
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
