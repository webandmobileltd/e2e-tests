import Video from "../domain/Video";
import {By} from "../../support/By";

export class Homepage {
    private readonly url: string;

    constructor() {
        this.url = Cypress.env("FRONTEND_BASE_URL");
    }

    public visit() {
        cy.visit(this.url);
        return this;
    }

    public logIn() {
        cy.get("#login-button").click();
        cy.wait(500);
        cy.get("#username").type(Cypress.env("FRONTEND_USERNAME"));
        cy.get("#password").type(Cypress.env("FRONTEND_PASSWORD"));
        cy.get("#form-login").contains("submit").submit();
        return this;
    }

    public search(searchQuery: string) {
        cy.get(By.dataQa("search-input"))
            .clear()
            .type(searchQuery)
            .type('{enter}');
        return this;
    }

    public showsVideo(callback: (videos: Video[]) => void) {
        const videos: Video[] = [];
        cy.get(By.dataQa("search-result"))
            .then(videoCards =>
                videoCards.each((idx, el: HTMLElement) => {
                    videos.push({
                        title: el.querySelector(By.dataQa("video-title"))!.textContent!,
                        description: el.querySelector(By.dataQa("video-description"))!
                            .textContent!
                    });
                })
            )
            .then(() => callback(videos));
        return this;
    }

}
