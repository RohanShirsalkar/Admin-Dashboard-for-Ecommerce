const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const createError = require("http-errors");

const db = new PrismaClient();

router.get("/", async (req, res, next) => {
  try {
    const carts = await db.cart.findMany();
    res.send({ carts });
  } catch (error) {
    next(error);
  }
});

// find cart by userID
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(createError("Invalid Id"));
  }

  try {
    const cart = await db.cart.findUnique({ where: { userId: id } });
    if (cart === null) {
      return next(createError("Cart not found"));
    }

    res.send({ cart });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// find cart with userId and add product to cart with id
router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { productId } = req.body;

  if (!id) {
    return next(createError("Invalid Id"));
  }

  if (!productId) {
    return next(createError("Missing product data"));
  }

  try {
    const cart = await db.cart.findUnique({ where: { userId: id } });
    if (!cart) {
      return next(createError("Cart not found"));
    }

    const product = await db.product.findUnique({ where: { id: productId } });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
