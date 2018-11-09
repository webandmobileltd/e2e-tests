import {By} from "../../support/By";
import MarketingCollectionVideo from "../marketing/domain/MarketingCollectionVideo";
import EducatorsVideo from "./domain/EducatorsVideo";

export class EducatorsHomepage {
    private readonly url: string;

    constructor() {
        this.url = Cypress.env("EDUCATORS_BASE_URL");
    }

    public visit() {
        cy.visit(this.url);
        return this;
    }

    public logIn() {
        cy.get("#username").type(Cypress.env("EDUCATORS_USERNAME"));
        cy.get("#password").type(Cypress.env("EDUCATORS_PASSWORD"));
        cy.get("#kc-form-login").submit();
        return this;
    }

    public search(searchQuery: string) {
        cy.get(By.dataQa("search-input"))
            .clear()
            .type(searchQuery)
            .type('{enter}');
        return this;
    }

    public showsVideo(callback: (videos: EducatorsVideo[]) => void) {
        const videos: EducatorsVideo[] = [];
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

    enterEmail(email: string) {
        cy.get(By.dataQa("email-address"))
            .clear()
            .type(email);
        return this;
    }

    submitForm() {
        cy.get(By.dataQa("no-results-submit"))
            .click();
        return this;
    }

    copyLink() {
        cy.get(By.dataQa("copy-link"))
            .click();
        return this;
    }

    visitCopiedLink() {
        return this;
    }
}
