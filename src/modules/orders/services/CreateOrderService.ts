import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}
interface IProductOrder {
  product_id: string;
  price: number;
  quantity: number;
}

@injectable()
class CreateProductService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    // TODO

    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer not found');
    }
    const ids = products.map(product => {
      return {
        id: product.id,
      };
    });

    const productsInOrder = await this.productsRepository.findAllById(ids);
    if (productsInOrder.length !== products.length) {
      throw new AppError('Product not found!');
    }

    products.forEach(prodRecei => {
      let quantity = productsInOrder.find(
        productItem => productItem.id === prodRecei.id,
      )?.quantity;
      if (!quantity) {
        quantity = 0;
      }
      if (prodRecei.quantity > quantity) {
        throw new AppError('Quantity');
      }
    });

    const productsOrder = products.map(product => {
      let price = productsInOrder.find(
        productItem => productItem.id === product.id,
      )?.price;

      if (!price) {
        price = 0;
      }

      return {
        product_id: product.id,

        price,
        quantity: product.quantity,
      };
    });

    const order = this.ordersRepository.create({
      customer,
      products: productsOrder,
    });

    const productsToUpdate = products.map(product => {
      let quantity = productsInOrder.find(
        productItem => productItem.id === product.id,
      )?.quantity;

      if (!quantity) {
        quantity = 0;
      }

      return {
        id: product.id,
        quantity: quantity - product.quantity,
      };
    });
    await this.productsRepository.updateQuantity(productsToUpdate);

    return order;
  }
}

export default CreateProductService;
