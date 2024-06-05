# AmiRA (A miRNA Research Assistant)

<iframe width="560" height="315" src="https://www.youtube.com/embed/Z6cCDmZmU_U?si=bv_RkuNYxQ2Xo2p9" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Company Information
[Myo](https://myo.fit) is building multimodal AI for brain health. Right now, we're exploring the relationship between microRNAs and various neurological conditions, including how these biomarkers can be utilized for early detection and monitoring of these diseases. AmiRA is an internal tool powered by Mistral's commercial and open-source models to help understand the functions of certain miRNA in sample results and their accompanying target genes.

## Description
This project demonstrates the fine tuning of mistral models and their use in a RAG system for:
1. Disease association/prediction provided a given miRNA molecule
2. Greater scientific accuracy and relevance when determining the function of miRNA molecules.

This project serves mainly as a proof-of-concept, showing that LLMs and agents can help us explore biomarkers and their relationships to health outcomes with proper engineering.

## Data and Training

Titles and abstracts from 9839 PubMed were crawled. Three questions for each paper were then generated using the `mistral-large-latest` function calling API and traditional prompting. An example prompt is below:

```python
def generate_questions(molecule, title, abstract):
 prompt = f"""
     Based on the following molecule, title, and abstract, generate scientific questions to be
     put in a function. Here is the information:\n\n
     Molecule: {molecule}\nTitle: {title}\nAbstract: {abstract}

     Ask your questions in a way that does not mention the abstract or the title of the work.
     Treat information from the title/abstract as new/general knowledge, and   ask questions framed off of that.
   """
 response = MISTRAL_CLIENT.chat(
     model=MISTRAL_MODEL,
     messages=[ChatMessage(role="user", content=prompt)],
     tools=tools,
     tool_choice="any"
 )
 return response
```
After questions were generated, answers for each question were then generated using mistral-large latest. An example prompt is below:

```python
def generate_answer(molecule, title, abstract, question):
     prompt = f"""
         Based on the following molecule, title, and abstract, and question, generate an answer:

         Molecule: {molecule}\nTitle: {title}\nAbstract: {abstract}\nQuestion: {question}\nAnswer:

         Answer the question given only context information and not prior knowledge.
         Answer in a way that does not mention the abstract or the title of the work.
         Treat the provided information as general knowledge, and answer the questions
         framed off of that.
       """
     response = MISTRAL_CLIENT.chat(
         model=MISTRAL_MODEL,
         messages=[ChatMessage(role="user", content=prompt)],
     )
     return response.choices[0].message.content.strip()
```

With multithreading on 2 CPU cores, question and answer generating took ~2.5 hours. Out of the original 9839 rows, 9414 made it past the data processing due to various errors.

This leaves us with ~28000 question/answer pairs to feed into the model for tuning. An example Q/A pair is below:

```json
{"messages": [{"role": "user", "content": "What is the role of hsa-miR-335-5p in the development of type 2 diabetes mellitus (T2DM) and which genes does it potentially regulate?"}, {"role": "assistant", "content": "The role of hsa-miR-335-5p in the development of type 2 diabetes mellitus (T2DM) is that it potentially regulates the expression of various candidate genes. These genes include procollagen C-endopeptidase enhancer 2, connective tissue growth factor, family with sequence similarity 105, member A, protein phosphatase 1 regulatory inhibitor subunit 1A, and C-C motif chemokine receptor 4. The specific mechanisms through which hsa-miR-335-5p regulates these genes and contributes to the development of T2DM are not detailed in the provided information. However, it is suggested that understanding these regulatory networks could potentially be useful for the molecular diagnosis and targeted therapy of T2DM."}]}
```

## "RAG" Pipeline

A simple table lookup (Pandas Dataframe) was used to surface relevant information about each miRNA present in query strings, and whole abstracts were fed into the model. N of results was never more than 12, and the context window limit was never reached.

![](/img/stories/rag.png)

Embeddings for each paper and title abstract were prepopulated and stored in the dataframe, and cosine similarity was used to surface the top-***k*** most relevant papers before feeding into the model. The number of results fed into the model varied depending on the number of entries present for each molecule. (ie. if there is only 1 entry, k will equal 1. If there are 30 entries, get the best 12 via cosine similarity.)

The model also has the option to take the raw query and perform lookups in the dataframe to gather more information or context at it's own discretion.

## Benchmarking and results
For disease association and prediction, 150 random questions from a miRNA disease association [benchmarking paper published in 2019](https://pubmed.ncbi.nlm.nih.gov/31594544/) were sampled. This dataset was completely separate from any training data used or any PubMed papers crawled to create the training data.

The fine-tuned model outperformed both `mistral-small-latest` and `mistral-large-latest` in question answering, without explicitly seeing any data affiliated to the benchmark. Values below are the averages across 3 attempts.

![](/img/stories/test.png)

One of the benefits of fine-tuning is that you can achieve better performnance with smaller, and therefore faster, models. Below is the average latency for each API call for the same three runs above.

![](/img/stories/latency.png)

## Example responses

The purpose of the finetuning model is not to be a test taker, but to provide better context for RAG systems, so it's natural to want to evaluate the actual outputs of the model in use. Below are two examples of the fine-tuned model's output compared to similar outputs `mistral-large-latest` and `mistral-small-latest`. In situations where the model was forced to "guess" the answer to a question, it gave correct context from it's own knowledge, based off of information it gathered from papers included in its training.

| mistral-finetune | mistral-small-latest |
| :------- | :------- |
| Letter: D: gastrointestinal neoplasms -- This is based on the information provided in the context that hsa-miR-106a-5p is identified as one of the key miRNAs associated with the regulation of hub genes in SARS-CoV-2 infections. However, a direct association with gastrointestinal neoplasms is not explicitly mentioned. The option D: gastrointestinal neoplasms is chosen as hsa-miR-106a has been previously reported in literature to be associated with various types of cancers, including colorectal cancer, which falls under gastrointestinal neoplasms. [Pubmed paper related to this response](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10451182/#:~:text=2.1.%20Colorectal%20Cancer,metastases%20%5B12%5D.) | vascular disease -- Letter: A, B, C, or D not mentioned in the context, so I can't definitively answer. However, hsa-let-7e has been associated with various diseases including some types of cancer, but the context provided doesn't specify its association with any of the listed diseases. |

| mistral-finetune | mistral-large-latest |
| :------- | :------- |
| Letter: D: hypertension (This is an educated guess as the context does not explicitly mention hsa-mir-146b being associated with any of the provided diseases. However, hsa-mir-146b has been studied in relation to hypertension in the literature.) [Pubmed paper related to this response](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6941490/#:~:text=Increased%20miR%2D146b%2D5p%20abundance%20has%20been%20reported%20in%20clinical%20studies%20of%20renal%20pathology%20and%20experimental%20disease%20models%3B%20including%20hypertension%2C%20AKI%2C%20renal%20fibrosis%2C%20and%20CKD.) | I'm sorry for any confusion, but the provided context does not contain any specific information linking hsa-mir-23b to a particular disease. Therefore, I'm unable to provide a precise answer based on the given options. If I were to make an educated guess without additional information, it would not be reliable or accurate. I recommend further research or consultation with a medical professional or a relevant database for the most accurate information. |


