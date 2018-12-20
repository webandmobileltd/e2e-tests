import {EducatorsHomepage} from "../page_objects/educators/EducatorsHomepage";
import { EducatorsVideoDetailsPage } from '../page_objects/educators/EducatorsVideoDetailsPage';

context('Educators', () => {
    const validSearchQuery = "Ted";
    const invalidSearchQuery = "asdfghjklkjhgf";
    const email = "test@test.com";

    it('search journey', () => {
        const homepage = new EducatorsHomepage();
        homepage
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
    });

    it('video details', () => {
        const videoDetailsPage = new EducatorsVideoDetailsPage('535');
        videoDetailsPage
            .visit()
            .showsTitle("Richard St. John: 8 secrets of success")
            .showsContentPartnerName("TeD")
            .showsSubject("Maths")
    });
});

