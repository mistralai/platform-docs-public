---
id: vision
title: Vision
sidebar_position: 2
---

# Vision

Vision capabilities enable models to **analyze images and provide insights based on visual content** in addition to text. This multimodal approach opens up new possibilities for applications that require both textual and visual understanding.

We provide a variety of models with vision capabilities, all available via the Chat Completions API.

:::tip
For document parsing, OCR, and data extraction, see [Document AI](/studio-api/document-processing/overview).
:::

<SectionTab as="h1" sectionId="before-you-start">Before You Start</SectionTab>

### Recommended Models with Vision Capabilities

- **Mistral Large 3** via `mistral-large-2512`
- **Mistral Medium 3.1** via `mistral-medium-2508`
- **Mistral Small 3.2** via `mistral-small-2506`
- **Ministral 3**:
  - Ministral 3 14B via `ministral-14b-2512`
  - Ministral 3 8B via `ministral-8b-2512`
  - Ministral 3 3B via `ministral-3b-2512`

<SectionTab as="h1" sectionId="passing-an-image">Sending an Image</SectionTab>

### Use Vision Models

There are two ways to send an image to the Chat Completions API, either by passing a URL or by passing a base64 encoded image.

:::tip
Before continuing, we recommend reading the [Chat Completions](/studio-api/conversations/chat-completion) documentation to learn more about the chat completions API and how to use it before proceeding.
:::

<ExplorerTabs id="passing-an-image">
  <ExplorerTab value="passing-an-image-url" label="Passing an Image URL">
    If the image is hosted online, you can simply provide the **publicaly accessible URL of the image** in the request. This method is straightforward and does not require any encoding.

<Tabs groupId="code">
    <TabItem value="python" label="python" default>
        <Tabs groupId="sdk-version">
            <TabItem value="v1" label="V1" default>

```python
import os
from mistralai import Mistral

api_key = os.environ["MISTRAL_API_KEY"]
model = "mistral-small-latest"

client = Mistral(api_key=api_key)

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

chat_response = client.chat.complete(
    model=model,
    messages=messages
)
```

            </TabItem>
            <TabItem value="v2" label="V2">

```python
import os
from mistralai.client import Mistral

api_key = os.environ["MISTRAL_API_KEY"]
model = "mistral-small-latest"

client = Mistral(api_key=api_key)

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

chat_response = client.chat.complete(
    model=model,
    messages=messages
)
```

            </TabItem>
        </Tabs>
    </TabItem>
    <TabItem value="typescript" label="typescript">

```typescript

const apiKey = process.env['MISTRAL_API_KEY'];

const client = new Mistral({ apiKey: apiKey });

const chatResponse = await client.chat.complete({
  model: 'mistral-small-latest',
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: "What's in this image?" },
        {
          type: 'image_url',
          imageUrl:
            'https://docs.mistral.ai/img/eiffel-tower-paris.jpg',
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
    "model": "mistral-small-latest",
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
    ]
  }'
```

    </TabItem>
    <TabItem value="output" label="output">

```json
{
    "id": "a8251fb1c4a64014b80141bd5685f6c7",
    "created": 1756318369,
    "model": "mistral-small-latest",
    "usage": {
    "prompt_tokens": 2099,
    "total_tokens": 2235,
    "completion_tokens": 136
    },
    "object": "chat.completion",
    "choices": [
    {
        "index": 0,
        "finish_reason": "stop",
        "message": {
        "role": "assistant",
        "tool_calls": null,
        "content": "The image depicts the Eiffel Tower, an iconic landmark located in Paris, France. The photograph is taken from a low angle, looking up towards the sky, emphasizing the tower's impressive height and intricate iron lattice structure. The Eiffel Tower is composed of three main levels, each offering viewing platforms for visitors. The sky is clear and blue, providing a striking contrast to the brownish hue of the iron tower. The base of the tower is framed by trees, adding a touch of natural greenery to the scene. In the background, beyond the tower, some buildings are visible, indicating the urban setting of the Eiffel Tower in the heart of Paris."
        }
    }
    ]
}
```
    </TabItem>
</Tabs>
  </ExplorerTab>
  <ExplorerTab value="passing-a-base64-encoded-image" label="Passing a Base64 Encoded Image">
    If you have an image or a set of images stored locally, you can pass them to the model in **base64 encoded format**. Base64 encoding is a common method for converting binary data into a text format that can be easily transmitted over the internet. This is particularly useful when you need to include images in API requests.

