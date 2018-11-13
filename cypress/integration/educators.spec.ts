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
            // .search(invalidSearchQuery)
            // .enterEmail(email)
            // .search(validSearchQuery)
            // .showsVideo(videos => {
            //         let minimumAcceptableNumberOfVideos = 2;
            //         expect(videos.length).to.be.greaterThan(minimumAcceptableNumberOfVideos,
            //             `There are less than ${minimumAcceptableNumberOfVideos}`)
            //     }
            // )
            // .copyFirstLink()
            // .visitCopiedLink()
            // .playVideo()
    })
});

