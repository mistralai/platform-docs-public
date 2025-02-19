---
id: robots
title: Mistral AI Crawlers
slug: robots
sidebar_position: 1.92
---

## Mistral AI Crawlers

Mistral AI employs web crawlers ("robots") and user agents to execute tasks for its products, either automatically or upon user request. To facilitate webmasters in managing how their sites and content interact with AI, Mistral AI utilizes specific robots.txt tags.

### MistralAI-User

MistralAI-User is for user actions in LeChat. When users ask LeChat a question, it may visit a web page to help answer and include a link to the source in its response. MistralAI-User governs which sites these user requests can be made to. It is not used for crawling the web in any automatic fashion, nor to crawl content for generative AI training.

Full user-agent string: Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; MistralAI-User/1.0; +https://docs.mistral.ai/robots

Published IP addresses: https://mistral.ai/mistralai-user-ips.json