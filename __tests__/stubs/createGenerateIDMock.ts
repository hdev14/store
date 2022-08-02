import IGenerateID from '../../src/catalog/app/IGenerateID';

function createGenerateIDMock(items: any): IGenerateID {
  return jest.fn(() => `test_product_id_${items.length + 1}`);
}

export default createGenerateIDMock;
