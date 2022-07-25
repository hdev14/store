/* eslint-disable no-unused-vars */
import Category from './Category';
import Product from './Product';

interface IProductRepository {
  getAllProducts(): Promise<Product[]>;

  getProductById(id: string): Promise<Product | null>;

  getProductsByCategory(category: Category): Promise<Product[]>;

  getAllCategories(): Promise<Category[]>;

  addProduct(product: Product): Promise<Product> | Product;

  updateProduct(product: Product): Promise<Product> | Product;

  addCategory(category: Category): Promise<Category> | Category;

  updateCategory(category: Category): Promise<Category> | Category;
}

export default IProductRepository;
