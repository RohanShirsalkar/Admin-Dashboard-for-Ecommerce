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