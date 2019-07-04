import { By } from '../../support/By';
import { TeacherPage } from './index';

export class DiscoverPage extends TeacherPage {
  public hasCollectionTitle(title: string) {
    cy.get(By.dataQa('collection-title'))
      .contains(title)
      .should('be.visible');
    return this;
  }
}
