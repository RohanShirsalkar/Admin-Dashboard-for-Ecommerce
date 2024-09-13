const router = require("express").Router();
const orderController = require("../controllers/order.controller");

router.get("/", orderController.findUserOrders);
router.get("/:id", orderController.findOrderById);
router.post("/", orderController.createOrder);
router.put("/:id", orderController.updateOrder);

module.exports = router;
