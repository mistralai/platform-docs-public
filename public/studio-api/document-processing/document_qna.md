---
id: document_qna
title: Document QnA
slug: document_qna
sidebar_position: 3.3
---

# Document AI QnA

The Document QnA capability combines OCR with large language model capabilities to enable natural language interaction with document content. This allows you to extract information and insights from documents by asking questions in natural language.

:::tip
Before continuing, we recommend reading the [Chat Completions](/studio-api/conversations/chat-completion) documentation to learn more about the chat completions API and how to use it before proceeding.
:::

<SectionTab as="h1" sectionId="before-you-start">Before You Start</SectionTab>

### Workflow and Capabilities

The workflow consists of two main steps:

<div style={{ textAlign: 'center' }}>
  <img
    src="/img/document_qna.png"
    alt="Document QnA Graph"
    width="800"
    style={{ borderRadius: '15px' }}
    className='mx-auto' 
  />
</div>

1. Document AI: OCR extracts text, structure, and formatting, creating a machine-readable version of the document.

2. Language Model Understanding: The extracted document content is analyzed by a large language model. You can ask questions or request information in natural language. The model understands context and relationships within the document and can provide relevant answers based on the document content.

<SectionTab as="h2" variant="secondary" sectionId="workflow-key-capabilities">Key Capabilities</SectionTab>

- Question answering about specific document content
- Information extraction and summarization
- Document analysis and insights
- Multi-document queries and comparisons
- Context-aware responses that consider the full document

<SectionTab as="h2" variant="secondary" sectionId="common-use-cases">Common Use Cases</SectionTab>

- Analyzing research papers and technical documents
- Extracting information from business documents
- Processing legal documents and contracts
- Building document Q&A applications
- Automating document-based workflows

<SectionTab as="h1" sectionId="usage">Usage</SectionTab>

### Leverage Document QnA

The examples below show how to interact with a PDF document using natural language.

<ExplorerTabs id="qna-usage">
    <ExplorerTab value="qna-pdf-url" label="QnA with a PDF Url">
        Be sure the URL is **public** and accessible by our API.

