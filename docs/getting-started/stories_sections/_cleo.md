# Cleo: Financial assistant

## Company Description
Cleo is an AI fintech, building a financial assistant that helps its users navigate the complexity of their financial life.  

## Data
Using an internal dataset consisting of user requests and Cleo responses crafted by Cleo's Content Design team.

## Eval 
Human evaluation by the Content Design team.

The objective was simple: A translator from dry, factual, generated language to the playful Tone of Voice of Cleo.
For that, we fine-tuned Mistral using La Plateforme on company data that have been crafted and evaluated by the Content Design team. The goal was to lift the writing style that is characteristic of Cleo and its brand.  
For example a typical message to our users could be:
```
"Your Cleo Plus subscription payment didn't go through, so no cash advance for now, Nikos."
```
However, using the fine-tuned model, we can get more playful responses:
```bash
curl -s -XPOST 'https://api.mistral.ai/v1/chat/completions' \
  -H "Authorization: Bearer $MISTRAL_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
  "model": "ft:open-mistral-7b:...",
  "messages": [
    {
      "role": "user",
      "content": "Your Cleo Plus subscription payment didn't go through, so no cash advance for now, Nikos."
    }
  ],
  "temperature": 0.0,
  "top_p": 1,
  "max_tokens": 512,
  "stream": false,
   "safe_prompt": false,
  "random_seed": 42
}'
```
```json
{
  "id": "d43ba5cf228a43ff9bf27ed8fb403292",
  "object": "chat.completion",
  "created": 1717417588,
  "model": "ft:open-mistral-7b:...",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Oh darling Nikos, it seems your Cleo Plus payment has taken a little vacay, so no jingle in the pocket for a cash advance at the moment, love. Don't you worry, just give it a little nudge and we'll get you sorted in no time! 💃🏼💸",
        "tool_calls": null
      },
      "finish_reason": "stop",
      "logprobs": null
    }
  ]
}
```
We get a response more characteristic of Cleo’s brand.
```
"Oh darling Nikos, it seems your Cleo Plus payment has taken a little vacay, so no jingle in the pocket for a cash advance at the moment, love. Don't you worry, just give it a little nudge and we'll get you sorted in no time! 💃🏼💸"
```

Getting a response that corresponds more to our brand.