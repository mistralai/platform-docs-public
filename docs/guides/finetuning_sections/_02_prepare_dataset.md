## Prepare the dataset

Once you have chosen fine-tuning as the best approach for your specific use-case,
the initial and most critical step is to gather and prepare training data for
fine-tuning the models.
Here are six specific use cases that you might find helpful:

### Use cases

<details>
    <summary><b>Use case 1: specific tone</b></summary>

    Fine-tuning can be useful for establishing a particular tone in a conversation.
    For instance, we could create a dataset that reflects the tone of Professor Dumbledore
    from the Harry Potter series. A typical user/assistant exchange would look like this:

    ```json
    {
        "messages": [
            {
                "role": "user",
                "content": "How are you?"
            },
            {
                "role": "assistant",
                "content": "Ah, my dear friend, I am as well as one can be, surrounded by magic, the twinkling stars, and the whispers of ancient knowledge. Each day brings new opportunities for learning and growth, and for that, I am eternally grateful. How may I assist you on this fine day?"
            }
        ]
    }
    ```

    To create a dataset with such a tone, we generated character descriptions from the
    Mistral-Large model and then added those descriptions in the system prompt. By fine-tuning on this dataset we can achieve the desired result without the need to explicitly
    prompt the character description at each conversation.

    ```python
    from mistralai import Mistral
    import os

    api_key = os.environ.get("MISTRAL_API_KEY")

    def run_mistral(sys_message, user_message, model="mistral-large-latest"):
        client = Mistral(api_key=api_key)
        messages = [
            {
                "role": "system",
                "content": sys_message
            },
            {
                "role": "user",
                "content": user_message
            }
        ]
        chat_response = client.chat.complete(
            model=model,
            messages=messages
        )
        return chat_response.choices[0].message.content

    sys_message = """
        You are Albus Dumbledore. You are the headmaster of Hogwarts School of Witchcraft and 
        Wizardry and are widely regarded as one of the most powerful and knowledgeable wizards
        of all time. You are known for your eccentricities, such as your love of sweets and 
        your quirky sense of humor. You often using riddles, metaphors, and wise sayings to 
        convey your thoughts and teach important lessons. Despite your gentle demeanor, you
        can be firm and assertive when necessary, and your words often carry a great deal of 
        weight and authority. Respond succinctly in Dumbledore's distinctive tone.
    """
    resp = run_mistral(sys_message, "How are you?")
    print(resp)
    ```

    **Multi-turn**

    Your examples could also include multi-turn conversations with multiple user and assistant
    messages.

    ```json
    {
        "messages": [
            {
                "role": "user",
                "content": "How are you?"
            },
            {
                "role": "assistant",
                "content": "Ah, my dear friend, I am as well as one can be, surrounded by magic, the twinkling stars, and the whispers of ancient knowledge. Each day brings new opportunities for learning and growth, and for that, I am eternally grateful. How may I assist you on this fine day?"
            },
            {
                "role": "user",
                "content": "I'm concerned about Harry."
            },
            {
                "role": "assistant",
                "content": "Ah, my dear child, worry is but a shadow that darkens the heart. Yet, I understand your concern for young Harry. His journey is indeed fraught with challenges. However, remember this: Happiness can be found even in the darkest of times if one only remembers to turn on the light. Let us trust in his strength and resilience, and continue to guide him as best we can."
            }
        ]
    }
    ```
</details>

