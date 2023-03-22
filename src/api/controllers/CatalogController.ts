import HttpStatusCodes from '@api/HttpStatusCodes';
import CategoryNotFoundError from '@catalog/app/CategoryNotFoundError';
import ICategoryService from '@catalog/app/ICategoryService';
import IProductService from '@catalog/app/IProductService';
import ProductNotFoundError from '@catalog/app/ProductNotFoundError';
import StockError from '@catalog/app/StockError';
import ValidationError from '@shared/errors/ValidationError';
import { NextFunction, Request, Response } from 'express';

export default class CatalogController {
  constructor(
    private readonly productService: IProductService,
    private readonly categoryService: ICategoryService,
  ) { }

  public async getProductById(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;

      const product = await this.productService.getProductById(id);

      return response.status(HttpStatusCodes.OK).json(product);
    } catch (e) {
      if (e instanceof ProductNotFoundError) {
        return response.status(HttpStatusCodes.NOT_FOUND).json({ message: e.message });
      }

      return next(e);
    }
  }

  public async getAllProducts(_: Request, response: Response, next: NextFunction) {
    try {
      const products = await this.productService.getAllProducts();

      return response.status(HttpStatusCodes.OK).json({ results: products });
    } catch (e) {
      return next(e);
    }
  }

  public async getProductsByCategory(request: Request, response: Response, next: NextFunction) {
    try {
      const categoryId = request.params.id;

      const products = await this.productService.getProductsByCategory(categoryId);

      return response.status(HttpStatusCodes.OK).json({ results: products });
    } catch (e) {
      return next(e);
    }
  }

  public async createProduct(request: Request, response: Response, next: NextFunction) {
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

      return response.status(HttpStatusCodes.CREATED).json(product);
    } catch (e) {
      if (e instanceof CategoryNotFoundError) {
        return response.status(HttpStatusCodes.BAD_REQUEST).json({ message: e.message });
      }

      if (e instanceof ValidationError) {
        return response.status(HttpStatusCodes.BAD_REQUEST).json({ errors: e.errors });
      }

      return next(e);
    }
  }

  public async updateProduct(request: Request, response: Response, next: NextFunction) {
    try {
      const productId = request.params.id;
      const data = request.body;

      const product = await this.productService.updateProduct(productId, data);

      return response.status(HttpStatusCodes.OK).json(product);
    } catch (e) {
      if (e instanceof ProductNotFoundError) {
        return response.status(HttpStatusCodes.NOT_FOUND).json({ message: e.message });
      }

      return next(e);
    }
  }

  public async updateProductStock(request: Request, response: Response, next: NextFunction) {
    try {
      const productId = request.params.id;
      const { quantity } = request.body;

      await this.productService.updateProductStock(productId, quantity);

      return response.status(HttpStatusCodes.NO_CONTENT).json({});
    } catch (e) {
      if (e instanceof StockError) {
        return response.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).json({ message: e.message });
      }

      return next(e);
    }
  }

  public async getAllCategories(_: Request, response: Response, next: NextFunction) {
    try {
      const categories = await this.categoryService.getAllCategories();

      return response.status(HttpStatusCodes.OK).json({
        results: categories.map((c) => c),
      });
    } catch (e) {
      return next(e);
    }
  }

  public async createCategory(request: Request, response: Response, next: NextFunction) {
    try {
      const data = request.body;

      const category = await this.categoryService.createCategory(data);

      return response.status(HttpStatusCodes.CREATED).json(category);
    } catch (e) {
      if (e instanceof ValidationError) {
        return response.status(HttpStatusCodes.BAD_REQUEST).json({ errors: e.errors });
      }

      return next(e);
    }
  }

  public async updateCategory(request: Request, response: Response, next: NextFunction) {
    try {
      const categoryId = request.params.id;
      const data = request.body;

      const category = await this.categoryService.updateCategory(categoryId, data);

      return response.status(HttpStatusCodes.OK).json(category);
    } catch (e) {
      if (e instanceof ValidationError) {
        return response.status(HttpStatusCodes.BAD_REQUEST).json({ errors: e.errors });
      }

      if (e instanceof CategoryNotFoundError) {
        return response.status(HttpStatusCodes.NOT_FOUND).json({ message: e.message });
      }

      return next(e);
    }
  }
}
