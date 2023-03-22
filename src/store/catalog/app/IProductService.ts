import { DimensionsProps } from '@catalog/domain/Dimensions';
import { ProductProps } from '@catalog/domain/Product';

export type DefaultProductParams = {
  name: string;
  description: string;
  amount: number;
  image: string;
  stockQuantity: number;
  dimensions: DimensionsProps;
  categoryId: string;
}

export type UpdateProductParams = Partial<DefaultProductParams>;

interface IProductService {
  getProductById(productId: string): Promise<ProductProps>;

  getAllProducts(): Promise<ProductProps[]>;

  getProductsByCategory(categoryId: string): Promise<ProductProps[]>;

  createProduct(params: DefaultProductParams): Promise<ProductProps>;

  updateProduct(productId: string, params: UpdateProductParams): Promise<ProductProps>;

  updateProductStock(productId: string, quantity: number): Promise<boolean>;
}

export default IProductService;
