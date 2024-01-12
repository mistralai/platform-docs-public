# Changelog

This is the list of changes to the Mistral API. 

Jan. 11, 2024
- We have enhanced the API's strictness. Previously the API would silently ignores unsupported parameters in the requests, but it now strictly enforces the validity of all parameters. If you have unsupported parameters in your request, you will see the error message "Extra inputs are not permitted".
- A previous version of the [guardrailing documentation](../guardrailing) incorrectly referred to the API parameter as `safe_mode` instead of `safe_prompt`. We corrected this in the documentation. 