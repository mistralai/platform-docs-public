import os
from mistralai.client import Mistral
def main():
    api_key = os.environ["MISTRAL_API_KEY"]
    model = "voxtral-mini-latest"
    client = Mistral(api_key=api_key)

    # Upload local audio file and get signed URL
    with open("local_audio.mp3", "rb") as f:
        uploaded_audio = client.files.upload(
            file={
                "content": f,
                "file_name": "local_audio.mp3",
            },
            purpose="audio"
        )
        signed_url = client.files.get_signed_url(file_id=uploaded_audio.id)

        # Perform transcription with diarization
        response = client.audio.transcriptions.complete(
            model=model,
            file_url=signed_url.url,
            diarize=True,
            timestamp_granularities=["segment"],
        )

        # Print results with speaker diarization
        for segment in response.segments:
            speaker = segment.speaker_id or "unknown"
            print(
                f"[{segment.start:.1f}s → {segment.end:.1f}s] {speaker}: {segment.text.strip()}"
            )

if __name__ == "__main__":
    main()
