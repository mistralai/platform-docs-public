---
id: code_embeddings
title: Code Embeddings
slug: code_embeddings
sidebar_position: 5.2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Embeddings are at the core of multiple enterprise use cases, such as **retrieval systems**, **clustering**, **code analytics**, **classification**, and a variety of search applications. With code embedings, you can embed **code databases** and **repositories**, and power **coding assistants** with state-of-the-art retrieval capabilities.

<a target="_blank" href="https://colab.research.google.com/github/mistralai/cookbook/blob/main/mistral/embeddings/code_embedding.ipynb">
  <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/>
</a>

## Codestral Embed API
To generate code embeddings using Mistral AI's embeddings API, we can make a request to the API endpoint and specify the embedding model `codestral-embed`, along with providing a list of input texts. The API will then return the corresponding embeddings as numerical vectors, which can be used for further analysis or processing in NLP applications.

We also provide `output_dtype` and `output_dimension` parameters that allow you to control the type and dimensional size of your embeddings.

### Output DType
`output_dtype` allows you to select the precision and format of the embeddings, enabling you to obtain embeddings with your desired level of numerical accuracy and representation.

The accepted dtypes are:
- **float** (default): A list of 32-bit (4-byte) single-precision floating-point numbers. Provides the highest precision and retrieval accuracy.
- **int8**: A list of 8-bit (1-byte) integers ranging from -128 to 127.
- **uint8**: A list of 8-bit (1-byte) integers ranging from 0 to 255.
- **binary**: A list of 8-bit integers that represent bit-packed, quantized single-bit embedding values using the `int8` type. The length of the returned list of integers is 1/8 of `output_dimension`. This type uses the offset binary method.
- **ubinary**: Similar to `binary`, but uses the `uint8` type for bit-packed, quantized single-bit embedding values.

### Output Dimension
`output_dimension` allows you to select a specific size for the embedding, enabling you to obtain an embedding of your chosen dimension, **defaults to 1536** and has a **maximum value of 3072**.

For any integer target dimension n, you can choose to retain the first n dimensions. These dimensions are ordered using a PCA algorithm, and the first n are selected for a smooth trade-off between quality and cost.

<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```python
import os
from mistralai import Mistral
from datasets import load_dataset

api_key = os.environ["MISTRAL_API_KEY"]
model = "codestral-embed"

client = Mistral(api_key=api_key)

embeddings_batch_response = client.embeddings.create(
    model=model,
    # output_dtype="binary",
    # output_dimension=512,
    inputs=[
        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order. Example 1: Input: nums = [2,7,11,15], target = 9 Output: [0,1] Explanation: Because nums[0] + nums[1] == 9, we return [0, 1]. Example 2: Input: nums = [3,2,4], target = 6 Output: [1,2] Example 3: Input: nums = [3,3], target = 6 Output: [0,1] Constraints: 2 <= nums.length <= 104 -109 <= nums[i] <= 109 -109 <= target <= 109 Only one valid answer exists.", 
        "class Solution: def twoSum(self, nums: List[int], target: int) -> List[int]: d = {} for i, x in enumerate(nums): if (y := target - x) in d: return [d[y], i] d[x] = i"
      ],
)
```
  </TabItem>
  <TabItem value="typescript" label="typescript">

```typescript
import { Mistral } from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;
const model = "codestral-embed";

const client = new Mistral({ apiKey: apiKey });

async function getEmbeddings() {

    const embeddingsBatchResponse = await client.embeddings.create({
        model: model,
        // output_dtype: "binary",
        // output_dimension: 512,
        inputs: [
            "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order. Example 1: Input: nums = [2,7,11,15], target = 9 Output: [0,1] Explanation: Because nums[0] + nums[1] == 9, we return [0, 1]. Example 2: Input: nums = [3,2,4], target = 6 Output: [1,2] Example 3: Input: nums = [3,3], target = 6 Output: [0,1] Constraints: 2 <= nums.length <= 104 -109 <= nums[i] <= 109 -109 <= target <= 109 Only one valid answer exists.", 
            "class Solution: def twoSum(self, nums: List[int], target: int) -> List[int]: d = {} for i, x in enumerate(nums): if (y := target - x) in d: return [d[y], i] d[x] = i"
          ],
    });
}

// Call the async function
getEmbeddings().catch(console.error);
```
  </TabItem>
    <TabItem value="curl" label="curl">

