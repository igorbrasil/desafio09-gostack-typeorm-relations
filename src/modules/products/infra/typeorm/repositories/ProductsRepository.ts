import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    // TODO

    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    // TODO

    const foundedProduct = this.ormRepository.findOne({
      where: {
        name,
      },
    });
    return foundedProduct;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    // TODO findByIds
    const foundedProducts = this.ormRepository.find({
      where: {
        id: In(products.map(product => product.id)),
      },
    });

    return foundedProducts;
  }

  public async findById(id: string): Promise<Product | undefined> {
    const product = this.ormRepository.findOne(id);
    return product;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    if (!products) {
      throw new Error('There are no products');
    }
    const foundedProducts = await this.ormRepository.find({
      where: {
        id: In(products.map(product => product.id)),
      },
    });

    // foundedProducts.map(product => {
    //   const quantity =
    //     products.find(prod => prod.id === product.id)?.quantity || 0;

    //   return quantity;
    // });
    foundedProducts.forEach(product => {
      const quantity =
        products.find(prod => prod.id === product.id)?.quantity || 0;

      product.quantity = quantity;
    });

    await this.ormRepository.save(foundedProducts);
    // TODO

    return foundedProducts;
  }
}

export default ProductsRepository;
