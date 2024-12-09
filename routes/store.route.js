const router = require("express").Router();
const createError = require("http-errors");
const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

router.post("/", async (req, res, next) => {
  const { userId } = req.query;
  try {
    const response = await db.settings.create();
    res.send({ response });
  } catch (error) {
    next(createError(500, "Internal server error"));
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(createError(401, "Invalid ID"));
  }
  try {
    const response = await db.store.findUnique({
      where: { id },
      include: { user: true, SitePaymentMethods: true },
    });
    if (!response) {
      return next(createError(401, "No settings found with this id"));
    }
    res.send({ response });
  } catch (error) {
    next(createError(500, "Internal server error"));
  }
});

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const {
    storeName,
    description,
    supportEmail,
    supportPhone,
    bussinessStreet,
    bussinessCity,
    bussinessState,
    bussinessZipCode,
    sitePaymentMethods,
  } = req.body;

  if (!id) {
    return next(createError.NotFound("Not Found"));
  }
  try {
    const settings = await db.settings.findUnique({ where: { id } });
    if (!settings) {
      return next(createError.NotFound("Not Found"));
    }
    const response = await db.settings.update({
      where: { id },
      data: {
        storeName: storeName,
        description: description,
        supportEmail: supportEmail,
        supportPhone: supportPhone,
        bussinessStreet: bussinessStreet,
        bussinessCity: bussinessCity,
        bussinessState: bussinessState,
        bussinessZipCode: bussinessZipCode,
        SitePaymentMethods: {
          connect: sitePaymentMethods?.map((id) => ({ id })),
        }, // connect payment metod ids here... (array of payment methods ids),
      },
    });
    res.send({ response });
  } catch (error) {
    next(createError(500, "Internal Server error"));
  }
});

module.exports = router;
