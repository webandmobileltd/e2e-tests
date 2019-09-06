import { BackofficePage } from '../page_objects/backoffice/BackofficePage';

context('Backoffice', () => {
  it('simple loging journey', () => {
    const backoffice = new BackofficePage();
    backoffice
      .visit()
      .logIn()
      .goToContentPartnerPage()
      .contentPartnerTableHasData();
  });
});
