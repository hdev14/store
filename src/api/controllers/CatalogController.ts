import ICategoryService from '@catalog/app/ICategoryService';
import IProductService from '@catalog/app/IProductService';
import { NextFunction, Request, Response } from 'express';

export default class CatalogController {
  private productService: IProductService;

  private categoryService: ICategoryService;

  constructor(productService: IProductService, categoryService: ICategoryService) {
    this.productService = productService;
    this.categoryService = categoryService;
  }

  async getProductById(request: Request, response: Response, next: NextFunction) {
    console.info(request, response, next);
    response.status(200).json({ messages: 'hello' });
  }

  async getAllProducts(request: Request, response: Response, next: NextFunction) {
    console.info(request, response, next);
    response.status(200).json({ messages: 'hello' });
  }

  async getProductsByCategory(request: Request, response: Response, next: NextFunction) {
    console.info(request, response, next);
    response.status(200).json({ messages: 'hello' });
  }

  async createProduct(request: Request, response: Response, next: NextFunction) {
    console.info(request, response, next);
    response.status(200).json({ messages: 'hello' });
  }

  async updateProduct(request: Request, response: Response, next: NextFunction) {
    console.info(request, response, next);
    response.status(200).json({ messages: 'hello' });
  }

  async updateProductStock(request: Request, response: Response, next: NextFunction) {
    console.info(request, response, next);
    response.status(200).json({ messages: 'hello' });
  }

  async getAllCategories(request: Request, response: Response, next: NextFunction) {
    console.info(request, response, next);
    response.status(200).json({ messages: 'hello' });
  }

  async createCategory(request: Request, response: Response, next: NextFunction) {
    console.info(request, response, next);
    response.status(200).json({ messages: 'hello' });
  }

  async updateCategory(request: Request, response: Response, next: NextFunction) {
    console.info(request, response, next);
    response.status(200).json({ messages: 'hello' });
  }
}