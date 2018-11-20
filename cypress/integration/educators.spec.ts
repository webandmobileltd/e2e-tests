import {EducatorsHomepage} from "../page_objects/educators/EducatorsHomepage";

context('Educators', () => {
    const validSearchQuery = "Richard";
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
            .copyFirstLink()
            .visitCopiedLink()
            .playVideo()
    })
});

