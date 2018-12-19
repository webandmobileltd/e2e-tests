import { By } from '../../support/By';

export class EducatorsVideoDetailsPage {

  private readonly url: string;

  constructor(id: string) {
    this.url = Cypress.env('EDUCATORS_BASE_URL') + '/videos/' + id;
  }

  public visit() {
    cy.visit(this.url);
    return this;
  }

  public showsTitle(title: string) {
    cy.get(By.dataQa('video-details-title')).should("have.text", title);
    return this;
  }

  public showsSubject(subject: string) {
    cy.get(By.dataQa('video-details-subject')).should("have.text", subject);
    return this;
  }


}
