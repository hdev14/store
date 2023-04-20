import CategoryNotFoundError from '@catalog/app/CategoryNotFoundError';
import CategoryService from '@catalog/app/CategoryService';
import { CreateCategoryParams } from '@catalog/app/ICategoryService';
import { fakeCategories } from '@tests/store/fakes';
import repositoryStub from '@tests/store/stubs/CategoryRepositoryStub';

describe('CategoryService.getAllCategories', () => {
  describe('CategoryService.getAllCategories()', () => {
    it('returns all categories', async () => {
      expect.assertions(2);

      const getAllCategoriesSpy = jest.spyOn(repositoryStub, 'getAllCategories');

      const categoryService = new CategoryService(
        repositoryStub,
      );
      const categories = await categoryService.getAllCategories();

      expect(categories).toHaveLength(fakeCategories.length);
      expect(getAllCategoriesSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('CategoryService.createCategory()', () => {
    it('creates a new category', async () => {
      expect.assertions(4);

      const countCategoriesSpy = jest.spyOn(repositoryStub, 'countCategories');
      const addCategorySpy = jest.spyOn(repositoryStub, 'addCategory');

      const categoryService = new CategoryService(repositoryStub);

      const params: CreateCategoryParams = {
        name: 'test_category',
      };

      const category = await categoryService.createCategory(params);

      expect(category.id).toBeTruthy();
      expect(category.code).toBeTruthy();
      expect(countCategoriesSpy).toHaveBeenCalledTimes(1);
      expect(addCategorySpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('CategoryService.updateCategory()', () => {
    it('updates a specific category', async () => {
      expect.assertions(4);

      const getCategoryByIdSpy = jest.spyOn(repositoryStub, 'getCategoryById');
      const updateCategorySpy = jest.spyOn(repositoryStub, 'updateCategory');

      const categoryService = new CategoryService(repositoryStub);

      const category = await categoryService.updateCategory(fakeCategories[1].id, {
        name: 'test_category_updated',
      });

      expect(category.name).toEqual('test_category_updated');
      expect(fakeCategories[1].name).toEqual('test_category_updated');
      expect(getCategoryByIdSpy).toHaveBeenCalledWith(fakeCategories[1].id);
      expect(updateCategorySpy).toHaveBeenCalledTimes(1);
    });

    it('throws an exception of type CategoryNotFoundError if repository.getCategoryById returns null', () => {
      expect.assertions(1);

      const categoryService = new CategoryService(repositoryStub);

      return categoryService.updateCategory('wrong_id', { name: 'test_category_updated' }).catch((e) => {
        expect(e).toBeInstanceOf(CategoryNotFoundError);
      });
    });
  });
});
