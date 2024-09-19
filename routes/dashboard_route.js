const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const createError = require("http-errors");
const { format, subDays, set } = require("date-fns");

const db = new PrismaClient();

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

router.get("/chart-data", async (req, res, next) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const d0 = new Date();
  const todaysDay = d0.getDay();
  try {
    const sales = [];
    const ordersPromise = days.map(async (day, index) => {
      const istOffset = 5.5 * 60 * 60 * 1000;
      const d1 = subDays(
        new Date(d0.getTime() + istOffset),
        index <= todaysDay ? todaysDay - index : index - (todaysDay + 2) // to get the day of week for nd tomorrow, start with -1 and so on
      );
      // if (index <= todaysDay) {
      // 1.FIX TIMEZONES
      // 2024-09-18T18:30:00.000Z --- 2024-09-19T08:29:59.999Z
      // Time starts at 18:30:00 but it should be 00:00:00
      const startOfDay = set(d1, {
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      });
      const endOfDay = set(d1, {
        hours: 23,
        minutes: 59,
        seconds: 59,
        milliseconds: 999,
      });

      const response = await db.order.count({
        where: {
          status: "COMPLETED",
          createdate: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      return {
        day: day,
        date: format(d1, "yyyy-MM-dd"),
        sales: response,
      };
      // }
    });

    const orders = await Promise.all(ordersPromise);
    orders?.forEach((order) => {
      sales.push(order);
    });

    res.send({ sales });
  } catch (error) {
    console.log(error);
    next(createError(500, "Internal server error"));
  }
});

module.exports = router;
