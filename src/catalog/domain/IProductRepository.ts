/* eslint-disable no-unused-vars */
import Category from './Category';
import Product from './Product';

export interface ICategoryOperations {
  getAllCategories(): Promise<Category[]>;

  addCategory(category: Category): Promise<Category> | Category;

  updateCategory(category: Category): Promise<Category> | Category;
}

export interface IProductOperations {
  getAllProducts(): Promise<Product[]>;

  getProductById(id: string): Promise<Product | null>;

  getProductsByCategory(categoryId: string): Promise<Product[]>;

  addProduct(product: Product): Promise<Product> | Product;

  updateProduct(product: Product): Promise<Product> | Product;
}

interface IProductRepository extends IProductOperations, ICategoryOperations {}

export default IProductRepository;
