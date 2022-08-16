import { CourierClient } from "@trycourier/courier";
import { config } from "dotenv";
import { readFileSync } from "fs";
import fetch from "node-fetch";

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

function getRecipientListAttachedToSubscription({ subscriptionId }) {
  return new Promise(async (resolve, reject) => {
    try {
      // https://www.courier.com/docs/reference/profiles/subscribed-list/
      const response = await fetch(
        `https://api.courier.com/lists/${subscriptionId}/subscriptions`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.COOL_COURIER_API_KEY}`,
          },
        }
      );
      const text = await response.text();
      resolve(JSON.parse(text));
    } catch (error) {
      reject(error);
    }
  });
}

function sendEmail({ subscriptionId, eventId, brandId }) {
  return new Promise(async (resolve, reject) => {
    try {
      const options = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.COOL_COURIER_API_KEY}`,
        },
        body: JSON.stringify({
          list: subscriptionId,
          event: eventId,
          brand: brandId,
          data: {
            coolMessage: `CowBoy Bebop ${subscriptionId}`,
          },
        }),
      };

      const response = await fetch(
        "https://api.courier.com/send/list",
        options
      );
      const text = await response.text();
      resolve(text);
    } catch (error) {
      reject(error);
    }
  });
}

(async () => {
  const subscriptionId = `test-subscription`;
  const eventId = `PZM0DZCP2XMTXZQRW5A0ECY431PW`;
  const brandId = `D0CAVDR7AJM847QQFH3CF14WNW0N`;
  const resultInfo = await sendEmail({
    subscriptionId,
    eventId,
    brandId,
  });
  console.log(resultInfo);
})();
