---
id: customization
title: Model customization
sidebar_position: 1.6
---

### Otherwise known as "How to Build an Application with a Custom Model"

## Overview
The following is a quick guide on how to build an application with a custom model. Our goal is to help developers build product operations for LLMs to go from a prototype to deployment.

AI is a tool, building applications that harness AI make them more useful and practical to your end users.

Before LLMs, AI applications were built around personalization, precision, and prediction. Traditional AI applications are catered towards predicting your next choice and recommending it to you based on your previous behavior and “customers like you”.

In contrast, LLM applications are built around Human-AI collaboration. As a developer and the end user, you have more agency in the customisation of your product. You can create something that did not exist before. 

Applications built with custom LLMs require an iterative development cycle, relying on continuous end user feedback and rigorous evals to ensure that your custom model behavior is aligned to the intended application behavior.

## Key terms
Before we get started, let’s define key terms:

**Application behavior** can be defined as the user interaction. It takes into account usability, performance, safety, and adaptability. Application behavior includes Objectives and Values.

**Model behavior** can be defined as the expected, appropriate, and acceptable way of an LLM acting in a specific context or application boundaries. Model behavior includes Objectives and Values.

**Objectives** determine whether the model behavior is in line with the expected application behavior. 

**Values** denotes the developers’ intended policy for the model and application. This can be a set of rules, a Constitution, or even a fictional character’s morals.

## Steerability: three methods
There are several techniques (with varying levels of engineering complexity) available to steer model behavior within your application context. We recommend leveraging the three methods below to do so:
1. **System prompt**
2. **Tune a model**
3. **Deploy a moderation layer** for input/output processing

A **System Prompt** is a method to provide context, instructions, and guidelines to your model before the model is tasked with user input data ([prompt guide](/guides/prompting_capabilities/)). By using a system prompt, you can steer the model to better align to your intended product behavior - whether the application is a conversation or task, you can specify a persona, personality, tone, values, or any other relevant information that may help your model better perform in response to the end user’s input.

System prompts can include:
- Clear and specific instructions and objectives
- Roles, desired persona and tone
- Guidance on style e.g. verbosity constraints
- Value definitions e.g. policies, rules and safeguards
- Desired output format

**Tuning a model** is a method to train the model on your intended application behavior ([fine-tuning guide](/guides/finetuning/)). Two popular approaches for tuning LLMs:
1. **Application tuning**, where you leverage a dataset of examples specified to the desired behavior of your application.
2. **Safety tuning**, where you leverage a dataset that specifies both example inputs that might result in unsafe behavior, along with the desired safe output in that situation.

**Deploying a classifier for content moderation** is a third method to create guardrails for your model’s behavior within the application. This is considered an extra security measure in case you are deploying your application to end users.

## Guide for tuning a model to your intended application behavior
### Step 1: Define your intended Application Behavior
The first step is to define the Objectives, i.e. how you want users to interact with your LLM product. 

For inspiration, look to developers building with Mistral models: 
- standalone products like conversational assistants; 
- within pre-existing products to complete a specific task like “Summarize” or “Translate” or enable new capabilities like function calling with API access for “Knowledge retrieval”.

Learn how others are building products with custom models here: [developer examples](/getting-started/stories/).
### Step 2: Define your policies based on your Values
When you deploy an LLM within an end-user facing application, you identify which Values the model will need to abide by in order to meet your Content Moderation guidelines along with your user expectations.

For Content Moderation, look for inspiration from [Llama Guard](https://ai.meta.com/research/publications/llama-guard-llm-based-input-output-safeguard-for-human-ai-conversations/)’s categories like Privacy, Hate, and Specialized Advice and [ML Commons Taxonomy](https://drive.google.com/file/d/1V8KFfk8awaAXc83nZZzDV2bHgPT8jbJY/view) categories like CSAM and Hate.

### Step 3: Create your Application Evals
The goal of your evals is to enable you to have better signal on whether your custom model’s behavior will meet your Application behavior before deployment. Identifying how you want to evaluate your custom model will help determine the type of training data to include in the fine-tuning.

There are two methods to evaluate an LLM:
- **Automated Evals**
    - **Metrics-based**, similar to the public benchmark evaluations where you can derive a metric from pre-annotated data for example.
    - **LLM-based**, where you leverage a different LLM like Mistral Large to evaluate or judge the output of your custom model.
- **Human-based Evals**, where you employ Content Annotators to evaluate or judge the output of your custom model and collect Human annotations.

For more on how to conduct an LLM Evaluation, check out our [evaluation guide](/guides/evaluation).

### Step 4: Test your application behavior hypothesis with an MVP powered by Mistral Large
Once you understand the intent of your custom LLM and the contours of how you want the model to behave, begin by testing your application hypothesis with Mistral Large and collect the interaction data to better understand how your end users may interact with your LLM. For example, many developers begin their process by creating a Demo or MVP with limited access (a Private Beta).

For some applications, a system prompt is the best solution for an aligned model behavior. If you need help deciding between the two, look to our [fine-tuning guide](/capabilities/finetuning/finetuning_overview/). 

If a system prompt works creating a Custom Model, skip to Step 6.

### Step 5: Tune for model alignment
Now that you have sense of the Application Behavior - Values and Objectives included - you are intending to adopt a custom model, you can begin the process of replacing Mistral Large for a smaller, custom model.

Look to our guide on how to [prepare your Tuning dataset](/guides/finetuning/#prepare-the-dataset).

Areas to consider when preparing your Tuning Dataset for better model performance:
- **Data Comprehension**, include all content policies for each application use case in your dataset (such as question-answering, summarization, and reasoning).
- **Data Variety**, ensure dataset diversity across query length, structure, tone, topic, levels of complexity, and demographic considerations.
- **Deduplication**, remove duplicates to prevent your tuning data being memorized.
- **Avoid Data Contamination**, isolate evaluation data from the tuning dataset.
- **Ethical Data Practices**, provide clear labeling guidelines and Annotator diversity to minimize model errors and bias.

For content moderation, get started with open source datasets like [Safety-Tuned LlaMAs](https://arxiv.org/abs/2309.07875).

At Mistral, we support two ways to customize our models:
1. OSS with the [FT Codebase](https://github.com/mistralai/mistral-finetune/)
2. Via [la Plateforme](https://console.mistral.ai/)

Head to our FT API within la Plateforme, upload and validate your training data. Run the job, and when completed, you can access your custom model via your own model API endpoint.

### Step 6: Test your custom model with your Evals
Now that you have your custom model API endpoint, you can run Application Evals from Step 4. Depending on your Application, remember to include Safety Evals in your Eval set:
- **Development Evaluations**, include ongoing assessments during training and fine-tuning to compare model performance against launch criteria and evaluate the impact of mitigation strategies. These evaluations use adversarial queries or external academic benchmarks.
- **Assurance Evaluations**, set up governance and review assessments at key milestones by an external group. These standardized evaluations use strictly managed datasets and provide high-level insights for mitigation efforts. They test safety policies and dangerous capabilities, such as biohazards, persuasion, and cybersecurity.
- **Red Teaming** requires adversarial testing by specialist teams using less structured methods to discover potential weaknesses and improve risk mitigation and evaluation approaches.
- **External Evaluations**, includes assessments by independent, external domain experts to identify model limitations and stress-test performance.

Based on the model performance, either retrain your model with new training data to support better model performance or deploy into your application by switching the Mistral Large API with your custom model endpoint.

### Step 7: Once deployed, continuously monitor and update your custom model, evals, and testing based on real life application data

Congrats! You’ve deployed your custom model into your application.
