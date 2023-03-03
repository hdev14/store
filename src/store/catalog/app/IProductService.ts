import Dimensions from '@catalog/domain/Dimensions';
import Product from '@catalog/domain/Product';

export type DefaultProductParams = {
  name: string;
  description: string;
  amount: number;
  image: string;
  stockQuantity: number;
  dimensions: Dimensions;
  categoryId: string;
}

export type UpdateProductParams = Partial<DefaultProductParams>;

// TODO: change return
interface IProductService {
  getProductById(productId: string): Promise<Product>;

  getAllProducts(): Promise<Product[]>;

  getProductsByCategory(categoryId: string): Promise<Product[]>;

  createProduct(params: DefaultProductParams): Promise<Product>;

  updateProduct(productId: string, params: UpdateProductParams): Promise<Product>;

  updateProductStock(productId: string, quantity: number): Promise<boolean>;
}

export default IProductService;
