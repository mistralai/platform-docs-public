# Mistral AI LLM documentation

This folder contains the documentation of the Mistral LLM setup and APIs.

Please follow the following steps to ensure your changes can be deployed
successfully.

## Cloning the Project

To clone the Mistral AI LLM project, including all necessary submodules, follow these steps:

1. **Clone the Repository**: Use the `--recurse-submodules` flag to ensure all submodules are cloned along with the main repository:

   ```bash
   git clone --recurse-submodules <repository-url>
   ```

2. **Navigate to the Project Directory**: After cloning, navigate into the project directory:

   ```bash
   cd <project-directory>
   ```

3. **Verify Submodules**: Ensure that all submodules are initialized and updated:
   ```bash
   git submodule update --init --recursive
   ```

Ensure that you commit any changes to submodules to keep the repository consistent.

## Project Setup

You will need to install `pnpm` **>= 9.8.0** and `node` **>= 20** first. For example, if you are using Mac, You can install [Homebrew](https://brew.sh/) and then install `pnpm` and `node`:

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


To build in autocompile mode, run the following command:
```bash
npm run dev
```

### Build

```bash
pnpm build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Cookbooks

You can add a cookbook in the docs by adding a cookbook object to the `cookbooks.config.json` file:

```json
{
   "path": "your/path/your-file-name.ipynb",
   "labels": {
      "integrations": [],
      "useCases": [
         "Your use case"
      ]
   },
   "availableInDocs": "True", 
   "title": "",
   "mainSection": {
      "featured": "False",
      "latest": "True"
   }
}
```

If the title is empty, the title will be extracted from the cookbook.

### Troubleshoot

- Make sure URLs start with `https://` or `http://`, otherwise, it will look for the relative paths in the repo.
- Images can be saved in the [img](https://github.com/mistralai/platform-docs-public/tree/main/static/img) folder. Please reference the images with `/img/your_added_image.svg`.
This documentation is built using [Docusaurus](https://docusaurus.io/).

# How to contribute?

Mistral AI is committed to open source software development and welcomes external contributions. Please head on to our [contribution guideline](https://docs.mistral.ai/guides/contribute/). 
