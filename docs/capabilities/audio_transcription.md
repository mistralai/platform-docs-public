---
id: audio
title: Audio & Transcription
sidebar_position: 3
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<div style={{ textAlign: 'center' }}>
  <img
    src="/img/audio.png"
    alt="audio_graph"
    width="500"
    style={{ borderRadius: '15px' }}
  />
</div>

Audio input capabilities enable models to chat and understand audio directly, this can be used for both chat use cases via audio or for optimal transcription purposes.

### Models with Audio Capabilities
Audio capable models:
- Voxtral Small (`voxtral-small-latest`) with audio input for [chat](#chat-with-audio) use cases.
- Voxtral Mini (`voxtral-mini-latest`) with audio input for [chat](#chat-with-audio) use cases and efficient [transcription](#transcription) only service.

## Chat with Audio

### Passing an Audio URL

<Tabs groupId="code">
  <TabItem value="python" label="python">

```python
Coming Soon...
```
  </TabItem>
  <TabItem value="typescript" label="typescript">

```typescript
Coming Soon...
```

  </TabItem>
  <TabItem value="curl" label="curl" default>

```bash
curl --location https://api.mistral.ai/v1/chat/completions \
  --header "Authorization: Bearer $MISTRAL_API_KEY" \
  --header "Content-Type: application/json" \
  --data '{
    "model": "voxtral-mini-2507",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "input_audio",
            "input_audio": {
              "data": "https://download.samplelib.com/mp3/sample-15s.mp3",
              "format": "mp3"
            }
          },
          {
            "type": "text",
            "text": "What'\''s in this file?"
          }
        ]
      }
    ]
  }'
```
  </TabItem>
</Tabs>

### Passing an Uploaded Audio File

<Tabs groupId="code">
  <TabItem value="python" label="python">

```python
Coming Soon...
```
  </TabItem>
  <TabItem value="typescript" label="typescript">

```typescript
Coming Soon...
```

  </TabItem>
  <TabItem value="curl" label="curl" default>

**Upload the Audio File**
```bash
Coming Soon...
```

**Get the Signed URL**
```bash
Coming Soon...
```

**Send Completion Request**
```bash
Coming Soon...
```
  </TabItem>
</Tabs>

<details>
<summary><b>Samples</b></summary>
  <Tabs>
    <TabItem value="chat" label="Chat" default>

        **User**

        <audio controls>
          <source src="/audio/chat.wav" type="audio/wav"/>
          Your browser does not support the audio element.
        </audio>

        **Assistant**

        Sure, here is the transcription of what you said:  
        "Today on July 15th, 2025, Mistral AI is announcing the new Voxtral models."  
        And here is the Python code to generate the first n digits of the Fibonacci sequence:  
        ```python
            def fibonacci(n):
        if n <= 0:
            return []
        elif n == 1:
            return [0]
        elif n == 2:
            return [0, 1]

        fib_sequence = [0, 1]
        for i in range(2, n):
            next_value = fib_sequence[-1] + fib_sequence[-2]
            fib_sequence.append(next_value)

        return fib_sequence

        # Example usage:
        n = 10  # Change this value to get the first n digits of the Fibonacci sequence
        print(fibonacci(n))
        ```
        This code defines a function `fibonacci` that takes an integer `n` and returns a list containing the first `n` digits of the Fibonacci sequence. You can change the value of `n` to get the desired number of Fibonacci digits.

    </TabItem>
    <TabItem value="music" label="Music">
    
        **User**

        <audio controls>
          <source src="/audio/music.mp3" type="audio/mp3"/>
          Your browser does not support the audio element.
        </audio>
        What's in this file?

        **Assistant**

        The audio file contains music.
    </TabItem>
    <TabItem value="compare_speakers" label="Compare Speakers">
    
        **User**

        <audio controls>
          <source src="/audio/obama.mp3" type="audio/mp3"/>
          Your browser does not support the audio element.
        </audio>
        <audio controls>
          <source src="/audio/bcn_weather.mp3" type="audio/mp3"/>
          Your browser does not support the audio element.
        </audio>
        
        Which speaker do you prefer between the two? Why? How are they different from each other?

        **Assistant**

        The speaker who delivers the farewell address is more engaging and inspiring.  
        They express gratitude and optimism, emphasizing the importance of self-government and citizenship.  
        They also share personal experiences and observations, making the speech more relatable and heartfelt.  
        In contrast, the second speaker provides factual information about the weather in Barcelona, which is less engaging and lacks the emotional depth of the first speaker's address.
    </TabItem>
  </Tabs>
</details>

## Transcription

### Passing an Audio URL

<Tabs groupId="code">
  <TabItem value="python" label="python">

```python
Coming Soon...
```
  </TabItem>
  <TabItem value="typescript" label="typescript">

```typescript
Coming Soon...
```

  </TabItem>
  <TabItem value="curl" label="curl" default>

```bash
curl --location 'https://api.mistral.ai/v1/audio/transcriptions' \
--header "x-api-key: $MISTRAL_API_KEY" \
--form 'file_url="https://https://docs.mistral.ai/audio/obama.mp3"' \
--form 'model="voxtral-mini-2507"'
```
  </TabItem>
</Tabs>

### Passing an Uploaded Audio File

<Tabs groupId="code">
  <TabItem value="python" label="python">

```python
Coming Soon...
```
  </TabItem>
  <TabItem value="typescript" label="typescript">

```typescript
Coming Soon...
```

  </TabItem>
  <TabItem value="curl" label="curl" default>

**Upload the Audio File**
```bash
Coming Soon...
```

**Get the Signed URL**
```bash
Coming Soon...
```

**Send Transcription Request**
```bash
Coming Soon...
```
  </TabItem>
</Tabs>

<details>
<summary><b>JSON Output</b></summary>

```json
{
  "model":"voxtral-mini-2507",
  "text":"This week, I traveled to Chicago to deliver my final farewell address to the nation, following in the tradition of presidents before me. It was an opportunity to say thank you. Whether we've seen eye to eye or rarely agreed at all, my conversations with you, the American people, in living rooms, in schools, at farms and on factory floors, at diners and on distant military outposts, All these conversations are what have kept me honest, kept me inspired, and kept me going. Every day, I learned from you. You made me a better President, and you made me a better man. Over the course of these eight years, I've seen the goodness, the resilience, and the hope of the American people. I've seen neighbors looking out for each other as we rescued our economy from the worst crisis of our lifetimes. I've hugged cancer survivors who finally know the security of affordable health care. I've seen communities like Joplin rebuild from disaster, and cities like Boston show the world that no terrorist will ever break the American spirit. I've seen the hopeful faces of young graduates and our newest military officers. I've mourned with grieving families searching for answers. And I found grace in a Charleston church. I've seen our scientists help a paralyzed man regain his sense of touch, and our wounded warriors walk again. I've seen our doctors and volunteers rebuild after earthquakes and stop pandemics in their tracks. I've learned from students who are building robots and curing diseases, and who will change the world in ways we can't even imagine. I've seen the youngest of children remind us of our obligations to care for our refugees. to work in peace, and above all, to look out for each other. That's what's possible when we come together in the slow, hard, sometimes frustrating, but always vital work of self-government. But we can't take our democracy for granted. All of us, regardless of party, should throw ourselves into the work of citizenship. Not just when there is an election. Not just when our own narrow interest is at stake. But over the full span of a lifetime. If you're tired of arguing with strangers on the Internet, try to talk with one in real life. If something needs fixing, lace up your shoes and do some organizing. If you're disappointed by your elected officials, then grab a clipboard, get some signatures, and run for office yourself. Our success depends on our participation, regardless of which way the pendulum of power swings. It falls on each of us to be guardians of our democracy. to embrace the joyous task we've been given to continually try to improve this great nation of ours. Because for all our outward differences, we all share the same proud title – citizen. It has been the honor of my life to serve you as President. Eight years later, I am even more optimistic about our country's promise. And I look forward to working along your side as a citizen for all my days that remain. Thanks, everybody. God bless you. And God bless the United States of America.",
  "language":"en",
  "segments":[],
  "usage":{
    "prompt_audio_seconds":203,
    "prompt_tokens":4,
    "total_tokens":3264,
    "completion_tokens":635
  }
}
```
</details>

<details>
<summary><b>Samples</b></summary>
  <Tabs>
    <TabItem value="obama" label="Obama">
        **Audio**
        <audio controls>
          <source src="/audio/obama.mp3" type="audio/mp3"/>
          Your browser does not support the audio element.
        </audio>

        **Transcription**  
        This week, I traveled to Chicago to deliver my final farewell address to the nation, following in the tradition of presidents before me. It was an opportunity to say thank you. Whether we've seen eye to eye or rarely agreed at all, my conversations with you, the American people, in living rooms, in schools, at farms and on factory floors, at diners and on distant military outposts, All these conversations are what have kept me honest, kept me inspired, and kept me going. Every day, I learned from you. You made me a better President, and you made me a better man. Over the course of these eight years, I've seen the goodness, the resilience, and the hope of the American people. I've seen neighbors looking out for each other as we rescued our economy from the worst crisis of our lifetimes. I've hugged cancer survivors who finally know the security of affordable health care. I've seen communities like Joplin rebuild from disaster, and cities like Boston show the world that no terrorist will ever break the American spirit. I've seen the hopeful faces of young graduates and our newest military officers. I've mourned with grieving families searching for answers. And I found grace in a Charleston church. I've seen our scientists help a paralyzed man regain his sense of touch, and our wounded warriors walk again. I've seen our doctors and volunteers rebuild after earthquakes and stop pandemics in their tracks. I've learned from students who are building robots and curing diseases, and who will change the world in ways we can't even imagine. I've seen the youngest of children remind us of our obligations to care for our refugees. to work in peace, and above all, to look out for each other. That's what's possible when we come together in the slow, hard, sometimes frustrating, but always vital work of self-government. But we can't take our democracy for granted. All of us, regardless of party, should throw ourselves into the work of citizenship. Not just when there is an election. Not just when our own narrow interest is at stake. But over the full span of a lifetime. If you're tired of arguing with strangers on the Internet, try to talk with one in real life. If something needs fixing, lace up your shoes and do some organizing. If you're disappointed by your elected officials, then grab a clipboard, get some signatures, and run for office yourself. Our success depends on our participation, regardless of which way the pendulum of power swings. It falls on each of us to be guardians of our democracy. to embrace the joyous task we've been given to continually try to improve this great nation of ours. Because for all our outward differences, we all share the same proud title – citizen. It has been the honor of my life to serve you as President. Eight years later, I am even more optimistic about our country's promise. And I look forward to working along your side as a citizen for all my days that remain. Thanks, everybody. God bless you. And God bless the United States of America.  

        **Language**
        English
     </TabItem>
  </Tabs>
</details>

## Transcription with Timestamps

You can request timestamps for the transcription by passing the `timestamp_granularities` parameter, currently supporting `segment`.
It will return the start and end time of each segment in the audio file.

<Tabs groupId="code">
  <TabItem value="python" label="python">

```python
Coming Soon...
```
  </TabItem>
  <TabItem value="typescript" label="typescript">

```typescript
Coming Soon...
```

  </TabItem>
  <TabItem value="curl" label="curl" default>

```bash
curl --location 'https://api.mistral.ai/v1/audio/transcriptions' \
--header "x-api-key: $MISTRAL_API_KEY" \
--form 'file_url="https://https://docs.mistral.ai/audio/obama.mp3"' \
--form 'model="voxtral-mini-2507"'
--form 'timestamp_granularities="segment"'
```
  </TabItem>
</Tabs>

<details>
<summary><b>JSON Output</b></summary>

```json
{
  "model":"voxtral-mini-2507",
  "text":"This week, I traveled to Chicago to deliver my final farewell address to the nation, following in the tradition of presidents before me. It was an opportunity to say thank you. Whether we've seen eye to eye or rarely agreed at all, My conversations with you, the American people, in living rooms, in schools, at farms, on factory floors, at diners, and on distant military outposts – all these conversations are what have kept me honest, kept me inspired, and kept me going. Every day, I learned from you. You made me a better President, and you made me a better man. Over the course of these eight years, I've seen the goodness, the resilience, and the hope of the American people. I've seen neighbors looking out for each other as we rescued our economy from the worst crisis of our lifetimes. I've hugged cancer survivors who finally know the security of affordable health care. I've seen communities like Joplin rebuild from disaster, and cities like Boston show the world that no terrorist will ever break the American spirit. I've seen the hopeful faces of young graduates and our newest military officers. I've mourned with grieving families searching for answers. And I found grace in a Charleston church. I've seen our scientists help a paralyzed man regain his sense of touch, and our wounded warriors walk again. I've seen our doctors and volunteers rebuild after earthquakes and stop pandemics in their tracks. I've learned from students who are building robots and curing diseases, and who will change the world in ways we can't even imagine. I've seen the youngest of children remind us of our obligations to care for our refugees, to work in peace, and above all, to look out for each other. That's what's possible when we come together in the slow, hard, sometimes frustrating, but always vital work of self-government. But we can't take our democracy for granted. All of us, regardless of party, should throw ourselves into the work of citizenship – not just when there is an election, not just when our own narrow interest is at stake, but over the full span of a lifetime. If you're tired of arguing with strangers on the Internet, try to talk with one in real life. If something needs fixing, lace up your shoes and do some organizing. If you're disappointed by your elected officials, then grab a clipboard, get some signatures, and run for office yourself. Our success depends on our participation, regardless of which way the pendulum of power swings. It falls on each of us to be guardians of our democracy, to embrace the joyous task we've been given to continually try to improve this great nation of ours. Because for all our outward differences, we all share the same proud title – citizen. It has been the honor of my life to serve you as President. Eight years later, I am even more optimistic about our country's promise. And I look forward to working along your side as a citizen for all my days that remain. Thanks, everybody. God bless you. And God bless the United States of America.",
  "language":"en",
  "segments":[
    {"text":"This week, I traveled to Chicago to deliver my final farewell address to the nation, following in the tradition of presidents before me.","start":0.0,"end":68.9},
    {"text":" It was an opportunity to say thank you.","start":68.9,"end":71.7},
    {"text":" Whether we've seen eye to eye or rarely agreed at all,","start":71.7,"end":75.1},
    {"text":" My conversations with you, the American people, in living rooms, in schools, at farms, on","start":75.1,"end":81.8},
    {"text":" factory floors, at diners, and on distant military outposts – all these conversations","start":81.8,"end":88.3},
    {"text":" are what have kept me honest, kept me inspired, and kept me going.","start":88.3,"end":93.3},
    {"text":" Every day, I learned from you.","start":93.3,"end":95.4},
    {"text":" You made me a better President, and you made me a better man.","start":95.4,"end":99.8},
    {"text":" Over the course of these eight years, I've seen the goodness, the resilience, and the","start":99.8,"end":104.1},
    {"text":" hope of the American people.","start":104.1,"end":106.4},
    {"text":" I've seen neighbors looking out for each other as we rescued our economy from the worst","start":106.4,"end":110.0},
    {"text":" crisis of our lifetimes.","start":110.0,"end":112.2},
    {"text":" I've hugged cancer survivors who finally know the security of affordable health care.","start":112.2,"end":117.1},
    {"text":" I've seen communities like Joplin rebuild from disaster, and cities like Boston show","start":117.1,"end":122.0},
    {"text":" the world that no terrorist will ever break the American spirit.","start":122.0,"end":127.0},
    {"text":" I've seen the hopeful faces of young graduates and our newest military officers.","start":127.0,"end":132.0},
    {"text":" I've mourned with grieving families searching for answers.","start":132.0,"end":135.5},
    {"text":" And I found grace in a Charleston church.","start":135.5,"end":138.5},
    {"text":" I've seen our scientists help a paralyzed man regain his sense of touch, and our wounded","start":138.5,"end":143.9},
    {"text":" warriors walk again.","start":143.9,"end":146.3},
    {"text":" I've seen our doctors and volunteers rebuild after earthquakes and stop pandemics in their","start":146.3,"end":151.6},
    {"text":" tracks.","start":151.6,"end":152.6},
    {"text":" I've learned from students who are building robots and curing diseases, and who will change","start":152.6,"end":157.2},
    {"text":" the world in ways we can't even imagine.","start":157.2,"end":160.0},
    {"text":" I've seen the youngest of children remind us of our obligations to care for our refugees,","start":160.0,"end":166.9},
    {"text":" to work in peace, and above all, to look out for each other.","start":166.9,"end":172.0},
    {"text":" That's what's possible when we come together in the slow, hard, sometimes frustrating,","start":172.0,"end":177.3},
    {"text":" but always vital work of self-government.","start":177.3,"end":180.3},
    {"text":" But we can't take our democracy for granted.","start":180.3,"end":183.8},
    {"text":" All of us, regardless of party, should throw ourselves into the work of citizenship –","start":183.8,"end":189.7},
    {"text":" not just when there is an election, not just when our own narrow interest is at stake,","start":189.7,"end":195.3},
    {"text":" but over the full span of a lifetime.","start":195.3,"end":198.1},
    {"text":" If you're tired of arguing with strangers on the Internet, try to talk with one in real life.","start":198.1,"end":203.5},
    {"text":" If something needs fixing, lace up your shoes and do some organizing.","start":204.4,"end":208.4},
    {"text":" If you're disappointed by your elected officials, then grab a clipboard, get some signatures, and run for office yourself.","start":209.1,"end":215.7},
    {"text":" Our success depends on our participation, regardless of which way the pendulum of power swings.","start":216.5,"end":224.4},
    {"text":" It falls on each of us to be guardians of our democracy, to embrace the joyous task we've been given to continually try to improve this great nation of ours.","start":225.2,"end":234.6},
    {"text":" Because for all our outward differences, we all share the same proud title – citizen.","start":235.3,"end":241.7},
    {"text":" It has been the honor of my life to serve you as President.","start":242.7,"end":245.9},
    {"text":" Eight years later, I am even more optimistic about our country's promise.","start":246.9,"end":250.3},
    {"text":" And I look forward to working along your side as a citizen for all my days that remain.","start":250.9,"end":257.3},
    {"text":" Thanks, everybody. God bless you.","start":258.4,"end":260.6},
    {"text":" And God bless the United States of America.","start":261.2,"end":263.4}
  ],
  "usage":{
    "prompt_audio_seconds":203,
    "prompt_tokens":5,
    "total_tokens":4001,
    "completion_tokens":1371
  }
}
```
</details>
