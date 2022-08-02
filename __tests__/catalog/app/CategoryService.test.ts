import CategoryService from '../../../src/catalog/app/CategoryService';
import { fakeCategories } from '../../fakes';
import RepositoryStub from '../../mocks/CategoryRepositoryStub';
import generateIDMock from '../../mocks/generateIDMock';

describe('CategoryService.getAllCategories', () => {
  it('returns all categories', async () => {
    expect.assertions(2);

    const repositoryStub = new RepositoryStub();
    const getAllCategoriesSpy = jest.spyOn(repositoryStub, 'getAllCategories');

    const categoryService = new CategoryService(repositoryStub, generateIDMock);
    const categories = await categoryService.getAllCategories();

    expect(categories).toHaveLength(fakeCategories.length);
    expect(getAllCategoriesSpy).toHaveBeenCalled();
  });
});
