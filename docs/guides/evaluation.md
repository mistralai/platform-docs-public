---
id: evaluation
title: Evaluation
sidebar_position: 1.7
---

<a target="_blank" href="https://colab.research.google.com/github/mistralai/cookbook/blob/main/mistral/evaluation/evaluation.ipynb">
  <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/>
</a>

Many companies face the challenge of evaluating whether a Large Language Model (LLM) is suitable for their specific use cases and determining which LLMs offer the best performance. It is essential to assess whether one model can effectively replace another and ensure that the chosen LLM meets the companies’ unique requirements. However, the process of evaluating LLMs can be complex and confusing. This guide provides a comprehensive approach to evaluating LLMs for various applications. We will start by discussing the goal of evaluation, the creation of evaluation datasets, and then we will dive into three primary evaluation methods with detailed Python code walkthroughs in notebooks. 

- What exact task do you want to solve?
- How to create an evaluation dataset?
- How to evaluate?  
    - Metrics-based evaluation
    - LLM-based evaluation
    - Human-based evaluation 

## What is your task? 
Before we get started with the evaluation process, it is important to think about what exact task you want to solve with the LLM. It is crucial that the task is precisely defined.

Some bad examples:
- Be a helpful assistant (What does “helpful” mean in your context?)
- Convert the text into code (What type of text and code?)
- Improve the quality of the documents (What is high vs. low quality?)

Some good examples:
- Be an assistant for customer complaints. Make sure to answer complaints in a polite and helpful way and give concise answers that don’t exceed 3 sentences. 
- Make sure to notify the user if you do not know the answer.
- Convert pseudo code into Python code 
- Rephrase the documents by improving all spelling and grammatical errors and give the text a more professional tone
- Extract all relevant information from medical records (which use case would be subject to specific applicable regulations)
- Summarize various types of documents, such as legal agreements, news articles, or scientific papers

Different goals and use cases may require different evaluation strategies. Some use cases may prioritize accuracy, while others may emphasize brevity and helpfulness. Therefore, it is crucial to know exactly what task you want to solve before starting an evaluation process.

## How to create an evaluation dataset?
There are numerous public benchmarks available for evaluating Large Language Models (LLMs) such as MMLU, GSMK8, and others. The first question to consider is whether these existing benchmarks can be used for your specific use cases. If applicable, then start with the existing benchmark dataset. 

However, we often observe that existing benchmarks are academic in nature and may not cover real-world customer use cases or only address a limited scope. Therefore, it is often preferable to create your own evaluation dataset. 

Once you have established your goals and determined whether existing benchmarks are suitable, you can proceed to create custom evaluation datasets tailored to your specific use cases. 

### Labeled data 

In many cases, it is important to create labeled data. For example, if your task is to use an LLM to extract information from medical records subject to specific applicable regulations, you can use human annotation to label the data and get the golden answer including all the information you would like to extract, e.g.,  `{"age": 60, "gender": "male", "diagnosis": "diabetes", "weight": 210, "smoking": "yes"}`. 

How much data annotation do you need? It depends on the task. You should always prioritize quality over quantity. If you have high quality data, 100 test cases can be enough to provide a meaningful signal.  

Additionally, It is recommended to have a discriminative benchmark, meaning that it’s neither too easy, nor too hard. If every model being tested achieves over 90% accuracy, the differences between them might not be meaningful, indicating the need for a better benchmark.  The goal is to create data that can differentiate models effectively. Creating discriminative data can be challenging, so focus on your specific task. Potentially multiple models perform well enough for your needs. A good evaluation dataset should lead to performances that are in agreement with model sizes, ie, larger models perform on par or better than smaller counterparts (unless the smaller models have been specifically trained for your purposes). 

Here are some examples of various prompts and golden answers across different capabilities:

