import {Homepage} from "../page_objects/frontend/Homepage";

context('Frontend', () => {

    it('educators journey', () => {
        const homepage = new Homepage();
        const validSearchQuery = "Richard";
        homepage
            .visit()
            .logIn()
            .search(validSearchQuery)
            .showsVideo(videos => {
                    let minimumAcceptableNumberOfVideos = 1;
                    expect(videos.length).to.be.greaterThan(minimumAcceptableNumberOfVideos,
                        `There are less than ${minimumAcceptableNumberOfVideos}`)
                }
            )
            .filterByEachSource()
            .filterByEachDuration()
    })
});

