import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Product } from '../models/product';
import { OrderService } from './order.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(
    private storageService: StorageService,
    private orderService: OrderService
  ) {}
  cart: Product[] = [];
  count: number = 0;
  getCount(): number {
    let count = 0;
    let user = this.storageService.loggedInUser();
    if (this.storageService.getCartProducts()) {
      let products: Product[] = this.storageService.getCartProducts();
      for (let i of products) {
        if (i.userid === user.id) count += i.count!;
      }
      return count;
    }
    return 0;
  }
  addToCart(id: number) {
    let products: Product[] = this.storageService.getProducts();
    let user = this.storageService.loggedInUser();
    if (!this.storageService.getCartProducts()) {
      this.storageService.setCart();
    }
    let cart: Product[] = this.storageService.getCartProducts();
    // console.log(user.id);
    let clickedProduct = products.find((product) => product.id === id);
    if (clickedProduct) {
      let newCart = cart.find(
        (product) => product.id === id && product.userid === user.id
      );
      if (!newCart) {
        cart.push({ ...clickedProduct, userid: user.id, count: 1 });
      } else {
        cart = cart.map((item) => {
          if (item.id === id && item.userid === user.id) {
            return { ...item, count: item.count! + 1 };
          } else {
            return item;
          }
        });
      }
    }
    this.storageService.loadCartProducts(cart);
  }

  delete(id: number): Product[] {
    let user = this.storageService.loggedInUser();
    let products = this.storageService.getCartProducts();
    console.log(this.cart);
    let del = products.filter((i) => !(i.id === id && user.id == i.userid));
    this.storageService.loadCartProducts(del);
    return del;
  }

  checkout(): Product[] {
    let cart = this.storageService.getCartProducts();
    let user = this.storageService.loggedInUser();
    this.orderService.orders(
      cart.filter((product) => product.userid == user.id)
    );
    cart = cart.filter((product) => product.userid !== user.id);
    this.storageService.loadCartProducts(cart);
    return cart;
  }
  cartProducts(): Product[] {
    return this.storageService
      .getCartProducts()
      .filter(
        (product) => this.storageService.loggedInUser().id === product.userid
      );
  }
}
