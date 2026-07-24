# Offline transcription snippets

Generated from `src/content/en/docs/studio-api/audio/speech_to_text/offline_transcription`.

## Regenerate

```bash
pnpm snippets:offline-transcription
```

## Local smoke test

Checks that generated snippets use the current transcription model, print their result for manual inspection, and compile where possible.

```bash
pnpm test:offline-transcription-snippets
```

## Manual API test

Run a snippet group in a temporary sandbox. By default, the runner downloads the Obama sample as `audio.mp3` inside the sandbox and rewrites placeholder paths to that file. Pass `--audio-file path/to/audio.mp3` to use your own file instead.

```bash
MISTRAL_API_KEY=... pnpm test:script passing-transcription-audio-url-tab-basic-tab --python
MISTRAL_API_KEY=... pnpm test:script passing-transcription-audio-file-tab-basic-tab --python
MISTRAL_API_KEY=... pnpm test:script passing-transcription-audio-file-tab-basic-tab --python --audio-file ./my-audio.mp3
MISTRAL_API_KEY=... pnpm test:script passing-transcription-audio-url-tab-basic-tab --all
```

You can also run a manually added file directly without editing the manifest:

```bash
MISTRAL_API_KEY=... pnpm test:script tests/snippets/offline-transcription/my-test.py
MISTRAL_API_KEY=... pnpm test:script my-test.ts
MISTRAL_API_KEY=... pnpm test:script my-test.sh
```