```bash
problem_description="Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order. Example 1: Input: nums = [2,7,11,15], target = 9 Output: [0,1] Explanation: Because nums[0] + nums[1] == 9, we return [0, 1]. Example 2: Input: nums = [3,2,4], target = 6 Output: [1,2] Example 3: Input: nums = [3,3], target = 6 Output: [0,1] Constraints: 2 <= nums.length <= 104 -109 <= nums[i] <= 109 -109 <= target <= 109 Only one valid answer exists."

solution="class Solution: def twoSum(self, nums: List[int], target: int) -> List[int]: d = {} for i, x in enumerate(nums): if (y := target - x) in d: return [d[y], i] d[x] = i"

curl -X POST "https://api.mistral.ai/v1/embeddings" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer ${API_KEY}" \
     -d '{"model": "codestral-embed", "output_dimension": 10, "output_dtype": "binary", "input": ["'"$problem_description"'", "'"$solution"'"]}' \
     -o embedding.json
```
  </TabItem>
</Tabs>

<details>
<summary><b>Output</b></summary>
```
EmbeddingResponse(
    id='8d6a8e8ee0fa460c9360526480f636ee',
    object='list',
    data=[
        EmbeddingResponseData(
            object='embedding',
            embedding=[17, -64]
        ),
        EmbeddingResponseData(
            object='embedding',
            embedding=[-79, 64]
        )
    ],
    model='codestral-embed',
    usage=UsageInfo(
        prompt_tokens=263,
        completion_tokens=0,
        total_tokens=263
    )
)
```
</details>

Let's take a look at the length of the first embedding:
<Tabs groupId="code">
  <TabItem value="python" label="python" default>
```python
len(embeddings_batch_response.data[0].embedding)
```
  </TabItem>
  <TabItem value="typescript" label="typescript">
```typescript
console.log('Embedding Length:', embeddingsBatchResponse.data?.[0]?.embedding?.length)
```
  </TabItem>
    <TabItem value="curl" label="curl">
```bash
echo "Embedding Length: $(jq '.data[0].embedding | length' embedding.json)"
```
  </TabItem>
</Tabs>

It returns 1553, which means that our embedding dimension is 1553. The `codestral-embed` model generates embedding vectors up to dimensions of 3072 for each text string, regardless of the text length, you can reduce the dimension using `output_dimension` if needed. It's worth nothing that while higher dimensional embeddings can better capture text information and improve the performance of NLP tasks, they may require more resources and may result in increased latency and memory usage for storing and processing these embeddings. This trade-off between performance and computational resources should be considered when designing NLP systems that rely on text embeddings.

## Distance Measures
In the realm of text embeddings, texts with similar meanings or context tend to be located in closer proximity to each other within this space, as measured by the distance between their vectors. This is due to the fact that the model has learned to group semantically related texts together during the training process.

Let's take a look at a simple example. To simplify working with text embeddings, we can wrap the embedding API in this function:


```python
from sklearn.metrics.pairwise import euclidean_distances

def get_code_embedding(inputs):
    embeddings_batch_response = client.embeddings.create(
        model=model,
        inputs=inputs
    )
    return embeddings_batch_response.data[0].embedding
```

Suppose we have two code snippets: one about **two sum** and the other about **reverse integer**. 
We want to find how similar each code snippets is to the reference code **palindrome number**. We can see that the distance between the reference code embeddings and the ** embeddings is smaller than the distance between the reference code embeddings and the ** code embeddings.

```python
dataset = load_dataset("newfacade/LeetCodeDataset")

two_sum_solution = dataset["train"][0]["completion"]
reverse_integer_solution = dataset["train"][6]["completion"]
palindrome_number_solution = dataset["train"][8]["completion"]

def remove_whitespace(code):
    return code.replace("\n", "").replace("\t", "").replace(" ", "")

two_sum_solution_clean = remove_whitespace(two_sum_solution)
reverse_integer_solution_clean = remove_whitespace(reverse_integer_solution)
palindrome_number_solution_clean = remove_whitespace(palindrome_number_solution)

code_snippets = [
    two_sum_solution_clean,
    reverse_integer_solution_clean
]

embeddings = [get_code_embedding([t]) for t in code_snippets]

reference_code_snippet = palindrome_number_solution
reference_embedding = get_code_embedding([reference_code_snippet])

for t, e in zip(code_snippets, embeddings):
    distance = euclidean_distances([e], [reference_embedding])
    print(t, distance)
```

<details>
<summary><b>Input / Output</b></summary>

