const { PrismaClient } = require("@prisma/client");
const createError = require("http-errors");

const router = require("express").Router();

const db = new PrismaClient();

// Utility function for image uploads and retrieves
function createImageArrayWithUrl(array, req) {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const images = array.map((img) => ({
    id: img.id,
    productId: img.productId,
    url: `${baseUrl}/${img.path}`,
    path: img.path,
    filename: img.name,
    uploadedAt: img.createdate,
  }));
  return images;
}

router.get("/product-images", async (req, res, next) => {
  try {
    const response = await db.image.findMany();
    res.send({
      statusCode: "successful operation.",
      images: createImageArrayWithUrl(response, req),
    });
  } catch (error) {
    next(createError(500, error));
  }
});

router.post("/product-images", async (req, res, next) => {
  const { productId } = req.body;
  const imageArray = req.files;
  console.log(imageArray);
  const userId = "4f16abae-c41d-42e9-b0a6-8940ad536bf2";
  // const productId = "1885260e-1768-486f-8fe5-4eadeb218dff";
  try {
    const response = await db.image.createMany({
      data: imageArray.map(({ filename, path }) => ({
        userId: userId,
        productId: productId,
        name: filename,
        path: path,
      })),
    });
    const images = await db.image.findMany({
      where: { productId },
    });
    res.send({
      message: "Image has been uploaded successfully",
      data: createImageArrayWithUrl(images, req),
    });
  } catch (error) {
    console.log(error);
    next(createError(500, error));
  }
});

router.delete("/product-images/:id", async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(createError(400, "Invalid request"));
  }
  try {
    const deletedImage = await db.image.delete({ where: { id } });
    if (!deletedImage) {
      return res.status(404).send({ message: "Image not found" });
    }
    res.send({
      message: "Image has been deleted successfully",
      image: deletedImage,
    });
  } catch (error) {
    next(createError(500, error));
  }
});

module.exports = router;
