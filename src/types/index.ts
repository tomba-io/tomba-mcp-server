export interface TombaConfig {
  apiKey: string;
  secretKey: string;
}

export interface DomainSearchParams {
  domain: string;
  limit?: number;
  page?: number;
  department?: string;
  country?: string;
}

export interface EmailFinderParams {
  domain: string;
  firstName: string;
  lastName: string;
}

export interface EmailVerifierParams {
  email: string;
}

export interface EmailEnrichmentParams {
  email: string;
}

export interface AuthorFinderParams {
  url: string;
}

export interface LinkedinFinderParams {
  url: string;
}

export interface PhoneFinderParams {
  email?: string;
  domain?: string;
  linkedin?: string;
}

export interface PhoneValidatorParams {
  phone: string;
}
