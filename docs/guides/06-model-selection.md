# Model Selection

Mistral AI provides five API endpoints featuring five leading Large Language Models:
- `open-mistral-7b` (aka `mistral-tiny-2312`)
- `open-mixtral-8x7b` (aka `mistral-small-2312`)
- `mistral-small-latest` (aka `mistral-small-2402`)
- `mistral-medium-latest` (aka `mistral-medium-2312`)
- `mistral-large-latest` (aka `mistral-large-2402`)

This guide will explore the performance, speed, and cost trade-offs, and discuss how to select the appropriate model for different use cases. We will delve into various factors to consider, offering guidance on choosing the right model for your specific needs.

Today, Mistral models are behind many LLM applications at scale. Here is a brief overview on the types of use cases we see along with their respective Mistral model:

1) Simple tasks that one can do in bulk (Classification, Customer Support, or Text Generation) are powered by Mistral-small.
2) Intermediate tasks that require moderate reasoning (Data extraction, Summarizing a Document, Writing emails, Writing a Job Description, or Writing Product Descriptions) are powered by Mistral-medium.
3) Complex tasks that require large reasoning capabilities or are highly specialized (Synthetic Text Generation, Code Generation, RAG, or Agents) are powered by Mistral-large.

## Performance, Speed, and Cost Trade-offs 

When selecting a model, it is essential to evaluate the performance, speed, and cost trade-offs. Depending on what’s most important for your application, your choice may differ significantly. Note that the models will be updated over time, the information we share below only reflect the current state of the models.

In general, the larger the model, the better the performance. For instance, when looking at the popular benchmark MMLU (Massive Multitask Language Understanding), the performance ranking of Mistral’s models is as follows: Mistral-large > Mistral-medium > Mistral-small > Mixtral 8x7B > Mistral 7B. Notably, Mistral-Large is currently outperforming all other four models across almost all benchmarks.

(placeholder for img)
<img src="/img/guides/embeddings2.png" alt="drawing" width="600"/>

For many applications, speed is a crucial factor, especially for the time to next tokens for LLMs. It’s not surprising that our smallest model Mistral 7B provides the fastest time to next token speed. Mistral-large also manages to deliver impressive speed, thanks to the substantial resources we dedicated to enhancing its performance.

(placeholder for img)
<img src="/img/guides/embeddings2.png" alt="drawing" width="600"/>


Pricing could also be a significant consideration for many applications. Here are two scatter plots showing the relationship between MMLU and input token price, as well as the relationship between MMLU and the output token price.

(placeholder for img)
<img src="/img/guides/embeddings2.png" alt="drawing" width="600"/>

In addition to the benchmarks mentioned above, you can also refer to various other independent benchmarks, such as https://huggingface.co/spaces/lmsys/chatbot-arena-leaderboard and https://artificialanalysis.ai/, to gain more insight into the performance and speed of different large language models.  By considering the performance, speed, and cost details, hopefully you can find the best model that suits your application's needs.

As a general rule, if you are new to using Large Language Models, you can always start with Mistral-large first. This will allow you to evaluate its cost and performance and determine whether you need to downgrade to Mistral-medium or even Mistral-small. If you are already using another large language model and are looking to replace a particularly powerful one, then Mistral-large may be the best choice for you. 

## Use Cases 
### Mistral-small: Simple tasks that one can do in bulk
Mistral-small is the ideal choice for simpe tasks that one can do in builk - like Classification, Customer Support, or Text Generation. It offers excellent performance at an affordable price point. For instance, it can be effectively used for a classification task to classify if an email is spam or not: 

Prompt
```
Classify the following email to determine if it is spam or not. Only respond with the exact words "Spam" or "Not spam".

🎉 Urgent! You've Won a $1,000,000 Cash Prize! 💰 To claim your prize, please click on the link below: https://bit.ly/claim-your-prize
```

Mistral-small, Mistral-medium, and Mistral-large all can accurately classify this email correctly as “Spam”. Mistral-small is capable to provide the correct classification as the larger models. So it is the most efficient and affordable choice for this kind of tasks. 

### Mistral-medium: Intermediate tasks that require language transformation
Mistral-medium is the ideal for intermediate tasks that require moderate reasoning - like Data extraction, Summarizing a Document, Writing a Job Description, or Writing Product Descriptions. Mistral-medium strikes a balance between performance and capability, making it suitable for a wide range of tasks that only require language transformaion. For example, Mistral-medium can write an email:

