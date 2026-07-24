import { Mistral } from "@mistralai/mistralai";
import fs from "fs";

const apiKey = process.env["MISTRAL_API_KEY"];

const client = new Mistral({ apiKey: apiKey });

// If local document, upload and retrieve the signed url
const uploaded_pdf = await client.files.upload({
    file: {
        fileName: "local_audio.mp3",
        content: fs.readFileSync("local_audio.mp3"),
        },
    purpose: "audio",
});
const signedUrl = await client.files.getSignedUrl({
    fileId: uploaded_pdf.id,
});

// Get the transcription
const transcriptionResponse = await client.audio.transcriptions.complete({
    model: "voxtral-mini-latest",
    fileUrl: signedUrl.url,
    // language: "en"
});

console.log(JSON.stringify(transcriptionResponse, null, 2));
