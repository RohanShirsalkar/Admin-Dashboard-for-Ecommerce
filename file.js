const { subDays, format, set } = require("date-fns");

const d0 = new Date();
const targetDate = subDays(new Date(), 0);
// const formattedDate = format(targetDate, "yyyy-MM-dd");
const istOffset = 5.5 * 60 * 60 * 1000;
const d1 = subDays(new Date(d0.getTime() + istOffset), -2);

console.log(4 - 5);
// const date = new Date(formattedDate);

// const fromDate = new Date(date.setHours(0, 0, 0, 0));
// const toDate = new Date(date.setHours(24, 0, 0, 0));
// const updatedDate = set(date, {
//   hours: 24,
//   minutes: 0,
//   seconds: 0,
//   milliseconds: 0,
// });
// console.log("----------");
// console.log(updatedDate);
// console.log(toDate);

// const date = new Date();
// const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

// const date = new Date();
// const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
// const istDate = new Date(date.getTime() + istOffset);
// //   .toISOString()
// //   .slice(0, 19)
// //   .replace("T", " ");

// console.log(istDate);
