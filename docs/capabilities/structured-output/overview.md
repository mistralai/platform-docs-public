---
id: structured_output_overview
title: Structured Output
slug: structured_output_overview
---

# Structured Output
When utilizing LLMs as agents or steps within a lengthy process, chain, or pipeline, it is often necessary for the outputs to adhere to a specific structured format. JSON is the most commonly used format for this purpose.

We offer a reliable method to obtain structured output in your desired format.

Our system includes a built-in mode for JSON output, along with the capability to use custom structured outputs.

:::warning
For JSON mode, it is essential to explicitly instruct the model in your prompt to output JSON and specify the desired format.

Custom structured outputs are more reliable and are recommended whenever possible. However, it is still advisable to iterate on your prompts.  
Use JSON mode when more flexibility in the output is required while maintaining a JSON structure, and customize it if you want to enforce a clearer format to improve reliability.
:::

## Structured Outputs
- [Custom](../custom_structured_output)
- [JSON](../json_mode)
