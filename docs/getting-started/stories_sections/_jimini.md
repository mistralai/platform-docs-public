# Jimini AI: Legal copilot

<iframe width="560" height="315" src="https://www.youtube.com/embed/H2jAsddS4LA?si=x_iRPIF5FON_Q-WR" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
*Video 1: Integration of the Mistral fine-tuned models into our product [Jimini Analyzer](https://jimini.ai/).*

The video begins by showcasing the integration of the fine-tuned model on [BSARD](https://arxiv.org/pdf/2108.11792) into our legal document analysis tool. In contrast to the base model, the fine-tuned version **accurately lists the relevant legal articles** in Markdown format, providing a clear and concise overview of the applicable laws.

The remainder of the video highlights the integration of the fine-tuned template on [Multi EURLEX](https://arxiv.org/pdf/2109.00904) into our legal translation tool, resulting in more precise translations of complex legal terminology, such as "*Gerichtsgesetzbuch*'' for "*Code judiciaire*". This enhancement ensures that our translations **accurately reflect the intended legal meaning, ultimately providing greater value to our clients**.

## Description

As we are building a legal copilot, fine-tuning a model presents several interests for us :

- ***It can teach the model to generate responses in a specific format and tone.***

To ensure that our legal copilot outputs reliable, well-sourced and professionally formatted legal answers, we've fine-tuned the `mistral-small` model, focusing on **improving response structure and sourcing**.

For this first use-case, demonstrated on the [*BSARD*](https://arxiv.org/pdf/2108.11792) dataset, we employ **distillation** from the smarter `mistral-large` model. This approach **reduces costs**, saves tokens (no need for a complex prompt anymore) and **decreases latency** by using a small, efficient and fine-tuned model.

- ***It can also be used to specialize the model for a specific topic or domain to improve its performance on domain-specific tasks, such as the legal translation.***

Our **strong European roots** and commitment to our European clients drive us to excel in French-German legal translation. By harnessing the strong multilingual abilities of `mistral-small` and fine-tuning it further specifically for legal terms on the [Multi EURLEX](https://arxiv.org/pdf/2109.00904) dataset, we significantly improved the translation of legal terminology.

## Company description

At [Jimini AI](https://jimini.ai/), we are dedicated to creating a **cutting-edge legal copilot**, designed to assist legal professionals in automating their most tedious and time-consuming tasks, such as the legal research or the translation of legal documents. Gaining access to [Mistral AI](https://mistral.ai/)'s fine-tuning API presented us with an ideal opportunity to focus on two of our key use-cases.

## BSARD

### Data

We used the [Belgian Statutory Article Retrieval Dataset (BSARD)](https://aclanthology.org/2022.acl-long.468/), a comprehensive French dataset for examining legal information retrieval, to fine-tune `mistral-small-latest` and improve the legal accuracy and quality of its answers. It encompasses over 22,600 statutory articles derived from Belgian law along with approximately 1,100 legal inquiries.

We created a synthetic *Question Answering* (QA) dataset by utilizing the `mistral-large-latest` model to generate ground truth answers based on expertly crafted guidelines, which were meticulously developed **in collaboration with legal professionals**. We then divided the dataset into a *train* set (80%) and an *evaluation* set (20%).

To determine the optimal training duration, we followed the rule of thumb that each token should be seen three times (in our case, 220 training steps, which is approximately 30 minutes).

To tune the `learning_rate`, we opted to measure third-party and more generic capabilities than legal criteria to ensure that the model does not regress due to catastrophic forgetting. To this end, we evaluated the model's performance using the [faithfulness](https://docs.ragas.io/en/stable/concepts/metrics/faithfulness.html) and [relevancy](https://docs.ragas.io/en/stable/references/metrics.html#ragas.metrics.AnswerRelevancy) metrics from [RAGAS](https://arxiv.org/abs/2309.15217) on a proprietary *generalist* dataset.

![RAGAS evaluation on BSARD](/static/img/stories/results_bsard.png)
*Figure 1: RAGAS based evaluation of Faithfulness and Answer relevancy of the `mistral-small-latest` and `mistral-small-fine-tuned` models for different learning rates and different number of steps.*

​​We have therefore selected a `learning_rate` of `1e-6`, for which we observe a slight improvement compared to `mistral-small-latest`, as well as a balance between the two criteria. Thus, there does not appear to be any regression of the model's general capabilities.

In addition to this initial sanity check, we used the very useful integration of the Mistral AI fine-tuning endpoint’s with [Weights & Biases](https://wandb.ai/site) to monitor our trainings, and we have notably measured the evolution of the model's `perplexity`, which seems to effectively converge under this training regime (where each token is seen 3 times).

![BSARD training curves](/static/img/stories/bsard_curves.png)
*Figure 2: Perplexity and eval loss during the fine-tuning on BSARD monitored in *Weights & Biases*.*

### Eval

To evaluate the effectiveness of our fine-tuning process, we employed the *LLM-as-a-Judge* methodology. Specifically, we drew inspiration from the additive scale approach developed by [Yuan et al](https://arxiv.org/abs/2401.10020). and recently utilized for the [FineWeb-Edu dataset constitution](https://huggingface.co/spaces/HuggingFaceFW/blogpost-fineweb-v1). We then adapted the methodology by transforming it into a preference score system, denoted in the following by `legal_quality` :

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

### Results

![BSARD evaluation on legal quality](/static/img/stories/legal_quality.png)
*Figure 3: LLM-as-a-judge evaluation of `mistral-small-latest` and `mistral-small-finetuned` based on the legal quality of their answers.*

We observe a significant improvement, with a score increase from 1.42 to 1.73, representing a **20% enhancement!**

This progress is also noticeable in practical applications. The example demonstrated in the video serves as evidence of this improvement:
*(For the non-French readers, we have translated the original French answers into English)*

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

## Multi EURLEX

### Data

To enhance our legal translation tool, we have also fine-tuned `mistral-small-latest` on legal documents. For this purpose, we selected a subset of the [Multi EURLEX](https://arxiv.org/pdf/2109.00904) dataset, which consists of 35,000 European legal documents in French translated into German.

![Multi EURLEX training curves](/static/img/stories/eurlex_curves.png)

*Figure 4: Perplexity and eval loss during the fine-tuning on Multi EURLEX monitored in *Weights & Biases*.*

### Eval

In order to evaluate the fine-tuned model on relevant examples for our use cases, we selected 50 texts containing complex legal terms to be translated from French to German (such as *"Clause de non-concurrence"*, which is sometimes translated as *"Nicht-Konkurrenz-Klausel"* instead of *"Wettbewerbsverbotsklausel"*).

We then submitted the triplets (`example`, `mistral_base_translation`, `mistral_finetuned_translation`) blindly to a bilingual legal expert, who selected the most accurate legal translation for each example.

### Results

The legal expert preferred the legal translation of the fine-tuned model in 38 / 50 cases, with 9 cases tied. Thus, the fine-tuned model is **better or at least as good as the base model in 94% of cases**.

|Example|`mistral-small-latest`|`mistral-small-finetuned`|
| :-: | :-: | - |
|Le vice de procédure a conduit à l'annulation du jugement.|Die Prozessirregularität führte zur Aufhebung des Urteils.|Der Verfahrensmangel hat zur Nichtigkeit des Urteils geführt.|

*Table 1: Comparison of `mistral-small-latest` and its fine-tuned counterpart on Multi EURLEX. The fine-tuned model uses "Verfahrensmangel" and "Nichtigkeit des Urteils", which are the precise and correct legal terms.*

## Conclusion

Our initial tests fine-tuning the `mistral-small` model using Mistral AI's endpoint have yielded promising results. **The fine-tuned model excels in generating structured, well-sourced responses and accurately translating complex legal terms**, demonstrating its potential for specialized legal applications.

The fast fine-tuning capability and *Weights & Biases* integration made the process efficient and straightforward, allowing us to **develop cost-effective, specialized models quickly**.

We will further enhance our results by collaborating closely with our lawyer customers to refine the models' performance. Additionally, we plan to expand use cases to include legal summarization, contract analysis, and legal drafting.

We extend our thanks to Mistral AI for allowing us to test their fine-tuning API as beta testers. The Mistral AI fine-tuning endpoint has proven to be an invaluable tool for our legal AI development - these experiments were just the beginning!

## References

- BSARD : [paper](https://arxiv.org/abs/2108.11792)
- FineWeb-Edu : [blogpost](https://huggingface.co/spaces/HuggingFaceFW/blogpost-fineweb-v1)
- Multi EURLEX : [paper](https://arxiv.org/pdf/2109.00904)
- RAGAS : [paper](https://arxiv.org/abs/2309.15217) & [library](https://github.com/explodinggradients/ragas)
- Self-Rewarding Language Model, *Yuan et al.* : [paper](https://arxiv.org/abs/2401.10020)
- Weights & Biases : [website](https://wandb.ai/site)
