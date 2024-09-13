const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const createError = require("http-errors");

const db = new PrismaClient();

router.get("/", async (req, res, next) => {
  try {
    const tags = await db.tag.findMany();
    res.send({ tags: tags });
  } catch (error) {
    next(createError(500, error));
  }
});

module.exports = router;