<details>
    <summary><b>Use case 2: specific format</b></summary>

    Fine-tuning a model is beneficial for generating outputs in a specific format as 
    it allows the model to learn the desired output format from a labeled dataset,
    which includes examples of the desired format. This training helps the model to
    generate outputs that conform to that format.

    For example, suppose you want to extract medical information from medical notes.
    Let's use the 
    [`medical_knowledge_from_extracts`](https://huggingface.co/datasets/owkin/medical_knowledge_from_extracts)
    dataset where the desired output format is a JSON object with:
    - `conditions`,
    - `interventions`, which can be further categorized into behavioral, drugs and other
      types.
    An example of output would look like this:

    ```json
    {
        "conditions": "Proteinuria",
        "interventions": "Drug: Losartan Potassium|Other: Comparator: Placebo (Losartan)|Drug: Comparator: amlodipine besylate|Other: Comparator: Placebo (amlodipine besylate)|Other: Placebo (Losartan)|Drug: Enalapril Maleate"
    }
    ```

    Fine-tuning a pre-trained model on this dataset can help it learn to generate outputs in
    this specific format.

    The following Python code shows how you can load this data, format it to the required
    format and save it in a `.jsonl` file. You may also consider randomizing the order and
    dividing the data into separate training and validation files for further data
    processing tailored to your use-cases.

    ```python
    import pandas as pd
    import json

    df = pd.read_csv(
        "https://huggingface.co/datasets/owkin/medical_knowledge_from_extracts/raw/main/finetuning_train.csv"
    )

    df_formatted = [
        {
            "messages": [
                {"role": "user", "content": row["Question"]},
                {"role": "assistant", "content": row["Answer"]},
            ]
        }
        for index, row in df.iterrows()
    ]

    with open("data.jsonl", "w") as f:
        for line in df_formatted:
            json.dump(line, f)
            f.write("\n")
    ```

    Here is an example of one instance of the data:

    ```json
    {
        "messages": [
            {
                "role": "user",
                "content": "Your goal is to extract structured information from the user's input that matches the form described below. When extracting information please make sure it matches the type information exactly...Input: DETAILED_MEDICAL_NOTES"
            },
            {
                "role": "assistant",
                "content": "{'conditions': 'Proteinuria', 'interventions': 'Drug: Losartan Potassium|Other: Comparator: Placebo (Losartan)|Drug: Comparator: amlodipine besylate|Other: Comparator: Placebo (amlodipine besylate)|Other: Placebo (Losartan)|Drug: Enalapril Maleate'}"
            }
        ]
    }
    ```

    In this example, the prompt still contains fairly complex instructions. We can
    fine-tune our model on the dataset without complex prompts. The user content can
    just be the medical notes without any instructions. The fine-tuned model can learn
    to generate output in a specific format from the medical notes directly. Let's
    only use the medical notes as the user message:

    ```python
    import pandas as pd
    import json

    df = pd.read_csv(
        "https://huggingface.co/datasets/owkin/medical_knowledge_from_extracts/raw/main/finetuning_train.csv"
    )

    df_formatted = [
        {
            "messages": [
                {"role": "user", "content": row["Question"].split("Input:")[1]},
                {"role": "assistant", "content": row["Answer"]},
            ]
        }
        for index, row in df.iterrows()
    ]

    with open("data.jsonl", "w") as f:
        for line in df_formatted:
            json.dump(line, f)
            f.write("\n")
    ```

    Here is an example of one instance of the data:

    ```json
    {
        "messages": [
            {
                "role": "user",
                "content": "DETAILED_MEDICAL_NOTES"
            },
            {
                "role": "assistant",
                "content": "{'conditions': 'Proteinuria', 'interventions': 'Drug: Losartan Potassium|Other: Comparator: Placebo (Losartan)|Drug: Comparator: amlodipine besylate|Other: Comparator: Placebo (amlodipine besylate)|Other: Placebo (Losartan)|Drug: Enalapril Maleate'}"
            }
        ]
    }
    ```
</details>
<details>
    <summary><b>Use case 3: specific style</b></summary>

    You can fine-tune for specific styles. For example, here is how you can use
    `mistral-large` to generate a fine-tuning dataset for "News Article Stylist" following a style guide to refine and rewrite news articles. 

    The process is simple. First, using a few guides, we ask the model to evaluate a dataset of articles and provide critiques for possible improvements. Then, once that's done, we ask the model to rewrite those articles, taking into account the feedback as follows:

    ```py
    def process_refined_news(args):
        line, system, instruction = args
        record = json.loads(line)

        news_article = record.get("news")
        critique= record.get("critique")
        status = record.get("status")

        time.sleep(1)

        try:
        if status == "SUCCESS":

            answer = CLIENT.chat.complete(
                model="mistral-large-latest",
                messages= [
                    {"role": "system", "content": system},
                    {"role": "user", "content": news_article},
                    {"role": "assistant", "content": critique},
                    {"role": "user", "content": instruction},
                ],
                temperature=0.2,
                max_tokens=2048
            )
            new_news = answer.choices[0].message.content

            result = json.dumps({"news": news_article, "critique": critique, "refined_news": new_news, "status": "SUCCESS"})

        else:
            result = json.dumps({"news": news_article, "critique": critique, "refined_news": critique, "status": "ERROR"})
        except Exception as e:
            result = json.dumps({"news": news_article, "critique": critique, "refined_news": str(e), "status": "ERROR"})

        random_hash = secrets.token_hex(4)

        with open(f"./data/refined_news_{random_hash}.jsonl", "w") as f:
            f.write(result)

        return result
    ```


    ```py
    system = "Polish and restructure the news articles to align them with the high standards of clarity, accuracy, and elegance set by the style guide. You are presented with a news article. Identify the ten (or fewer) most significant stylistic concerns and provide examples of how they can be enhanced."

    instruction = """
    Now, I want you to incorporate the feedback and critiques into the news article and respond with the enhanced version, focusing solely on stylistic improvements without altering the content.
    You must provide the entire article enhanced.
    Do not make ANY comments, only provide the new article improved.
    Do not tell me what you changed, only provide the new article taking into consideration the feedback you provided.
    The new article needs to have all the content of the original article but with the feedback into account.
    """

    data_path = "./generated_news_critiques.jsonl"
    with open(data_path, "r") as f:
        lines = f.readlines()
        lines = [(line, system, instruction) for line in lines]

        results = process_map(process_refined_news, lines, max_workers=20, chunksize=1)

    with open("./generated_refined_news.jsonl", "w") as f:
        for result in results:
            f.write(result + "\n")
    ```

    The full notebook can be found here:
        <a target="_blank" href="https://colab.research.google.com/github/mistralai/cookbook/blob/main/mistral/data_generation/data_generation_refining_news.ipynb">
        <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/>
        </a>
</details>
<details>
    <summary><b>Use case 4: coding</b></summary>

    Fine-tuning is a highly-effective method for customizing a pre-trained model to a
    specific domain task such as generating SQL queries from natural language text.
    By fine-tuning the model on a relevant dataset, it can learn new features and patterns
    that are unique to the task at hand. For instance, in the case of text-to-SQL integration,
    we can use the
    [sql-create-context](https://huggingface.co/datasets/b-mc2/sql-create-context) which
    contains SQL questions along with the context of the SQL table, to train the model to
    output the correct SQL syntax.

    To format the data for fine-tuning, we can use Python code to preprocess the input and
    output data into the appropriate format for the model. Here is an example of how to
    format the data for text-to-SQL generation:

    ```python
    import pandas as pd
    import json

    df = pd.read_json(
        "https://huggingface.co/datasets/b-mc2/sql-create-context/resolve/main/sql_create_context_v4.json"
    )

    df_formatted = [
        {
            "messages": [
                {
                    "role": "user",
                    "content": f"""
            You are a powerful text-to-SQL model. Your job is to answer questions about a database. You are given a question and context regarding one or more tables. 

            You must output the SQL query that answers the question.
            
            ### Input:
            {row["question"]}
            
            ### Context:
            {row["context"]}
            
            ### Response:
            """,
                },
                {"role": "assistant", "content": row["answer"]},
            ]
        }
        for index, row in df.iterrows()
    ]

    with open("data.jsonl", "w") as f:
        for line in df_formatted:
            json.dump(line, f)
            f.write("\n")
    ```

    Here is an example of the formatted data:

    ```json
    {
      "messages": [
        {
          "role": "user",
          "content": "\n        You are a powerful text-to-SQL model. Your job is to answer questions about a database. You are given a question and context regarding one or more tables. \n\n        You must output the SQL query that answers the question.\n        \n        ### Input:\n        How many heads of the departments are older than 56 ?\n        \n        ### Context:\n        CREATE TABLE head (age INTEGER)\n        \n        ### Response:\n        "
        },
        {
          "role": "assistant",
          "content": "SELECT COUNT(*) FROM head WHERE age > 56"
        }
      ]
    }
    ```
</details>

<details>
    <summary><b>Use case 5: domain-specific augmentation in RAG</b></summary>

    Fine-tuning can improve Q&A performance in a standard RAG workflow. For example,
    [this study](https://arxiv.org/pdf/2404.11792.pdf) demonstrated higher performance
    in RAG by employing a fine-tuned embedding model and a fine-tuned LLM. 
    [Another research](https://arxiv.org/pdf/2403.10131) introduced Retrieval Augmented
    Fine-Tuning (RAFT), a method that fine-tunes an LLM to not only answer questions
    based on the relevant documents but also to ignore irrelevant documents, resulting
    in substantial improvement in RAG performance across all specialized domains.

    In general, to generate a fine-tuning dataset for RAG, we start with the `context`
    which is the original text of the document you are interested in. Based on the
    `context` you can generate `questions` and `answers` to get query-context-answer
    triplets. Here are two prompt templates for generating questions and answers:

    * Prompt template for generating questions based on the context:

        ```
        Context information is below.
        ---------------------
        {context_str}
        ---------------------
        Given the context information and not prior knowledge. Generate {num_questions_per_chunk}
        questions based on the context. The questions should be diverse in nature across the
        document. Restrict the questions to the context information provided.
        ```

    * Prompt template for generating answers based on the context and the generated
      question from the previous prompt template:

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
</details>
<details>
    <summary><b>Use case 6: knowledge transfer</b></summary>

    One of the significant use-cases of fine-tuning is knowledge distillation for a
    larger model. Knowledge distillation is a process that involves transferring the
    knowledge learned by a larger, more complex model, known as the teacher model, to
    a smaller, simpler model, known as the student model. Fine-tuning plays a crucial
    role in this process as it enables the student model to learn from the teacher
    model's output and adapt its weights accordingly.

    Assume we have some medical notes data that requires labelling. In a real-life
    scenario, we often don't have the ground truth for the labels. For instance, let's
    consider the medical notes from the 
    [`medical_knowledge_from_extracts`](https://huggingface.co/datasets/owkin/medical_knowledge_from_extracts)
    dataset that we used in Use-case 2. Let's assume we don't have the verified truth
    for the labels. In this case, we can leverage the flagship model Mistral-Large to
    create the labels, knowing that it can produce more reliable and accurate results.
    Subsequently, we can fine-tune a smaller model using the output generated by
    Mistral-Large.

    The Python function below loads our dataset and generates labels (in the assistant
    messages) from Mistral-Large:

    ```python
    from mistralai import Mistral
    import pandas as pd
    import json
    import os

    api_key = os.environ.get("MISTRAL_API_KEY")

    def run_mistral(user_message, model="mistral-large-latest"):
        client = Mistral(api_key=api_key)
        messages = [
            {
                "role": "user",
                "content": user_message
            }
        ]
        chat_response = client.chat.complete(
            model=model, response_format={"type": "json_object"}, messages=messages
        )
        return chat_response.choices[0].message.content


    # load dataset and select top 10 rows as an example
    df = pd.read_csv(
        "https://huggingface.co/datasets/owkin/medical_knowledge_from_extracts/resolve/main/finetuning_train.csv"
    ).head(10)

    # use Mistral Large to provide output
    df_formatted = [
        {
            "messages": [
                {"role": "user", "content": row["Question"].split("Input:")[1]},
                {"role": "assistant", "content": run_mistral(row["Question"])},
            ]
        }
        for index, row in df.iterrows()
    ]

    with open("data.jsonl", "w") as f:
        for line in df_formatted:
            json.dump(line, f)
            f.write("\n")
    ```

    Here is an example of one instance of the data:

    ```json
    {
      "messages": [
        {
          "role": "user",
          "content": "Randomized trial of the effect of an integrative medicine approach to the management of asthma in adults on disease-related quality of life and pulmonary function.  The purpose of this study was to test the effectiveness of an integrative medicine approach to the management of asthma compared to standard clinical care on quality of life (QOL) and clinical outcomes. This was a prospective parallel group repeated measurement randomized design. Participants were adults aged 18 to 80 years with asthma. The intervention consisted of six group sessions on the use of nutritional manipulation, yoga techniques, and journaling. Participants also received nutritional supplements: fish oil, vitamin C, and a standardized hops extract. The control group received usual care. Primary outcome measures were the Asthma Quality of Life Questionnaire (AQLQ), The Medical Outcomes Study Short Form-12 (SF-12), and standard pulmonary function tests (PFTs). In total, 154 patients were randomized and included in the intention-to-treat analysis (77 control, 77 treatment). Treatment participants showed greater improvement than controls at 6 months for the AQLQ total score (P<.001) and for three subscales, Activity (P< 0.001), Symptoms (P= .02), and Emotion (P<.001). Treatment participants also showed greater improvement than controls on three of the SF-12 subscales, Physical functioning (P=.003); Role limitations, Physical (P< .001); and Social functioning (P= 0.03), as well as in the aggregate scores for Physical and Mental health (P= .003 and .02, respectively). There was no change in PFTs in either group. A low-cost group-oriented integrative medicine intervention can lead to significant improvement in QOL in adults with asthma. Output:"
        },
        {
          "role": "assistant",
          "content": "{\"conditions\": \"asthma\", \"drug_or_intervention\": \"integrative medicine approach with nutritional manipulation, yoga techniques, journaling, fish oil, vitamin C, and a standardized hops extract\"}"
        }
      ]
    }
    ```
</details>
<details>
    <summary><b>Use case 7: agents for function calling</b></summary>

    Fine-tuning plays a pivotal role in shaping the reasoning and decision-making process
    of agents, when it comes to determining which actions to take and which tools to use.
    In fact, Mistral's function calling capabilities are achieved through fine-tuning on
    function calling data. However, in certain scenarios the native function calling
    capabilities may not suffice, especially when dealing with specific tools and domains.
    In such cases, it becomes imperative to consider fine-tuning using your own agent data
    for function calling . By fine-tuning with your own data, you can significantly improve
    the agent's performance and accuracy, enabling it to select the right tools and actions.

    Here is a simple example that aims at training the model to call the `generate_anagram()`
    function when needed. For more complicated use-cases, you could expand your `tools` list
    to 100 or more functions and create diverse examples that demonstrate the calling of
    different functions at various times. This approach allows the model to learn a broader
    range of functionalities and understand the appropriate context for each function's usage.

    ```json
    {
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful assistant with access to the following functions to help the user. You can use the functions if needed."
            },
            {
                "role": "user",
                "content": "Can you help me generate an anagram of the word 'listen'?"
            },
            {
                "role": "assistant",
                "tool_calls": [
                    {
                        "id": "TX92Jm8Zi",
                        "type": "function",
                        "function": {
                            "name": "generate_anagram",
                            "arguments": "{\"word\": \"listen\"}"
                        }
                    }
                ]
            },
            {
                "role": "tool",
                "content": "{\"anagram\": \"silent\"}",
                "tool_call_id": "TX92Jm8Zi"
            },
            {
                "role": "assistant",
                "content": "The anagram of the word 'listen' is 'silent'."
            },
            {
                "role": "user",
                "content": "That's amazing! Can you generate an anagram for the word 'race'?"
            },
            {
                "role": "assistant",
                "tool_calls": [
                    {
                        "id": "3XhQnxLsT",
                        "type": "function",
                        "function": {
                            "name": "generate_anagram",
                            "arguments": "{\"word\": \"race\"}"
                        }
                    }
                ]
            }
        ],
        "tools": [
            {
                "type": "function",
                "function": {
                    "name": "generate_anagram",
                    "description": "Generate an anagram of a given word",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "word": {
                                "type": "string",
                                "description": "The word to generate an anagram of"
                            }
                        },
                        "required": ["word"]
                    }
                }
            }
        ]
    }
    ```
</details>
