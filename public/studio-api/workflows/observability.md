---
id: observability
title: Observability
sidebar_position: 6
---

# Workflow observability

This guide covers how worker telemetry (logs, traces, and metrics) is exported, and how to use OpenTelemetry traces for execution-level diagnostics.

<SectionTab as="h1" sectionId="telemetry-setup">Telemetry setup</SectionTab>

By default, the worker exports OpenTelemetry **logs, traces, and metrics** to Mistral's hosted observability platform. No setup is required: telemetry is authenticated with your Mistral API key and sent to Mistral's telemetry endpoint. This is what makes your workflow logs and traces visible directly in Studio, on the [execution page](https://console.mistral.ai/build/workflows/executions).

You can also send telemetry to your own observability stack or turn it off. See **Configuring telemetry export** at the end of this page.

<SectionTab as="h1" sectionId="traces-opentelemetry">Traces (OpenTelemetry)</SectionTab>

Traces capture execution details (spans, timings, errors) and are optimized for debugging and performance analysis. They are independent from custom task events.

Execution logs are also available in Studio. Open <AppLink href="https://console.mistral.ai/build/workflows/executions" app="studio" path={["Workflows", "Executions"]} /> and select an execution to inspect its logs on the execution page.

<SectionTab as="h2" variant="secondary" sectionId="activity-observability">Activity observability</SectionTab>

Activities automatically generate spans. Use the `name` parameter to make them more readable:

<Tabs>
  <TabItem value="python" label="Python">

```python
@workflows.activity(name="Processing customer emails")
async def process_emails(params: ActivityParams) -> ActivityResult:
    # Your activity code
```

  </TabItem>
</Tabs>

<SectionTab as="h2" variant="secondary" sectionId="trace-sampling">Trace sampling</SectionTab>

By default, all traces are exported (the worker samples at a 100% rate). To control sampling, pass a `traceparent` header at your workflow entry point (or API edge): the worker uses a parent-based sampler, so it honors the upstream sampling decision. This lets you force sampling on or off and propagate the parent trace consistently.

<SectionTab as="h2" variant="secondary" sectionId="fetching-workflow-traces">Fetching workflow traces</SectionTab>

Three methods are available to retrieve trace data for a given execution:

- **`get_workflow_execution_trace_otel()`**: Returns the raw OpenTelemetry trace data (spans with timings, attributes, and parent-child relationships). Use this to feed traces into your own observability backend (Jaeger, Grafana Tempo, etc.).
- **`get_workflow_execution_trace_summary()`**: Returns a high-level summary of the execution (total duration, activity count, error count). Useful for dashboards and quick status checks.
- **`get_workflow_execution_trace_events()`**: Returns a chronological list of events in the execution. Set `include_internal_events=False` to filter out platform-internal events and see only your workflow and activity events.

<Tabs>
  <TabItem value="python" label="Python">

```python
from mistralai.client import Mistral

client = Mistral(api_key="your_api_key")

# Get raw OpenTelemetry trace data (spans, timings, attributes)
trace = client.workflows.executions.get_workflow_execution_trace_otel(
    execution_id=execution_id,
)

# Get high-level summary (duration, activity count, errors)
summary = client.workflows.executions.get_workflow_execution_trace_summary(
    execution_id=execution_id,
)

# Get chronological event list
events = client.workflows.executions.get_workflow_execution_trace_events(
    execution_id=execution_id,
    include_internal_events=False,  # Hide system events
)
```

  </TabItem>
</Tabs>

<SectionTab as="h2" variant="secondary" sectionId="fetching-workflow-logs">Fetching workflow logs</SectionTab>

Execution logs (the same ones shown in Studio) can also be retrieved programmatically:

- **`get_workflow_execution_logs()`**: Returns a page of log records for an execution. Filter with `run_id`, `activity_id`, and a time range (`after`, `before`), choose the first-page sort with `order` (`asc` or `desc`), and paginate with `cursor` and `limit`.
- **`stream_workflow_execution_logs()`**: Streams log records live over Server-Sent Events (SSE).

<Tabs>
  <TabItem value="python" label="Python">

```python
# Get the first page of execution logs (oldest first)
logs = client.workflows.executions.get_workflow_execution_logs(
    execution_id=execution_id,
    order="asc",
    limit=50,
)

# Fetch the next page using the returned cursor
if logs.next_cursor:
    next_page = client.workflows.executions.get_workflow_execution_logs(
        execution_id=execution_id,
        cursor=logs.next_cursor,
    )
```

  </TabItem>
</Tabs>

<SectionTab as="h1" sectionId="configuring-telemetry-export">Configuring telemetry export</SectionTab>

By default, every signal is exported to Mistral (see the **Telemetry setup** section above). You can override individual signals to your own OTLP endpoint, route everything to one endpoint, or disable export entirely.

:::warning
If you redirect the **logs** or **traces** signal to a custom endpoint (or disable it), that data is no longer sent to Mistral. It will not be stored on the Mistral observability platform and will not be visible in Studio.
:::

<SectionTab as="h2" variant="secondary" sectionId="using-your-own-otel-endpoint">Using your own OTEL endpoint</SectionTab>

To send worker telemetry to your own observability stack, point one or more signals at your own OTLP endpoint. Each signal is routed independently:

| Environment variable | Signal |
| --- | --- |
| `OTEL_TRACES_ENDPOINT` | Traces |
| `OTEL_METRICS_ENDPOINT` | Metrics |
| `OTEL_LOGS_ENDPOINT` | Logs |

Provide the **base** OTLP HTTP endpoint (for example `https://otel.example.com`). The worker appends the standard signal path (`/v1/traces`, `/v1/metrics`, or `/v1/logs`) automatically.

Signals you don't override keep flowing to Mistral, so they stay visible in Studio. When you set a custom endpoint, the worker no longer attaches your Mistral API key for that signal, so you authenticate it yourself.

To authenticate a custom endpoint, use the **signal-specific** OTLP header variable (`OTEL_EXPORTER_OTLP_TRACES_HEADERS`, `OTEL_EXPORTER_OTLP_METRICS_HEADERS`, or `OTEL_EXPORTER_OTLP_LOGS_HEADERS`). For example, to send only metrics to your own stack while keeping logs and traces in Studio:

```bash
OTEL_METRICS_ENDPOINT=https://otel.example.com
OTEL_EXPORTER_OTLP_METRICS_HEADERS=Authorization=Bearer <your-token>
```

:::warning
Avoid the generic `OTEL_EXPORTER_OTLP_HEADERS` here: it applies to **every** signal, including those still exporting to Mistral. The worker already uses that variable internally to attach your Mistral API key, so setting it yourself can leak your token to a custom endpoint or clobber the Mistral auth. Always scope custom-endpoint headers to the signal you are overriding.
:::

To route **all** signals to a single endpoint, set `OTEL_ENDPOINT`. This sends traces, metrics, and logs to that one endpoint and attaches no Mistral authentication. Use the per-signal variables above when you need different destinations or want to keep some signals in Studio.

<SectionTab as="h2" variant="secondary" sectionId="disabling-telemetry-export">Disabling telemetry export</SectionTab>

You can disable export entirely or per signal:

| Environment variable | Effect |
| --- | --- |
| `OTEL_ENABLED=false` | Disables all telemetry (logs, traces, metrics) |
| `MISTRAL_WORKFLOWS_OTEL_TRACES_EXPORT=false` | Disables trace export only |
| `MISTRAL_WORKFLOWS_OTEL_METRICS_EXPORT=false` | Disables metrics export only |
| `MISTRAL_WORKFLOWS_OTEL_LOGS_EXPORT=false` | Disables log export only |

:::info
Disabling trace export still creates spans in-process for context propagation and log/trace correlation. Only the OTLP export is stopped.
:::