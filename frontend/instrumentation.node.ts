import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { LoggerProvider, SimpleLogRecordProcessor } from "@opentelemetry/sdk-logs";

const exporter = new OTLPLogExporter({
  url: "https://us.i.posthog.com/i/v1/logs",
  headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_POSTHOG_KEY}` },
});

const loggerProvider = new LoggerProvider({
  resource: resourceFromAttributes({ "service.name": "zyncoai-frontend" }),
  processors: [new SimpleLogRecordProcessor({ exporter })],
});

(globalThis as any).__posthogLogger = loggerProvider.getLogger("zyncoai-frontend");