<Tabs groupId="code">
    <TabItem value="python" label="python" default>
        <Tabs groupId="sdk-version">
            <TabItem value="v1" label="V1" default>

```py
import base64
import requests
import os
from mistralai import Mistral

api_key = os.environ["MISTRAL_API_KEY"]
model = "mistral-small-latest"

client = Mistral(api_key=api_key)

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

image_path = "eiffel-tower-paris.jpg" # path to your image
base64_image = encode_image(image_path)

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

chat_response = client.chat.complete(
    model=model,
    messages=messages
)
```

            </TabItem>
            <TabItem value="v2" label="V2">

```py
import base64
import requests
import os
from mistralai.client import Mistral

api_key = os.environ["MISTRAL_API_KEY"]
model = "mistral-small-latest"

client = Mistral(api_key=api_key)

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

image_path = "eiffel-tower-paris.jpg" # path to your image
base64_image = encode_image(image_path)

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

chat_response = client.chat.complete(
    model=model,
    messages=messages
)
```

            </TabItem>
        </Tabs>
    </TabItem>
    <TabItem value="typescript" label="typescript">

```ts

const apiKey = process.env["MISTRAL_API_KEY"];

const client = new Mistral({ apiKey: apiKey });

async function encodeImage(imagePath) {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    return base64Image;
}

const imagePath = "eiffel-tower-paris.jpg"; // path to your image
const base64Image = await encodeImage(imagePath)

const chatResponse = await client.chat.complete({
  model: "mistral-small-latest",
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "What's in this image?" },
        {
          type: "image_url",
          imageUrl: "data:image/jpeg;base64," + base64Image,
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
    "model": "mistral-small-latest",
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
    ]
  }'
```

    </TabItem>
    <TabItem value="output" label="output">

```json
{
  "id": "fc486ba226804d92b07d1b5ba8f18ee7",
  "created": 1756318720,
  "model": "mistral-small-latest",
  "usage": {
    "prompt_tokens": 2099,
    "total_tokens": 2214,
    "completion_tokens": 115
  },
  "object": "chat.completion",
  "choices": [
    {
      "index": 0,
      "finish_reason": "stop",
      "message": {
        "role": "assistant",
        "tool_calls": null,
        "content": "The image showcases the Eiffel Tower, an iconic landmark located in Paris, France. The photograph is taken from a low angle, emphasizing the tower's impressive height and intricate iron lattice structure. The sky is clear and blue, providing a striking contrast to the brownish hue of the Eiffel Tower. The base of the tower is visible, with its characteristic arches and detailed ironwork. In the background, some trees and buildings can be seen, adding depth to the image. The overall composition highlights the architectural beauty and grandeur of the Eiffel Tower."
      }
    }
  ]
}
```
    </TabItem>
</Tabs>
  </ExplorerTab>
</ExplorerTabs>

<SectionTab as="h1" sectionId="use-cases">Use cases</SectionTab>

Below you can find a few examples of use cases leveraging our models vision, from understanding graphs to extract data, the use cases are diverse.

:::note
These are simple examples you can use as inspiration to build your own use cases. For OCR and structured outputs, see [Document AI](/studio-api/document-processing).
:::

<ExplorerTabs id="use-cases" mode="close">
  <ExplorerTab value="understand-charts" label="Charts">
    ![](https://cdn.statcdn.com/Infographic/images/normal/30322.jpeg)

<Tabs groupId="code">
  <TabItem value="curl" label="curl" default>

```bash
curl https://api.mistral.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MISTRAL_API_KEY" \
  -d '{
    "model": "ministral-14b-latest",
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

    </TabItem>
    <TabItem value="output" label="output">

```
The chart is a bar chart titled 'France's Social Divide,' comparing socio-economic indicators between disadvantaged areas and the whole of France. It comprises two sections: the first section includes three bar groups representing the percentage of people part of the working-class, unemployment rate, and percentage of 16-25-year-olds not in school and unemployed. The second section includes three bar groups representing median monthly income, poverty rate, and households living in overcrowded housing. Each bar group contains two bars: one for disadvantaged areas (red) and one for the whole of France (blue). The data indicate that disadvantaged areas have higher percentages of working-class individuals (33.5% vs. 14.5%), unemployment (18.1% vs. 7.3%), and young people not in school and unemployed (25.2% vs. 12.9%). They also show a lower median monthly income (€1,168 vs. €1,822), a higher poverty rate (43.3% vs. 15.5%), and a higher percentage of households living in overcrowded housing (22.0% vs. 8.7%). The chart highlights significant disparities in socio-economic conditions between disadvantaged areas and the rest of France, emphasizing the challenges faced by these communities.
```

    </TabItem>
</Tabs>
  </ExplorerTab>
  <ExplorerTab value="compare-images" label="Compare images">
    <Image
  url='/img/eiffel-tower-paris.jpg'
  alt="chat_completions_graph"
  width="500px"
  centered
/>

<Image
  url='/img/stadium-paris.jpeg'
  alt="chat_completions_graph"
  width="500px"
  centered
/>

<Tabs groupId="code">
  <TabItem value="curl" label="curl" default>

```bash
curl https://api.mistral.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MISTRAL_API_KEY" \
  -d '{
    "model": "ministral-14b-latest",
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
            "image_url": "https://docs.mistral.ai/img/eiffel-tower-paris.jpg"
          },
          {
            "type": "image_url",
            "image_url": "https://docs.mistral.ai/img/stadium-paris.jpeg"
          }
        ]
      }
    ],
    "max_tokens": 300
  }'
