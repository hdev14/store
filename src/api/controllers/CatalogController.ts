import CategoryNotFoundError from '@catalog/app/CategoryNotFoundError';
import ICategoryService from '@catalog/app/ICategoryService';
import IProductService from '@catalog/app/IProductService';
import ProductNotFoundError from '@catalog/app/ProductNotFoundError';
import StockError from '@catalog/app/StockError';
import ValidationEntityError from '@shared/errors/ValidationEntityError';
import { NextFunction, Request, Response } from 'express';

export default class CatalogController {
  private productService: IProductService;

  private categoryService: ICategoryService;

  constructor(productService: IProductService, categoryService: ICategoryService) {
    this.productService = productService;
    this.categoryService = categoryService;
  }

  async getProductById(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;

      const product = await this.productService.getProductById(id);

      return response.status(200).json({ product });
    } catch (e) {
      return next(e);
    }
  }

  async getAllProducts(_: Request, response: Response, next: NextFunction) {
    try {
      const products = await this.productService.getAllProducts();

      return response.status(200).json({ results: products });
    } catch (e) {
      return next(e);
    }
  }

  async getProductsByCategory(request: Request, response: Response, next: NextFunction) {
    try {
      const categoryId = request.params.id;

      const products = await this.productService.getProductsByCategory(categoryId);

      return response.status(200).json({ results: products });
    } catch (e) {
      return next(e);
    }
  }

  async createProduct(request: Request, response: Response, next: NextFunction) {
    try {
      const {
        height,
        width,
        depth,
        ...rest
      } = request.body;

      const product = await this.productService.createProduct({
        ...rest,
        dimensions: {
          height,
          width,
          depth,
        },
      });

      return response.status(201).json(product);
    } catch (e) {
      if (e instanceof CategoryNotFoundError) {
        return response.status(400).json({ message: e.message });
      }

      if (e instanceof ValidationEntityError) {
        return response.status(400).json({ errors: e.errors });
      }

      return next(e);
    }
  }

  async updateProduct(request: Request, response: Response, next: NextFunction) {
    try {
      const productId = request.params.id;
      const data = request.body;

      const product = await this.productService.updateProduct(productId, data);

      return response.status(200).json(product);
    } catch (e) {
      if (e instanceof ProductNotFoundError) {
        return response.status(404).json({ message: e.message });
      }
      return next(e);
    }
  }

  async updateProductStock(request: Request, response: Response, next: NextFunction) {
    try {
      const productId = request.params.id;
      const { quantity } = request.body;

      await this.productService.updateProductStock(productId, quantity);

      return response.status(204).json({});
    } catch (e) {
      if (e instanceof StockError) {
        return response.status(422).json({ message: e.message });
      }

      return next(e);
    }
  }

  async getAllCategories(_: Request, response: Response, next: NextFunction) {
    try {
      const categories = await this.categoryService.getAllCategories();

      return response.status(200).json({ results: categories });
    } catch (e) {
      return next(e);
    }
  }

  async createCategory(request: Request, response: Response, next: NextFunction) {
    try {
      const data = request.body;

      const category = await this.categoryService.createCategory(data);

      return response.status(201).json(category);
    } catch (e) {
      return next(e);
    }
  }

  async updateCategory(request: Request, response: Response, next: NextFunction) {
    console.info(request, response, next);
    response.status(200).json({ messages: 'hello' });
  }
}
