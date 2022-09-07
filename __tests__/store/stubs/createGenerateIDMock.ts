import { faker } from '@faker-js/faker';
import IGenerateID from '@shared/utils/IGenerateID';

function createGenerateIDMock(items: any[] = []): IGenerateID {
  return jest.fn(() => (items.length ? `test_id_${items.length + 1}` : faker.datatype.uuid()));
}

export default createGenerateIDMock;
