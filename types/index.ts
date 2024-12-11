export type Foundation = {
  internalId: string;
  stiftungsId: string;
  name: string;
  contact: {
    address: string[];
    phone: string[];
    fax: string[];
    emails: string[];
    urls: string[];
  };
  content: {
    title: string;
    lines: string[];
  }[];
  purpose?: string;
  score: number;
};

export type SearchResponse = {
  foundations: Foundation[];
  executionTime: number;
  totalVectors: number;
};
