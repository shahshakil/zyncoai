export type ConnectorManifest = {
  id: string;          // "gmail"
  name: string;        // "Gmail"
  version: string;     // "1.0.0"
  auth: "apikey" | "oauth2" | "none";
  actions: { key: string; name: string }[];
  triggers: { key: string; name: string }[];
};

const manifests: ConnectorManifest[] = [];

export function registerConnector(m: ConnectorManifest) {
  manifests.push(m);
}

export function listConnectors() {
  return manifests;
}
