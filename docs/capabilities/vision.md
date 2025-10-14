---
id: vision
title: Vision
sidebar_position: 2
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Vision capabilities enable models to analyze images and provide insights based on visual content in addition to text. This multimodal approach opens up new possibilities for applications that require both textual and visual understanding.

For more specific use cases regarding document parsing and data extraction we recommend taking a look at our Document AI stack [here](../document_ai/document_ai_overview).

## Models with Vision Capabilities:
- Mistral Medium 3.1 2508 (`mistral-medium-latest`)
- Mistral Small 3.2 2506 (`mistral-small-latest`)
- Magistral Small 1.2 2509 (`magistral-small-latest`)
- Magistral Medium 1.2 2509 (`magistral-medium-latest`)
- Pixtral 12B (`pixtral-12b-latest`)
- Pixtral Large 2411 (`pixtral-large-latest`)

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
                "image_url": "https://docs.mistral.ai/img/eiffel-tower-paris.jpg"
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
          imageUrl: "https://docs.mistral.ai/img/eiffel-tower-paris.jpg",
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
            "image_url": "https://docs.mistral.ai/img/eiffel-tower-paris.jpg"
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


```ts
import { Mistral } from "@mistralai/mistralai";
import fs from 'fs';

async function encodeImage(imagePath) {
    try {
        // Read the image file as a buffer
        const imageBuffer = fs.readFileSync(imagePath);

        // Convert the buffer to a Base64-encoded string
        const base64Image = imageBuffer.toString('base64');
        return base64Image;
    } catch (error) {
        console.error(`Error: ${error}`);
        return null;
    }
}

// Path to your image
const imagePath = "path_to_your_image.jpg"

// Getting the base64 string
const base64Image = await encodeImage(imagePath)

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
          imageUrl: f"data:image/jpeg;base64," + base64Image,
        },
      ],
    },
  ],
});
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
            "image_url": "data:image/jpeg;base64,<base64_image>"
          }
        ]
      }
    ],
    "max_tokens": 300
  }'
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
<summary><b>OCR old documents</b></summary>

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

## FAQ

- **What is the price per image?**

    The price is calculated using the same pricing as input tokens per image, with each image being tokenized.

- **How many tokens correspond to an image and/or what is the maximum resolution?**

    Depending on the model and resolution, an image will be tokenized differently. Below is a summary.

    | Model | Max Resolution | ≈ Formula | ≈ N Max Tokens |
    | - | - | - | - |
    | Magistral Medium 1.2 | 1540x1540 | `≈ (ResolutionX * ResolutionY) / 784` | ≈ 3025 |
    | Magistral Small 1.2 | 1540x1540 | `≈ (ResolutionX * ResolutionY) / 784` | ≈ 3025 |
    | Mistral Small 3.2 | 1540x1540 | `≈ (ResolutionX * ResolutionY) / 784` | ≈ 3025 |
    | Mistral Medium 3 | 1540x1540 | `≈ (ResolutionX * ResolutionY) / 784` | ≈ 3025 |
    | Mistral Small 3.1 | 1540x1540 | `≈ (ResolutionX * ResolutionY) / 784` | ≈ 3025 |
    | Pixtral Large | 1024x1024 | `≈ (ResolutionX * ResolutionY) / 256` | ≈ 4096 |
    | Pixtral 12B | 1024x1024 | `≈ (ResolutionX * ResolutionY) / 256` | ≈ 4096 |

    If the resolution of the image sent is higher than the maximum resolution of the model, the image will be downscaled to its maximum resolution. An error will be sent if the resolution is higher than **10000x10000**.

- **Can I fine-tune the image capabilities?**

    Yes, you can fine-tune pixtral-12b.

- **Can I use them to generate images?**

    No, they are designed to understand and analyze images, not to generate them.

- **What types of image files are supported?**
    
    We currently support the following image formats:

    - PNG (.png)
    - JPEG (.jpeg and .jpg)
    - WEBP (.webp) 
    - Non-animated GIF with only one frame (.gif) 

- **Is there a limit to the size of the image?**

    The current file size limit is 10Mb. 

- **What's the maximum number images per request?** 

    The maximum number images per request via API is 8.

- **What is the rate limit?**

    For information on rate limits, please visit https://console.mistral.ai/limits/.
