const { PrismaClient } = require("@prisma/client");
const createError = require("http-errors");
const db = new PrismaClient();

const orderController = {
  findUserOrders: async (req, res, next) => {
    const { userId } = req.query;

    if (!userId) {
      return next(createError.BadRequest("Missing userId in query parameters"));
    }

    try {
      const orders = await db.order.findMany({
        where: { userId: userId },
        include: { products: true },
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
    const { userId, products } = req.body;
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
      const newOrder = await db.order.create({
        data: {
          userId,
          products: {
            connect: products.map((id) => ({ id })),
          },
          totalPrice: 10,
        },
      });
      res.send({ newOrder });
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
};

module.exports = orderController;