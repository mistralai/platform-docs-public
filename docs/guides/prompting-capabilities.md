---
id: prompting_capabilities
title: Prompting capabilities
sidebar_position: 1.1
---

# Prompting Capabilities

When you first start using Mistral models, your first interaction will revolve around prompts. The art of crafting effective prompts is essential for generating desirable responses from Mistral models or other LLMs. This guide will walk you through example prompts showing four different prompting capabilities:

- Classification
- Summarization
- Personalization
- Evaluation

<a target="_blank" href="https://colab.research.google.com/github/mistralai/cookbook/blob/main/mistral/prompting/prompting_capabilities.ipynb">
  <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/>
</a>

## Classification

Mistral models can easily **categorize text** into distinct classes. Take a customer support bot for a bank as an illustration: we can establish a series of predetermined categories within the prompt and then instruct Mistral AI models to categorize the customer's question accordingly.

In the following example, when presented with the customer inquiry, Mistral AI models correctly categorizes it as "country support":

<table class="prompt-example">
    <tr>
        <td>User</td>
        <td>I am inquiring about the availability of your cards in the EU, as I am a resident of France and am interested in using your cards. </td>
    </tr>
    <tr>
        <td>Assistant</td>
        <td>country support</td>
    </tr>
</table>


<details>
<summary><b>Prompt</b></summary>

```
You are a bank customer service bot. Your task is to assess customer intent and categorize customer inquiry after <<<>>> into one of the following predefined categories:

card arrival
change pin
exchange rate
country support
cancel transfer
charge dispute

If the text doesn't fit into any of the above categories, classify it as:
customer service

You will only respond with the category. Do not include the word "Category". Do not provide explanations or notes.

####
Here are some examples:

Inquiry: How do I know if I will get my card, or if it is lost? I am concerned about the delivery process and would like to ensure that I will receive my card as expected. Could you please provide information about the tracking process for my card, or confirm if there are any indicators to identify if the card has been lost during delivery?
Category: card arrival
Inquiry: I am planning an international trip to Paris and would like to inquire about the current exchange rates for Euros as well as any associated fees for foreign transactions.
Category: exchange rate
Inquiry: What countries are getting support? I will be traveling and living abroad for an extended period of time, specifically in France and Germany, and would appreciate any information regarding compatibility and functionality in these regions.
Category: country support
Inquiry: Can I get help starting my computer? I am having difficulty starting my computer,and would appreciate your expertise in helping me troubleshoot the issue.
Category: customer service
###

<<<
Inquiry: {insert inquiry text here}
>>>
```

</details>


#### Strategies we used:

- **Few shot learning**: Few-shot learning or in-context learning is when we give a few examples in the prompts, and the LLM can generate corresponding output based on the example demonstrations. Few-shot learning can often improve model performance especially when the task is difficult or when we want the model to respond in a specific manner.
- **Delimiter**: Delimiters like `###`, `<<< >>>` specify the boundary between different sections of the text. In our example, we used `###` to indicate examples and `<<<>>>` to indicate customer inquiry.
- **Role playing**: Providing LLM a role (e.g., "You are a bank customer service bot.") adds personal context to the model and often leads to better performance.

## Summarization
Summarization is a common task for LLMs due to their natural language understanding and generation capabilities. Here is an example prompt we can use to generate interesting questions about an essay and summarize the essay.

<details>
<summary><b>Prompt</b></summary>

```
You are a commentator. Your task is to write a report on an essay.
When presented with the essay, come up with interesting questions to ask, and answer each question.
Afterward, combine all the information and write a report in the markdown format.

# Essay:
{essay}

# Instructions:
## Summarize:
In clear and concise language, summarize the key points and themes presented in the essay.

## Interesting Questions:
Generate three distinct and thought-provoking questions that can be asked about the content of the essay. For each question:
- After "Q: ", describe the problem
- After "A: ", provide a detailed explanation of the problem addressed in the question.
- Enclose the ultimate answer in <>.

## Write a report
Using the essay summary and the answers to the interesting questions, create a comprehensive report in Markdown format.
```

</details>

#### Strategies we used:

- **Step-by-step instructions**: This strategy is inspired by the chain-of-thought prompting that enables LLMs to use a series of intermediate reasoning steps to tackle complex tasks. It's often easier to solve complex problems when we decompose them into simpler and small steps and it's easier for us to debug and inspect the model behavior. In our example, we break down the task into three steps: summarize, generate interesting questions, and write a report. This helps the language to think in each step and generate a more comprehensive final report.
- **Example generation**: We can ask LLMs to automatically guide the reasoning and understanding process by generating examples with the explanations and steps. In this example, we ask the LLM to generate three questions and provide detailed explanations for each question.
- **Output formatting**: We can ask LLMs to output in a certain format by directly asking "write a report in the Markdown format".

## Personalization
LLMs excel at personalization tasks as they can deliver content that aligns closely with individual users. In this example, we create personalized email responses to address customer questions.


