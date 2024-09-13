const router = require("express").Router();
const addressController = require("../controllers/address.controller");

router.get("/", addressController.findUserAddress);
router.get("/:id", addressController.findAddressById);
router.post("/", addressController.createAddress);

module.exports = router;