| Task               | Prompt/Context| Golden Answer/Criteria|
|--------------------|:--------------------|:--------------------|
| Information extraction                | A 60-year-old male patient, Mr. Johnson, presented with symptoms of increased thirst, frequent urination, fatigue, and unexplained weight loss. Upon evaluation, he was diagnosed with diabetes, confirmed by elevated blood sugar levels. Mr. Johnson's weight is 210 lbs. He has been prescribed Metformin to be taken twice daily with meals. It was noted during the consultation that the patient is a current smoker.| `{"age": 60, "gender": "male", "diagnosis": "diabetes", "weight": 210, "smoking": "yes"}` |
|Python code generation|Write a python function to check whether the given number is odd or not using bitwise operator.|`assert is_odd(5) == True` |
|Summarization| Summarize the following into a short paragraph for 3rd graders: "Water is a chemical compound composed of two hydrogen atoms bonded to one oxygen atom, with the chemical formula H2O. The hydrogen atoms are bonded to the oxygen atom via polar covalent bonds, which means that the electrons in the bond are not shared equally between the atoms, resulting in a slight negative charge on the oxygen atom and a slight positive charge on the hydrogen atoms. This gives water molecules a bent, or V-shaped, structure, and allows them to form hydrogen bonds with other water molecules, which are responsible for many of water's unique properties, such as its high boiling point and surface tension." |Water is a special substance that is made up of two tiny parts called atoms, specifically, two hydrogen atoms and one oxygen atom. These atoms are stuck together in a way that creates a bent shape, which makes water have some amazing properties. For example, water can stick to itself, which helps it stay together as a liquid and not just turn into a gas. This also makes water have a high boiling point, which means it needs a lot of heat to turn into a gas. Water's unique properties make it an important part of our lives and our planet.|
|Multilingual|Translate this college homework assignment into advanced Spanish for an advanced writing course: "Write a personal essay of 500 words about a crucial moment in your family, describing the event, its impact on family relationships, and the emotions and thoughts that surrounded it. Your essay should have a clear structure, with an introduction, body, and conclusion, and use expressive and precise language. It will be evaluated based on clarity, coherence, depth, and originality."|Escriba un ensayo personal de 500 palabras sobre un momento crucial en su familia, describiendo el evento, su impacto en las relaciones familiares, y las emociones y pensamientos que lo rodearon. Su ensayo debe tener una estructura clara, con una introducción, un cuerpo y una conclusión, y utilizar un lenguaje expresivo y preciso. Será evaluado sobre la base de claridad, coherencia, profundidad y originalidad.|
|Chat|You are an 8th grade tutor for a Latin class, your job is to help students memorize their weekly word list test. You don’t give the answers to your students but instead help them get to the answer themselves. Begin your tutoring session by asking your student what word list do they need help memorizing. Remember to be encouraging and ask students to "show their work" i.e. articulate how they came up with that answer.|Hello there! I hope you're having a great day. As your Latin tutor, I'm here to help you with your weekly word list test. So, let's get started! Could you please tell me which word list you need help memorizing this week? Remember, the goal is not just to remember the words, but also to understand their meanings and how to use them in context. <br/> Once you've chosen a word, I'd like you to try to recall its meaning or use it in a sentence. Then, I'd love for you to "show your work" by explaining how you came up with that answer. This will help reinforce your understanding and make it easier to remember. Does that sound good? Let's dive in!


### Unlabeled data:

In some cases, you may not be able to create labeled data easily. You may use an LLM to generate the necessary data. For example, you may ask an LLM to generate questions and answers based on a given text. Here are two prompt templates for generating questions and answers:

- Prompt template for generating questions based on the context: 
```
Context information is below.
---------------------
{context_str}
---------------------
Given the context information and not prior knowledge. Generate {num_questions_per_chunk} questions based on the context. The questions should be diverse in nature across the document. Restrict the questions to the context information provided.
```

- Prompt template for generating answers based on the context and the generated question from the previous prompt template: 
```
Context information is below
---------------------
{context_str}
---------------------
Given the context information and not prior knowledge,
answer the query.
Query: {generated_query_str}
Answer: 
```

However, LLM-generated data usually requires further refinement and filtering. It is preferable to have questions derived from real-world sources, especially from experts. Nevertheless, LLM-generated data can still be helpful when real data is difficult to obtain or scarce. 

## How to evaluate