<table class="prompt-example">
    <tr>
        <td>User</td>
        <td>Dear mortgage lender, <br/><br/>
        What's your 30-year fixed-rate APR, how is it compared to the 15-year fixed rate? <br/><br/>
        Regards, <br/>
        Anna</td>
    </tr>
    <tr>
        <td>Assistant</td>
        <td>
        Dear Anna, <br/><br/>
        Thank you for your inquiry regarding our fixed-rate mortgage options.
        Our current 30-year fixed-rate interest rate is 6.403% with an Annual Percentage Rate (APR) of 6.484%. In comparison, our 15-year fixed-rate interest rate is 5.705% with an APR of 5.848%.<br/><br/>
        As you can see, the 15-year fixed-rate option has a lower interest rate and APR compared to the 30-year fixed-rate option. This means that you would pay less in interest over the life of the loan if you choose the 15-year option. However, the monthly payments would be higher due to the shorter loan term.<br/><br/>
        Please let us know if you have any other questions or if we can assist you further in choosing the best mortgage option for your needs.<br/><br/>
        Best regards,<br/>
        Lender Customer Support
        </td>
    </tr>
</table>



<details>
<summary><b>Prompt</b></summary>

```
You are a mortgage lender customer service bot, and your task is to create personalized email responses to address customer questions. Answer the customer's inquiry using the provided facts below. Ensure that your response is clear, concise, and directly addresses the customer's question. Address the customer in a friendly and professional manner. Sign the email with "Lender Customer Support."

# Facts
30-year fixed-rate: interest rate 6.403%, APR 6.484%
20-year fixed-rate: interest rate 6.329%, APR 6.429%
15-year fixed-rate: interest rate 5.705%, APR 5.848%
10-year fixed-rate: interest rate 5.500%, APR 5.720%
7-year ARM: interest rate 7.011%, APR 7.660%
5-year ARM: interest rate 6.880%, APR 7.754%
3-year ARM: interest rate 6.125%, APR 7.204%
30-year fixed-rate FHA: interest rate 5.527%, APR 6.316%
30-year fixed-rate VA: interest rate 5.684%, APR 6.062%

# Email
{insert customer email here}
```
</details>



#### Strategies we used:
- **Providing facts**: Incorporating facts into prompts can be useful for developing customer support bots. It's important to use clear and concise language when presenting these facts. This can help the LLM to provide accurate and quick responses to customer queries.

## Evaluation
There are many ways to evaluate LLM outputs. Here are three approaches for your reference: include a confidence score, introduce an evaluation step, or employ another LLM for evaluation.

### Include a confidence score
We can include a confidence score along with the generated output.

<table class="prompt-example">
    <tr>
        <td>Assistant</td>
        <td>

```
{
  "Summaries": [
    {
      "Summary": "The author discusses their early experiences with programming and writing, starting with writing short stories and programming on an IBM 1401 in 9th grade. They then moved on to working with microcomputers, building their own from a Heathkit, and eventually convincing their father to buy a TRS-80 in 1980. They wrote simple games, a program to predict rocket flight trajectories, and a word processor.",
      "Confidence": 0.9
    },
    {
      "Summary": "The author began college as a philosophy major, but found it to be unfulfilling and switched to AI. They were inspired by a novel and a PBS documentary, as well as the potential for AI to create intelligent machines like those in the novel. Despite this excitement, they eventually realized that the traditional approach to AI was flawed and shifted their focus to Lisp.",
      "Confidence": 0.85
    },
    {
      "Summary": "The author briefly worked at Interleaf, where they found that their Lisp skills were highly valued. They eventually left Interleaf to return to RISD, but continued to work as a freelance Lisp hacker. While at RISD, they started painting still lives in their bedroom at night, which led to them applying to art schools and eventually attending the Accademia di Belli Arti in Florence.",
      "Confidence": 0.9
    }
  ]
}
```

</td>
    </tr>
</table>


<details>
<summary><b>Prompt</b></summary>

```
You are a summarization system that can provide summaries with associated confidence scores.
In clear and concise language, provide three short summaries of the following essay, along with their confidence scores.
You will only respond with a JSON object with the key Summary and Confidence. Do not provide explanations.

# Essay:
{insert essay text here}
```

</details>

#### Strategies we used:
- **JSON output**: For facilitating downstream tasks, JSON format output is frequently preferred. We can enable the JSON mode by setting the response_format to `{"type": "json_object"}` and specify in the prompt that "You will only respond with a JSON object with the key Summary and Confidence." Specifying these keys within the JSON object is beneficial for clarity and consistency.
- **Higher Temperature**: In this example, we increase the temperature score to encourage the model to be more creative and output three generated summaries that are different from each other.

### Introduce an evaluation step
We can also add a second step in the prompt for evaluation. We ask the LLM to generate three summaries and evaluate these three summaries. 

<table class="prompt-example">
    <tr>
        <td>Assistant</td>
        <td>

