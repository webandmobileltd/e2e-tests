import { BackofficePage } from '../page_objects/backoffice/BackofficePage';

context('Backoffice test', () => {
  const backoffice = new BackofficePage();

  it('should go to collections page and create a collection', () => {
    backoffice
      .visit()
      .logIn()
      .gotToOrdersPage()
      .selectOrderFromOrdersTable()
      .editRowInOrdersTable()
      .editOrder()
      .validateOrder();
  });
});
