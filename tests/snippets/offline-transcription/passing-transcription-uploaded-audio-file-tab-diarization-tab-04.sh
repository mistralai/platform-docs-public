curl --location 'https://api.mistral.ai/v1/audio/transcriptions' \
    --header "x-api-key: $MISTRAL_API_KEY" \
    --form 'file_url="<signed_url>"' \
    --form 'model="voxtral-mini-latest"' \
    --form 'diarize=true' \
    --form 'timestamp_granularities="segment"'
