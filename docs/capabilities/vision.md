---
id: vision
title: Vision
sidebar_position: 2.21
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Our latest Pixtral 12B introduces vision capabilities, enabling it to analyze images and provide insights based on visual content in addition to text. This multimodal approach opens up new possibilities for applications that require both textual and visual understanding.

## Passing an Image URL
If the image is hosted online, you can simply provide the URL of the image in the request. This method is straightforward and does not require any encoding.



<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```python
import os
from mistralai import Mistral

# Retrieve the API key from environment variables
api_key = os.environ["MISTRAL_API_KEY"]

# Specify model
model = "pixtral-12b-2409"

# Initialize the Mistral client
client = Mistral(api_key=api_key)

# Define the messages for the chat
messages = [
    {
        "role": "user",
        "content": [
            {
                "type": "text",
                "text": "What's in this image?"
            },
            {
                "type": "image_url",
                "image_url": "https://tripfixers.com/wp-content/uploads/2019/11/eiffel-tower-with-snow.jpeg"
            }
        ]
    }
]

# Get the chat response
chat_response = client.chat.complete(
    model=model,
    messages=messages
)

# Print the content of the response
print(chat_response.choices[0].message.content)

```


  </TabItem>
  <TabItem value="typescript" label="typescript">
```typescript
import { Mistral } from "@mistralai/mistralai";

const apiKey = process.env["MISTRAL_API_KEY"];

const client = new Mistral({ apiKey: apiKey });

const chatResponse = await client.chat.complete({
  model: "pixtral-12b",
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "What's in this image?" },
        {
          type: "image_url",
          imageUrl: "https://tripfixers.com/wp-content/uploads/2019/11/eiffel-tower-with-snow.jpeg",
        },
      ],
    },
  ],
});

console.log("JSON:", chatResponse.choices[0].message.content);
```
  </TabItem>
  <TabItem value="curl" label="curl">
```bash
curl https://api.mistral.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MISTRAL_API_KEY" \
  -d '{
    "model": "pixtral-12b-2409",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "What’s in this image?"
          },
          {
            "type": "image_url",
            "image_url": "https://tripfixers.com/wp-content/uploads/2019/11/eiffel-tower-with-snow.jpeg"
          }
        ]
      }
    ],
    "max_tokens": 300
  }'
```
  </TabItem>
</Tabs>

## Passing a Base64 Encoded Image
If you have an image or a set of images stored locally, you can pass them to the model in base64 encoded format. Base64 encoding is a common method for converting binary data into a text format that can be easily transmitted over the internet. This is particularly useful when you need to include images in API requests.

<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```py
import base64
import requests
import os
from mistralai import Mistral

def encode_image(image_path):
    """Encode the image to base64."""
    try:
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')
    except FileNotFoundError:
        print(f"Error: The file {image_path} was not found.")
        return None
    except Exception as e:  # Added general exception handling
        print(f"Error: {e}")
        return None

# Path to your image
image_path = "path_to_your_image.jpg"

# Getting the base64 string
base64_image = encode_image(image_path)

# Retrieve the API key from environment variables
api_key = os.environ["MISTRAL_API_KEY"]

# Specify model
model = "pixtral-12b-2409"

# Initialize the Mistral client
client = Mistral(api_key=api_key)

# Define the messages for the chat
messages = [
    {
        "role": "user",
        "content": [
            {
                "type": "text",
                "text": "What's in this image?"
            },
            {
                "type": "image_url",
                "image_url": f"data:image/jpeg;base64,{base64_image}" 
            }
        ]
    }
]

# Get the chat response
chat_response = client.chat.complete(
    model=model,
    messages=messages
)

# Print the content of the response
print(chat_response.choices[0].message.content)
```

  </TabItem>
  <TabItem value="typescript" label="typescript">

```typescript
import { Mistral } from "@mistralai/mistralai";
import type { ChatCompletionRequest } from "@mistralai/mistralai/models/components";
import fs from "fs";
import path from "path";

// Retrieving the API key from our environment
const apiKey = process.env["MISTRAL_API_KEY"];
// path to the image we want to encode to base64
const imagePath = path.join(__dirname, "path_to_your_image.jpeg");

// Encoding the image to Base 64
const base64 = base64_encode(imagePath);

// Initializing a Mistral Client with our API Key
const client = new Mistral({ apiKey: apiKey });

// Specifying the model we want to use
const model = "pixtral-12b-2409";

function base64_encode(file: string) {
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString("base64");
}

// Defining our Messages
const messages: ChatCompletionRequest["messages"] = [
  {
    role: "user",
    content: [
      { type: "text", text: "What's in this image?" },
      {
        type: "image_url",
        // Important here, we pass on "data:image/jpeg;base64," so that Mistral knows what we are encoding.
        imageUrl: "data:image/jpeg;base64," + base64,
      },
    ],
  },
];

// Getting the text response
const chatResponse = await client.chat.complete({
  model: model,
  messages: messages,
});

// Logging the response
console.log("Response: ", chatResponse.choices?.[0].message.content);
```

  </TabItem>
