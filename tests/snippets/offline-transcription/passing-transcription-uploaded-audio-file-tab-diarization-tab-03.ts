import { Mistral } from "@mistralai/mistralai";
import * as fs from "fs";
async function main() {
    const apiKey = process.env["MISTRAL_API_KEY"];
    if (!apiKey) {
        throw new Error("MISTRAL_API_KEY is not set in environment variables");
    }

    const model = "voxtral-mini-latest";
    const client = new Mistral({ apiKey: apiKey });

    try {
        // Upload local audio file and get signed URL
        const uploadedAudio = await client.files.upload({
            file: {
                fileName: "local_audio.mp3",
                content: fs.readFileSync("local_audio.mp3"),
            },
            purpose: "audio",
        });

        const signedUrl = await client.files.getSignedUrl({
            fileId: uploadedAudio.id,
        });

        // Perform transcription with diarization
        const response = await client.audio.transcriptions.complete({
            model: model,
            fileUrl: signedUrl.url,
            diarize: true,
            timestampGranularities: ["segment"],
        });

        // Print results with speaker diarization
        for (const segment of response.segments) {
            const speaker = segment.speaker_id || "unknown";
            console.log(
                `[${segment.start.toFixed(1)}s → ${segment.end.toFixed(1)}s] ${speaker}: ${segment.text.trim()}`
            );
        }
    } catch (error) {
        console.error("Error during transcription:", error);
        throw error;
    }
}

main().catch(console.error);
