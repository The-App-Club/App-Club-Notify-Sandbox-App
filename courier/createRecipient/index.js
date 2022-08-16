// Install with: npm install @trycourier/courier
import { CourierClient } from "@trycourier/courier";
import { v4 as uuid } from "uuid";
import { config } from "dotenv";
// https://www.courier.com/docs/reference/profiles/create/
import fetch from "node-fetch";
import { readFileSync } from "fs";

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

function createPostData({ email }) {
  return {
    profile: {
      address: {},
      email: email,
      airship: {
        audience: {},
        device_types: [],
      },
      intercom: {
        to: {},
      },
      webhook: {
        authentication: {},
      },
    },
  };
}

function postData({ recipientId, willCreatedPostData }) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `https://api.courier.com/profiles/${recipientId}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.COOL_COURIER_API_KEY}`,
          },
          body: JSON.stringify(willCreatedPostData),
        }
      );
      const json = await response.json();
      resolve(json);
    } catch (error) {
      reject(error);
    }
  });
}

(async () => {
  const res = await readFile();
  const willCreatedPostData = createPostData({ email: res.email });
  const recipientId = `${uuid()}`;
  const resultInfo = await postData({
    recipientId,
    willCreatedPostData,
  });
  console.log(Object.assign(resultInfo, { recipientId, email: res.email }));
})();
