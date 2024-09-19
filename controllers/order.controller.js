const { ne } = require("@faker-js/faker");
const { PrismaClient } = require("@prisma/client");
const createError = require("http-errors");
const db = new PrismaClient();

const orderController = {
  findUserOrders: async (req, res, next) => {
    const { userId, status } = req.query;
    if (!userId) {
      return next(createError.BadRequest("Missing userId in query parameters"));
    }
    try {
      const orders = await db.order.findMany({
        where: { userId: userId, status: status },
        include: {
          products: true,
          user: true,
          deliveryAddress: true,
        },
      });
      return res.send({ orders: orders });
    } catch (error) {
      next(error);
    }
  },

  findOrderById: async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
      return next(createError.BadRequest("Missing ID in params"));
    }

    try {
      const order = await db.order.findUnique({ where: { id } });

      if (!order) {
        return next(createError.NotFound("Order not found"));
      }

      res.send({ order });
    } catch (error) {
      next(error);
    }
  },

  createOrder: async (req, res, next) => {
    const {
      userId,
      products,
      addressId,
      paymentMethod,
      paymentStatus,
      status,
    } = req.body;
    if (!userId) {
      return next(createError.BadRequest("Missing UserId in body"));
    }
    if (!products) {
      return next(createError.BadRequest("Missing products in body"));
    }
    try {
      const user = await db.user.findUnique({ where: { id: userId } });
      if (!user) {
        return next(createError.NotFound("User not found"));
      }
      let totalPrice = 0;
      const productPromise = products.map(async (id) => {
        const pResponse = await db.product.findUnique({
          where: { id: id },
          select: { price: true },
        });
        return pResponse?.price || 0;
      });

      const prices = await Promise.all(productPromise);
      prices?.forEach((price) => (totalPrice += price));
      const newOrder = await db.order.create({
        data: {
          userId,
          addressId,
          products: {
            connect: products.map((id) => ({ id })),
          },
          totalProducts: products?.length || 0,
          totalPrice,
          paymentMethod: paymentMethod,
          paymentStatus: paymentStatus,
          status: status,
        },
        include: {
          user: true,
          deliveryAddress: true,
        },
      });
      res.send({ order: newOrder });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  updateOrder: async (req, res, next) => {
    const { id } = req.params;
    const { status, totalPrice, paymentMethod, paymentStatus, addressId } =
      req.body;
    if (!id) {
      return next(createError.BadRequest("Missing ID in params"));
    }
    const order = await db.order.findUnique({ where: { id: id } });
    if (!order) {
      return next(createError.NotFound("Order not found"));
    }
    try {
      const updatedOrder = await db.order.update({
        where: { id },
        data: { status, totalPrice, paymentMethod, paymentStatus, addressId },
      });
      res.send({ updatedOrder });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  createManyOrders: async (req, res, next) => {
    const { orders } = req.body;
    if (!orders) {
      return next(createError.BadRequest("Missing product in request body"));
    }
    try {
      const response = await db.order.createMany({ data: orders });
      res.send({ message: "Orders created" });
    } catch (error) {
      next(createError(500, "server error"));
    }
  },
};

module.exports = orderController;
