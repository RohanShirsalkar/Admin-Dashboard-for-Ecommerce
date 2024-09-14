const router = require("express").Router();
const { ne } = require("@faker-js/faker");
const { PrismaClient } = require("@prisma/client");
const createError = require("http-errors");
const { createImageArrayWithUrl } = require("../lib/utils/app.utils");

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
    const productResponse = await db.product.findUnique({
      where: { id },
      include: { tags: true, orders: true, category: true, images: true },
    });
    if (!productResponse) {
      return next(createError(404, "Product not found with given ID."));
    }
    const product = {
      ...productResponse,
      images: createImageArrayWithUrl(productResponse.images, req),
    };
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

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(createError(401, "Id is missing"));
  }
  try {
    const product = await db.product.findUnique({ where: { id } });
    if (!product) {
      return next(createError(404, "No product found with given ID."));
    }
    const deletedProduct = await db.product.delete({ where: { id } });
    res.send({
      product: deletedProduct,
      message: "product has been successfully removed",
    });
  } catch (error) {
    next(createError(500, error));
  }
});

module.exports = router;
