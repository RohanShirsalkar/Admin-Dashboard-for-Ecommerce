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

module.exports = { createImageArrayWithUrl };
