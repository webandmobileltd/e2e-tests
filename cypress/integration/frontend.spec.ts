import {Homepage} from "../page_objects/frontend/Homepage";

context('Frontend', () => {

    it('teachers journey', () => {
        const homepage = new Homepage();
        const validSearchQuery = "Richard";
        homepage
            .visit()
            .logIn()
            .assertHubspotChat()
            .assertSuccessfulLogIn()
            .search(validSearchQuery)
            .showsVideo(videos => {
                    expect(videos.length).to.be.greaterThan(0,
                        `There are no videos showing`)
                }
            )
            .filterByEachSource()
            .filterByEachDuration()
    })
});

