import uuid = require('uuid');
import { BackofficePage } from '../page_objects/backoffice/BackofficePage';

context('Backoffice', () => {
  const backoffice = new BackofficePage();

  it('should log in and view content partner page', () => {
    backoffice
      .visit()
      .logIn()
      .goToContentPartnerPage()
      .contentPartnerTableHasData();
  });

  it('should import an order CSV and set its currency', () => {
    backoffice
      .visit()
      .logIn()
      .goToOrdersPage()
      .importOrderCSV()
      .loadOrderById('129')
      .updateOrderCurrency()
      .updateOrderItemDuration('17 Years')
      .updateOrderItemTerritory('World Wide');
  });

  it('should import a job CSV and make sure the video ingestor picks it up', () => {
    backoffice
      .visit()
      .logIn()
      .goToIngestsPage()
      .importJobCSV()
      .jobsTableHasData()
      .goToFirstJobDetails()
      .videosTableHasVideo();
  });

  it('should export a manifest', () => {
    backoffice
      .visit()
      .logIn()
      .goToOrdersPage()
      .exportOrderCSV();
  });

  it('should create a content partner', () => {
    const contentPartnerName = uuid.v4();
    backoffice
      .visit()
      .logIn()
      .goToContentPartnerPage()
      .createContentPartner()
      .setContentPartnerName(contentPartnerName)
      .setContentPartnerDistributionMethods('STREAM')
      .setMarketingFiles()
      .submitContentPartner()
      .filterByContentPartner(contentPartnerName)
      .editFirstAndOnlyContentPartner();
  });

  it('should go to collections page and create a collection', () => {
    backoffice
      .visit()
      .logIn()
      .goToCollectionsPage();
  });

  it('should go to collections page and create a collection', () => {
    backoffice
      .visit()
      .logIn()
      .goToCollectionsPage()
      .openCollectionsModal()
      .fillCollectionDetails()
      .saveCollection()
      .findCreatedCollection();
  });

  it('should go to collections page and create a collection', () => {
    backoffice
      .visit()
      .logIn()
      .goToVideoPage()
      .findVideo()
      .goToEditPage()
      .editVideo()
      .validateVideoChange();
  });
});
