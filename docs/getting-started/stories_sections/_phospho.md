# Phospho: RAG for internet retrieval

<iframe width="560" height="315" src="https://www.youtube.com/embed/kqNtOlSOJIE?si=xQOhIXukTFZhV3xq" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

The video showcases the behavior of Tak. When a user inputs a query, Tak will use the LLM knowledge, a tool to search the web and a tool to fetch the news to generate the most relevant answer to the user query. Its behavior depends on the type of query by the user.

## Description
[Tak is a B2C internet search app](https://tak.phospho.ai/) powered by Mistral Large and other models with RAG and Function Calling. 

In order to provide the most relevant answer to the user query, several function calls are performed to categorize the request (see diagram below). As the multiple agents are chained, ensuring consistently formatted outputs is crucial.

![Performance Metrics](/static/img/stories/tak_architecture_diagram.png)

## Company Description

At phospho, we developed the Tak chatbot as an experimental playground to test new phospho features and showcase the power of phospho analytics. A great thing is that you can use the data logged to phospho to finetune LLM models. 
We are [phospho](https://phospho.ai/), an open-source text analytics platform for LLM apps. Companies of all sizes use phospho to understand what users do with their LLM app and how well the app performs at the product level.

## Data
We used a dataset of user queries in Tak and the corresponding GPT-4-turbo function calls, collected and filtered through the phospho platform. We then divided the dataset into a *train* set (70%), an *evaluation* set (15%) and a test set (15%). 

To determine the optimal training duration, we followed the rule of thumb that each token should be seen three times (in our case, 150 training steps, which is approximately 10 minutes).

For the learning rate, we used the suggested learning rate of 6e-5.

## Eval
To evaluate our fine-tuned model, we run inference of the test set of our dataset, then use binary classification metrics (Accuracy, Recall, F1 score). We test whether we were able to align the behavior of Mistral 7b to the classification behavior of OpenAI GPT-4-turbo, while maintaining the expected structured output. Indeed, we removed the function calling.

![Performance Metrics](/static/img/stories/performance_metrics.png)

Fine-tuning made Mistral 7B match the reference model, **increasing the F1 score from 20% to 78%**. Without fine-tuning, Mistral 7B achieved 87% accuracy and 20% recall on our classification task. With the fine-tuned model, we achieved 96% accuracy and 90% recall.

As we fine-tuned the model to only answer with `news_related` or `not_news_related`, we do not need to use function calling anymore. This led to a **34% decrease in the number of tokens used** excluding the user query, which further decreases costs.

## Conclusion
In conclusion, by combining phospho data collection and labeling with Mistral's fine-tuning services, we significantly enhanced our ability to deliver precise and relevant answers to user queries while decreasing cost. We have successfully aligned the behavior of Mistral 7B with GPT-4-turbo. This fine-tuning process not only ensures consistent output formatting but also reduces operational costs by minimizing token usage.

If you also want to improve your RAG agent, we encourage you to try fine tuning with Mistral using the data collected and labeled with phospho. This can lead to significant improvement on your user experience. 
