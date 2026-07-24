import { Mistral } from "@mistralai/mistralai";
import * as fs from "fs";
async function main() {
    const apiKey = process.env["MISTRAL_API_KEY"];
    const model = "voxtral-mini-latest";

    const client = new Mistral({ apiKey: apiKey });
    const audioFile = fs.readFileSync("/path/to/file/audio.mp3");

    const response = await client.audio.transcriptions.complete({
        model: model,
        fileUrl: "https://docs.mistral.ai/audio/obama.mp3",
        diarize: true,
        timestampGranularities: ["segment"],
    });

    for (const segment of response.segments) {
        const speaker = segment.speaker_id || "unknown";
        console.log(
            `[${segment.start.toFixed(1)}s → ${segment.end.toFixed(1)}s] ${speaker}: ${segment.text.trim()}`
        );
    }
}

main().catch(console.error);
