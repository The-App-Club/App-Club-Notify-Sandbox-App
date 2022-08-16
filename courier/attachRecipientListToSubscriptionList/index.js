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

function subscribe({ subscriptionId, eventId, recipientIdList }) {
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
          recipients: recipientIdList.map((recipientId) => {
            return {
              recipientId: recipientId,
              preferences: {
                notifications: {
                  [eventId]: {
                    channel_preferences: [],
                    rules: [],
                    status: "OPTED_IN",
                  },
                },
                categories: {},
                // templateId: "W951R8G37V49KZMK8DEKW8Z588BZ",
              },
            };
          }),
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
  // 単一のイベントを複数のサブスクに適用して複数受信者に自動購読させる
  const eventId = `PZM0DZCP2XMTXZQRW5A0ECY431PW`;
  const res = await getSubscriptionList({});
  const subscriptionIdList = res.items.map((itemInfo) => {
    return itemInfo.id;
  });
  for (let index = 0; index < subscriptionIdList.length; index++) {
    const subscriptionId = subscriptionIdList[index];
    const recipientData = await readFile();
    const broadcastInfoList = recipientData.broadcastInfoList.map(itemInfo=>{return itemInfo.recipientId});
    const resultInfo = await subscribe({
      eventId,
      subscriptionId,
      recipientIdList: broadcastInfoList,
    });
    console.log(resultInfo);
  }
})();