## Metrics-based evaluation
Metrics-based evaluation is the standard approach in many public benchmark evaluations. There are a number of metrics that can be used to evaluate and compare the model-generated answers with the golden answers. The most popular ones are exact match accuracy rate, recall, precision, F1 score.
- **Exact Match Accuracy Rate**: This metric measures the proportion of model-generated answers that perfectly match the golden answers. It offers a strict evaluation of the model's ability to generate precise responses.
- **Recall**: Recall calculates the fraction of relevant information from the golden answers that is successfully retrieved by the model-generated answers. A higher recall indicates that the model can capture more relevant information.
- **Precision**: Precision assesses the fraction of relevant information in the model-generated answers. A higher precision means that the model generates more accurate and relevant responses.
- **F1 Score**: The F1 score is the harmonic mean of recall and precision, providing a balanced evaluation of the model's performance in terms of both metrics.

Apart from these popular metrics, there are other NLP evaluation metrics such as BLEU (Bilingual Evaluation Understudy) and ROUGE (Recall-Oriented Understudy for Gisting Evaluation). BLEU is primarily used for machine translation tasks, while ROUGE is commonly applied for text summarization. However, due to concerns regarding their reliability and the potential for misleading results, we do not recommend.

<details>
<summary><b> Example 1: evaluate information extraction with accuracy rate</b></summary>

### Example 1: evaluate information extraction with accuracy rate

#### Evaluation data

This first example involves extracting patient information from medical notes. To perform the evaluation, both the medical notes and the correct/expected answer (referred to as the "golden answer") are required in the evaluation data. Here are two example test cases: 

```py
prompts = {
    "Johnson": {
        "medical_notes": "A 60-year-old male patient, Mr. Johnson, presented with symptoms of increased thirst, frequent urination, fatigue, and unexplained weight loss. Upon evaluation, he was diagnosed with diabetes, confirmed by elevated blood sugar levels. Mr. Johnson's weight is 210 lbs. He has been prescribed Metformin to be taken twice daily with meals. It was noted during the consultation that the patient is a current smoker. ",
        "golden_answer": {
            "age": 60,
            "gender": "male",
            "diagnosis": "diabetes",
            "weight": 210,
            "smoking": "yes",
        },
    },
    "Smith": {
        "medical_notes": "Mr. Smith, a 55-year-old male patient, presented with severe joint pain and stiffness in his knees and hands, along with swelling and limited range of motion. After a thorough examination and diagnostic tests, he was diagnosed with arthritis. It is important for Mr. Smith to maintain a healthy weight (currently at 150 lbs) and quit smoking, as these factors can exacerbate symptoms of arthritis and contribute to joint damage.",
        "golden_answer": {
            "age": 55,
            "gender": "male",
            "diagnosis": "arthritis",
            "weight": 150,
            "smoking": "yes",
        },
    },
}
```

#### How to evaluate?

- Step 1: Define prompt template

We have designed a prompt that incorporates the medical notes as context. Additionally, we expect the model to provide output in a JSON format following a predefined JSON schema, ensuring that the model produces the desired output accurately. It is worth noting that when calling our models, we specified the response format as `{"type": "json_object"}` to ensure consistent JSON output.


```py
import os
from mistralai import Mistral

def run_mistral(user_message, model="mistral-large-latest"):
    client = Mistral(api_key=os.getenv("MISTRAL_API_KEY"))
    messages = [{"role": "user", "content": user_message}]
    chat_response = client.chat.complete(
        model=model,
        messages=messages,
        response_format={"type": "json_object"},
    )
    return chat_response.choices[0].message.content


# define prompt template
prompt_template = """
Extract information from the following medical notes:
{medical_notes}

Return json format with the following JSON schema: 

{{
        "age": {{
            "type": "integer"
        }},
        "gender": {{
            "type": "string",
            "enum": ["male", "female", "other"]
        }},
        "diagnosis": {{
            "type": "string",
            "enum": ["migraine", "diabetes", "arthritis", "acne", "common cold"]
        }},
        "weight": {{
            "type": "integer"
        }},
        "smoking": {{
            "type": "string",
            "enum": ["yes", "no"]
        }},
        
}}
"""
```

- Step 2: Define how we compare the model response with the golden answer

In step 2, we wrote a function to compare two json objects, with one being the model response and one being the golden answer. In this example, we calculate the percentage of matching values across the JSON keys to assess the accuracy of the JSON output. 

