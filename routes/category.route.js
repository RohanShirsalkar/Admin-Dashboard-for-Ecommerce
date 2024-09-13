const router = require("express").Router();
const { ne } = require("@faker-js/faker");
const { PrismaClient } = require("@prisma/client");
const createError = require("http-errors");

const db = new PrismaClient();

router.get("/", async (req, res, next) => {
  try {
    const categories = await db.category.findMany();
    res.send({ categories: categories });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return next(createError(401, "Invalid Information"));
  }

  try {
    const newCategory = await db.category.create({ data: { name } });
    res.send("Category created successfully");
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    // return res.status(401).send("Missing required field: ID");
    return next(createError(404, "Missing required field: ID "));
  }

  try {
    const deletedCategory = await db.category.delete({ where: { id } });
    res.send("Category deleted successfully");
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!id || !name) {
    // res.send("Missing required field: ID or Name");
    return next(createError(404, "Missing required field: ID or Name"));
  }

  try {
    const updatedCategory = await db.category.update({
      where: { id },
      data: { name },
    });

    res.send("Category updated successfully");
  } catch (error) {
    next(err);
  }
});

module.exports = router;
