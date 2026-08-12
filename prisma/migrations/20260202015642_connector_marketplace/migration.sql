-- CreateTable
CREATE TABLE "ConnectorVersion" (
    "id" TEXT NOT NULL,
    "connectorId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "manifestJson" JSONB NOT NULL,
    "isDeprecated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConnectorVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamConnector" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "connectorId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'enabled',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamConnector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConnectorSecret" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "connectorId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "valueEnc" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConnectorSecret_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ConnectorVersion_connectorId_idx" ON "ConnectorVersion"("connectorId");

-- CreateIndex
CREATE UNIQUE INDEX "ConnectorVersion_connectorId_version_key" ON "ConnectorVersion"("connectorId", "version");

-- CreateIndex
CREATE INDEX "TeamConnector_teamId_idx" ON "TeamConnector"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamConnector_teamId_connectorId_key" ON "TeamConnector"("teamId", "connectorId");

-- CreateIndex
CREATE INDEX "ConnectorSecret_teamId_idx" ON "ConnectorSecret"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "ConnectorSecret_teamId_connectorId_key_key" ON "ConnectorSecret"("teamId", "connectorId", "key");

-- AddForeignKey
ALTER TABLE "ConnectorVersion" ADD CONSTRAINT "ConnectorVersion_connectorId_fkey" FOREIGN KEY ("connectorId") REFERENCES "Connector"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamConnector" ADD CONSTRAINT "TeamConnector_connectorId_fkey" FOREIGN KEY ("connectorId") REFERENCES "Connector"("id") ON DELETE CASCADE ON UPDATE CASCADE;
