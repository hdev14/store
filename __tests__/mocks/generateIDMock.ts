import IGenerateID from '../../src/catalog/app/IGenerateID';
import { fakeProducts } from '../fakes';

const generateIDMock: IGenerateID = jest.fn(() => `test_product_id_${fakeProducts.length + 1}`);

export default generateIDMock;
