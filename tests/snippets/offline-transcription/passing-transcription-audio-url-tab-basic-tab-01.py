import os
from mistralai.client import Mistral

api_key = os.environ["MISTRAL_API_KEY"]
model = "voxtral-mini-latest"

client = Mistral(api_key=api_key)

transcription_response = client.audio.transcriptions.complete(
    model=model,
    file_url="https://docs.mistral.ai/audio/obama.mp3",
    ## language="en"
)

print(transcription_response)
