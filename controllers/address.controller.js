const createError = require("http-errors");
const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

const addressController = {
  findUserAddress: async (req, res, next) => {
    const { userId } = req.query;
    if (!userId) {
      return next(
        createError.BadRequest("Missing User ID in query parameters")
      );
    }
    try {
      const addresses = await db.address.findMany({ where: { userId } });
      res.send({ addresses });
    } catch (error) {
      next(error);
    }
  },

  findAddressById: async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
      return next(createError.BadRequest("missing id parameter"));
    }
    try {
      const address = await db.address.findUnique({ where: { id } });
      if (!address) {
        return next(createError.NotFound());
      }
      res.send({ address });
    } catch (error) {
      next(error);
    }
  },

  createAddress: async (req, res, next) => {
    const { userId, street, city, state, pinCode } = req.body;
    if (!userId) {
      return next(
        createError.BadRequest("User ID is missing from the payload")
      );
    }
    if (!street || !city || !state || !pinCode) {
      return next(createError("Missing required fields in request body"));
    }
    try {
      const address = await db.address.create({
        data: { userId, street, city, state, pinCode },
      });
      res.send({ message: "Address created successfully", data: address });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = addressController;
