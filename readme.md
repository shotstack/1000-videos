# How I built 1,000 personalised videos in 60 seconds
In this article, we will show you how to build 1,000 personalized birthday videos for 1,000 different people. This is
close to impossible to do using traditional video editors such as Adobe [Premiere](https://www.adobe.com/au/products/premiere.html)
and After [Effects](https://www.adobe.com/au/products/aftereffects.html), with specialized personalization agencies
charging tens of thousands of dollars for this type of service.

The Shotstack API allows you to render tens of thousands of videos in the cloud, and personalise each individual video
through small changes to a JSON file.

With our API capable of rendering hundreds videos concurrently in the cloud, **the ability to work at enormous scale
allows you to render all 1,000 of our videos in less than 30 seconds.**

# Getting started

## Shotstack API key

You can sign up for a [free developer account](https://dashboard.shotstack.io/register).

Just be aware of throttling as the free account allows for 1 request per second.

## Personalised videos using Node.js

I'll use vanilla javascript through [Node.js](https://nodejs.org/en/) to build the application, but feel free to use what works for you. We have SDKs available for [PHP](https://github.com/shotstack/shotstack-sdk-php), [Node](https://github.com/shotstack/shotstack-sdk-node), [Ruby](https://github.com/shotstack/shotstack-sdk-ruby) and [Python](https://github.com/shotstack/shotstack-sdk-python).

### Personalised videos using Integromat

You can also use our [Make app](https://www.make.com/en/integrations/shotstack?pc=shotstack) to achieve the same result without using any code at all.

# Choosing our footage

I built a promotional video which we'll use to offer our fictitious customers a discount on their birthday. This video has
been completely built within Shotstack, but you can achieve the same result using a pre-rendered video built in a video editing
solution such as After Effects.

https://youtu.be/01I6xFbhXFE

We'll remove some of the video's content, and use those empty spaces for our personalised data. This data will be placed into
a JSON file, and will place back all of those missing items with new values and animations.

For this particular template we'll personalise the name, age, their younger "fake" age, the discount code, and the discount
amount.

https://youtu.be/2rijxKxUdXY

Shotstack uses a JSON object that acts like an editable timeline. This works in a similar fashion to how any desktop video
editing solution would work, with a timeline representing the video duration, and individual clips allowing you to manipulate its content.

For this article I won't go into how this video was built, but if you're interested in understanding how this particular video
was edited you can [take a closer look at](https://gist.github.com/derkzomer/78cc7527d293fd1b8b26fc29c063c931) the JSON template.
And if you're really keen [this tutorial](https://shotstack.io/learn/hello-world) goes a little deeper into how you can design these videos yourself.

For this example we'll use a simplified template where the animations have been pre-rendered, making it easy for us to add in
specific HTML assets where our personalised content should go:

```json
{
  "timeline": {
    "fonts": [
      {
        "src": "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/fonts/FiraCode-Regular.ttf"
      },
      {
        "src": "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/fonts/Nexa-Bold.otf"
      }
    ],
    "background": "#000000",
    "tracks": [
      {
        "clips": [
          {
            "asset": {
              "type": "html",
              "html": "<p>firstName</p>",
              "css": "p { font-family: \"Nexa Bold\"; font-size: 128px; color: #ffffff; text-align: left; }"
            },
            "start": 2.35,
            "length": 1.45,
            "offset": {
              "y": -0.23,
              "x": 0.05
            },
            "transition": {
              "out": "carouselDown"
            }
          },
          {
            "asset": {
              "type": "html",
              "html": "<p><b>age</b></p>",
              "css": "p { font-family: \"Nexa Bold\"; font-size: 149px; color: white; text-align: left; }"
            },
            "position": "center",
            "start": 5.2,
            "length": 1.3,
            "offset": {
              "y": -0.23,
              "x": 0.05
            },
            "transition": {
              "in": "zoom",
              "out": "zoom"
            }
          },
          {
            "asset": {
              "type": "html",
              "html": "<p><b>fakeAge</b></p>",
              "css": "p { font-family: \"Nexa Bold\"; font-size: 384px; color: #ffffff; text-align: left;}"
            },
            "position": "center",
            "start": 11.15,
            "length": 2.5,
            "offset": {
              "y": -0.05,
              "x": 0.05
            },
            "transition": {
              "out": "carouselLeft"
            }
          },
          {
            "asset": {
              "type": "html",
              "html": "<p>discountCode</p>",
              "css": "p { font-family: \"Fira Coda\"; font-size: 42px; color: #3498db; text-align: center; background-color: #ffffff; padding: 32px; line-height: 106px; }",
              "width": 320,
              "height": 107
            },
            "start": 17.2,
            "length": 4.8,
            "offset": {
              "y": -0.05,
              "x": 0
            }
          },
          {
            "asset": {
              "type": "html",
              "html": "<p>For discount Off</p>",
              "css": "p { font-family: \"Nexa Bold\"; font-size: 58px; color: #3498db; text-align: left;} span { color: #e74c3c; }"
            },
            "start": 19.2,
            "length": 1.2,
            "offset": {
              "y": -0.302,
              "x": 0.04
            }
          },
          {
            "asset": {
              "type": "html",
              "html": "<p>For <span>discount Off</span></p>",
              "css": "p { font-family: \"Nexa Bold\"; font-size: 58px; color: #3498db; text-align: left;} span { color: #e74c3c; }"
            },
            "start": 20.3,
            "length": 1.7,
            "offset": {
              "y": -0.302,
              "x": 0.04
            }
          }
        ]
      },
      {
        "clips": [
          {
            "asset": {
              "type": "video",
              "src": "https://shotstack-content.s3-ap-southeast-2.amazonaws.com/birthday/birthday-template.mp4",
              "volume": 1
            },
            "start": 0,
            "length": 22
          }
        ]
      }
    ]
  },
  "output": {
    "format": "mp4",
    "resolution": "sd"
  }
}
```

# Personalise videos using a spreadsheet

For our customers we'll use a dataset with information on about 1,000 concocted users. This will include their name, age, fake age,
their discount code, and the discount amount. We will then use the data in this CSV to fill in the JSON template and send it to the
API. You can find the complete [spreadsheet](https://gist.github.com/derkzomer/154768b3c6f4a84e6fd71a31b53e92ce) on GitHub.

# Create videos from CSV data

The only thing you need to do now is iterate over the CSV file, add those personalised datapoints to the JSON template, and send
each video edit to the API for rendering.

The below script works using an .env environment file with the Shotstack API key details in it. You can take a look at my
[.env file](https://gist.github.com/derkzomer/683737119911be3a2a73fe5520bb9b7e) to see how we can use environment
variables in our script.

```javascript
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
```

# The result - 1000 personalised videos

Once you run the script you'll see all thousand personalised templates be sent through to the API for rendering, and all output
data will end up in a CSV file called video-list.csv, which will include the urls for each individual video.
Image for post

![A small sample of the 10,000 personalised videos created](https://shotstack.io/assets/img/learn/articles/birthday-mosaic.jpg)

The below list contains the first 20 videos, but if you don't believe me you can find the whole list [here](https://gist.github.com/derkzomer/33c0301bbd5024d8a8a7fe6560afe487).

<script src="https://gist.github.com/derkzomer/a7e3d29d1bbdd2a02b5d79c62321315f.js"></script>

# So what next?

Personalised marketing [has shown](https://www.forbes.com/sites/jiawertz/2018/08/31/personalized-video-content-can-be-the-marketing-breakthrough-brands-need/?sh=3974fbf32e6f)
to lead to higher email open rates, higher click-through rates, better engagement, and provides you with a new way to build relationships with your audience.

The above only shows you a small example of what can be done by personalising videos at scale. You can use Shotstack to build
personalised media experiences for your customers and automate your customer engagement by linking Shotstack to Sendgrid via
Integromat, or many other hyper-personalised automations that takes your customer engagement strategy to the next level.