Prompt
```
Compose a welcome email for new customers who have just made their first purchase with your product. 
Start by expressing your gratitude for their business, and then convey your excitement for having them as a customer. 
Include relevant details about their recent order. Sign the email with "The Fun Shop Team".

Order details:
- Customer name: Anna
- Product: hat 
- Estimate date of delivery: Feb. 25, 2024
- Return policy: 30 days
```
Output
```
Subject: Welcome to The Fun Shop, Anna! Your Hat is on its Way!

Dear Anna,

We hope this message finds you well. We are thrilled to welcome you to The Fun Shop family! We are incredibly grateful for your business and are excited to have you as our new customer.

We are processing your recent order for the fabulous hat you've selected. Your new accessory is set to be delivered by Feb. 25, 2024. We hope it arrives just in time to add a touch of fun and style to your outfits!

Please remember that our return policy allows you to return any item within 30 days of receipt if you are not completely satisfied. We want you to love every item you purchase from us, so if there's any issue, please don't hesitate to reach out.

Thank you once again for choosing The Fun Shop. We look forward to serving you and making your shopping experience a fun and enjoyable one!

Best Regards,
The Fun Shop Team
```

### Mistral-large: Complex tasks that require large reasoning capabilities or are highly specialized 
Mistral-large is ideal for complex tasks that require large reasoning capabilities or are highly specialized - like Synthetic Text Generation, Code Generation, RAG, or Agents.
#### Complex reasoning
Mistral-large outperforms our other four models in commonsense and reasoning benchmarks, making it the best choice for complex reasoning tasks. 

| Model | MMLU | hellaswag (10 shot) | winograde (5 shot) | arc challenges (25 shot) |
| --- | ---- | ---|---|---|
| Mistral 7B | 62.5% | 83.1% | 78.0% | 78.1% |
| Mixtral 8x7B | 70.6% | 86.7% | 81.2% | 85.8% |
| Mistral-small | 72.2% | 86.9% | 84.7% | 86.9% |
| Mistral-medium | 75.3% | 88.0% | 88% | 89.9% |
| Mistral-large | 80.3% | 88.8% | 86.7% | 93.1% |



In this example, we ask Mistral-large to calculate the difference in payment dates between the two customers whose payment amounts are closest to each other in the given dataset. Mistral-large can easily and automatically break down the problem into smaller steps: identify the two closest payment amounts, find their respective payment dates, and calculate the date difference. Mistral-large is an excellent choice for tasks that require complex reasoning and problem-solving skills.

Prompt
```
Calculate the difference in payment dates between the two customers whose payment amounts are closest to each other in the given dataset: 

'{
  "transaction_id":{"0":"T1001","1":"T1002","2":"T1003","3":"T1004","4":"T1005"},
    "customer_id":{"0":"C001","1":"C002","2":"C003","3":"C002","4":"C001"},
    "payment_amount":{"0":125.5,"1":89.99,"2":120.0,"3":54.3,"4":210.2},
"payment_date":{"0":"2021-10-05","1":"2021-10-06","2":"2021-10-07","3":"2021-10-05","4":"2021-10-08"},
    "payment_status":{"0":"Paid","1":"Unpaid","2":"Paid","3":"Paid","4":"Pending"}
}'
```

Output
```
To find the difference in payment dates between the two customers whose payment amounts are closest to each other, we first need to identify the two closest payment amounts and then find their respective payment dates.

The payment amounts are: 125.5, 89.99, 120.0, 54.3, 210.2

The two closest payment amounts are 125.5 and 120.0. The payment date for the payment amount 125.5 is '2021-10-05' and for the payment amount 120.0 is '2021-10-07'.

The difference in payment dates can be calculated as follows:

Date difference = |'2021-10-07' - '2021-10-05'| = 2 days

So, the difference in payment dates between the two customers whose payment amounts are closest to each other is 2 days.
```

Let’s try another prompt we found online that requires reasoning and logic understanding. Mistral-Large is able to answer it correctly, while other models can’t. 
```
There's an apple inside a blue box. There's also a red box inside the blue box. The red box has a lid on it. How can I get the apple?
```
Output
```
You can get the apple by opening the blue box. The apple is not inside the red box, so you don't need to open the red box. Simply reach into the blue box and take the apple.
```

Here is another example. Mistral-large is able to answer it correctly, while other models can’t. 
```
Which one is heavier a pound of iron or a kilogram of feather
```
Output
```
A kilogram of feathers is heavier than a pound of iron.

A pound is a unit of weight that is equivalent to approximately 0.453592 kilograms. Therefore, a pound of iron weighs less than a kilogram of feathers.
```
It may seem counterintuitive because we often think of iron as being a heavy material and feathers as being light, but the weight of an object depends on its mass and the force of gravity acting upon it, not on its material or composition.

#### Coding
This table shows our latest coding benchmark results for all our five end points. Mistral-large, the top performer in coding tasks, is the ideal choice for users who priortize coding capabilities in their model selection. 


