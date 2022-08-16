import { config } from "dotenv";
import fetch from "node-fetch";

config();

function getSubscriptionList() {
  return new Promise(async (resolve, reject) => {
    try {
      // https://www.courier.com/docs/reference/lists/list/
      const response = await fetch(`https://api.courier.com/lists`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.COOL_COURIER_API_KEY}`,
        },
      });
      const json = await response.json();
      resolve(json);
    } catch (error) {
      reject(error);
    }
  });
}

function updateSubscription({
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
  // const resultUpdateSubscription = await updateSubscription({
  //   subscriptionId: "test-subscription",
  //   subscriptionName: "テストサブすくリプチョン",
  // });
  // console.log(resultUpdateSubscription);
  const res = await getSubscriptionList({});
  console.log(JSON.stringify(res));
})();
