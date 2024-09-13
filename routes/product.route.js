const router = require("express").Router();
const { ne } = require("@faker-js/faker");
const { PrismaClient } = require("@prisma/client");
const createError = require("http-errors");

const db = new PrismaClient();

router.get("/", async (req, res, next) => {
  const { skip, take, status } = req.query;
  const handlePagination = (take, page) => {};
  try {
    const products = await db.product.findMany({
      // take,
      // skip,
      // where: { status: undefined },
    });
    const count = await db.product.count();
    res.send({ products, count });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(createError(404, "ID is missing"));
  }
  try {
    const product = await db.product.findUnique({
      where: { id },
      include: { tags: true, orders: true, category: true },
    });
    if (!product) {
      return next(createError(404, "Product not found with given ID."));
    }
    res.send({ product });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const product = await db.product.create({ data: {} });
    res.send({ product, message: "Product created successfully." });
  } catch (error) {
    console.log(error);
    next(createError(500, error));
  }
});

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    description,
    stock,
    status,
    imageUrl,
    price,
    categoryId,
    tags,
  } = req.body;

  if (!id) {
    return next(createError(401, "Id is missing"));
  }
  try {
    const product = await db.product.findUnique({ where: { id } });
    if (!product) {
      return next(createError(401, "No product found with given ID."));
    }
    const updatedProduct = await db.product.update({
      where: { id },
      data: {
        title,
        description,
        stock,
        status,
        tags: { set: [], connect: tags?.map((id) => ({ id })) },
        imageUrl,
        price,
        categoryId,
      },
      include: { tags: true },
    });
    res.send({
      product: updatedProduct,
      message: "Product updated successfully.",
    });
  } catch (error) {
    console.log(error);
    next(createError(501, error));
  }
});

// router.post("/", async (req, res, next) => {
//   const {
//     title,
//     description,
//     stock,
//     status,
//     imageUrl,
//     price,
//     categoryId,
//     tags,
//   } = req.body;
//   console.log(req.body);
//   if (!title || !price) {
//     return next(createError(404, "Missing required fields"));
//   }

//   try {
//     const product = await db.product.create({
//       data: {
//         title,
//         description,
//         stock,
//         imageUrl,
//         price,
//         tags: { connect: tags.map((id) => ({ id })) },
//         status,
//         categoryId,
//       },
//     });
//     res.send({
//       product: product,
//       message: "Product created successfully",
//     });
//   } catch (e) {
//     next(e);
//   }
// });

module.exports = router;
