/* eslint-disable no-unused-vars */
import Category from './Category';
import Product from './Product';

interface IProductRepository {
  getAllProducts(): Promise<Product[]>;

  getProductById(id: string): Promise<Product | null>;

  getProductByCategory(category: Category): Promise<Product | null>;

  getAllCategories(): Promise<Category[]>;

  addProduct(product: Product): Promise<void> | void;

  updateProduct(product: Product): Promise<void> | void;

  addCategory(category: Category): Promise<void> | void;

  updateCategory(category: Category): Promise<void> | void;
}

export default IProductRepository;
