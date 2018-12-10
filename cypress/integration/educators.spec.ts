import {EducatorsHomepage} from "../page_objects/educators/EducatorsHomepage";

context('Educators', () => {
    const validSearchQuery = "Ted";
    const invalidSearchQuery = "asdfghjklkjhgf";
    const email = "test@test.com";

    it('educators journey', () => {
        const educatorsHomepage = new EducatorsHomepage();
        educatorsHomepage
            .visit()
            .logIn()
            .search(invalidSearchQuery)
            .enterEmail(email)
            .search(validSearchQuery)
            .showsVideo(videos => {
                expect(videos.length).to.be.greaterThan(0,
                    `There are no videos showing`)
                }
            )
            .isOnPage(1)
            .goToNextPage()
            .isOnPage(2)
            .goToPreviousPage()
            .isOnPage(1)
            .goToFirstVideo()
    })
});

