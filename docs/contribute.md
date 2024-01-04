# How to contribute

Thank you for your interest in contributing to Mistral AI. We appreciate your time and effort!

## Official docs

If you are interested in contributing to our [official docs](https://docs.mistral.ai/), please submit a PR at [https://github.com/mistralai/platform-docs-public](https://github.com/mistralai/platform-docs-public). 

Note: Please follow the following steps to ensure your changes can be deployed successfully.

### Set up 

You will need to install `pnpm` and `node` first. For example, if you are using Mac, You can install [Homebrew](https://brew.sh/) and then install `pnpm` and `node`:
```
brew install pnpm
brew install node
```

### Install project dependencies 

```bash
pnpm install
```

### Local Development

```bash
pnpm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server. Make sure the local browser accurately reflects your intended changes. 

### Build

```bash
pnpm build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service. Make sure everything compiles successfully in this step. This will be exactly how we build in production. 

### Troubleshoot 
- Make sure URLs starts with `https://` or `http://`, otherwise it will look for the relative paths in the repo. 
- Images can be saved in the [img](https://github.com/mistralai/platform-docs-public/tree/main/static/img) folder. Please reference the images with `/img/your_added_image.svg`. 

## Codebooks
Coming soon 

## Awesome List
Coming soon

## Discord

We are grateful to anyone who shares resources and assists us in addressing questions on our [Discord](https://discord.gg/mistralai) community.

