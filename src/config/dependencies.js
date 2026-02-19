import { UsersDAO } from "../dao/mongo/users.dao.js";
import { UsersRepository } from "../repositories/users.repository.js";
import { UsersService } from "../services/users.service.js";

import { ProductsDAO } from "../dao/mongo/products.dao.js";
import { ProductsRepository } from "../repositories/products.repository.js";
import { ProductsService } from "../services/products.service.js";

import { CartsDAO } from "../dao/mongo/carts.dao.js";
import { CartsRepository } from "../repositories/carts.repository.js";
import { CartsService } from "../services/carts.service.js";

import { TicketsDAO } from "../dao/mongo/tickets.dao.js";
import { TicketsRepository } from "../repositories/tickets.repository.js";
import { TicketsService } from "../services/tickets.service.js";

// USERS
const usersDao = new UsersDAO();
const usersRepo = new UsersRepository(usersDao);
export const usersService = new UsersService(usersRepo);

// PRODUCTS
const productsDao = new ProductsDAO();
const productsRepo = new ProductsRepository(productsDao);
export const productsService = new ProductsService(productsRepo);

// CARTS
const cartsDao = new CartsDAO();
const cartsRepo = new CartsRepository(cartsDao);
export const cartsService = new CartsService(cartsRepo);

// TICKETS
const ticketsDao = new TicketsDAO();
const ticketsRepo = new TicketsRepository(ticketsDao);
export const ticketsService = new TicketsService(ticketsRepo);

