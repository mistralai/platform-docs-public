import os
from mistralai.client import Mistral

api_key = os.environ["MISTRAL_API_KEY"]
model = "voxtral-mini-latest"

client = Mistral(api_key=api_key)

transcription_response = client.audio.transcriptions.complete(
    model=model,
    file_url="https://docs.mistral.ai/audio/obama.mp3",
    context_bias=[
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
)

print(transcription_response)
