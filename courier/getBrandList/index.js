import { config } from "dotenv";
import fetch from "node-fetch";

config();

function getData({}) {
  return new Promise(async (resolve, reject) => {
    try {
      // https://www.courier.com/docs/reference/events/list/
      const response = await fetch(`https://api.courier.com/preferences`, {
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

(async () => {
  const resultInfo = await getData({});
  console.log(resultInfo);
})();
