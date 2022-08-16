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

function unsubscribe({ recipientId }) {
  // https://www.courier.com/docs/reference/profiles/remove-subscription/
  return new Promise(async (resolve, reject) => {
    try {
      const options = {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.COOL_COURIER_API_KEY}`,
        },
      };

      // https://www.courier.com/docs/reference/lists/put-subscribe/
      const response = await fetch(
        `https://api.courier.com/profiles/${recipientId}/lists`,
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
  const res = await readFile();
  const broadcastInfoList = res.broadcastInfoList;
  for (let index = 0; index < broadcastInfoList.length; index++) {
    const broadcastInfo = broadcastInfoList[index];
    const resultInfo = await unsubscribe({
      recipientId: broadcastInfo.recipientId,
    });
    console.log(resultInfo);
  }
})();
