-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."AdminLog" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AiOrchestratorLog" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "taskId" TEXT,

    CONSTRAINT "AiOrchestratorLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AiTask" (
    "id" TEXT NOT NULL,
    "data" JSONB,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnalyticsSummary" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "counts" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuthLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "teamId" TEXT,
    "action" TEXT NOT NULL,
    "ip" TEXT,
    "json" JSONB,
    "env" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Billing" (
    "id" TEXT NOT NULL,
    "teamId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "renewAt" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "plan" TEXT NOT NULL,

    CONSTRAINT "Billing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BillingLog" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "billingId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BillingLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Connector" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Connector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ConnectorCredential" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "connectorId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConnectorCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Embedding" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "vector" JSONB,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Embedding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EmbeddingLog" (
    "id" TEXT NOT NULL,
    "embeddingId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmbeddingLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FeatureFlag" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" BOOLEAN NOT NULL,
    "teamId" TEXT,
    "userId" TEXT,
    "json" JSONB,
    "env" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeatureFlag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FileProcessLog" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FileProcessLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FileRecord" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" INTEGER,
    "mimeType" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FileRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FlagLog" (
    "id" TEXT NOT NULL,
    "flagId" TEXT NOT NULL,
    "userId" TEXT,
    "teamId" TEXT,
    "action" TEXT NOT NULL,
    "env" JSONB,
    "json" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FlagLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."IngestError" (
    "id" TEXT NOT NULL,
    "ingestId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IngestError_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."IngestRecord" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IngestRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InternalMetrics" (
    "id" TEXT NOT NULL,
    "teamId" TEXT,
    "json" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InternalMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MarketplaceApp" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketplaceApp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MarketplaceEvent" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketplaceEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MarketplaceInstall" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketplaceInstall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MarketplaceReview" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketplaceReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MarketplaceVersion" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "changelog" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketplaceVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MonitorHealth" (
    "id" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MonitorHealth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MonitorInfra" (
    "id" TEXT NOT NULL,
    "usageCpu" DOUBLE PRECISION,
    "usageRam" DOUBLE PRECISION,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MonitorInfra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MonitorSystem" (
    "id" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "value" DOUBLE PRECISION,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MonitorSystem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NotificationLog" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "userId" TEXT,
    "type" TEXT NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NotificationStatus" (
    "id" TEXT NOT NULL,
    "logId" TEXT NOT NULL,
    "userId" TEXT,
    "status" TEXT NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlaygroundLog" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "request" JSONB,
    "response" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlaygroundLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RealtimeLog" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RealtimeLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SearchIndex" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "content" JSONB,
    "tags" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchIndex_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SearchLog" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "indexId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "teamId" TEXT,
    "token" TEXT NOT NULL,
    "json" JSONB,
    "env" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Subscription" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "billingId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "meta" JSONB,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "billingId" TEXT,
    "env" JSONB,
    "json" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Trigger" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "type" TEXT NOT NULL,
    "config" JSONB,

    CONSTRAINT "Trigger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "env" JSONB,
    "json" JSONB,
    "password" TEXT,
    "teamId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WebhookEvent" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WebhookLog" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "response" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Workflow" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "config" JSONB,
    "definitionId" TEXT,
    "steps" JSONB,
    "trigger" JSONB,
    "userId" TEXT,

    CONSTRAINT "Workflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WorkflowApproval" (
    "id" TEXT NOT NULL,
    "workflowRunId" TEXT NOT NULL,
    "stepIndex" INTEGER,
    "userId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workflowId" TEXT,

    CONSTRAINT "WorkflowApproval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WorkflowDefinition" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "steps" JSONB,
    "trigger" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WorkflowLoop" (
    "id" TEXT NOT NULL,
    "workflowRunId" TEXT NOT NULL,
    "workflowId" TEXT,
    "stepIndex" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkflowLoop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WorkflowRun" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "definitionId" TEXT,
    "userId" TEXT,
    "teamId" TEXT,
    "input" JSONB,
    "output" JSONB,
    "context" JSONB,
    "error" TEXT,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WorkflowSpec" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "spec" JSONB NOT NULL,

    CONSTRAINT "WorkflowSpec_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdminLog_teamId_idx" ON "public"."AdminLog"("teamId" ASC);

-- CreateIndex
CREATE INDEX "AnalyticsEvent_teamId_idx" ON "public"."AnalyticsEvent"("teamId" ASC);

-- CreateIndex
CREATE INDEX "AnalyticsSummary_teamId_idx" ON "public"."AnalyticsSummary"("teamId" ASC);

-- CreateIndex
CREATE INDEX "AuthLog_teamId_idx" ON "public"."AuthLog"("teamId" ASC);

-- CreateIndex
CREATE INDEX "AuthLog_userId_idx" ON "public"."AuthLog"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Billing_teamId_key" ON "public"."Billing"("teamId" ASC);

-- CreateIndex
CREATE INDEX "BillingLog_billingId_idx" ON "public"."BillingLog"("billingId" ASC);

-- CreateIndex
CREATE INDEX "BillingLog_teamId_idx" ON "public"."BillingLog"("teamId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Connector_key_key" ON "public"."Connector"("key" ASC);

-- CreateIndex
CREATE INDEX "ConnectorCredential_connectorId_idx" ON "public"."ConnectorCredential"("connectorId" ASC);

-- CreateIndex
CREATE INDEX "ConnectorCredential_teamId_idx" ON "public"."ConnectorCredential"("teamId" ASC);

-- CreateIndex
CREATE INDEX "Embedding_teamId_idx" ON "public"."Embedding"("teamId" ASC);

-- CreateIndex
CREATE INDEX "EmbeddingLog_embeddingId_idx" ON "public"."EmbeddingLog"("embeddingId" ASC);

-- CreateIndex
CREATE INDEX "FeatureFlag_teamId_idx" ON "public"."FeatureFlag"("teamId" ASC);

-- CreateIndex
CREATE INDEX "FeatureFlag_userId_idx" ON "public"."FeatureFlag"("userId" ASC);

-- CreateIndex
CREATE INDEX "FileProcessLog_fileId_idx" ON "public"."FileProcessLog"("fileId" ASC);

-- CreateIndex
CREATE INDEX "FileProcessLog_teamId_idx" ON "public"."FileProcessLog"("teamId" ASC);

-- CreateIndex
CREATE INDEX "FileRecord_teamId_idx" ON "public"."FileRecord"("teamId" ASC);

-- CreateIndex
CREATE INDEX "FlagLog_flagId_idx" ON "public"."FlagLog"("flagId" ASC);

-- CreateIndex
CREATE INDEX "FlagLog_teamId_idx" ON "public"."FlagLog"("teamId" ASC);

-- CreateIndex
CREATE INDEX "FlagLog_userId_idx" ON "public"."FlagLog"("userId" ASC);

-- CreateIndex
CREATE INDEX "IngestError_ingestId_idx" ON "public"."IngestError"("ingestId" ASC);

-- CreateIndex
CREATE INDEX "IngestRecord_teamId_idx" ON "public"."IngestRecord"("teamId" ASC);

-- CreateIndex
CREATE INDEX "InternalMetrics_teamId_idx" ON "public"."InternalMetrics"("teamId" ASC);

-- CreateIndex
CREATE INDEX "MarketplaceApp_teamId_idx" ON "public"."MarketplaceApp"("teamId" ASC);

-- CreateIndex
CREATE INDEX "MarketplaceEvent_appId_idx" ON "public"."MarketplaceEvent"("appId" ASC);

-- CreateIndex
CREATE INDEX "MarketplaceInstall_appId_idx" ON "public"."MarketplaceInstall"("appId" ASC);

-- CreateIndex
CREATE INDEX "MarketplaceInstall_teamId_idx" ON "public"."MarketplaceInstall"("teamId" ASC);

-- CreateIndex
CREATE INDEX "MarketplaceReview_appId_idx" ON "public"."MarketplaceReview"("appId" ASC);

-- CreateIndex
CREATE INDEX "MarketplaceVersion_appId_idx" ON "public"."MarketplaceVersion"("appId" ASC);

-- CreateIndex
CREATE INDEX "MonitorSystem_metric_idx" ON "public"."MonitorSystem"("metric" ASC);

-- CreateIndex
CREATE INDEX "NotificationLog_teamId_idx" ON "public"."NotificationLog"("teamId" ASC);

-- CreateIndex
CREATE INDEX "NotificationStatus_logId_idx" ON "public"."NotificationStatus"("logId" ASC);

-- CreateIndex
CREATE INDEX "PlaygroundLog_teamId_idx" ON "public"."PlaygroundLog"("teamId" ASC);

-- CreateIndex
CREATE INDEX "RealtimeLog_teamId_idx" ON "public"."RealtimeLog"("teamId" ASC);

-- CreateIndex
CREATE INDEX "SearchIndex_key_idx" ON "public"."SearchIndex"("key" ASC);

-- CreateIndex
CREATE INDEX "SearchIndex_teamId_idx" ON "public"."SearchIndex"("teamId" ASC);

-- CreateIndex
CREATE INDEX "SearchLog_indexId_idx" ON "public"."SearchLog"("indexId" ASC);

-- CreateIndex
CREATE INDEX "SearchLog_teamId_idx" ON "public"."SearchLog"("teamId" ASC);

-- CreateIndex
CREATE INDEX "Session_teamId_idx" ON "public"."Session"("teamId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "public"."Session"("token" ASC);

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "public"."Session"("userId" ASC);

-- CreateIndex
CREATE INDEX "Subscription_billingId_idx" ON "public"."Subscription"("billingId" ASC);

-- CreateIndex
CREATE INDEX "Subscription_teamId_idx" ON "public"."Subscription"("teamId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Team_billingId_key" ON "public"."Team"("billingId" ASC);

-- CreateIndex
CREATE INDEX "Trigger_workflowId_idx" ON "public"."Trigger"("workflowId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email" ASC);

-- CreateIndex
CREATE INDEX "User_teamId_idx" ON "public"."User"("teamId" ASC);

-- CreateIndex
CREATE INDEX "WebhookEvent_teamId_idx" ON "public"."WebhookEvent"("teamId" ASC);

-- CreateIndex
CREATE INDEX "WebhookLog_eventId_idx" ON "public"."WebhookLog"("eventId" ASC);

-- CreateIndex
CREATE INDEX "WebhookLog_teamId_idx" ON "public"."WebhookLog"("teamId" ASC);

-- CreateIndex
CREATE INDEX "Workflow_teamId_idx" ON "public"."Workflow"("teamId" ASC);

-- CreateIndex
CREATE INDEX "WorkflowApproval_workflowRunId_idx" ON "public"."WorkflowApproval"("workflowRunId" ASC);

-- CreateIndex
CREATE INDEX "WorkflowDefinition_teamId_idx" ON "public"."WorkflowDefinition"("teamId" ASC);

-- CreateIndex
CREATE INDEX "WorkflowLoop_workflowRunId_idx" ON "public"."WorkflowLoop"("workflowRunId" ASC);

-- CreateIndex
CREATE INDEX "WorkflowRun_teamId_idx" ON "public"."WorkflowRun"("teamId" ASC);

-- CreateIndex
CREATE INDEX "WorkflowRun_userId_idx" ON "public"."WorkflowRun"("userId" ASC);

-- CreateIndex
CREATE INDEX "WorkflowRun_workflowId_idx" ON "public"."WorkflowRun"("workflowId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowSpec_teamId_name_key" ON "public"."WorkflowSpec"("teamId" ASC, "name" ASC);

-- AddForeignKey
ALTER TABLE "public"."AiOrchestratorLog" ADD CONSTRAINT "AiOrchestratorLog_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."AiTask"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuthLog" ADD CONSTRAINT "AuthLog_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuthLog" ADD CONSTRAINT "AuthLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BillingLog" ADD CONSTRAINT "BillingLog_billingId_fkey" FOREIGN KEY ("billingId") REFERENCES "public"."Billing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConnectorCredential" ADD CONSTRAINT "ConnectorCredential_connectorId_fkey" FOREIGN KEY ("connectorId") REFERENCES "public"."Connector"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EmbeddingLog" ADD CONSTRAINT "EmbeddingLog_embeddingId_fkey" FOREIGN KEY ("embeddingId") REFERENCES "public"."Embedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FeatureFlag" ADD CONSTRAINT "FeatureFlag_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FeatureFlag" ADD CONSTRAINT "FeatureFlag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FileProcessLog" ADD CONSTRAINT "FileProcessLog_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "public"."FileRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FlagLog" ADD CONSTRAINT "FlagLog_flagId_fkey" FOREIGN KEY ("flagId") REFERENCES "public"."FeatureFlag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FlagLog" ADD CONSTRAINT "FlagLog_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FlagLog" ADD CONSTRAINT "FlagLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IngestError" ADD CONSTRAINT "IngestError_ingestId_fkey" FOREIGN KEY ("ingestId") REFERENCES "public"."IngestRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MarketplaceEvent" ADD CONSTRAINT "MarketplaceEvent_appId_fkey" FOREIGN KEY ("appId") REFERENCES "public"."MarketplaceApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MarketplaceInstall" ADD CONSTRAINT "MarketplaceInstall_appId_fkey" FOREIGN KEY ("appId") REFERENCES "public"."MarketplaceApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MarketplaceReview" ADD CONSTRAINT "MarketplaceReview_appId_fkey" FOREIGN KEY ("appId") REFERENCES "public"."MarketplaceApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MarketplaceVersion" ADD CONSTRAINT "MarketplaceVersion_appId_fkey" FOREIGN KEY ("appId") REFERENCES "public"."MarketplaceApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NotificationStatus" ADD CONSTRAINT "NotificationStatus_logId_fkey" FOREIGN KEY ("logId") REFERENCES "public"."NotificationLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SearchLog" ADD CONSTRAINT "SearchLog_indexId_fkey" FOREIGN KEY ("indexId") REFERENCES "public"."SearchIndex"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_billingId_fkey" FOREIGN KEY ("billingId") REFERENCES "public"."Billing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Team" ADD CONSTRAINT "Team_billingId_fkey" FOREIGN KEY ("billingId") REFERENCES "public"."Billing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Trigger" ADD CONSTRAINT "Trigger_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "public"."Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WebhookLog" ADD CONSTRAINT "WebhookLog_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."WebhookEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Workflow" ADD CONSTRAINT "Workflow_definitionId_fkey" FOREIGN KEY ("definitionId") REFERENCES "public"."WorkflowDefinition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Workflow" ADD CONSTRAINT "Workflow_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Workflow" ADD CONSTRAINT "Workflow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkflowApproval" ADD CONSTRAINT "WorkflowApproval_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "public"."Workflow"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkflowApproval" ADD CONSTRAINT "WorkflowApproval_workflowRunId_fkey" FOREIGN KEY ("workflowRunId") REFERENCES "public"."WorkflowRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkflowLoop" ADD CONSTRAINT "WorkflowLoop_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "public"."Workflow"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkflowLoop" ADD CONSTRAINT "WorkflowLoop_workflowRunId_fkey" FOREIGN KEY ("workflowRunId") REFERENCES "public"."WorkflowRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkflowRun" ADD CONSTRAINT "WorkflowRun_definitionId_fkey" FOREIGN KEY ("definitionId") REFERENCES "public"."WorkflowDefinition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkflowRun" ADD CONSTRAINT "WorkflowRun_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkflowRun" ADD CONSTRAINT "WorkflowRun_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkflowRun" ADD CONSTRAINT "WorkflowRun_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "public"."Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

