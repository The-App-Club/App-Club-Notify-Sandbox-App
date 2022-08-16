import { config } from "dotenv";
import fetch from "node-fetch";

config();

function getData({ recipientId }) {
  return new Promise(async (resolve, reject) => {
    try {
      // https://www.courier.com/docs/reference/profiles/by-id/
      const response = await fetch(
        `https://api.courier.com/profiles/${recipientId}`,
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
    } catch (error) {
      reject(error);
    }
  });
}

(async () => {
  const resultInfo = await getData({
    recipientId: "6720e40f-4c8d-44e8-acb2-8b1aa4976dda",
  });
  console.log(resultInfo);
})();
