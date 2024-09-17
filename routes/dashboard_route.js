const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const createError = require("http-errors");

const db = new PrismaClient();

// 1. Total revenue
// 2. Total sales
// 3. Total customers
router.get("/quick-overview", async (req, res, next) => {
  const { userId } = req.query;
  const { fromDate, toDate } = req.params;
  try {
    const totalRevenue = await db.order.aggregate({
      _sum: {
        totalPrice: true,
      },
    });
    const totalSales = await db.order.aggregate({
      _sum: {
        totalProducts: true,
      },
      where: {
        status: "COMPLETED",
      },
    });
    const allCustomersCount = await db.user.count({ where: { role: "USER" } });
    const activeProductsCount = await db.product.count({
      where: { status: "ACTIVE" },
    });
    res.send({
      data: {
        totalRevenue: totalRevenue._sum.totalPrice,
        totalSales: totalSales._sum.totalProducts,
        customersCount: allCustomersCount,
        activeProductsCount: activeProductsCount,
      },
    });
  } catch (error) {
    next(createError(500, error));
  }
});

router.get("/recent-sales", async (req, res, next) => {
  try {
    // const resposne = await db.order.findMany({ take:3 , orderBy:"createdAt", where : { status:'COMPLETED' } });
    const resposne = await db.order.findMany({
      where: {
        status: "COMPLETED",
      },
      orderBy: { createdate: "desc" },
      take: 5,
      select: {
        id: true,
        totalPrice: true,
        createdate: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    res.send({ sales: resposne });
  } catch (error) {
    console.log(error);
    next(createError(500, error));
  }
});

module.exports = router;
