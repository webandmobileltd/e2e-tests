import { By } from "../../support/By";

export class TeachersVideoDetailsPage {
  private readonly url: string;

  constructor(id: string) {
    this.url = Cypress.env("TEACHERS_BASE_URL") + "/videos/" + id;
  }

  public visit() {
    cy.visit(this.url);
    return this;
  }

  public hasTitle() {
    cy.get(By.dataQa("video-title")).should("not.be.empty");
    return this;
  }

  public hasContentPartnerName() {
    cy.get(By.dataQa("video-content-partner")).should("not.be.empty");
    return this;
  }

  public showsTitle(title: string) {
    cy.get(By.dataQa("video-title")).should("have.text", title);
    return this;
  }

  public showsContentPartnerName(contentPartnerName: string) {
    cy.get(By.dataQa("video-content-partner")).should(
      "have.text",
      contentPartnerName
    );
    return this;
  }

  public showsSubject(subject: string) {
    cy.get(By.dataQa("video-subject")).should("have.text", subject);
    return this;
  }
}