```py
import json

def compare_json_objects(obj1, obj2):
    total_fields = 0
    identical_fields = 0
    common_keys = set(obj1.keys()) & set(obj2.keys())
    for key in common_keys:
        identical_fields += obj1[key] == obj2[key]
    percentage_identical = (identical_fields / max(len(obj1.keys()), 1)) * 100
    return percentage_identical
```

- Step 3: Calculate accuracy rate across test cases 
Now, we're able to go through each test case individually. For each case, we can create a user message based on the prompt template we've already defined. We then retrieve responses from the LLM and compare them to the correct answers. After calculating the accuracy rate for each test case, we can calcate the overall average accuracy rate across all cases.

```py
accuracy_rates = []

# for each test case
for name in prompts:

    # define user message
    user_message = prompt_template.format(medical_notes=prompts[name]["medical_notes"])

    # run LLM
    response = json.loads(run_mistral(user_message))

    # calculate accuracy rate for this test case
    accuracy_rates.append(
        compare_json_objects(response, prompts[name]["golden_answer"])
    )

# calculate accuracy rate across test cases
sum(accuracy_rates) / len(accuracy_rates)
```

</details>

<details>
<summary><b> Example 2: evaluate code generation</b></summary>

### Example 2: evaluate code generation

#### Evaluation data
Our second example involves generating Python code and assessing the generated code. To conduct the evaluation, both the Python instructions and the corresponding unit tests are required for the evaluation data. Here are two examples of such evaluation data sets:

```py
python_prompts = {
    "sort_string": {
        "prompt": "Write a python function to sort the given string.", 
        "test": "assert sort_string(\"data\") == \"aadt\""
    },
    "is_odd": {
        "prompt": "Write a python function to check whether the given number is odd or not using bitwise operator.", 
        "test": "assert is_odd(5) == True"
    }
}
```

#### How to evaluate? 

- Step 1: Define prompt template

We have designed a prompt that generates Python code snippets based on descriptions of specific tasks.

