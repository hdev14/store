/* eslint-disable no-use-before-define */
import CategoryService from '@catalog/app/CategoryService';
import ProductService from '@catalog/app/ProductService';
import StockService from '@catalog/domain/StockService';
import PrismaProductRepository from '@catalog/infra/persistence/PrismaProductRepository';
import generateUUID from '@shared/utils/generateUUID';
import CatalogController from '../controllers/CatalogController';

// factory method & singleton
export default class CatalogControllerFactory {
  private static instance: CatalogControllerFactory;

  protected catalogController: CatalogController;

  protected constructor() {
    const productRepository = new PrismaProductRepository();
    const stockService = new StockService(productRepository);
    const productService = new ProductService(productRepository, generateUUID, stockService);
    const categoryService = new CategoryService(productRepository, generateUUID);
    this.catalogController = new CatalogController(productService, categoryService);
  }

  static create() {
    if (CatalogControllerFactory.instance) {
      return CatalogControllerFactory.instance.catalogController;
    }

    const factory = new CatalogControllerFactory();

    CatalogControllerFactory.instance = factory;

    return factory.catalogController;
  }
}