| Model | HumanE | MBPP | CODE | 
| --- | ---- | ---|---|
| Mistral 7B | 26.2% | 50.2% | 38.2% |
| Mistral 8x7B | 40.2% | 60.7% | 50.5% |
| Mistral-small | 44.5% | 61.5% | 53.0% |
| Mistral-medium | 38.4% | 62.3% | 50.3% | 
| Mistral-large | 47.6% | 74.3% | 60.9% |

Here is an example of Mistral-large giving the correct code following the prompt. 

Prompt
```
Write a function to find the maximum number of segments of lengths a, b and c that can be formed from n.
```
Output
```
Here is a possible function in Python to find the maximum number of segments that can be formed from a given length `n` using segments of lengths `a`, `b`, and `c`:

def max_segments(n, a, b, c):
    # Initialize the maximum number of segments to 0
    max_num_segments = 0

    # Loop through all possible combinations of segments
    for i in range(n // a + 1):
        for j in range(n // b + 1):
            for k in range(n // c + 1):
                # Check if the combination is valid and update the maximum number of segments
                if i * a + j * b + k * c == n:
                    max_num_segments = max(max_num_segments, i + j + k)

    return max_num_segments
```


This function uses nested loops to generate all possible combinations of segments of lengths `a`, `b`, and `c`, respectively. For each combination, it checks if the total length of the segments is equal to `n`, and if so, it updates the maximum number of segments found so far. The function returns the maximum number of segments that can be formed from `n`.

Here is another example of Mistral-large writing a function for computing square roots using the babylonian method. 

Prompt
```
You are an expert Python programmer, and here is your task: Write a function for computing square roots using the babylonian method. Your code should pass these tests:

assert math.isclose(babylonian_squareroot(10), 3.162277660168379, rel_tol=0.001)
assert math.isclose(babylonian_squareroot(2), 1.414213562373095, rel_tol=0.001)
assert math.isclose(babylonian_squareroot(9), 3.0, rel_tol=0.001)
```
Output
```
def babylonian_squareroot(number):
    if(number == 0):
        return 0;
    g = number/2.0;
    g2 = g + 1;
    while(g != g2):
        n = number/ g;
        g2 = g;
        g = (g + n)/2;
    return g;"
```

#### Multi-lingual tasks 
In addition to its exceptional performance in complex reasoning tasks and coding tasks, Mistral-large also demonstrates superior capabilities in handling multi-lingual tasks. Mistral-large has been specifically trained to understand and generate text in multiple languages, especially in French, German, Spanish and Italian. Mistral-large can be especially valuable for businesses and users that need to communicate in multiple languages.



| Model | Fr Arc-C | Fr HellaS | Fr MMLU | De Arc-C | De HellaS | De MMLU | Es Arc-C | Es HellaS | Es MMLU | It Arc-C | It HellaS | It MMLU | 
| --- | ---- | --- | --- | ---- | --- | --- | ---- | --- | --- | ---- | --- | --- |
| Mistral 7B | 44.2% | 63.9% | 50.6% | 39.9% | 58.4% | 49.6% | 43.9% | 64.8% | 51.4% | 41.2% | 60.8% | 51.3% | 
| Mistral 8x7B | 54.3% | 76.0% | 66.1% | 52.7% | 71.0% | 64.9% | 53.7% | 76.3% | 67.5% | 51.1% | 72.9% | 65.9% |
| Mistral-small | 58.8% | 77.4% | 68.4% | 53.0% | 72.9% | 70.1% | 55.9% | 78.2% | 69.7% | 53.7% | 75.1% | 69.5% | 
| Mistral-medium | 58.2% | 77.4% | 70.9% | 54.3% | 73.0% | 71.5% | 55.4% | 77.6% | 72.5% | 52.8% | 75.1% | 70.9% | 
| Mistral-large | 62.1% | 79.8% | 78.4% | 56.4% | 76.6% | 76.7% | 58.6% | 81.1% | 79.3% | 57.5% | 77.6% | 78.1% | 


Prompt
```
Lequel est le plus lourd une livre de fer ou un kilogramme de plume
```
Output
```
Un kilogramme de plumes est plus lourd qu'une livre de fer.

Pour comprendre cela, il est important de se rappeler que :

1. Une livre (lb) est une unité de mesure de masse principalement utilisée aux États-Unis et dans d'autres systèmes de mesure impériaux, tandis qu'un kilogramme (kg) est l'unité de base de masse dans le système international d'unités (SI).
2. 1 kilogramme est approximativement égal à 2,2 livres.

Donc, un kilogramme de plumes est plus lourd qu'une livre de fer, car il correspond à environ 2,2 livres de plumes.
```



