curl --location 'https://api.mistral.ai/v1/audio/transcriptions' \
  --header "x-api-key: $MISTRAL_API_KEY" \
  --form 'file=@"/path/to/file/audio.mp3"' \
  --form 'model="voxtral-mini-latest"'
