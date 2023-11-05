import { DimensionsProps } from '@catalog/domain/Dimensions';
import { ProductProps } from '@catalog/domain/Product';

export type DefaultProductParams = {
  name: string;
  description: string;
  amount: number;
  image: string;
  stock_quantity: number;
  dimensions: DimensionsProps;
  category_id: string;
}

export type UpdateProductParams = Partial<DefaultProductParams>;

interface IProductService {
  getProductById(product_id: string): Promise<ProductProps>;

  getAllProducts(): Promise<ProductProps[]>;

  getProductsByCategory(category_id: string): Promise<ProductProps[]>;

  createProduct(params: DefaultProductParams): Promise<ProductProps>;

  updateProduct(product_id: string, params: UpdateProductParams): Promise<ProductProps>;

  updateProductStock(product_id: string, quantity: number): Promise<boolean>;
}

export default IProductService;
