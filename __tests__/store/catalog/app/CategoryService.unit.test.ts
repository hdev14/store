import CategoryNotFoundError from '@catalog/app/CategoryNotFoundError';
import CategoryService from '@catalog/app/CategoryService';
import { CreateCategoryParams } from '@catalog/app/ICategoryService';
import { fakeCategories } from '@tests/store/fakes';
import RepositoryStub from '@tests/store/stubs/CategoryRepositoryStub';
import createGenerateIDMock from '@tests/store/stubs/createGenerateIDMock';

describe('CategoryService.getAllCategories', () => {
  describe('CategoryService.getAllCategories()', () => {
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

  describe('CategoryService.createCategory()', () => {
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

  describe('CategoryService.updateCategory()', () => {
    it('updates a specific category', async () => {
      expect.assertions(4);

      const repositoryStub = new RepositoryStub();
      const getCategoryByIdSpy = jest.spyOn(repositoryStub, 'getCategoryById');
      const updateCategorySpy = jest.spyOn(repositoryStub, 'updateCategory');

      const categoryService = new CategoryService(
        repositoryStub,
        createGenerateIDMock(fakeCategories),
      );

      const category = await categoryService.updateCategory(fakeCategories[1].id, {
        name: 'test_category_updated',
      });

      expect(category.name).toEqual('test_category_updated');
      expect(fakeCategories[1].name).toEqual('test_category_updated');
      expect(getCategoryByIdSpy).toHaveBeenCalledWith(fakeCategories[1].id);
      expect(updateCategorySpy).toHaveBeenCalled();
    });

    it('throws an exception of type CategoryNotFoundError if repository.getCategoryById returns null', async () => {
      expect.assertions(1);

      const repositoryStub = new RepositoryStub();

      const categoryService = new CategoryService(
        repositoryStub,
        createGenerateIDMock(fakeCategories),
      );

      try {
        await categoryService.updateCategory('wrong_id', {
          name: 'test_category_updated',
        });
      } catch (e) {
        expect(e).toBeInstanceOf(CategoryNotFoundError);
      }
    });
  });
});
