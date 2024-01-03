import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Deploy with SkyPilot

[SkyPilot](https://skypilot.readthedocs.io/en/latest/) is a framework for running LLMs, AI, and batch jobs on any cloud, offering maximum cost savings, highest GPU availability, and managed execution.

We provide an example SkyPilot config that deploys our models.

## SkyPilot Configuration

After [installing SkyPilot](https://skypilot.readthedocs.io/en/latest/getting-started/installation.html), you need to create a configuration file that tells SkyPilot how and where to deploy your inference server, using our pre-built docker container:
<Tabs>
  <TabItem value="mistral7b" label="Mistral-7B" default>

```yaml
resources: 
  cloud: ${CLOUD_PROVIDER}
  accelerators: A10G:1
  ports: 
    - 8000

run: |
  docker run --gpus all -p 8000:8000 ghcr.io/mistralai/mistral-src/vllm:latest \
                   --host 0.0.0.0 \
                   --model mistralai/Mistral-7B-Instruct-v0.2 \
                   --tensor-parallel-size 1
```

  </TabItem>
  <TabItem value="mixtral8x7b" label="Mixtral-8X7B">

```yaml
resources: 
  cloud: ${CLOUD_PROVIDER}
  accelerators: A100-80GB:2
  ports: 
    - 8000

run: |
  docker run --gpus all -p 8000:8000 ghcr.io/mistralai/mistral-src/vllm:latest \
                   --host 0.0.0.0 \
                   --model mistralai/Mixtral-8x7B-Instruct-v0.1 \
                   --tensor-parallel-size 2
```

  </TabItem>
</Tabs>
Once these environment variables are set, you can use `sky launch` to launch the inference server with the name `mistral-7b`:

```bash
sky launch -c mistral-7b mistral-7b-v0.1.yaml --region us-east-1
```

:::caution

When deployed that way, the model will be accessible to the whole world. You **must** secure it, either by exposing it exclusively on your private network (change the `--host` Docker option for that), by adding a load-balancer with an authentication mechanism in front of it, or by configuring your instance networking properly.

:::

### Test it out!

To easily retrieve the IP address of the deployed `mistral-7b` cluster you can use:

```bash
sky status --ip mistral-7b
```

You can then use curl to send a completion request:

```
IP=$(sky status --ip cluster-name)

curl http://$IP:8000/v1/completions \
  -H "Content-Type: application/json" \
  -d '{
      "model": "mistralai/Mistral-7B-v0.1",
      "prompt": "My favourite condiment is",
      "max_tokens": 25
  }'
```


## Usage Quotas

Many cloud providers require you to explicitly request access to powerful GPU instances. Read [SkyPilot's guide](https://skypilot.readthedocs.io/en/latest/cloud-setup/quota.html) on how to do this.
