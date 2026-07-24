import os
from mistralai.client import Mistral
from mistralai.client.models import File
def main():
    api_key = os.environ["MISTRAL_API_KEY"]
    model = "voxtral-mini-latest"

    client = Mistral(api_key=api_key)
    with open("/path/to/file/audio.mp3", "rb") as f:
        response = client.audio.transcriptions.complete(
            model=model,
            file_url="https://docs.mistral.ai/audio/obama.mp3",
            diarize=True,
            timestamp_granularities=["segment"],
        )
        for segment in response.segments:
            speaker = segment.speaker_id or "unknown"
            print(
                f"[{segment.start:.1f}s → {segment.end:.1f}s] {speaker}: {segment.text.strip()}"
            )
main()
