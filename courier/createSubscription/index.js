import { CourierClient } from "@trycourier/courier";
import { config } from "dotenv";
import { readFileSync } from "fs";
import fetch from "node-fetch";

config();

function createSubscription({
  subscriptionId,
  subscriptionName,
  eventId = "6JDVWF0WKVMYZGK15STEG3VKRMPR",
}) {
  // https://www.courier.com/docs/reference/lists/replace/
  return new Promise(async (resolve, reject) => {
    try {
      const options = {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.COOL_COURIER_API_KEY}`,
        },
        body: JSON.stringify({
          name: subscriptionName,
          preferences: {
            notifications: {
              [eventId]: {
                channel_preferences: [],
                rules: [],
                status: "OPTED_IN",
              },
            },
            categories: {},
          },
        }),
      };

      const response = await fetch(
        `https://api.courier.com/lists/${subscriptionId}`,
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
  const resultInfo = await createSubscription({
    subscriptionId: "test-subscription",
    subscriptionName: "Test Subscription",
    eventId: "6JDVWF0WKVMYZGK15STEG3VKRMPR",
  });

  console.log(resultInfo);
})();