```
Summary 1: The essay discusses the author's experiences with writing and programming before college, his initial struggles with learning Fortran on an IBM 1401, and the shift towards microcomputers that led to his interest in AI. He also touches on his decision to pursue a degree in AI and the disillusionment he felt when he realized that AI as practiced at the time was a hoax.

Summary 2: The author tells the story of his journey into programming, starting with writing short stories before discovering the world of computers. He describes his early experiences with an IBM 1401 and how it was like a mini Bond villain's lair. He also talks about his fascination with microcomputers and how it led him to learn Lisp and become interested in AI. However, he eventually became disillusioned with AI and decided to focus on Lisp instead.

Summary 3: The essay recounts the author's experiences with writing and programming before college, including his early attempts at writing short stories and his struggles with learning to program on an IBM 1401. He discusses how the arrival of microcomputers changed everything and sparked his interest in AI. However, he eventually realized that AI, as practiced at the time, was a hoax, and he turned his attention to Lisp. He also touches on his decision to pursue a degree in AI despite his disillusionment with the field.

Evaluation: I believe that Summary 1 is the best summary because it provides a clear and concise overview of the author's experiences with writing and programming before college, the shift towards microcomputers, and his eventual disillusionment with AI. It covers the key points of the essay without getting bogged down in unnecessary details. Summary 2 is also good, but it focuses more on the author's early experiences with computers and less on his later experiences with AI. Summary 3 is the weakest summary because it does not capture the full scope of the author's experiences and does not mention his decision to pursue a degree in AI despite his disillusionment with the field.
```

</td>
    </tr>
</table>

<details>
<summary><b>Prompt</b></summary>

```
You are given an essay text and need to provide summaries and evaluate them.

# Essay:
{insert essay text here}

Step 1: In this step, provide three short summaries of the given essay. Each summary should be clear, concise, and capture the key points of the speech. Aim for around 2-3 sentences for each summary.
Step 2: Evaluate the three summaries from Step 1 and rate which one you believe is the best. Explain your choice by pointing out specific reasons such as clarity, completeness, and relevance to the speech content.
```
</details>



### Employ another LLM for evaluation
In production systems, it is common to employ another LLM for evaluation so that the evaluation step can be separate from the generation summaries.

- **Step 1**: use the first LLM to generate three summaries

<table class="prompt-example">
    <tr>
        <td>Assistant</td>
        <td>

```
Summary 1: The author writes about their experiences with programming and writing before college. They started programming using Fortran on an IBM 1401 and wrote short stories. They later got into AI, but became disillusioned with it while in graduate school. The author then turned their focus to Lisp, eventually writing a book about it called "On Lisp". They also tried pursuing art, but found it difficult to make a living from it.

Summary 2: The author describes their experiences with programming in college and later in the workforce. They learned Lisp while in college, which expanded their concept of what a program could do. After graduation, the author worked at Interleaf, a company that made document creation software. They also did some consulting and writing on the side, eventually writing a book called "On Lisp". The author enjoyed working at Interleaf, but found that the Lisp they used was just a thin layer on top of a larger C cake.

Summary 3: The author tells the story of their early experiences with programming and writing. They started writing short stories before college, but they were not very good. The first programs they wrote were on an IBM 1401 using Fortran. In college, they got into AI, but found it disappointing. The author then turned their focus to Lisp, which they found to be more interesting. They also tried pursuing art, but found it difficult to make a living from it. The author eventually wrote a book called "On Lisp" and worked at Interleaf, a company that made document creation software. They enjoyed their time at Interleaf, but found that the Lisp they used was just a thin layer on top of a larger C cake.
```

</td>
    </tr>
</table>

<details>
<summary><b>Prompt</b></summary>

```
Provide three short summaries of the given essay. Each summary should be clear, concise, and capture the key points of the essay.
Aim for around 2-3 sentences for each summary.

# essay:
{insert essay text here}
```
</details>



- **Step 2**: use another LLM to rate the generated summaries


<table class="prompt-example">
    <tr>
        <td>Assistant</td>
        <td>

```
Summary 3 provides the most complete and accurate summary of the essay. It covers the author's experiences with writing and programming before college, their disappointment with AI in college, and their eventual focus on Lisp and work at Interleaf. Summary 1 is missing some key details, such as the author's work at Interleaf and their writing of "On Lisp". Summary 2 focuses too much on the author's time at Interleaf and neglects their early experiences with writing and programming before college. Overall, Summary 3 is the best choice as it is the most complete and accurate summary of the essay.
```

</td>
    </tr>
</table>

<details>
<summary><b>Prompt</b></summary>

```
You are given an essay and three summaries of the essay. Evaluate the three summaries and rate which one you believe is the best.
Explain your choice by pointing out specific reasons such as clarity, completeness, and relevance to the essay content.

# Essay:
{insert essay text here}

# Summaries
{insert the previous output}
```

</details>

#### Strategies we used:
- **LLM chaining**: In this example, we chain two LLMs in a sequence, where the output from the first LLM serves as the input for the second LLM. The method of chaining LLMs can be adapted to suit your specific use cases. For instance, you might choose to employ three LLMs in a chain, where the output of two LLMs is funneled into the third LLM. While LLM chaining offers flexibility, it's important to consider that it may result in additional API calls and potentially increased costs.





