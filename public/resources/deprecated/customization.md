---
id: customization
title: Fine-tuning API (legacy)
sidebar_position: 1.6
---

#  Fine-tuning API (legacy)

:::warning[Deprecated]
This feature is deprecated and is no longer actively supported.
:::

When creating an application with an LLM, you may want to customize the model to better fit your use case. This guide will walk you through the process of customizing a model for your application.

<SectionTab as="h1" sectionId="overview">Overview</SectionTab>

### How to build an application with a custom model

The following is a quick guide on how to build an application with a custom model. Our goal is to help developers build product operations for LLMs to go from a prototype to deployment.

**AI is a tool**, building applications that harness AI make them more useful and practical to your end users.

Before LLMs, AI applications were built around personalization, precision, and prediction. Traditional AI applications are catered towards predicting your next choice and recommending it to you based on your previous behavior and “customers like you”.

In contrast, **LLM applications are built around Human-AI collaboration**. As a developer and the end user, you have more agency in the customisation of your product. You can create something that did not exist before. 

Applications built with custom LLMs require an **iterative development cycle**, relying on **continuous end user feedback** and **rigorous evals** to ensure that your custom model behavior is aligned to the intended application behavior.

*We provide a few developer examples of model customization via Fine-Tuning [here](/resources/cookbooks?useCase=Finetuning).*

<SectionTab variant="secondary" as="h1" sectionId="key-terms">Key Terms</SectionTab>

Before we get started, let’s define key terms:

**Application behavior** can be defined as the user interaction. It takes into account usability, performance, safety, and adaptability. Application behavior includes Objectives and Values.

**Model behavior** can be defined as the expected, appropriate, and acceptable way of an LLM acting in a specific context or application boundaries. Model behavior includes Objectives and Values.

**Objectives** determine whether the model behavior is in line with the expected application behavior. 

**Values** denotes the developers’ intended policy for the model and application. This can be a set of rules, a Constitution, or even a fictional character’s morals.

<SectionTab as="h1" sectionId="steerability-three-methods">Steerability: three methods</SectionTab>

There are several techniques (with varying levels of engineering complexity) available to steer model behavior within your application context. We recommend leveraging the three methods below to do so:
1. **System prompt**
2. **Tune a model**
3. **Deploy a moderation layer** for input/output processing

A **System Prompt** is a method to provide context, instructions, and guidelines to your model before the model is tasked with user input data ([prompt guide](/models/best-practices/prompt-engineering)). By using a system prompt, you can steer the model to better align to your intended product behavior - whether the application is a conversation or task, you can specify a persona, personality, tone, values, or any other relevant information that may help your model better perform in response to the end user’s input.

System prompts can include:
- Clear and specific instructions and objectives
- Roles, desired persona and tone
- Guidance on style e.g. verbosity constraints
- Value definitions e.g. policies, rules and safeguards
- Desired output format

**Tuning a model** is a method to train the model on your intended application behavior ([fine-tuning guide](/resources/deprecated/finetuning)). Two popular approaches for tuning LLMs:
1. **Application tuning**, where you leverage a dataset of examples specified to the desired behavior of your application.
2. **Safety tuning**, where you leverage a dataset that specifies both example inputs that might result in unsafe behavior, along with the desired safe output in that situation.

**Deploying a classifier for content moderation** is a third method to create guardrails for your model’s behavior within the application. This is considered an extra security measure in case you are deploying your application to end users.

<SectionTab as="h1" sectionId="guide-for-tuning-a-model-to-your-intended-application-behavior">Guide for tuning a model to your intended application behavior</SectionTab>

Below you have a step-by-step guide to help you build your application with a custom model.

<SectionTab as="h2" variant="secondary" sectionId="step-1-define-your-intended-application-behavior">Step 1: Define your intended Application Behavior</SectionTab>

The first step is to define the Objectives, i.e. how you want users to interact with your LLM product. 

For inspiration, look to developers building with Mistral models: 
- standalone products like conversational assistants; 
- within pre-existing products to complete a specific task like “Summarize” or “Translate” or enable new capabilities like function calling with API access for “Knowledge retrieval”.

