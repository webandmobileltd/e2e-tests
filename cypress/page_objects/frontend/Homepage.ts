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
        cy.wait(100);
        cy.get(By.dataQa("login-button")).click();
        cy.get(By.dataQa("username")).type(Cypress.env("FRONTEND_USERNAME"));
        cy.get(By.dataQa("password")).type(Cypress.env("FRONTEND_PASSWORD"));
        cy.get(By.dataQa("form-login")).click();
        return this;
    }

    public search(searchQuery: string) {
        cy.wait(5000);
        cy.get(By.dataQa("search-input"))
            .first()
            .clear()
            .type(searchQuery)
            .type('{enter}');
        return this;
    }

    public showsVideo(callback: (videos: Video[]) => void) {
        const videos: Video[] = [];
        cy.get(By.dataQa("video-thumbnail"))
            .then(videoCards =>
                videoCards.each((idx, el: HTMLElement) => {
                    videos.push({
                        title: el.querySelector(By.dataQa("video-title"))!.textContent!,
                    });
                })
            )
            .then(() => callback(videos));
        return this;
    }

    public clickOnFirstVideo() {
        cy.get(By.dataQa("video-thumbnail"))
            .first()
            .click();
        return this;
    }

    public sourceNameIsCorrectOnVideoDetailsPage(source: string) {
        cy.get(".status-get--content").contains(source);
        return this;
    }

    private checkPersistanceOfSelectedFilter(previousCheckedFilterIndex: number, dataQaQuery: string) {
        cy.get(By.dataQa(dataQaQuery))
            .find("input").eq(previousCheckedFilterIndex)
            .should("be.checked");
    }

    private getListOfFilterValuesForFilterContainer(dataQaQuery: string) {
        return cy.get(By.dataQa(dataQaQuery))
            .find(By.dataQa("filter-value"));
    }

    public findEachFilter(dataQaQuery: string, callback: (filterItem: JQuery<HTMLElement>, index: number) => void) {
        this.getListOfFilterValuesForFilterContainer(dataQaQuery)
            .each((filterItem: JQuery<HTMLElement>, index: number) => callback(filterItem, index));
        return this
    }

    public filterByEachSource() {
        const dataQaQuery = "source-filter-container";
        this.findEachFilter(dataQaQuery, (sourceFilterItem: JQuery<HTMLElement>, index: number) => {
            this.getListOfFilterValuesForFilterContainer(dataQaQuery).eq(index).click();

            cy.wait(1000);
            this.clickOnFirstVideo();
            cy.wait(2000);
            this.sourceNameIsCorrectOnVideoDetailsPage(sourceFilterItem.text());
            cy.go("back");
            cy.wait(2000);
            this.checkPersistanceOfSelectedFilter(index, dataQaQuery);
            this.getListOfFilterValuesForFilterContainer(dataQaQuery).eq(index).click();
        });
        return this;
    }

    public filterByEachDuration() {
        const dataQaQuery = "durationsecs-filter-container";
        this.findEachFilter(dataQaQuery, (durationFilterItem: JQuery<HTMLElement>, index: number) => {
            this.getListOfFilterValuesForFilterContainer(dataQaQuery).eq(index).click();

            cy.wait(1000);
            this.clickOnFirstVideo();
            cy.wait(2000);
            cy.go("back")
            cy.wait(2000);

            this.checkPersistanceOfSelectedFilter(index, dataQaQuery);
            this.getListOfFilterValuesForFilterContainer(dataQaQuery).eq(index).click();

        });
        return this;
    }
}
