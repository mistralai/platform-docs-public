import { Mistral } from "@mistralai/mistralai";

const apiKey = process.env["MISTRAL_API_KEY"];

const client = new Mistral({ apiKey: apiKey });

const transcriptionResponse = await client.audio.transcriptions.complete({
  model: "voxtral-mini-latest",
  fileUrl: "https://docs.mistral.ai/audio/obama.mp3",
  contextBias: [
    "Chicago",
    "Joplin",
    "Boston",
    "Charleston",
    "farewell_address",
    "self-government",
    "citizenship",
    "democracy",
    "American_people",
    "cancer_survivors",
    "affordable_health_care",
    "wounded_warriors",
    "refugees",
    "elected_officials",
    "American_spirit",
    "work_of_citizenship",
    "guardians_of_our_democracy",
  ]
});

console.log(JSON.stringify(transcriptionResponse, null, 2));
