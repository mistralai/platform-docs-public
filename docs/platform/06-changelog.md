# Changelog

This is the list of changes to the Mistral API. 

Feb. 26, 2024

- API endpoints: We renamed 3 API endpoints and added 2 model endpoints. 
    - `open-mistral-7b` (aka `mistral-tiny-2312`): renamed from `mistral-tiny`. The endpoint `mistral-tiny` will be deprecated in three months.
    - `open-mixtral-8x7B` (aka `mistral-small-2312`): renamed from `mistral-small`. The endpoint `mistral-small` will be deprecated in three months.
    - `mistral-small-latest` (aka `mistral-small-2402`): new model.
   - `mistral-medium-latest` (aka `mistral-medium-2312`): old model. The previous mistral-medium has been dated and tagged as `mistral-medium-2312`. 
    - `mistral-large-latest` (aka `mistral-large-2402`): our new flagship model with leading performance. 

- New API capabilities:
    - Function calling: available for Mistral-small, Mistral-medium, and Mistral-large. 
    - JSON mode: available for Mistral Small, Mistral Medium, and Mistral Large

- La Plateforme:
    - We added multiple currency support to the payment system, including the option to pay in US dollars. 
    - We introduced enterprise platform features including admin management, which allows users to manage individuals from your organization.

- Le Chat: 
    - We introduced the brand new chat interface Le Chat to easily interact with Mistral models. 
    - You can currently interact with four models: Mistral-large, Mistral-next, Mistral-medium, and Mistral-small. 

Jan. 11, 2024
- We have enhanced the API's strictness. Previously the API would silently ignores unsupported parameters in the requests, but it now strictly enforces the validity of all parameters. If you have unsupported parameters in your request, you will see the error message "Extra inputs are not permitted".
- A previous version of the [guardrailing documentation](../guardrailing) incorrectly referred to the API parameter as `safe_mode` instead of `safe_prompt`. We corrected this in the documentation. 

Jan. 16, 2024
- We added token usage information in streaming requests. You can find it in the last chunk returned.
