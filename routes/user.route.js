const router = require("express").Router();
const createError = require("http-errors");

const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

router.get("/", async (req, res, next) => {
  try {
    const users = await db.user.findMany();
    res.send({
      users: users,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await db.user.findUnique({ where: { id } });
    if (!user) throw createError(401, "User not found");
    res.send({ User: user });
  } catch (error) {
    next(error);
  }
});

router.post("/register", async (req, res, next) => {
  const body = req.body;

  if (!body.email || !body.name || !body.phone) {
    return next(createError(401, "Invalid Information"));
    next();
  }

  try {
    var user = await db.user.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        role: "USER",
      },
    });

    var cart = await db.cart.create({
      data: {
        qty: body.qty || 0,
        user: { connect: { id: user.id } },
      },
    });

    res.send({
      user: user,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createError(401, "Invalid Information"));
  }

  try {
    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      return next(createError(401, "User not found"));
    }

    res.send({ user });
  } catch (error) {
    console.log(error);
    next(createError(error));
  }
});

router.post("/user", async (req, res, next) => {});

module.exports = router;