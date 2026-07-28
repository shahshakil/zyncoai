export type MarketingMetric = {
  key: string;
  label: string;
  value: number;
  suffix?: string;
  note?: string;
};

export type MarketingConnector = {
  id: string;
  name: string;
  category?: string;
  icon?: string | null;
  status?: "live" | "beta" | "coming_soon";
};

export type MarketingTemplate = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty?: "easy" | "medium" | "advanced";
  href?: string;
};

export type StoryboardFrame = {
  id: string;
  title: string;
  subtitle?: string;
  nodes: string[];
  outcomes: string[];
};

export type EnterpriseCapability = {
  id: string;
  title: string;
  description: string;
};

export type MarketingHomePayload = {
  metrics: MarketingMetric[];
  connectors: MarketingConnector[];
  templates: MarketingTemplate[];
  storyboard: StoryboardFrame[];
  enterpriseCapabilities: EnterpriseCapability[];
  proof: {
    headline: string;
    stats: { label: string; value: string }[];
    logos: string[];
  };
};
