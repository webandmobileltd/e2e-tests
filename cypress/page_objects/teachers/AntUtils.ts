export function acceptDialog() {
  cy.get('.ant-modal-confirm-btns .ant-btn-primary').click();
}