</Tabs>

## Use cases
<details>
<summary><b>Understand charts</b></summary>

![](https://cdn.statcdn.com/Infographic/images/normal/30322.jpeg)

```bash
curl https://api.mistral.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MISTRAL_API_KEY" \
  -d '{
    "model": "pixtral-12b-2409",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "What’s in this image?"
          },
          {
            "type": "image_url",
            "image_url": "https://cdn.statcdn.com/Infographic/images/normal/30322.jpeg"
          }
        ]
      }
    ],
    "max_tokens": 300
  }'
```

Model output: 
```
The chart is a bar chart titled 'France's Social Divide,' comparing socio-economic indicators between disadvantaged areas and the whole of France. It comprises two sections: the first section includes three bar groups representing the percentage of people part of the working-class, unemployment rate, and percentage of 16-25-year-olds not in school and unemployed. The second section includes three bar groups representing median monthly income, poverty rate, and households living in overcrowded housing. Each bar group contains two bars: one for disadvantaged areas (red) and one for the whole of France (blue). The data indicate that disadvantaged areas have higher percentages of working-class individuals (33.5% vs. 14.5%), unemployment (18.1% vs. 7.3%), and young people not in school and unemployed (25.2% vs. 12.9%). They also show a lower median monthly income (€1,168 vs. €1,822), a higher poverty rate (43.3% vs. 15.5%), and a higher percentage of households living in overcrowded housing (22.0% vs. 8.7%). The chart highlights significant disparities in socio-economic conditions between disadvantaged areas and the rest of France, emphasizing the challenges faced by these communities.
```

</details>

<details>
<summary><b>Compare images</b></summary>

![](https://tripfixers.com/wp-content/uploads/2019/11/eiffel-tower-with-snow.jpeg)

![](https://assets.visitorscoverage.com/production/wp-content/uploads/2024/04/AdobeStock_626542468-min-1024x683.jpeg)

```bash
curl https://api.mistral.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MISTRAL_API_KEY" \
  -d '{
    "model": "pixtral-12b-2409",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "what are the differences between two images?"
          },
          {
            "type": "image_url",
            "image_url": "https://tripfixers.com/wp-content/uploads/2019/11/eiffel-tower-with-snow.jpeg"
          },
          {
            "type": "image_url",
            "image_url": {
              "url": "https://assets.visitorscoverage.com/production/wp-content/uploads/2024/04/AdobeStock_626542468-min-1024x683.jpeg"
            }
          }
        ]
      }
    ],
    "max_tokens": 300
  }'
```

Model output: 
```
The first image features the Eiffel Tower surrounded by snow-covered trees and pathways, with a clear view of the tower's intricate iron lattice structure. The second image shows the Eiffel Tower in the background of a large, outdoor stadium filled with spectators, with a red tennis court in the center. The most notable differences are the setting - one is a winter scene with snow, while the other is a summer scene with a crowd at a sporting event. The mood of the first image is serene and quiet, whereas the second image conveys a lively and energetic atmosphere. These differences highlight the versatility of the Eiffel Tower as a landmark that can be enjoyed in various contexts and seasons.
```

</details>

<details>
<summary><b>Transcribe receipts</b></summary>

![](https://www.boredpanda.com/blog/wp-content/uploads/2022/11/interesting-receipts-102-6364c8d181c6a__700.jpg)

```bash
curl https://api.mistral.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MISTRAL_API_KEY" \
  -d '{
    "model": "pixtral-12b-2409",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "transcribe this receipt"
          },
          {
            "type": "image_url",
            "image_url": "https://www.boredpanda.com/blog/wp-content/uploads/2022/11/interesting-receipts-102-6364c8d181c6a__700.jpg"
          }
        ]
      }
    ]
  }'

```

Model output: 
```
\nDine-In\n\nReceipt Details\nDate: 02-Apr-2022\nTime: 5:01:56 PM\nCashier: Raul\n\nItems Purchased:\n1 Empanada - Beef         $3.00\n1 Empanada - Cheese       $3.00\n1 Empanada - Chicken      $3.00\n1 Tallarin Huancaina Lomo Saltado  $19.99\n1 1/2 Pisco Sour          $15.00\n\nSubtotal                   $43.99\nLocal Taxes (5.5%)        $2.42\nTotal                     $46.41\n\nMessage: IMMIGRANTS MAKE AMERICA GREAT THEY ALSO COOKED YOUR FOOD AND SERVED YOU TODAY GOD BLESS YOU\n\nOrder ID: D0BQZ3R656MDC\n\nLinks:\n- Online Ordering: https://clover.com/r/D0BQZ3R656MDC\n- Clover Privacy Policy: https://clover.com/privacy\n
```

</details>


<details>
<summary><b>Transcribe old documents</b></summary>

![](https://ciir.cs.umass.edu/irdemo/hw-demo/page_example.jpg)

```bash
curl https://api.mistral.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MISTRAL_API_KEY" \
  -d '{
    "model": "pixtral-12b-2409",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "transcribe this"
          },
          {
            "type": "image_url",
            "image_url": "https://ciir.cs.umass.edu/irdemo/hw-demo/page_example.jpg"
          }
        ]
      }
    ]
  }'

```

Model output: 
```
# Letters Orders and Instructions December 1855\n\n**Hoag's Company, if any opportunity offers.**\n\nYou are to be particularly exact and careful in these pagineries, that there is no disgrace meet between the Returns and you Pay Roll, or those who will be strict examining into it hereafter.\n\nI am & c.\n\n*[Signed]*\nEff.
```

</details>

<details>
<summary><b>OCR with structured output</b></summary>

![](https://i.imghippo.com/files/kgXi81726851246.jpg)

```bash
curl https://api.mistral.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MISTRAL_API_KEY" \
  -d '{
    "model": "pixtral-12b-2409",
    "messages": [
            {
                "role": "system",
                "content": [
                    {"type": "text",
                     "text" : "Extract the text elements described by the user from the picture, and return the result formatted as a json in the following format : {name_of_element : [value]}"
                    }
                ]
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "From this restaurant bill, extract the bill number, item names and associated prices, and total price and return it as a string in a Json object"
                    },
                    {
                        "type": "image_url",
                        "image_url": "https://i.imghippo.com/files/kgXi81726851246.jpg"
                    }
                ]
            }
        ],
    "response_format": 
      {
        "type": "json_object"
      }
  }'

```

Model output: 
```json
{'bill_number': '566548',
 'items': [{'item_name': 'BURGER - MED RARE', 'price': 10},
  {'item_name': 'WH/SUB POUTINE', 'price': 2},
  {'item_name': 'BURGER - MED RARE', 'price': 10},
  {'item_name': 'WH/SUB BSL - MUSH', 'price': 4},
  {'item_name': 'BURGER - MED WELL', 'price': 10},
  {'item_name': 'WH BREAD/NO ONION', 'price': 2},
  {'item_name': 'SUB POUTINE - MUSH', 'price': 2},
  {'item_name': 'CHK PESTO/BR', 'price': 9},
  {'item_name': 'SUB POUTINE', 'price': 2},
  {'item_name': 'SPEC OMELET/BR', 'price': 9},
  {'item_name': 'SUB POUTINE', 'price': 2},
  {'item_name': 'BSL', 'price': 8}],
 'total_price': 68}
```

</details>

## FAQ
- What is the price per image?

    The price is calculated using the same pricing as input tokens. Each image will be divided into batches of 16x16 pixels, with each batch converted to a token. As a rule of thumb, an image with a resolution of "ResolutionX"x"ResolutionY" will consume approximately `(ResolutionX/16) * (ResolutionY/16)` tokens.    
    For example, a 720x512 image will consume approximately `(720/16) * (512/16)` ≈ 1440 tokens.  
    Note that all images with a resolution higher than 1024x1024 will be downscaled while maintaining the same aspect ratio. For instance, a 1436x962 image will be downscaled to approximately 1024x686, consuming around `(1024/16) * (686/16)` ≈ 2600 tokens.
  
- Can I fine-tune the image capabilities in Pixtral 12B?

    No, we do not currently support fine-tuning the image capabilities of Pixtral 12B.

- Can I use Pixtral 12B to generate images?

    No, Pixtral 12B is designed to understand and analyze images, not to generate them.

- What types of image files are supported?
    
    We currently support the following image formats:

    - PNG (.png)
    - JPEG (.jpeg and .jpg)
    - WEBP (.webp) 
    - Non-animated GIF with only one frame (.gif) 

- Is there a limit to the size of the image?

    The current file size limit is 10Mb. 

- What's the maximum number images per request? 

    The maximum number images per request via API is 8.

- What is the rate limit for Pixtral 12B?

    For information on rate limits, please visit https://console.mistral.ai/limits/.



