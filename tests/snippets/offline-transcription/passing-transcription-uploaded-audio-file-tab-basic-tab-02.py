import os
from mistralai.client import Mistral

api_key = os.environ["MISTRAL_API_KEY"]
model = "voxtral-mini-latest"

client = Mistral(api_key=api_key)

# If local audio, upload and retrieve the signed url
with open("local_audio.mp3", "rb") as f:
    uploaded_audio = client.files.upload(
        file={
            "content": f,
            "file_name": "local_audio.mp3",
            },
        purpose="audio"
    )
signed_url = client.files.get_signed_url(file_id=uploaded_audio.id)

transcription_response = client.audio.transcriptions.complete(
    model=model,
    file_url=signed_url.url,
    ## language="en"
)

print(transcription_response)
