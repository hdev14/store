import { PrismaClient, Product as PrismaProduct, Category as PrismaCategory } from '@prisma/client';
import Prisma from '../../../shared/Prisma';
import Category from '../../domain/Category';
import Dimensions from '../../domain/Dimensions';
import IProductRepository from '../../domain/IProductRepository';
import Product from '../../domain/Product';

export default class PrismaProductRepository implements IProductRepository {
  private connection: PrismaClient;

  constructor() {
    this.connection = Prisma.connect();
  }

  async getAllProducts(): Promise<Product[]> {
    const products = await this.connection.product.findMany({
      include: { category: true },
    });

    return products.map(this.mapProduct.bind(this));
  }

  async getProductById(id: string): Promise<Product | null> {
    const product = await this.connection.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (product) {
      return this.mapProduct(product);
    }

    return null;
  }

  async getProductByCategory(category: Category): Promise<Product | null> {
    const product = await this.connection.product.findFirst({
      where: { categoryId: category.id },
      include: { category: true },
    });

    if (product) {
      return this.mapProduct(product);
    }

    return null;
  }

  async getAllCategories(): Promise<Category[]> {
    const categories = await this.connection.category.findMany();

    return categories.map(this.mapCategory.bind(this));
  }

  async addProduct(product: Product): Promise<void> {
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
    });
  }

  async updateProduct(product: Product): Promise<void> {
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
    });
  }

  async addCategory(category: Category): Promise<void> {
    await this.connection.category.create({
      data: {
        id: category.id,
        name: category.name,
        code: category.code,
      },
    });
  }

  async updateCategory(category: Category): Promise<void> {
    await this.connection.category.update({
      where: { id: category.id },
      data: {
        name: category.name,
        code: category.code,
      },
    });
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
