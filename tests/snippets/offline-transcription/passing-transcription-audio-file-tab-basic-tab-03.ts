import { Mistral } from "@mistralai/mistralai";
import fs from "fs";

const apiKey = process.env["MISTRAL_API_KEY"];

const client = new Mistral({ apiKey: apiKey });

const audio_file = fs.readFileSync('/path/to/file/audio.mp3');
const transcriptionResponse = await client.audio.transcriptions.complete({
  model: "voxtral-mini-latest",
  file: {
    fileName: "audio.mp3",
    content: audio_file,
  },
  // language: "en"
});

console.log(JSON.stringify(transcriptionResponse, null, 2));
