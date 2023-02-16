import Category from './Category';
import Product from './Product';

export interface ICategoryOperations {
  getCategoryById(categoryId: string): Promise<Category | null>;

  getAllCategories(): Promise<Category[]>;

  addCategory(category: Category): Promise<Category>;

  updateCategory(category: Category): Promise<Category>;
}

export interface IProductOperations {
  getAllProducts(): Promise<Product[]>;

  getProductById(id: string): Promise<Product | null>;

  getProductsByCategory(categoryId: string): Promise<Product[]>;

  addProduct(product: Product): Promise<Product>;

  updateProduct(product: Product): Promise<Product>;
}

interface IProductRepository extends IProductOperations, ICategoryOperations { }

export default IProductRepository;
