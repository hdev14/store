import CategoryService from '../../../src/catalog/app/CategoryService';
import { CreateCategoryParams } from '../../../src/catalog/app/ICategoryService';
import { fakeCategories } from '../../fakes';
import RepositoryStub from '../../mocks/CategoryRepositoryStub';
import createGenerateIDMock from '../../mocks/createGenerateIDMock';

describe('CategoryService.getAllCategories', () => {
  describe('CategoryService.getAllCategories', () => {
    it('returns all categories', async () => {
      expect.assertions(2);

      const repositoryStub = new RepositoryStub();
      const getAllCategoriesSpy = jest.spyOn(repositoryStub, 'getAllCategories');

      const categoryService = new CategoryService(
        repositoryStub,
        createGenerateIDMock(fakeCategories),
      );
      const categories = await categoryService.getAllCategories();

      expect(categories).toHaveLength(fakeCategories.length);
      expect(getAllCategoriesSpy).toHaveBeenCalled();
    });
  });

  describe('CategoryService.createCategory', () => {
    it('creates a new category', async () => {
      expect.assertions(5);

      const repositoryStub = new RepositoryStub();
      const getAllCategoriesSpy = jest.spyOn(repositoryStub, 'getAllCategories');
      const addCategorySpy = jest.spyOn(repositoryStub, 'addCategory');
      const generateIDMock = createGenerateIDMock(fakeCategories);

      const categoryService = new CategoryService(repositoryStub, generateIDMock);

      const params: CreateCategoryParams = {
        name: 'test_category',
      };

      const category = await categoryService.createCategory(params);

      expect(category.id).toBeTruthy();
      expect(category.code).toBeTruthy();
      expect(generateIDMock).toHaveBeenCalled();
      expect(getAllCategoriesSpy).toHaveBeenCalled();
      expect(addCategorySpy).toHaveBeenCalled();
    });
  });
});