Learn how others are building products with custom models here: [developer examples](#developer-examples).

<SectionTab as="h2" variant="secondary" sectionId="step-2-define-your-policies-based-on-your-values">Step 2: Define your policies based on your Values</SectionTab>

When you deploy an LLM within an end-user facing application, you identify which Values the model will need to abide by in order to meet your Content Moderation guidelines along with your user expectations.

For Content Moderation, look for inspiration from [Llama Guard](https://ai.meta.com/research/publications/llama-guard-llm-based-input-output-safeguard-for-human-ai-conversations/)’s categories like Privacy, Hate, and Specialized Advice and [ML Commons Taxonomy](https://drive.google.com/file/d/1V8KFfk8awaAXc83nZZzDV2bHgPT8jbJY/view) categories like CSAM and Hate.

<SectionTab as="h2" variant="secondary" sectionId="step-3-create-your-application-evals">Step 3: Create your Application Evals</SectionTab>

The goal of your evals is to enable you to have better signal on whether your custom model’s behavior will meet your Application behavior before deployment. Identifying how you want to evaluate your custom model will help determine the type of training data to include in the fine-tuning.

There are two methods to evaluate an LLM:
- **Automated Evals**
    - **Metrics-based**, similar to the public benchmark evaluations where you can derive a metric from pre-annotated data for example.
    - **LLM-based**, where you leverage a different LLM like Mistral Large to evaluate or judge the output of your custom model.
- **Human-based Evals**, where you employ Content Annotators to evaluate or judge the output of your custom model and collect Human annotations.

For more on how to conduct an LLM Evaluation, check out our [evaluation guide](/resources/deprecated/customization#step-3-create-your-application-evals).

<SectionTab as="h2" variant="secondary" sectionId="step-4-test-your-application-behavior-hypothesis-with-an-mvp-powered-by-mistral-large">Step 4: Test your application behavior hypothesis with an MVP</SectionTab>

Once you understand the intent of your custom LLM and the contours of how you want the model to behave, begin by testing your application hypothesis with Mistral Large and collect the interaction data to better understand how your end users may interact with your LLM. For example, many developers begin their process by creating a demo or MVP with limited access as a Public Preview.

For some applications, a system prompt is the best solution for an aligned model behavior. If you need help deciding between the two, look to our [fine-tuning guide](/resources/deprecated/finetuning). 

If a system prompt works creating a Custom Model, skip to Step 6.

<SectionTab as="h2" variant="secondary" sectionId="step-5-tune-for-model-alignment">Step 5: Tune for model alignment</SectionTab>

Now that you have sense of the Application Behavior - Values and Objectives included - you are intending to adopt a custom model, you can begin the process of replacing Mistral Large for a smaller, custom model.

Look to our guide on how to [prepare your Tuning dataset](/resources/deprecated/finetuning#prepare-the-dataset).

Areas to consider when preparing your Tuning Dataset for better model performance:
- **Data Comprehension**, include all content policies for each application use case in your dataset (such as question-answering, summarization, and reasoning).
- **Data Variety**, ensure dataset diversity across query length, structure, tone, topic, levels of complexity, and demographic considerations.
- **Deduplication**, remove duplicates to prevent your tuning data being memorized.
- **Avoid Data Contamination**, isolate evaluation data from the tuning dataset.
- **Ethical Data Practices**, provide clear labeling guidelines and Annotator diversity to minimize model errors and bias.

For content moderation, get started with open source datasets like [Safety-Tuned LlaMAs](https://arxiv.org/abs/2309.07875).

At Mistral, we support two ways to customize our models:
1. OSS with the [FT Codebase](https://github.com/mistralai/mistral-finetune/)
2. Via the [AI Studio](https://console.mistral.ai/)

Head to our FT API within the AI Studio, upload and validate your training data. Run the job, and when completed, you can access your custom model via your own model API endpoint.

<SectionTab as="h2" variant="secondary" sectionId="step-6-test-your-custom-model-with-your-evals">Step 6: Test your custom model with your Evals</SectionTab>

Now that you have your custom model API endpoint, you can run Application Evals from Step 4. Depending on your Application, remember to include Safety Evals in your Eval set:
- **Development Evaluations**, include ongoing assessments during training and fine-tuning to compare model performance against launch criteria and evaluate the impact of mitigation strategies. These evaluations use adversarial queries or external academic benchmarks.
- **Assurance Evaluations**, set up governance and review assessments at key milestones by an external group. These standardized evaluations use strictly managed datasets and provide high-level insights for mitigation efforts. They test safety policies and dangerous capabilities, such as biohazards, persuasion, and cybersecurity.
- **Red Teaming** requires adversarial testing by specialist teams using less structured methods to discover potential weaknesses and improve risk mitigation and evaluation approaches.
- **External Evaluations**, includes assessments by independent, external domain experts to identify model limitations and stress-test performance.

Based on the model performance, either retrain your model with new training data to support better model performance or deploy into your application by switching the Mistral Large API with your custom model endpoint.

<SectionTab as="h2" variant="secondary" sectionId="step-7-once-deployed-continuously-monitor-and-update-your-custom-model-evals-and-testing-based-on-real-life-application-data">Step 7: Once deployed, continuously monitor and update</SectionTab>

Continuously monitor and update your custom model, evals, and testing based on real life application data.

*Congrats! You’ve deployed your custom model into your application.*

<SectionTab as="h1" sectionId="developer-examples">Developer Examples</SectionTab>

The following are developer examples from the startup community using our fine-tuning API.
Check out our [fine-tuning doc](/resources/deprecated/finetuning) to learn the benefits of fine-tuning and how to use our fine-tuning API.

<ExplorerTabs id="developer-examples" mode="close">
  <ExplorerTab value="rag-for-internet-retrieval" label="RAG for Internet Retrieval">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/kqNtOlSOJIE?si=xQOhIXukTFZhV3xq" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

The video showcases the behavior of Tak. When a user inputs a query, Tak will use the LLM knowledge, a tool to search the web and a tool to fetch the news to generate the most relevant answer to the user query. Its behavior depends on the type of query by the user.

<SectionTab variant="secondary" sectionId="phospho-description">Description</SectionTab>

[Tak is a B2C internet search app](https://tak.phospho.ai/) powered by Mistral Large and other models with RAG and Function Calling.

In order to provide the most relevant answer to the user query, several function calls are performed to categorize the request (see diagram below). As the multiple agents are chained, ensuring consistently formatted outputs is crucial.

![Performance Metrics](/img/stories/tak_architecture_diagram.png)

<SectionTab variant="secondary" sectionId="phospho-company-description">Company Description</SectionTab>

At phospho, we developed the Tak chatbot as an experimental playground to test new phospho features and showcase the power of phospho analytics. A great thing is that you can use the data logged to phospho to finetune LLM models.
We are [phospho](https://phospho.ai/), an open-source text analytics platform for LLM apps. Companies of all sizes use phospho to understand what users do with their LLM app and how well the app performs at the product level.

<SectionTab variant="secondary" sectionId="phospho-data">Data</SectionTab>

We used a dataset of user queries in Tak and the corresponding GPT-4-turbo function calls, collected and filtered through the phospho platform. We then divided the dataset into a _train_ set (70%), an _evaluation_ set (15%) and a test set (15%).

To determine the optimal training duration, we followed the rule of thumb that each token should be seen three times (in our case, 150 training steps, which is approximately 10 minutes).

For the learning rate, we used the suggested learning rate of 6e-5.

<SectionTab variant="secondary" sectionId="phospho-eval">Eval</SectionTab>

To evaluate our fine-tuned model, we run inference of the test set of our dataset, then use binary classification metrics (Accuracy, Recall, F1 score). We test whether we were able to align the behavior of Mistral 7b to the classification behavior of OpenAI GPT-4-turbo, while maintaining the expected structured output. Indeed, we removed the function calling.

![Performance Metrics](/img/stories/performance_metrics.png)

Fine-tuning made Mistral 7B match the reference model, **increasing the F1 score from 20% to 78%**. Without fine-tuning, Mistral 7B achieved 87% accuracy and 20% recall on our classification task. With the fine-tuned model, we achieved 96% accuracy and 90% recall.

As we fine-tuned the model to only answer with `news_related` or `not_news_related`, we do not need to use function calling anymore. This led to a **34% decrease in the number of tokens used** excluding the user query, which further decreases costs.

<SectionTab variant="secondary" sectionId="phospho-conclusion">Conclusion</SectionTab>

In conclusion, by combining phospho data collection and labeling with Mistral's fine-tuning services, we significantly enhanced our ability to deliver precise and relevant answers to user queries while decreasing cost. We have successfully aligned the behavior of Mistral 7B with GPT-4-turbo. This fine-tuning process not only ensures consistent output formatting but also reduces operational costs by minimizing token usage.

If you also want to improve your RAG agent, we encourage you to try fine tuning with Mistral using the data collected and labeled with phospho. This can lead to significant improvement on your user experience.
  </ExplorerTab>
  <ExplorerTab value="rag-for-medical-domain" label="RAG for Medical Domain">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/Z6cCDmZmU_U?si=bv_RkuNYxQ2Xo2p9" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<SectionTab variant="secondary" sectionId="myo-company-information">Company Information</SectionTab>

[Myo](https://myo.fit) is building multimodal AI for brain health. Right now, we're exploring the relationship between microRNAs and various neurological conditions, including how these biomarkers can be utilized for early detection and monitoring of these diseases. AmiRA is an internal tool powered by Mistral's commercial and open-source models to help understand the functions of certain miRNA in sample results and their accompanying target genes.

<SectionTab variant="secondary" sectionId="myo-description">Description</SectionTab>

This project demonstrates the fine tuning of mistral models and their use in a RAG system for:

1. Disease association/prediction provided a given miRNA molecule
2. Greater scientific accuracy and relevance when determining the function of miRNA molecules.

This project serves mainly as a proof-of-concept, showing that LLMs and agents can help us explore biomarkers and their relationships to health outcomes with proper engineering.

<SectionTab variant="secondary" sectionId="myo-data-training">Data and Training</SectionTab>

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
{
  "messages": [
    {
      "role": "user",
      "content": "What is the role of hsa-miR-335-5p in the development of type 2 diabetes mellitus (T2DM) and which genes does it potentially regulate?"
    },
    {
      "role": "assistant",
      "content": "The role of hsa-miR-335-5p in the development of type 2 diabetes mellitus (T2DM) is that it potentially regulates the expression of various candidate genes. These genes include procollagen C-endopeptidase enhancer 2, connective tissue growth factor, family with sequence similarity 105, member A, protein phosphatase 1 regulatory inhibitor subunit 1A, and C-C motif chemokine receptor 4. The specific mechanisms through which hsa-miR-335-5p regulates these genes and contributes to the development of T2DM are not detailed in the provided information. However, it is suggested that understanding these regulatory networks could potentially be useful for the molecular diagnosis and targeted therapy of T2DM."
    }
  ]
}
```

<SectionTab variant="secondary" sectionId="myo-rag-pipeline">"Rag" Pipeline</SectionTab>

A simple table lookup (Pandas Dataframe) was used to surface relevant information about each miRNA present in query strings, and whole abstracts were fed into the model. N of results was never more than 12, and the context window limit was never reached.

![](/img/stories/rag.png)

Embeddings for each paper and title abstract were prepopulated and stored in the dataframe, and cosine similarity was used to surface the top-**_k_** most relevant papers before feeding into the model. The number of results fed into the model varied depending on the number of entries present for each molecule. (ie. if there is only 1 entry, k will equal 1. If there are 30 entries, get the best 12 via cosine similarity.)

The model also has the option to take the raw query and perform lookups in the dataframe to gather more information or context at it's own discretion.

<SectionTab variant="secondary" sectionId="myo-benchmarking-and-results">Benchmarking and Results</SectionTab>

For disease association and prediction, 150 random questions from a miRNA disease association [benchmarking paper published in 2019](https://pubmed.ncbi.nlm.nih.gov/31594544/) were sampled. This dataset was completely separate from any training data used or any PubMed papers crawled to create the training data.

The fine-tuned model outperformed both `mistral-small-latest` and `mistral-large-latest` in question answering, without explicitly seeing any data affiliated to the benchmark. Values below are the averages across 3 attempts.

![](/img/stories/test.png)

One of the benefits of fine-tuning is that you can achieve better performnance with smaller, and therefore faster, models. Below is the average latency for each API call for the same three runs above.

![](/img/stories/latency.png)

<SectionTab variant="secondary" sectionId="myo-example-responses">Example Responses</SectionTab>

The purpose of the finetuning model is not to be a test taker, but to provide better context for RAG systems, so it's natural to want to evaluate the actual outputs of the model in use. Below are two examples of the fine-tuned model's output compared to similar outputs `mistral-large-latest` and `mistral-small-latest`. In situations where the model was forced to "guess" the answer to a question, it gave correct context from it's own knowledge, based off of information it gathered from papers included in its training.

| mistral-finetune                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | mistral-small-latest                                                                                                                                                                                                                                                                            |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Letter: D: gastrointestinal neoplasms -- This is based on the information provided in the context that hsa-miR-106a-5p is identified as one of the key miRNAs associated with the regulation of hub genes in SARS-CoV-2 infections. However, a direct association with gastrointestinal neoplasms is not explicitly mentioned. The option D: gastrointestinal neoplasms is chosen as hsa-miR-106a has been previously reported in literature to be associated with various types of cancers, including colorectal cancer, which falls under gastrointestinal neoplasms. [Pubmed paper related to this response](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10451182/#:~:text=2.1.%20Colorectal%20Cancer,metastases%20%5B12%5D.) | vascular disease -- Letter: A, B, C, or D not mentioned in the context, so I can't definitively answer. However, hsa-let-7e has been associated with various diseases including some types of cancer, but the context provided doesn't specify its association with any of the listed diseases. |

| mistral-finetune                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | mistral-large-latest                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Letter: D: hypertension (This is an educated guess as the context does not explicitly mention hsa-mir-146b being associated with any of the provided diseases. However, hsa-mir-146b has been studied in relation to hypertension in the literature.) [Pubmed paper related to this response](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6941490/#:~:text=Increased%20miR%2D146b%2D5p%20abundance%20has%20been%20reported%20in%20clinical%20studies%20of%20renal%20pathology%20and%20experimental%20disease%20models%3B%20including%20hypertension%2C%20AKI%2C%20renal%20fibrosis%2C%20and%20CKD.) | I'm sorry for any confusion, but the provided context does not contain any specific information linking hsa-mir-23b to a particular disease. Therefore, I'm unable to provide a precise answer based on the given options. If I were to make an educated guess without additional information, it would not be reliable or accurate. I recommend further research or consultation with a medical professional or a relevant database for the most accurate information. |
  </ExplorerTab>
  <ExplorerTab value="financial-advisor-conversational-assistant" label="Financial Assistant">
    {/* TODO: obsolete? */}

<SectionTab variant="secondary" sectionId="cleo-company-description">Company Description</SectionTab>

Cleo is an AI fintech, building a financial assistant that helps its users navigate the complexity of their financial life.

<SectionTab variant="secondary" sectionId="cleo-data">Data</SectionTab>

Using an internal dataset consisting of user requests and Cleo responses crafted by Cleo's Content Design team.

<SectionTab variant="secondary" sectionId="cleo-eval">Eval</SectionTab>

Human evaluation by the Content Design team.

The objective was simple: A translator from dry, factual, generated language to the playful Tone of Voice of Cleo.
For that, we fine-tuned Mistral using Studio on company data crafted and evaluated by the Content Design team. The goal was to lift the writing style that is characteristic of Cleo and its brand.
For example a typical message to our users could be:

```
"Your Cleo Plus subscription payment didn't go through, so no cash advance for now, Nikos."
```

However, using the fine-tuned model, we can get more playful responses:

```bash
curl -s -XPOST 'https://api.mistral.ai/v1/chat/completions' \
  -H "Authorization: Bearer $MISTRAL_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
  "model": "ft:open-mistral-7b:...",
  "messages": [
    {
      "role": "user",
      "content": "Your Cleo Plus subscription payment didn't go through, so no cash advance for now, Nikos."
    }
  ],
  "temperature": 0.0,
  "top_p": 1,
  "max_tokens": 512,
  "stream": false,
   "safe_prompt": false,
  "random_seed": 42
}'
```

```json
{
  "id": "d43ba5cf228a43ff9bf27ed8fb403292",
  "object": "chat.completion",
  "created": 1717417588,
  "model": "ft:open-mistral-7b:...",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Oh darling Nikos, it seems your Cleo Plus payment has taken a little vacay, so no jingle in the pocket for a cash advance at the moment, love. Don't you worry, just give it a little nudge and we'll get you sorted in no time! 💃🏼💸",
        "tool_calls": null
      },
      "finish_reason": "stop",
      "logprobs": null
    }
  ]
}
```

We get a response more characteristic of Cleo’s brand.

```
"Oh darling Nikos, it seems your Cleo Plus payment has taken a little vacay, so no jingle in the pocket for a cash advance at the moment, love. Don't you worry, just give it a little nudge and we'll get you sorted in no time! 💃🏼💸"
```

Getting a response that corresponds more to our brand.
  </ExplorerTab>
  <ExplorerTab value="legal-copilot" label="Legal Copilot">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/H2jAsddS4LA?si=x_iRPIF5FON_Q-WR" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
*Video 1: Integration of the Mistral fine-tuned models into our product [Jimini Analyzer](https://jimini.ai/).*

The video begins by showcasing the integration of the fine-tuned model on [BSARD](https://arxiv.org/pdf/2108.11792) into our legal document analysis tool. In contrast to the base model, the fine-tuned version **accurately lists the relevant legal articles** in Markdown format, providing a clear and concise overview of the applicable laws.

The remainder of the video highlights the integration of the fine-tuned template on [Multi EURLEX](https://arxiv.org/pdf/2109.00904) into our legal translation tool, resulting in more precise translations of complex legal terminology, such as "_Gerichtsgesetzbuch_'' for "_Code judiciaire_". This enhancement ensures that our translations **accurately reflect the intended legal meaning, ultimately providing greater value to our clients**.

<SectionTab variant="secondary" sectionId="description">Description</SectionTab>

As we are building a legal copilot, fine-tuning a model presents several interests for us :

- **_It can teach the model to generate responses in a specific format and tone._**

To ensure that our legal copilot outputs reliable, well-sourced and professionally formatted legal answers, we've fine-tuned the `mistral-small` model, focusing on **improving response structure and sourcing**.

For this first use-case, demonstrated on the [_BSARD_](https://arxiv.org/pdf/2108.11792) dataset, we employ **distillation** from the smarter `mistral-large` model. This approach **reduces costs**, saves tokens (no need for a complex prompt anymore) and **decreases latency** by using a small, efficient and fine-tuned model.

- **_It can also be used to specialize the model for a specific topic or domain to improve its performance on domain-specific tasks, such as the legal translation._**

Our **strong European roots** and commitment to our European clients drive us to excel in French-German legal translation. By harnessing the strong multilingual abilities of `mistral-small` and fine-tuning it further specifically for legal terms on the [Multi EURLEX](https://arxiv.org/pdf/2109.00904) dataset, we significantly improved the translation of legal terminology.

<SectionTab variant="secondary" sectionId="jimini-company-description">Company Description</SectionTab>

At [Jimini AI](https://jimini.ai/), we are dedicated to creating a **cutting-edge legal copilot**, designed to assist legal professionals in automating their most tedious and time-consuming tasks, such as the legal research or the translation of legal documents. Gaining access to [Mistral AI](https://mistral.ai/)'s fine-tuning API presented us with an ideal opportunity to focus on two of our key use-cases.

<SectionTab variant="secondary" sectionId="bsard-data">BSARD - Data</SectionTab>

We used the [Belgian Statutory Article Retrieval Dataset (BSARD)](https://aclanthology.org/2022.acl-long.468/), a comprehensive French dataset for examining legal information retrieval, to fine-tune `mistral-small-latest` and improve the legal accuracy and quality of its answers. It encompasses over 22,600 statutory articles derived from Belgian law along with approximately 1,100 legal inquiries.

We created a synthetic _Question Answering_ (QA) dataset by utilizing the `mistral-large-latest` model to generate ground truth answers based on expertly crafted guidelines, which were meticulously developed **in collaboration with legal professionals**. We then divided the dataset into a _train_ set (80%) and an _evaluation_ set (20%).

To determine the optimal training duration, we followed the rule of thumb that each token should be seen three times (in our case, 220 training steps, which is approximately 30 minutes).

To tune the `learning_rate`, we opted to measure third-party and more generic capabilities than legal criteria to ensure that the model does not regress due to catastrophic forgetting. To this end, we evaluated the model's performance using the [faithfulness](https://docs.ragas.io/en/stable/concepts/metrics/faithfulness.html) and [relevancy](https://docs.ragas.io/en/stable/references/metrics.html#ragas.metrics.AnswerRelevancy) metrics from [RAGAS](https://arxiv.org/abs/2309.15217) on a proprietary _generalist_ dataset.

![RAGAS evaluation on BSARD](/img/stories/results_bsard.png)
_Figure 1: RAGAS based evaluation of Faithfulness and Answer relevancy of the `mistral-small-latest` and `mistral-small-fine-tuned` models for different learning rates and different number of steps._

​​We have therefore selected a `learning_rate` of `1e-6`, for which we observe a slight improvement compared to `mistral-small-latest`, as well as a balance between the two criteria. Thus, there does not appear to be any regression of the model's general capabilities.

In addition to this initial sanity check, we used the very useful integration of the Mistral AI fine-tuning endpoint’s with [Weights & Biases](https://wandb.ai/site) to monitor our trainings, and we have notably measured the evolution of the model's `perplexity`, which seems to effectively converge under this training regime (where each token is seen 3 times).

![BSARD training curves](/img/stories/bsard_curves.png)
*Figure 2: Perplexity and eval loss during the fine-tuning on BSARD monitored in *Weights & Biases*.*

<SectionTab variant="secondary" sectionId="bsard-eval">BSARD - Eval</SectionTab>

To evaluate the effectiveness of our fine-tuning process, we employed the _LLM-as-a-Judge_ methodology. Specifically, we drew inspiration from the additive scale approach developed by [Yuan et al](https://arxiv.org/abs/2401.10020). and recently utilized for the [FineWeb-Edu dataset constitution](https://huggingface.co/spaces/HuggingFaceFW/blogpost-fineweb-v1). We then adapted the methodology by transforming it into a preference score system, denoted in the following by `legal_quality` :

```text
Given the following two answers, compare them based on the following criteria:

- Explicit, accurate citation of the relevant legal article(s), such as "d'après l'article 123 du Code Civil". Implicit (such as "d'après l'extrait fourni") or general references (such as "d'après le Code Civil") are not accepted.

- Clear, logical argumentation of each stated element, including the precise identifier of the corresponding legal article.

- Well-structured answer with Markdown formatting, clear writing, and no ambiguities. Source references are required.

---

For each criterion, assign a point to the answer that best satisfies the criterion. If both answers are equal, assign 1 point to both. Be strict; if no answer perfectly meets a criterion, do not award a point. Briefly justify your total score in up to 100 words. Conclude with the score of each answer as an integer between 0 and 3.

Return the information in JSON format following this schema:

{
    "justification": "string",
    "score_answer_1": int,
    "score_answer_2": int
}

Question :
{question}

Answer 1:
{answer_1}

Answer 2:
{answer_2}

JSON:
```

These criteria were meticulously established and fine-tuned based on the feedback of multiple legal experts.

We conducted a rigorous evaluation of several candidate `Judge LLMs`, including `gpt-3.5-turbo`, `mixtral`, and `mistral-large`. The results of our analysis revealed that `mistral-large` demonstrated the highest correlation with the experts' preferences, and was therefore selected as the `Judge LLM`.

<SectionTab variant="secondary" sectionId="bsard-results">BSARD - Results</SectionTab>

![BSARD evaluation on legal quality](/img/stories/legal_quality.png)
_Figure 3: LLM-as-a-judge evaluation of `mistral-small-latest` and `mistral-small-finetuned` based on the legal quality of their answers._

We observe a significant improvement, with a score increase from 1.42 to 1.73, representing a **20% enhancement!**

This progress is also noticeable in practical applications. The example demonstrated in the video serves as evidence of this improvement:
_(For the non-French readers, we have translated the original French answers into English)_

**Question :**

```text
What are the risks if I stop paying my consumer credit?
```

**`mistral-small-finetuned` answer:**

```text
If you stop paying your consumer credit, you face several consequences:

1. Payment deadline and suspension of proceedings: The judge may grant moderate payment deadlines and suspend proceedings (Art. 1244, Civil Code).

2. Payment facilities: You can request payment facilities from the justice of the peace, but only after the creditor has refused to grant these facilities. This procedure is governed by articles 1337bis to 1337octies of the Judicial Code.

3. Forfeiture of the term or resolutory condition: If you do not comply with the payment terms and the contract provides for it, the creditor may declare the forfeiture of the term or the resolutory condition. However, the conditions of forfeiture of the term or resolutory condition are strictly regulated by article VII.105 of the Economic Law Code. For example, a forfeiture of the term or resolutory condition clause can only be applied if you are in default of payment of at least two term amounts or a sum equivalent to 20% of the total amount due.

4. Penalties and late interest: In case of late payment, the creditor may claim the outstanding and unpaid capital, the outstanding and unpaid amount of the total cost of credit for the consumer, the amount of the agreed late interest calculated on the outstanding and unpaid capital, and the agreed fees for reminder letters and formal notices (Art. VII.106, Economic Law Code).

5. Repossession of the financed asset: If the financed asset is subject to a retention of title clause or a promise of pledge with an irrevocable mandate, the creditor may repossess the asset if you do not meet your payment obligations. However, if you have already paid 40% or more of the cash price of the asset, it cannot be repossessed except by court decision or a written agreement concluded after formal notice by registered mail (Art. VII.108, Economic Law Code).
```

**`mistral-small-latest` answer:**

```text
If you continue to not pay, this may lead to the termination of the contract or the forfeiture of the term. In this case, the creditor can claim the remaining balance, the total cost of credit for the consumer, and penalties or compensation within certain limits. Finally, if the situation persists, the creditor may initiate recovery procedures, which may include wage garnishment or seizure of your bank account. Your financial situation could then deteriorate significantly.
```

The answer from `mistral-small-finetuned` is clear and well-structured, supported by precise legal references, whereas the response from `mistral-small-latest` is not.

<SectionTab variant="secondary" sectionId="multi-eurlex-data">Multi EURLEX - Data</SectionTab>

To enhance our legal translation tool, we have also fine-tuned `mistral-small-latest` on legal documents. For this purpose, we selected a subset of the [Multi EURLEX](https://arxiv.org/pdf/2109.00904) dataset, which consists of 35,000 European legal documents in French translated into German.

![Multi EURLEX training curves](/img/stories/eurlex_curves.png)

*Figure 4: Perplexity and eval loss during the fine-tuning on Multi EURLEX monitored in *Weights & Biases*.*

<SectionTab variant="secondary" sectionId="multi-eurlex-eval">Multi EURLEX - Eval</SectionTab>

In order to evaluate the fine-tuned model on relevant examples for our use cases, we selected 50 texts containing complex legal terms to be translated from French to German (such as _"Clause de non-concurrence"_, which is sometimes translated as _"Nicht-Konkurrenz-Klausel"_ instead of _"Wettbewerbsverbotsklausel"_).

We then submitted the triplets (`example`, `mistral_base_translation`, `mistral_finetuned_translation`) blindly to a bilingual legal expert, who selected the most accurate legal translation for each example.

<SectionTab variant="secondary" sectionId="multi-eurlex-results">Multi EURLEX - Results</SectionTab>

The legal expert preferred the legal translation of the fine-tuned model in 38 / 50 cases, with 9 cases tied. Thus, the fine-tuned model is **better or at least as good as the base model in 94% of cases**.

|                          Example                           |                   `mistral-small-latest`                   | `mistral-small-finetuned`                                     |
| :--------------------------------------------------------: | :--------------------------------------------------------: | ------------------------------------------------------------- |
| Le vice de procédure a conduit à l'annulation du jugement. | Die Prozessirregularität führte zur Aufhebung des Urteils. | Der Verfahrensmangel hat zur Nichtigkeit des Urteils geführt. |

_Table 1: Comparison of `mistral-small-latest` and its fine-tuned counterpart on Multi EURLEX. The fine-tuned model uses "Verfahrensmangel" and "Nichtigkeit des Urteils", which are the precise and correct legal terms._

<SectionTab variant="secondary" sectionId="jimini-conclusion">Conclusion</SectionTab>

Our initial tests fine-tuning the `mistral-small` model using Mistral AI's endpoint have yielded promising results. **The fine-tuned model excels in generating structured, well-sourced responses and accurately translating complex legal terms**, demonstrating its potential for specialized legal applications.

The fast fine-tuning capability and _Weights & Biases_ integration made the process efficient and straightforward, allowing us to **develop cost-effective, specialized models quickly**.

We will further enhance our results by collaborating closely with our lawyer customers to refine the models' performance. Additionally, we plan to expand use cases to include legal summarization, contract analysis, and legal drafting.

We extend our thanks to Mistral AI for allowing us to test their fine-tuning API during Public Preview. The Mistral AI fine-tuning endpoint has proven to be an invaluable tool for our legal AI development - these experiments were just the beginning!

<SectionTab variant="secondary" sectionId="jimini-references">References</SectionTab>

- BSARD : [paper](https://arxiv.org/abs/2108.11792)
- FineWeb-Edu : [blogpost](https://huggingface.co/spaces/HuggingFaceFW/blogpost-fineweb-v1)
- Multi EURLEX : [paper](https://arxiv.org/pdf/2109.00904)
- RAGAS : [paper](https://arxiv.org/abs/2309.15217) & [library](https://github.com/explodinggradients/ragas)
- Self-Rewarding Language Model, _Yuan et al._ : [paper](https://arxiv.org/abs/2401.10020)
- Weights & Biases : [website](https://wandb.ai/site)
  </ExplorerTab>
</ExplorerTabs>