<Tabs groupId="code">
    <TabItem value="python" label="python" default>
        <Tabs groupId="sdk-version">
            <TabItem value="v1" label="V1" default>

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
                "text": "what is the last sentence in the document"
            },
            {
                "type": "document_url",
                "document_url": "https://arxiv.org/pdf/1805.04770"
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
                "text": "what is the last sentence in the document"
            },
            {
                "type": "document_url",
                "document_url": "https://arxiv.org/pdf/1805.04770"
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

const apiKey = process.env["MISTRAL_API_KEY"];

const client = new Mistral({
  apiKey: apiKey,
});

const chatResponse = await client.chat.complete({
  model: "mistral-small-latest",
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "what is the last sentence in the document",
        },
        {
          type: "document_url",
          documentUrl: "https://arxiv.org/pdf/1805.04770",
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
  -H "Authorization: Bearer ${MISTRAL_API_KEY}" \
  -d '{
    "model": "mistral-small-latest",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "what is the last sentence in the document"
          },
          {
            "type": "document_url",
            "document_url": "https://arxiv.org/pdf/1805.04770"
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
  "id": "7b98be65bb7b475ca2456a92f9ed0049",
  "created": 1756753708,
  "model": "mistral-small-latest",
  "usage": {
    "prompt_tokens": 13707,
    "total_tokens": 13764,
    "completion_tokens": 57
  },
  "object": "chat.completion",
  "choices": [
    {
      "index": 0,
      "finish_reason": "stop",
      "message": {
        "role": "assistant",
        "tool_calls": null,
        "content": "The last sentence in the document is:\n\n\"Zaremba, W., Sutskever, I., and Vinyals, O. Recurrent neural network regularization. arXiv:1409.2329, 2014.\""
      }
    }
  ]
}
```

    </TabItem>
</Tabs>
    </ExplorerTab>
    <ExplorerTab value="qna-base64-encoded-pdf" label="QnA with a Base64 Encoded PDF">
        You can perform QnA with any PDF by encoding them in base64 and sending them as part of the chat completion request.

<Tabs groupId="code">
    <TabItem value="python" label="python" default>
        <Tabs groupId="sdk-version">
            <TabItem value="v1" label="V1" default>

```python
import base64
import os
from mistralai.client import Mistral

api_key = os.environ["MISTRAL_API_KEY"]
model = "mistral-small-latest"

client = Mistral(api_key=api_key)

def encode_pdf(pdf_path):
    with open(pdf_path, "rb") as pdf_file:
        return base64.b64encode(pdf_file.read()).decode('utf-8')

pdf_path = "path_to_your_pdf.pdf"
base64_pdf = encode_pdf(pdf_path)

messages = [
    {
        "role": "user",
        "content": [
            {
                "type": "text",
                "text": "what is the last sentence in the document"
            },
            {
                "type": "document_url",
                "document_url": f"data:application/pdf;base64,{base64_pdf}"
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
import base64
import os
from mistralai.client import Mistral

api_key = os.environ["MISTRAL_API_KEY"]
model = "mistral-small-latest"

client = Mistral(api_key=api_key)

def encode_pdf(pdf_path):
    with open(pdf_path, "rb") as pdf_file:
        return base64.b64encode(pdf_file.read()).decode('utf-8')

pdf_path = "path_to_your_pdf.pdf"
base64_pdf = encode_pdf(pdf_path)

messages = [
    {
        "role": "user",
        "content": [
            {
                "type": "text",
                "text": "what is the last sentence in the document"
            },
            {
                "type": "document_url",
                "document_url": f"data:application/pdf;base64,{base64_pdf}"
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

const apiKey = process.env.MISTRAL_API_KEY;

const client = new Mistral({ apiKey: apiKey });

async function encodePdf(pdfPath) {
    const pdfBuffer = fs.readFileSync(pdfPath);
    const base64Pdf = pdfBuffer.toString('base64');
    return base64Pdf;
}

const pdfPath = "path_to_your_pdf.pdf";
const base64Pdf = await encodePdf(pdfPath);

const chatResponse = await client.chat.complete({
  model: "mistral-small-latest",
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "what is the last sentence in the document",
        },
        {
          type: "document_url",
          documentUrl: "data:application/pdf;base64," + base64Pdf,
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
  -H "Authorization: Bearer ${MISTRAL_API_KEY}" \
  -d '{
    "model": "mistral-small-latest",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "what is the last sentence in the document"
          },
          {
            "type": "document_url",
            "document_url": "data:application/pdf;base64,<base64_pdf>"
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
  "id": "7b98be65bb7b475ca2456a92f9ed0049",
  "created": 1756753708,
  "model": "mistral-small-latest",
  "usage": {
    "prompt_tokens": 13707,
    "total_tokens": 13764,
    "completion_tokens": 57
  },
  "object": "chat.completion",
  "choices": [
    {
      "index": 0,
      "finish_reason": "stop",
      "message": {
        "role": "assistant",
        "tool_calls": null,
        "content": "The last sentence in the document is:\n\n\"Zaremba, W., Sutskever, I., and Vinyals, O. Recurrent neural network regularization. arXiv:1409.2329, 2014.\""
      }
    }
  ]
}
```

    </TabItem>
</Tabs>
    </ExplorerTab>
    <ExplorerTab value="qna-with-uploaded-pdf" label="QnA with an Uploaded PDF">
        You can also upload a PDF file in our Cloud and get the QnA results from the uploaded PDF by retrieving a signed url. Document QnA is under the umbrela OCR, the method for uploading and handling files will hence be the same.

<SectionTab as="h3" variant="secondary" sectionId="upload-a-file">Upload a File</SectionTab>

First, you will have to upload your PDF file to our cloud, this file will be stored and only accessible via an API key.

<Tabs groupId="code">
  <TabItem value="python" label="python" default>
    <Tabs groupId="sdk-version">
        <TabItem value="v1" label="V1" default>

```python
from mistralai.client import Mistral
import os

api_key = os.environ["MISTRAL_API_KEY"]

client = Mistral(api_key=api_key)

uploaded_pdf = client.files.upload(
    file={
        "file_name": "2201.04234v3.pdf",
        "content": open("2201.04234v3.pdf", "rb"),
    },
    purpose="ocr"
)
```

        </TabItem>
        <TabItem value="v2" label="V2">

```python
from mistralai.client import Mistral
import os

api_key = os.environ["MISTRAL_API_KEY"]

client = Mistral(api_key=api_key)

uploaded_pdf = client.files.upload(
    file={
        "file_name": "2201.04234v3.pdf",
        "content": open("2201.04234v3.pdf", "rb"),
    },
    purpose="ocr"
)
```

        </TabItem>
    </Tabs>
  </TabItem>
  <TabItem value="typescript" label="typescript">

```typescript

const apiKey = process.env.MISTRAL_API_KEY;

const client = new Mistral({apiKey: apiKey});

const uploadedFile = fs.readFileSync('2201.04234v3.pdf');
const uploadedPdf = await client.files.upload({
    file: {
        fileName: "2201.04234v3.pdf",
        content: uploadedFile,
    },
    purpose: "ocr"
});
```

  </TabItem>
  <TabItem value="curl" label="curl">

```bash
curl https://api.mistral.ai/v1/files \
  -H "Authorization: Bearer $MISTRAL_API_KEY" \
  -F purpose="ocr" \
  -F file="@2201.04234v3.pdf"
```

  </TabItem>
  <TabItem value="output" label="output">

```json
{
  "id": "9a90b93c-0e7d-4dd7-8520-07d051404d11",
  "object": "file",
  "bytes": 560027,
  "created_at": 1756754478,
  "filename": "1805.04770v2.pdf",
  "purpose": "ocr",
  "sample_type": "ocr_input",
  "num_lines": 0,
  "mimetype": "application/pdf",
  "source": "upload",
  "signature": "..."
}
```

    </TabItem>
</Tabs>

<SectionTab as="h3" variant="secondary" sectionId="retrieve-file">Retrieve File</SectionTab>

Once the file uploaded, you can retrieve it at any point.

<Tabs groupId="code">
  <TabItem value="python" label="python">

```python
retrieved_file = client.files.retrieve(file_id=uploaded_pdf.id)
```

  </TabItem>
  <TabItem value="typescript" label="typescript">

```typescript
const retrievedFile = await client.files.retrieve({
    fileId: uploadedPdf.id
});
```

  </TabItem>
  <TabItem value="curl" label="curl">

```bash
curl -X GET "https://api.mistral.ai/v1/files/$id" \
     -H "Accept: application/json" \
     -H "Authorization: Bearer $MISTRAL_API_KEY"
```

  </TabItem>

  <TabItem value="output" label="output">

```json
{
  "id": "9a90b93c-0e7d-4dd7-8520-07d051404d11",
  "object": "file",
  "bytes": 560027,
  "created_at": 1756754478,
  "filename": "1805.04770v2.pdf",
  "purpose": "ocr",
  "sample_type": "ocr_input",
  "num_lines": 0,
  "mimetype": "application/pdf",
  "source": "upload",
  "signature": "...",
  "deleted": false
}
```

    </TabItem>
</Tabs>

<SectionTab as="h3" variant="secondary" sectionId="get-signed-url">Get Signed Url</SectionTab>

For QnA with Documents, you can get a signed url to access the file. An optional `expiry` parameter allow you to automatically expire the signed url after n hours.

<Tabs groupId="code">
  <TabItem value="python" label="python">

```python
signed_url = client.files.get_signed_url(file_id=uploaded_pdf.id)
```

  </TabItem>
  <TabItem value="typescript" label="typescript">

```typescript
const signedUrl = await client.files.getSignedUrl({
    fileId: uploadedPdf.id,
});
```

  </TabItem>
  <TabItem value="curl" label="curl">

```bash
curl -X GET "https://api.mistral.ai/v1/files/$id/url?expiry=24" \
     -H "Accept: application/json" \
     -H "Authorization: Bearer $MISTRAL_API_KEY"
```

  </TabItem>

  <TabItem value="output" label="output">

```json
{
  "url": "https://mistralaifilesapiprodswe.blob.core.windows.net/fine-tune/.../.../9a90b93c0e7d4dd7852007d051404d11.pdf?se=2025-09-02T19%3A22%3A08Z&sp=r&sv=2025-01-05&sr=b&sig=..."
}
```

    </TabItem>
</Tabs>

<SectionTab as="h3" variant="secondary" sectionId="get-chat-completion-results">Get Chat Completion Result</SectionTab>

You can now query any LLM with the signed url.

<Tabs groupId="code">
  <TabItem value="python" label="python">

```python
model =  "mistral-small-latest"

messages = [
    {
        "role": "user",
        "content": [
            {
                "type": "text",
                "text": "what is the last sentence in the document"
            },
            {
                "type": "document_url",
                "document_url": signed_url.url
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
  <TabItem value="typescript" label="typescript">

```typescript
const chatResponse = await client.chat.complete({
  model: "mistral-small-latest",
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "what is the last sentence in the document",
        },
        {
          type: "document_url",
          documentUrl: signedUrl.url,
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
  -H "Authorization: Bearer ${MISTRAL_API_KEY}" \
  -d '{
    "model": "mistral-small-latest",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "what is the last sentence in the document"
          },
          {
            "type": "document_url",
            "document_url": "https://mistralaifilesapiprodswe.blob.core.windows.net/fine-tune/.../.../22e2e88f167d4f3d982aadd977a54ec3.pdf?se=2025-08-30T10%3A53%3A22Z&sp=r&sv=2025-01-05&sr=b&sig=..."
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
  "id": "4ccfdc97996241eb9fe4375d947c671b",
  "created": 1756754528,
  "model": "mistral-small-latest",
  "usage": {
    "prompt_tokens": 13707,
    "total_tokens": 13764,
    "completion_tokens": 57
  },
  "object": "chat.completion",
  "choices": [
    {
      "index": 0,
      "finish_reason": "stop",
      "message": {
        "role": "assistant",
        "tool_calls": null,
        "content": "The last sentence in the document is:\n\n\"Zaremba, W., Sutskever, I., and Vinyals, O. Recurrent neural network regularization. arXiv:1409.2329, 2014.\""
      }
    }
  ]
}
```

    </TabItem>
</Tabs>

<SectionTab as="h3" variant="secondary" sectionId="delete-file">Delete File</SectionTab>

Once everything done, you can optionally delete the pdf file from our cloud unless you wish to reuse it later.

<Tabs groupId="code">
  <TabItem value="python" label="python">

```python
client.files.delete(file_id=file.id)
```

  </TabItem>
  <TabItem value="typescript" label="typescript">

```typescript
await client.files.delete(fileId=file.id);
```

  </TabItem>
  <TabItem value="curl" label="curl">

```bash
curl -X DELETE https://api.mistral.ai/v1/files/${file_id} \
-H "Authorization: Bearer ${MISTRAL_API_KEY}"
```

  </TabItem>
  <TabItem value="output" label="output">

```json
{
  "id": "9a90b93c-0e7d-4dd7-8520-07d051404d11",
  "object": "file",
  "deleted": true
}
```

  </TabItem>
</Tabs>
    </ExplorerTab>
</ExplorerTabs>

<SectionTab as="h1" sectionId="cookbooks">Cookbooks</SectionTab>

For more information on how to make use of Document QnA, we have the following [Document QnA Cookbook](https://colab.research.google.com/github/mistralai/cookbook/blob/main/mistral/ocr/document_understanding.ipynb) with a simple example.

<Faq>
  <FaqItem question="Are there any limits regarding the Document QnA API?">
    Yes, there are certain limitations for the Document QnA API. Uploaded document files must not exceed 50 MB in size and should be no longer than 1,000 pages.
  </FaqItem>
</Faq>