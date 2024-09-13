const { PrismaClient } = require("@prisma/client");
const createError = require("http-errors");

const router = require("express").Router();

const db = new PrismaClient();

router.get("/", async (req, res, next) => {
  try {
    const response = await db.image.findMany();
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const images = response.map((img) => ({
      id: img.id,
      productId: img.productId,
      url: `${baseUrl}/${img.path}`,
      path: img.path,
      filename: img.name,
      uploadedAt: img.createdate,
    }));
    res.send({ statusCode: "successful operation.", images });
  } catch (error) {
    next(createError(500, error));
  }
});

router.post("/", async (req, res, next) => {
  const { path, filename } = req.file;
  try {
    const images = await db.image.create({
      data: {
        userId: "4f16abae-c41d-42e9-b0a6-8940ad536bf2",
        productId: "ac58da65-ab20-4491-9dfa-01f68b80f0dc",
        name: filename,
        path: path,
      },
    });
    res.send({ message: "Image has been uploaded successfully", data: images });
  } catch (error) {
    next(createError(500, error));
  }
});

module.exports = router;
