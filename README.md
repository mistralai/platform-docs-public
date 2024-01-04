# Mistral AI LLM documentation

This folder contains the documentation of the Mistral LLM setup and APIs.


Please follow the following steps to ensure your changes can be deployed successfully.

### Set up 

You will need to install `pnpm` and `node` first. For example, if you are using Mac, You can install [Homebrew](https://brew.sh/) and then install `pnpm` and `node`:
```
brew install pnpm
brew install node
```

### Installation

```bash
pnpm install
```

### Local Development

```bash
pnpm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```bash
pnpm build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Troubleshoot 
- Make sure URLs start with `https://` or `http://`, otherwise, it will look for the relative paths in the repo. 
- Images can be saved in the [img](https://github.com/mistralai/platform-docs-public/tree/main/static/img) folder. Please reference the images with `/img/your_added_image.svg`. 


This documentation is built using [Docusaurus](https://docusaurus.io/).