import {Homepage} from "../page_objects/frontend/Homepage";

context('Frontend', () => {

    it('educators journey', () => {
        const homepage = new Homepage();
        const validSearchQuery = "Richard";
        homepage
            .visit()
            .logIn()
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

