/* eslint-disable no-unused-vars */
import Category from './Category';
import Product from './Product';

interface IProductRepository {
  getAllProducts(): Promise<Product[]>;

  getProductById(): Promise<Product>;

  getProductByCategory(): Promise<Product>;

  getAllCategories(): Promise<Category[]>;

  addProduct(product: Product): void;

  updateProduct(product: Product): void;

  addCategory(category: Category): void;

  updateCategory(category: Category): void;
}

export default IProductRepository;