```

    </TabItem>
    <TabItem value="output" label="output">

```
{
  "id": "66cf17260e4b4abe8f0c3de97ea5864c",
  "created": 1764253564,
  "model": "ministral-14b-2512",
  "usage": {
    "prompt_tokens": 3051,
    "total_tokens": 3312,
    "completion_tokens": 261
  },
  "object": "chat.completion",
  "choices": [
    {
      "index": 0,
      "finish_reason": "stop",
      "message": {
        "role": "assistant",
        "tool_calls": null,
        "content": "The two images you provided both feature the Eiffel Tower, but they depict different scenes and perspectives:\n\n1. **First Image:**\n   - This image shows a close-up, clear view of the Eiffel Tower from a low angle, emphasizing its intricate iron lattice structure.\n   - The background is a clear blue sky, and the focus is solely on the Eiffel Tower itself.\n   - There are no other elements such as crowds or sporting events visible.\n\n2. **Second Image:**\n   - This image captures the Eiffel Tower in the background, but it is part of a larger scene that includes a tennis stadium.\n   - The stadium is filled with spectators, indicating a major tennis event, likely the French Open, which is held at Roland Garros in Paris.\n   - The Eiffel Tower is visible in the distance behind the stadium, adding a sense of scale and context to the event.\n   - The sky is partly cloudy, and the stadium is bustling with activity, contrasting with the serene and solitary depiction of the Eiffel Tower in the first image.\n\nIn summary, the first image focuses on the architectural details of the Eiffel Tower, while the second image situates the Eiffel Tower within a lively, crowded sports event setting."
      }
    }
  ]
}
```
    </TabItem>
</Tabs>

The two images you provided both feature the Eiffel Tower, but they depict different scenes and perspectives:

1. **First Image:**
  - This image shows a close-up, clear view of the Eiffel Tower from a low angle, emphasizing its intricate iron lattice structure.
  - The background is a clear blue sky, and the focus is solely on the Eiffel Tower itself.
  - There are no other elements such as crowds or sporting events visible.

2. **Second Image:
  - This image captures the Eiffel Tower in the background, but it is part of a larger scene that includes a tennis stadium.
  - The stadium is filled with spectators, indicating a major tennis event, likely the French Open, which is held at Roland Garros in Paris.
  - The Eiffel Tower is visible in the distance behind the stadium, adding a sense of scale and context to the event.
  - The sky is partly cloudy, and the stadium is bustling with activity, contrasting with the serene and solitary depiction of the Eiffel Tower in the first image.

In summary, the first image focuses on the architectural details of the Eiffel Tower, while the second image situates the Eiffel Tower within a lively, crowded sports event setting.
  </ExplorerTab>
  <ExplorerTab value="transcribe-receipts" label="Transcribe">
    <Image
  url={['/img/food-receipt.jpg']}
  alt="chat_completions_graph"
  width="500px"
  centered
/>

<Tabs groupId="code">
    <TabItem value="curl" label="curl" default>

```bash
curl https://api.mistral.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer nSiQfu0VopsTZA9OS7axszGjOVcwOqCt" \
  -d '{
    "model": "ministral-14b-2512",
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
            "image_url": "https://docs.mistral.ai/img/food-receipt.jpg"
          }
        ]
      }
    ]
  }'
