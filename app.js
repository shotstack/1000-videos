require("dotenv").config();

const fs = require("fs");
const axios = require("axios").default;
const csv = require("fast-csv");
const argv = require("yargs").argv;
const numWords = require("num-words");
const getAge = require("get-age");
const capitalize = require("capitalize");
const Throttle = require("throttle-stream");

const USER_LIST = "./user-list-test.csv";
const VIDEO_LIST = "./video-list.csv";
const API_KEY = process.env.SHOTSTACK_KEY;
const ENDPOINT = process.env.SHOTSTACK_ENDPOINT;
const CUSTOMER_ID = process.env.SHOTSTACK_CUSTOMER_ID;
const PREVIEW_URL = process.env.SHOTSTACK_PREVIEW_URL;
const TEMPLATE = fs.readFileSync("./template.json", "utf8");
const fileStream = fs.createWriteStream(VIDEO_LIST, { flags: "a" });

let count = 0;

fs.createReadStream(USER_LIST)
  .pipe(new Throttle({ bytes: 200, interval: 1000 }))
  .pipe(csv.parse())
  .on("data", (row) => {
    let age = getAge(row[1]);
    let ageInWords = capitalize.words(numWords(age));

    var mapObj = {
      firstName: row[0],
      age: ageInWords,
      fakeAge: row[2],
      discountCode: row[3],
      discount: row[4],
    };

    let template = JSON.parse(
      JSON.stringify(TEMPLATE).replace(
        /firstName|age|fakeAge|discountCode|discount/gi,
        function (matched) {
          return mapObj[matched];
        }
      )
    );

    axios({
      method: "post",
      url: ENDPOINT,
      headers: {
        "x-api-key": API_KEY,
        "content-type": "application/json",
      },
      data: template,
    }).then(
      (response) => {
        if (response.status !== 201) {
          console.log(row[0], response.data.response.id);
          return;
        }

        let video = response.data.response.id + ".mp4";
        fileStream.write(`${row[0]},${PREVIEW_URL}${CUSTOMER_ID}/${video}\n`);
        console.log("Video queued for: " + row[0]);
      },
      (error) => {
        throw error;
      }
    );
  });