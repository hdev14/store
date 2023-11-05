import Category from './Category';
import Product from './Product';

export interface ICategoryOperations {
  /** @throws {RepositoryError} */
  getCategoryById(category_id: string): Promise<Category | null>;

  /** @throws {RepositoryError} */
  getAllCategories(): Promise<Category[]>;

  /** @throws {RepositoryError} */
  addCategory(category: Category): Promise<void>;

  /** @throws {RepositoryError} */
  updateCategory(category: Category): Promise<void>;

  /** @throws {RepositoryError} */
  countCategories(): Promise<number>;
}

export interface IProductOperations {
  /** @throws {RepositoryError} */
  getAllProducts(): Promise<Product[]>;

  /** @throws {RepositoryError} */
  getProductById(id: string): Promise<Product | null>;

  /** @throws {RepositoryError} */
  getProductsByCategory(category_id: string): Promise<Product[]>;

  /** @throws {RepositoryError} */
  addProduct(product: Product): Promise<void>;

  /** @throws {RepositoryError} */
  updateProduct(product: Product): Promise<void>;
}

interface IProductRepository extends IProductOperations, ICategoryOperations { }

export default IProductRepository;