```

    </TabItem>
    <TabItem value="output" label="output">

```
{
  "id": "de1b7c4aeca241488b91fae621b7f56c",
  "created": 1764256540,
  "model": "ministral-14b-2512",
  "usage": {
    "prompt_tokens": 917,
    "total_tokens": 1169,
    "completion_tokens": 252
  },
  "object": "chat.completion",
  "choices": [
    {
      "index": 0,
      "finish_reason": "stop",
      "message": {
        "role": "assistant",
        "tool_calls": null,
        "content": "Sure, here is the transcription of the receipt:\n\n---\n**Dine-In**\n\nCashier: Raul\n02-Apr-2022 5:01:56P\n\n1 EMPANADA - BEEF                     $3.00\n1 EMPANADA - CHEESE                   $3.00\n1 EMPANADA - CHICKEN                  $3.00\n1 Tallarin Huancaina Lomo Saltado      $19.99\n1 1/2 Pisco Sour                      $15.00\n\nSubtotal                             $43.99\nLocal Taxes 5.5%                      $2.42\n\nTotal                                 $46.41\n\nIMMIGRANTS MAKE AMERICA GREAT THEY ALSO COOKED YOUR FOOD AND SERVED YOU TODAY\nGOD BLESS YOU\n\nOnline: https://clover.com/r/D0BQZ3R656MDC\n\nOrder D0BQZ3R656MDC\n\nClover Privacy Policy\nhttps://clover.com/privacy\n---"
      }
    }
  ]
}
```

    </TabItem>
</Tabs>

Sure, here is the transcription of the receipt:

---
**Dine-In**

Cashier: Raul
02-Apr-2022 5:01:56P

1 EMPANADA - BEEF                     $3.00
1 EMPANADA - CHEESE                   $3.00
1 EMPANADA - CHICKEN                  $3.00
1 Tallarin Huancaina Lomo Saltado      $19.99
1 1/2 Pisco Sour                      $15.00

Subtotal                             $43.99
Local Taxes 5.5%                      $2.42

Total                                 $46.41

IMMIGRANTS MAKE AMERICA GREAT THEY ALSO COOKED YOUR FOOD AND SERVED YOU TODAY
GOD BLESS YOU

Online: https://clover.com/r/D0BQZ3R656MDC

Order D0BQZ3R656MDC

Clover Privacy Policy
https://clover.com/privacy
---
  </ExplorerTab>
  <ExplorerTab value="ocr-old-documents" label="OCR Old Documents">
    <Image
  url='/img/old-page.jpg'
  alt="chat_completions_graph"
  width="500px"
  centered
/>

<Tabs groupId="code">
    <TabItem value="curl" label="curl" default>

```bash
curl https://api.mistral.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MISTRAL_API_KEY" \
  -d '{
    "model": "ministral-14b-latest",
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
            "image_url": "https://docs.mistral.ai/img/old-page.jpg"
          }
        ]
      }
    ]
  }'