```py
def run_mistral(user_message, model="mistral-large-latest"):
    client = Mistral(api_key=os.getenv("MISTRAL_API_KEY"))
    messages = [{"role":"user", "content": user_message}]
    chat_response = client.chat.complete(
        model=model,
        messages=messages,
        response_format={"type": "json_object"},
    )
    return chat_response.choices[0].message.content


# define prompt template
prompt_template = """Write a Python function to execute the following task: {task} 
Return only valid Python code. Do not give any explanation.
Never start with ```python.
Always start with def {name}(. 
"""
```

- Step 2: Decide how we evaluate the code generation

Next, we can use `code_eval.compute` to evaluate whether the generated code passes the pre-defined unit tests. `predictions` is a list of generated code outputs from the LLM and `references` is a list of unit tests for each prediction. 

:::warning[ ]
 This code is designed to run code that’s been generated by a model, which may not be entirely reliable. While it's unlikely that the model-generated code will intentionally cause harm, it's strongly recommended to run this evaluation suite in a sandbox environment, isolating it from your main system and network.
:::


```py
from evaluate import load

os.environ["HF_ALLOW_CODE_EVAL"] = "1"
code_eval = load("code_eval")

# example using code_eval:
pass_at_1, results = code_eval.compute(
    references=['assert is_odd(5) == True'], 
    predictions=[['def is_odd(n):\n    return n & 1 != 0']], 
    k=[1])

# example output: 
# ({'pass@1': 1.0},
#  defaultdict(list,
#              {0: [(0,
#                 {'task_id': 0,
#                  'passed': True,
#                  'result': 'passed',
#                  'completion_id': 0})]}))
```

- Step 3: Calculate accuracy rate across test cases 

Now, we can go through all test cases, create a user message based on the prompt template, use the LLM to produce Python code, and evaluate the generated code for each test case. 

```py
refs = []
preds = []

for name in python_prompts:

    # define user message
    user_message = prompt_template.format(
        task=python_prompts[name]["prompt"], name=name
    )

    # run LLM
    response = run_mistral(user_message)

    refs.append(python_prompts[name]["test"])
    preds.append([response])

# evaluate code generation
pass_at_1, results = code_eval.compute(references=refs, predictions=preds)

pass_at_1

# example output
# {'pass@1': 1.0}
```

</details>

## LLM-based Evaluation
Using a Large Language Model (LLM) to evaluate or judge the output of another LLM is a common practice in situations especially when labeled data and golden answers are not available or insufficient. The [MT Bench paper](https://arxiv.org/pdf/2306.05685) explored the effectiveness of LLM-as-a-judge and revealed that strong LLMs can perform similarly to humans. LLMs can process and evaluate large amounts of data in a relatively short time, making it highly scalable and efficient compared to human evaluation, which often requires substantial time and resources. 

There are several approaches to using LLMs as judges, including single-point grading, reference-based grading, and pairwise grading.
- **Single-point grading**: LLM assigns a single score to a generated output based on its quality or accuracy. This score is typically given according to specific grading instructions. Single-point grading is a straightforward and efficient approach, but it may not always capture the nuances of various complex outputs.
- **Reference-based grading**: LLM compares a generated output to one or more reference outputs and assigns a score based on their similarity. This approach is often used in machine translation tasks, where there may be multiple valid translations for a given input. However, reference-based grading requires the availability of a golden answer, which may not always be available.
- **Pairwise grading**: LLM compares two generated outputs and assigns a score based on their relative quality or accuracy. This approach is often used in tasks such as dialogue generation, where there may be multiple valid responses to a given query. By comparing pairs of responses, the LLM can determine which one is more relevant or coherent, and assign a score accordingly.

It is also essential to recognize the potential limitations and challenges. For example, LLMs may exhibit inherent biases. LLMs developed by one company tends to favor answers that models of the same company generate. It is difficult to ensure a fair and accurate evaluation. In our experience, Mistral Large exhibits relatively little favoritism.

<details>
<summary><b> Example 3: evaluate summary generation with LLM</b></summary>

### Example 3: evaluate summary generation with LLM

#### Evaluation data
In this example, we generate news summaries and use LLM single-point grading to evaluate the quality of the summary. To carry out the evaluation, let's use a sample news article that we plan to summarize. 

```py
news = (
    "BRUSSELS (Reuters) - Theresa May looked despondent , with deep rings under her eyes, EU chief executive Jean-Claude Juncker told aides after dining with the British prime minister last week, a German newspaper said on Sunday. The report by a Frankfurter Allgemeine Zeitung correspondent whose leaked account of a Juncker-May dinner in April caused upset in London, said Juncker thought her marked by battles over Brexit with her own Conservative ministers as she asked for EU help to create more room for maneuver at home. No immediate comment was available from Juncker s office, which has a policy of not commenting on reports of meetings. The FAZ said May, who flew in for a hastily announced dinner in Brussels with the European Commission president last Monday ahead of an EU summit, seemed to Juncker anxious, despondent and disheartened , a woman who trusts hardly anyone but is also not ready for a clear-out to free herself . As she later did over dinner on Thursday with fellow EU leaders, May asked for help to overcome British divisions. She indicated that back home friend and foe are at her back plotting to bring her down, the paper said. May said she had no room left to maneuver. The Europeans have to create it for her. May s face and appearance spoke volumes, Juncker later told his colleagues, the FAZ added. She has deep rings under her eyes. She looks like someone who can t sleep a wink. She smiles for the cameras, it went on, but it looks forced , unlike in the past, when she could shake with laughter. Now she needs all her strength not to lose her poise. As with the April dinner at 10 Downing Street, when the FAZ reported that Juncker thought May in another galaxy in terms of Brexit expectations, both sides issued statements after last week s meeting saying talks were constructive and friendly . They said they agreed negotiations should be accelerated . May dismissed the dinner leak six months ago as Brussels gossip , though officials on both sides said the report in the FAZ did little to foster an atmosphere of trust which they agree will be important to reach a deal. German Chancellor Angela Merkel was also reported to have been irritated by that leak. Although the summit on Thursday and Friday rejected May s call for an immediate start to talks on the future relationship, leaders made a gesture to speed up the process and voiced hopes of opening a new phase in December. Some said they understood May s difficulties in forging consensus in London.",
)
```

#### How to evaluate? 
- Step 1: Generate summary for the given news

First, let's use a smaller model, `open-mistral-7b', to generate a summary for the provided news article. If you have additional news articles to summarize, please generate a summary for each one. For the sake of simplicity in this example, we will only demonstrate one news sample.

```py
import os
from mistralai import Mistral

def run_mistral(user_message, model="open-mistral-7b", is_json=False):
    client = Mistral(api_key=os.getenv("MISTRAL_API_KEY"))
    messages = [{"role":"user", "content":user_message}]

    if is_json:
        chat_response = client.chat.complete(
            model=model, messages=messages, response_format={"type": "json_object"}
        )
    else:
        chat_response = client.chat.complete(model=model, messages=messages)

    return chat_response.choices[0].message.content

summary_prompt = f"""
Summarize the following news. Write the summary based on the following criteria: relevancy and readability. Consider the sources cited, the quality of evidence provided, and any potential biases or misinformation. 

## News: 
{news}
"""

summary = run_mistral(summary_prompt)
```

- Step 2: Define evaluation metrics and rubrics

To accurately evaluate the quality of the generated summaries, we need to establish clear and well-defined evaluation metrics and rubrics. These guidelines play a pivotal role in directing the LLM in its evaluation process. Feel free to incorporate various metrics and create rubrics tailored to your specific needs.

```py
eval_rubrics = [
    {
        "metric": "relevancy", 
        "rubrics": """
        Score 1: The summary is not relevant to the original text. 
        Score 2: The summary is somewhat relevant to the original text, but has significant flaws.
        Score 3: The summary is mostly relevant to the original text, and effectively conveys its main ideas and arguments.
        Score 4: The summary is highly relevant to the original text, and provides additional value or insight.
        """
    },
    {
        "metric": "readability", 
        "rubrics": """
        Score 1: The summary is difficult to read and understand.
        Score 2: The summary is somewhat readable, but has significant flaws.
        Score 3: The summary is mostly readable and easy to understand.
        Score 4: The summary is highly readable and engaging.
        """
    },
    
]
```

- Step 3: Employ a more powerful LLM (e.g., Mistral Large) as a judge

It's beneficial to use a more powerful LLM such as Mistral Large as a judge to ensure a more accurate and comprehensive evaluation of the generated summaries. In the prompt, we provide the specific evaluation metrics, associated rubrics, the original news article, and the generated summary. This information enables the LLM to evaluate the summary based on the predefined criteria systematically. In this example, we assess each metric separately to gain a better understanding of the summarization model's performance in different aspects. However, you can also choose to combine all metrics for a more general evaluation.

```py
scoring_prompt = """
Please read the provided news article and its corresponding summary. Based on the specified evaluation metric and rubrics, assign an integer score between 1 and 4 to the summary. Then, return a JSON object with the metric as the key and the evaluation score as the value.

# Evaluation metric:
{metric}

# Evaluation rubrics:
{rubrics}

# News article
{news}

# Summary
{summary}

"""
for i in eval_rubrics:
    eval_output = run_mistral(
        scoring_prompt.format(
            news=news, summary=summary, metric=i["metric"], rubrics=i["rubrics"]
        ),
        model="mistral-large-latest",
        is_json=True,
    )
    print(eval_output)

# example output:
# {"relevancy": 2}
# {"readability": 3}
```
</details>

## Human-based Evaluation
Human-based evaluation is likely to provide the most accurate and reliable evaluation results. However, it's difficult and costly to scale. Despite these challenges, integrating human evaluation into the development of better training data and the fine-tuning process can still be highly beneficial due to its effectiveness.

One common approach of human-evaluation is through crowdsourcing. For example, the well-known [LMSYS leaderboard](https://chat.lmsys.org/) utilizes crowdsourcing to ask questions of two anonymous models and gather votes to determine the better one. LMSYS has collected over 300,000 human votes to create an Elo-based LLM leaderboard. Many companies also employ human evaluation for their own benchmarks, often utilizing crowdsourcing platforms to facilitate the process.

When implementing crowdsourcing for human evaluation, you can opt for a simple approach by asking voters to select the better model. Alternatively, if your use case has more complex requirements, you can provide specific criteria for voters to consider, targeting areas such as empathy, fluency, and other relevant factors. 
