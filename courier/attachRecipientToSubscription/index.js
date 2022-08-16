import { config } from "dotenv";
import { readFileSync } from "fs";
import fetch from "node-fetch";

config();

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

function getSubscribeList({
  // brandId = "D0CAVDR7AJM847QQFH3CF14WNW0N",
  // eventId = "6JDVWF0WKVMYZGK15STEG3VKRMPR",
  recipientId,
  // willSendedEmail,
}) {
  return new Promise(async (resolve, reject) => {
    try {
      // https://www.courier.com/docs/reference/profiles/subscribed-list/
      const response = await fetch(
        `https://api.courier.com/profiles/${recipientId}/lists`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.COOL_COURIER_API_KEY}`,
          },
        }
      );
      const json = await response.json();
      resolve(json);
      resolve("");
    } catch (error) {
      reject(error);
    }
  });
}

function subscribe({ subscriptionId, recipientId, eventId }) {
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
          recipients: [
            {
              recipientId,
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
            },
          ],
        }),
      };

      // https://www.courier.com/docs/reference/lists/put-subscribe/
      const response = await fetch(
        `https://api.courier.com/lists/${subscriptionId}/subscriptions`,
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
  const eventId = `PZM0DZCP2XMTXZQRW5A0ECY431PW`; // 通知ID
  const res = await readFile();
  const broadcastInfoList = res.broadcastInfoList;
  for (let index = 0; index < broadcastInfoList.length; index++) {
    const broadcastInfo = broadcastInfoList[index];
    const resultInfo = await subscribe({
      subscriptionId,
      recipientId: broadcastInfo.recipientId,
      eventId,
    });
    console.log(resultInfo);
  }
})();