```

    </TabItem>
    <TabItem value="output" label="output">

```
{
  "id": "e8f4bf33baf3474abfcd0c24d4a56939",
  "created": 1764254337,
  "model": "ministral-14b-2512",
  "usage": {
    "prompt_tokens": 168,
    "total_tokens": 238,
    "completion_tokens": 70
  },
  "object": "chat.completion",
  "choices": [
    {
      "index": 0,
      "finish_reason": "stop",
      "message": {
        "role": "assistant",
        "tool_calls": null,
        "content": "300. Letters Orders and Instructions, December 1855.\n\nHogg's Company if any opportunity offers,\n\nYou are to be particularly exact and careful in these payments, seeing that there is no disagreement between the Returns and your Pay Rolls; or there will be strict examination into it hereafter.\n\nJam & Co.\n\nJ.F."
      }
    }
  ]
}
```

    </TabItem>
</Tabs>

300. Letters Orders and Instructions, December 1855.

Hogg's Company if any opportunity offers,

You are to be particularly exact and careful in these payments, seeing that there is no disagreement between the Returns and your Pay Rolls; or there will be strict examination into it hereafter.

Jam & Co.

J.F.
  </ExplorerTab>
  <ExplorerTab value="ocr-with-structured-output" label="OCR with Structured output">
    <Image
  url='/img/food-receipt.jpg'
  alt="chat_completions_graph"
  width="500px"
  centered
/>

<Tabs groupId="code">
    <TabItem value="curl" label="curl" default>

```bash
curl https://api.mistral.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MISTRAL_API_KEY" \
  -d '{
    "model": "ministral-14b-latest",
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
                        "text": "From this restaurant bill, extract the order id, item names and associated prices, and total price and return it as a string in a Json object"
                    },
                    {
                        "type": "image_url",
                        "image_url": "https://docs.mistral.ai/img/food-receipt.jpg"
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

    </TabItem>
    <TabItem value="output" label="output">

```json
{
  "id": "7719baca89384361ae46e2ee3b371354",
  "created": 1764256812,
  "model": "ministral-14b-2512",
  "usage": {
    "prompt_tokens": 977,
    "total_tokens": 1132,
    "completion_tokens": 155
  },
  "object": "chat.completion",
  "choices": [
    {
      "index": 0,
      "finish_reason": "stop",
      "message": {
        "role": "assistant",
        "tool_calls": null,
        "content": "{\n  \"order_id\": [\"D0BQZ3R656MDC\"],\n  \"items\": {\n    \"item_names\": [\n      \"EMPANADA - BEEF\",\n      \"EMPANADA - CHEESE\",\n      \"EMPANADA - CHICKEN\",\n      \"Tallarin Huancaina Lomo Saltado\",\n      \"1/2 Pisco Sour\"\n    ],\n    \"prices\": [\n      \"$3.00\",\n      \"$3.00\",\n      \"$3.00\",\n      \"$19.99\",\n      \"$15.00\"\n    ]\n  },\n  \"total_price\": [\"$46.41\"]\n}"
      }
    }
  ]
}
```

    </TabItem>
</Tabs>

```json
{
  "order_id": [
    "D0BQZ3R656MDC"
  ],
  "items": {
    "item_names": [
      "EMPANADA - BEEF",
      "EMPANADA - CHEESE",
      "EMPANADA - CHICKEN",
      "Tallarin Huancaina Lomo Saltado",
      "1/2 Pisco Sour"
    ],
    "prices": [
      "$3.00",
      "$3.00",
      "$3.00",
      "$19.99",
      "$15.00"
    ]
  },
  "total_price": [
    "$46.41"
  ]
}
```
  </ExplorerTab>
</ExplorerTabs>

<SectionTab as="h1" sectionId="faq">FAQ</SectionTab>

<Faq defaultValue={['price-per-image', 'tokens-per-image']}>
  <FaqItem question="What is the price per image?">

    The price is calculated using the same pricing as input tokens per image, with each image being tokenized.

  </FaqItem>
  <FaqItem question="How many tokens correspond to an image and/or what is the maximum resolution?">

    Depending on the model and resolution, an image will be tokenized differently. Below is a summary.

    | Model             | Max Resolution | ≈ Formula                             | ≈ N Max Tokens |
    | ----------------- | -------------- | ------------------------------------- | -------------- |
    | Mistral Large 3   | 1540x1540      | `≈ (ResolutionX * ResolutionY) / 784` | ≈ 3025         |
    | Mistral Small 3.2 | 1540x1540      | `≈ (ResolutionX * ResolutionY) / 784` | ≈ 3025         |
    | Mistral Medium 3  | 1540x1540      | `≈ (ResolutionX * ResolutionY) / 784` | ≈ 3025         |
    | Ministral 3       | 1540x1540      | `≈ (ResolutionX * ResolutionY) / 784` | ≈ 3025         |
    | Pixtral Large     | 1024x1024      | `≈ (ResolutionX * ResolutionY) / 256` | ≈ 4096         |
    | Pixtral 12B       | 1024x1024      | `≈ (ResolutionX * ResolutionY) / 256` | ≈ 4096         |

    If the resolution of the image sent is higher than the maximum resolution of the model, the image will be downscaled to its maximum resolution. An error will be sent if the resolution is higher than **10000x10000**.

  </FaqItem>

  <FaqItem question="Can I use them to generate images?">

    No, they are designed to understand and analyze images, not to generate them.

  </FaqItem>
  <FaqItem question="What types of image files are supported?">

    We currently support the following image formats:

    - PNG (.png)
    - JPEG (.jpeg and .jpg)
    - WEBP (.webp)
    - Non-animated GIF with only one frame (.gif)

  </FaqItem>

  <FaqItem question="Is there a limit to the size of the image?">

    The current file size limit is 10Mb.

  </FaqItem>
  <FaqItem question="What's the maximum number images per request?">

    The maximum number images per request via API is 8.

  </FaqItem>
  <FaqItem question="What is the rate limit?">

    For information on rate limits, visit <AppLink href="https://console.mistral.ai/limits/" app="studio">Limits</AppLink>.

  </FaqItem>
</Faq>