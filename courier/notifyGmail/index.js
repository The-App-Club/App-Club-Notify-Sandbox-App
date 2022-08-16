import { CourierClient } from "@trycourier/courier";
import { config } from "dotenv";
import { readFileSync } from "fs";

config();

const courier = CourierClient({
  authorizationToken: `${process.env.COOL_COURIER_API_KEY}`,
});

function readFile() {
  return new Promise((resolve, reject) => {
    try {
      const data = readFileSync("./data.json", {
        encoding: "utf-8",
      });
      resolve(JSON.parse(data));
    } catch (error) {
      reject(error);
    }
  });
}

function sendEmail({
  brandId = "62051M6GPKMNSEPHGDZY04D5MKKH",
  // brandId = "D0CAVDR7AJM847QQFH3CF14WNW0N",
  eventId = "6JDVWF0WKVMYZGK15STEG3VKRMPR",
  recipientId,
  willSendedEmail,
}) {
  return new Promise(async (resolve, reject) => {
    try {
      const { messageId } = await courier.send({
        brand: brandId,
        eventId: eventId,
        recipientId: recipientId,
        profile: {
          email: willSendedEmail,
        },
        data: {},
        override: {},
      });
      resolve(messageId);
    } catch (error) {
      reject(error);
    }
  });
}

(async () => {
  const res = await readFile();
  const broadcastInfoList = res.broadcastInfoList;
  for (let index = 0; index < broadcastInfoList.length; index++) {
    const broadcastInfo = broadcastInfoList[index];
    const resultInfo = await sendEmail({
      // eventId: "PZM0DZCP2XMTXZQRW5A0ECY431PW",
      willSendedEmail: broadcastInfo.willSendedEmail,
      recipientId: broadcastInfo.recipientId,
    });
    console.log(resultInfo);
  }
})();

// // 自身へ送付
// const { messageId } = await courier.send({
//   brand: "62051M6GPKMNSEPHGDZY04D5MKKH",
//   eventId: "6JDVWF0WKVMYZGK15STEG3VKRMPR",
//   recipientId: "1db6745c-8de9-44fb-ab41-7ea147891b64",
//   profile: {
//     email: "mond@example.com",
//   },
//   data: {},
//   override: {},
// });

// console.log(messageId);

// // 自身以外へ送付
// const { messageId } = await courier.send({
//   brand: "62051M6GPKMNSEPHGDZY04D5MKKH",
//   eventId: "6JDVWF0WKVMYZGK15STEG3VKRMPR",
//   recipientId: "6720e40f-4c8d-44e8-acb2-8b1aa4976dda",
//   profile: {
//     email: "hoge@example.com",
//   },
//   data: {},
//   override: {},
// });

// console.log(messageId);
