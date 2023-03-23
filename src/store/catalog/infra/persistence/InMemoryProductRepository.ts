import Category from '@catalog/domain/Category';
import IProductRepository from '@catalog/domain/IProductRepository';
import Product from '@catalog/domain/Product';

type InMemoryID = string;

type ISODate = string;

type InMemoryCategory = {
  _id: InMemoryID;
  name: string;
  code: number;
}

type InMemoryProduct = {
  _id: InMemoryID;
  name: string;
  description: string;
  amount: number;
  image: string;
  stockQuantity: number;
  createdAt: ISODate;
  height: number;
  width: number;
  depth: number;
  category: InMemoryID;
}

export class InMemoryProductRepository implements IProductRepository {
  private _categories: InMemoryCategory[] = [];

  private _products: InMemoryProduct[] = [];

  constructor(products?: InMemoryProduct[], categories?: InMemoryCategory[]) {
    this._products = products || [];
    this._categories = categories || [];
  }

  public countCategories(): Promise<number> {
    return Promise.resolve(this._categories.length);
  }

  public getAllProducts(): Promise<Product[]> {
    return Promise.resolve(this._products.map(this.mapProduct.bind(this)));
  }

  public getProductById(id: string): Promise<Product | null> {
    const inMemoryProduct = this._products.find((p) => p._id === id);

    return Promise.resolve(inMemoryProduct ? this.mapProduct(inMemoryProduct) : null);
  }

  public getProductsByCategory(categoryId: string): Promise<Product[]> {
    const inMemoryProducts = this._products.filter((p) => p.category === categoryId);

    const results: Product[] = [];

    for (const product of inMemoryProducts) {
      results.push(this.mapProduct(product));
    }

    return Promise.resolve(results);
  }

  public getCategoryById(categoryId: string): Promise<Category> {
    const category = this._categories.find((c) => c._id === categoryId);

    return Promise.resolve(this.mapCategory(category!));
  }

  public getAllCategories(): Promise<Category[]> {
    const results: Category[] = [];

    for (const category of this._categories) {
      results.push(this.mapCategory(category));
    }

    return Promise.resolve(results);
  }

  public async addProduct(product: Product): Promise<void> {
    this._products.push({
      _id: product.id,
      name: product.name,
      description: product.description,
      amount: product.amount,
      depth: product.dimensions.depth,
      height: product.dimensions.height,
      width: product.dimensions.width,
      image: product.image,
      createdAt: product.createdAt.toISOString(),
      stockQuantity: product.stockQuantity,
      category: product.category.id,
    });
  }

  public async updateProduct(product: Product): Promise<void> {
    const inMemoryProduct = this._products.find((p) => p._id === product.id);

    if (inMemoryProduct === undefined) {
      throw new Error('Product doens\'t exist');
    }

    const newInMemoryProduct: InMemoryProduct = {
      _id: inMemoryProduct._id,
      name: product.name,
      description: product.description,
      amount: product.amount,
      depth: product.dimensions.depth,
      height: product.dimensions.height,
      width: product.dimensions.width,
      image: product.image,
      stockQuantity: product.stockQuantity,
      createdAt: product.createdAt.toISOString(),
      category: product.category.id,
    };

    this._products = [
      ...this._products.filter((p) => p._id !== product.id),
      newInMemoryProduct,
    ];
  }

  public async addCategory(category: Category): Promise<void> {
    this._categories.push({
      _id: category.id,
      name: category.name,
      code: category.code,
    });
  }

  public async updateCategory(category: Category): Promise<void> {
    const inMemoryCategory = this._categories.find((c) => c._id === category.id);

    if (!inMemoryCategory) {
      throw new Error('Category doens\'t exist');
    }

    const newInMemoryCategory: InMemoryCategory = {
      _id: inMemoryCategory._id,
      name: category.name,
      code: category.code,
    };

    this._categories = [
      ...this._categories.filter((p) => p._id !== category.id),
      newInMemoryCategory,
    ];
  }

  get products() {
    return this._products;
  }

  get categories() {
    return this._categories;
  }

  private mapProduct(inMemoryProduct: InMemoryProduct) {
    return new Product({
      id: inMemoryProduct._id,
      name: inMemoryProduct.name,
      description: inMemoryProduct.description,
      amount: inMemoryProduct.amount,
      image: inMemoryProduct.image,
      stockQuantity: inMemoryProduct.stockQuantity,
      createdAt: new Date(inMemoryProduct.createdAt),
      dimensions: {
        height: inMemoryProduct.height,
        width: inMemoryProduct.width,
        depth: inMemoryProduct.depth,
      },
      category: this.getCategory(inMemoryProduct.category),
    });
  }

  private mapCategory(inMemoryCategory: InMemoryCategory) {
    return new Category({
      id: inMemoryCategory._id,
      name: inMemoryCategory.name,
      code: inMemoryCategory.code,
    });
  }

  private getCategory(id: InMemoryID) {
    const inMemoryCategory = this._categories.find((c) => c._id === id);

    if (!inMemoryCategory) {
      throw new Error('Category doesn\'t exists');
    }

    return this.mapCategory(inMemoryCategory);
  }
}

export default new InMemoryProductRepository();
