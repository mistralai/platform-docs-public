import { Mistral } from "@mistralai/mistralai";

const apiKey = process.env["MISTRAL_API_KEY"];

const client = new Mistral({ apiKey: apiKey });

const transcriptionResponse = await client.audio.transcriptions.complete({
  model: "voxtral-mini-latest",
  fileUrl: "https://docs.mistral.ai/audio/obama.mp3",
  timestampGranularities: ["segment"] // or "word"
});

console.log(JSON.stringify(transcriptionResponse, null, 2));
