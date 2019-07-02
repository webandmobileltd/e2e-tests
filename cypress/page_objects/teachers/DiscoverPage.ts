import { By } from '../../support/By';
import { TeachersPage } from './TeachersPage';

export class DiscoverPage extends TeachersPage {
  public hasCollectionTitle(title: string) {
    cy.get(By.dataQa('discover-collections-discipline-subjects'))
      .contains(title)
      .should('be.visible');
    return this;
  }
}
