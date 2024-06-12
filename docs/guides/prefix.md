---
id: prefix
title: Prefix
slug: prefix
sidebar_position: 1.3
---

# Prefix: Use Cases

Prefixes are one feature that can easily be game-changing for many use cases and scenarios, while the concept is simple, the possibilities are endless.


## What is it?

A prefix is essentially a string that is prepended to a model's
response, rather than to the user's query. This means that the model
will not generate the string, but it will be included as part of the
input.

For example, let's say we ask a model a question:

-   Input: `User: Hi there! Assistant:`
-   Output: `Hello! It's nice to meet you. Is there something you'd like to talk about or learn more about? I'm here to help.`

However, if we want the model to always start with "I'm kind" for a
specific use case and continue from there as a completion model, it
would look like this:

-   Input: `User: Hi there! Assistant: I'm kind`
-   Output: `and new here, so please bear with me if I make any mistakes. How can I assist you today?`

This way, we can force the model to begin a sentence or response with a
desired string of our choice!

### Other Examples

For reference, here are some other examples of prefixes being used to
better visualize:

Question:  
    - `"How are you?"`  
Prefix:  
    - `"Fine"`  
Assistant:  
    - `"Fine, thank you! How can I help you today?"`

Question:  
    - `"Who is Albert Einstein?"`  
Prefix:  
    - `"Well..."`  
Assistant:  
    - `"Well...you've asked about one of the most influential scientists in history! Albert Einstein (1879-1955) was a theoretical physicist, known best [...]"`

## How to use it

```py
from mistralai.client import MistralClient

mistral_api_key = "your_api_key"
cli = MistralClient(api_key = mistral_api_key)

question = "Hi there!"

prefix = "Oh!"
resp = cli.chat(model = "mistral-small-latest",
                messages = [
                    {"role":"user", "content":question},
                    {"role":"assistant", "content":prefix, "prefix":True}
                    ],
                max_tokens = 256)
print(resp.choices[0].message.content)
```
```
Oh! Hello there! How may I be of assistance to you today? Or perhaps you just wanted to chat? In either case, I'm more than happy to oblige! Do tell me more, dear interlocutor.
```