import { PrismaClient, Product as PrismaProduct, Category as PrismaCategory } from '@prisma/client';
import Category from '@catalog/domain/Category';
import Dimensions from '@catalog/domain/Dimensions';
import IProductRepository from '@catalog/domain/IProductRepository';
import Product from '@catalog/domain/Product';
import Prisma from '@shared/Prisma';
import RepositoryError from '@shared/errors/RepositoryError';

export default class PrismaProductRepository implements IProductRepository {
  private readonly connection: PrismaClient;

  constructor() {
    this.connection = Prisma.connect();
  }

  public async getAllProducts(): Promise<Product[]> {
    try {
      const products = await this.connection.product.findMany({
        include: { category: true },
      });

      return products.map(this.mapProduct.bind(this));
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async getProductById(id: string): Promise<Product | null> {
    try {
      const product = await this.connection.product.findUnique({
        where: { id },
        include: { category: true },
      });

      if (product) {
        return this.mapProduct(product);
      }

      return null;
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async getProductsByCategory(categoryId: string): Promise<Product[]> {
    try {
      const products = await this.connection.product.findMany({
        where: { categoryId },
        include: { category: true },
      });

      return products.map(this.mapProduct.bind(this));
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async getAllCategories(): Promise<Category[]> {
    try {
      const categories = await this.connection.category.findMany();

      return categories.map(this.mapCategory.bind(this));
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async addProduct(product: Product): Promise<void> {
    try {
      await this.connection.product.create({
        data: {
          id: product.id,
          name: product.name,
          active: product.active,
          amount: product.amount,
          description: product.description,
          image: product.image,
          stockQuantity: product.stockQuantity,
          height: product.dimensions.height,
          width: product.dimensions.width,
          depth: product.dimensions.depth,
          categoryId: product.category.id,
          createdAt: product.createdAt,
        },
        include: { category: true },
      });
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async getCategoryById(categoryId: string): Promise<Category | null> {
    try {
      const category = await this.connection.category.findUnique({
        where: { id: categoryId },
      });

      return category ? this.mapCategory(category) : null;
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async updateProduct(product: Product): Promise<void> {
    try {
      await this.connection.product.update({
        where: {
          id: product.id,
        },
        data: {
          name: product.name,
          active: product.active,
          amount: product.amount,
          description: product.description,
          image: product.image,
          stockQuantity: product.stockQuantity,
          height: product.dimensions.height,
          width: product.dimensions.width,
          depth: product.dimensions.depth,
          categoryId: product.category.id,
          createdAt: product.createdAt,
        },
        include: { category: true },
      });
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async addCategory(category: Category): Promise<void> {
    try {
      await this.connection.category.create({
        data: {
          id: category.id,
          name: category.name,
          code: category.code,
        },
      });
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  public async updateCategory(category: Category): Promise<void> {
    try {
      await this.connection.category.update({
        where: { id: category.id },
        data: {
          name: category.name,
          code: category.code,
        },
      });
    } catch (e: any) {
      throw new RepositoryError(this.constructor.name, e.message, {
        cause: e.stack,
      });
    }
  }

  private mapProduct(product: PrismaProduct & { category: PrismaCategory }): Product {
    return new Product({
      id: product.id,
      name: product.name,
      amount: product.amount,
      description: product.description,
      image: product.image,
      stockQuantity: product.stockQuantity,
      category: new Category({
        id: product.category.id,
        name: product.category.name,
        code: product.category.code,
      }),
      dimensions: new Dimensions({
        height: product.height,
        width: product.width,
        depth: product.depth,
      }),
      createdAt: product.createdAt,
    });
  }

  private mapCategory(category: PrismaCategory) {
    return new Category({
      id: category.id,
      name: category.name,
      code: category.code,
    });
  }
}
