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

function deleteSubscription({ subscriptionId }) {
  return new Promise(async (resolve, reject) => {
    try {
      // https://www.courier.com/docs/reference/lists/delete/
      const response = await fetch(
        `https://api.courier.com/lists/${subscriptionId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.COOL_COURIER_API_KEY}`,
          },
        }
      );
      const text = await response.text();
      resolve(text);
    } catch (error) {
      reject(error);
    }
  });
}

(async () => {
  // const resultDeleteSubscription = await deleteSubscription({ subscriptionId: "test-subscription-event" });
  // console.log(resultDeleteSubscription);

  const res = await getSubscriptionList({});
  console.log(JSON.stringify(res));
})();
