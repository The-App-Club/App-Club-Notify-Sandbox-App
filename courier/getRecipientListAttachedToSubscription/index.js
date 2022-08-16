import { config } from "dotenv";
import fetch from "node-fetch";

config();

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
      resolve(text);
    } catch (error) {
      reject(error);
    }
  });
}

(async () => {
  const subscriptionId = `test-subscription`;
  const res = await getRecipientListAttachedToSubscription({ subscriptionId });
  console.log(res);
})();