**Input**
```json
{
    "code_snippets": {
      "two_sum_solution": "classSolution:deftwoSum(self,nums:List[int],target:int)->List[int]:d={}fori,xinenumerate(nums):if(y:=target-x)ind:return[d[y],i]d[x]=i",
      "reverse_integer_solution": "classSolution:defreverse(self,x:int)->int:ans=0mi,mx=-(2**31),2**31-1whilex:ifans<mi//10+1orans>mx//10:return0y=x%10ifx<0andy>0:y-=10a",
    },
    "reference_code_snippet": "classSolution:defisPalindrome(self,x:int)->bool:ifx<0or(xandx%10==0):returnFalsey=0whiley<x:y=y*10+x%10x//=10returnxin(y,y//10)"

}
```

**Output**
```
classSolution:deftwoSum(self,nums:List[int],target:int)->List[int]:d={}fori,xinenumerate(nums):if(y:=target-x)ind:return[d[y],i]d[x]=i [[0.909916]]
classSolution:defreverse(self,x:int)->int:ans=0mi,mx=-(2**31),2**31-1whilex:ifans<mi//10+1orans>mx//10:return0y=x%10ifx<0andy>0:y-=10ans=ans*10+yx=(x-y)//10returnans [[0.64201937]]
```
</details>

In our example above, we used the Euclidean distance to measure the distance between embedding vectors (note that since Mistral AI embeddings are norm 1, cosine similarity, dot product or Euclidean distance are all equivalent).

## Batch processing
The Mistral AI Embeddings API is designed to process text in batches for improved efficiency and speed. In this example, we will demonstrate this by loading a LeetCodeTSNE dataset, which contains 37 rows with two columns: "Name" and "Code". The "Name" column indicates the problem name, while the "Code" column corresponds to an implementation of this problem.

We wrote a function `get_embeddings_by_chunks` that splits data into chunks and then sends each chunk to the Mistral AI Embeddings API to get the embeddings. Then we saved the embeddings as a new column in the dataframe. Note that the API will provide auto-chunking in the future, so that users don't need to manually split the data into chunks before sending it.


```python
import pandas as pd

df = pd.read_csv(
    "https://raw.githubusercontent.com/mistralai/cookbook/main/data/LeetCodeTSNE.csv"
)

def get_embeddings_by_chunks(data, chunk_size):
    chunks = [data[x : x + chunk_size] for x in range(0, len(data), chunk_size)]
    embeddings_response = [
        client.embeddings.create(model=model, inputs=c) for c in chunks
    ]
    return [d.embedding for e in embeddings_response for d in e.data]

df["embeddings"] = get_embeddings_by_chunks(df["Code"].tolist(), 50)
display(df.head())
```

<img src="/img/guides/tsne_dataset-codestral-embed.png" alt="drawing" width="700"/>

### t-SNE embeddings visualization
We mentioned previously that our embeddings have 1536 dimensions, which makes them impossible to visualize directly. Thus, in order to visualize our embeddings, we can use a dimensionality reduction technique such as t-SNE to project our embeddings into a lower-dimensional space that is easier to visualize.

In this example, we transform our embeddings to 2 dimensions and create a 2D scatter plot showing the relationships among embeddings of different problems.

```python
import seaborn as sns
from sklearn.manifold import TSNE
import numpy as np

tsne = TSNE(n_components=2, random_state=0).fit_transform(np.array(df['embeddings'].to_list()))
ax = sns.scatterplot(x=tsne[:, 0], y=tsne[:, 1], hue=np.array(df['Name'].to_list()))
sns.move_legend(ax, 'upper left', bbox_to_anchor=(1, 1))
```

<img src="/img/guides/tsne_codestral-embed.png" alt="drawing" width="600"/>

## Retrieval
Our embedding model excels in retrieval tasks, as it is trained with retrieval in mind. Embeddings are also incredibly helpful in implementing retrieval-augmented generation (RAG) systems, which use retrieved relevant information from a knowledge base to generate responses. At a high-level, we embed a knowledge base, whether it is a local directory, text files, or internal wikis, into text embeddings and store them in a vector database. Then, based on the user's query, we retrieve the most similar embeddings, which represent the relevant information from the knowledge base. Finally, we feed these relevant embeddings to a large language model to generate a response that is tailored to the user's query and context. If you are interested in learning more about how RAG systems work and how to implement a basic RAG, check out our [previous guide](/guides/rag) on this topic.

## Cookbooks
For more information and guides on how to make use of our embedding sdk, we have the following cookbooks:
- [Embedding Cookbook](https://colab.research.google.com/github/mistralai/cookbook/blob/main/mistral/embeddings/code_embedding.ipynb)
- [Dequantization Cookbook](https://colab.research.google.com/github/mistralai/cookbook/blob/main/mistral/embeddings/dequantization.ipynb)
