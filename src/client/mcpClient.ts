import { TombaClient, Finder, Domain, Phone, Verifier } from "tomba";
import type {
  VerifierResponse,
  PhoneResponse,
  DomainSearchResponse,
  FinderResponse,
} from "tomba";
import {
  TombaConfig,
  DomainSearchParams,
  EmailFinderParams,
  EmailVerifierParams,
  EmailEnrichmentParams,
  AuthorFinderParams,
  LinkedinFinderParams,
  PhoneFinderParams,
  PhoneValidatorParams,
} from "../types";

export class TombaMcpClient {
  private client: TombaClient;

  constructor(config: TombaConfig) {
    this.client = new TombaClient();
    this.client.setKey(config.apiKey);
    this.client.setSecret(config.secretKey);
  }

  async domainSearch(
    params: DomainSearchParams
  ): Promise<DomainSearchResponse> {
    try {
      const domain = new Domain(this.client);
      const response = await domain.domainSearch(
        params.domain,
        params.page?.toString(),
        params.limit?.toString(),
        params.department,
        params.country
      );
      return response as DomainSearchResponse;
    } catch (error) {
      throw new Error(
        `Domain search failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async emailFinder(params: EmailFinderParams): Promise<FinderResponse> {
    try {
      const finder = new Finder(this.client);
      const response = await finder.emailFinder(
        params.domain,
        params.firstName,
        params.lastName
      );
      return response as FinderResponse;
    } catch (error) {
      throw new Error(
        `Email finder failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async emailVerifier(params: EmailVerifierParams): Promise<VerifierResponse> {
    try {
      const verifier = new Verifier(this.client);
      const response = await verifier.emailVerifier(params.email);
      return response as VerifierResponse;
    } catch (error) {
      throw new Error(
        `Email verification failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async emailEnrichment(
    params: EmailEnrichmentParams
  ): Promise<FinderResponse> {
    try {
      const finder = new Finder(this.client);
      const response = await finder.emailEnrichment(params.email);
      return response as FinderResponse;
    } catch (error) {
      throw new Error(
        `Email enrichment failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async authorFinder(params: AuthorFinderParams): Promise<FinderResponse> {
    try {
      const finder = new Finder(this.client);
      const response = await finder.authorFinder(params.url);
      return response as FinderResponse;
    } catch (error) {
      throw new Error(
        `Author finder failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async linkedinFinder(params: LinkedinFinderParams): Promise<FinderResponse> {
    try {
      const finder = new Finder(this.client);
      const response = await finder.linkedinFinder(params.url);
      return response as FinderResponse;
    } catch (error) {
      throw new Error(
        `LinkedIn finder failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async phoneFinder(params: PhoneFinderParams): Promise<PhoneResponse> {
    try {
      const phone = new Phone(this.client);
      let response;
      if (params.email) {
        response = await phone.finder({ email: params.email });
      } else if (params.domain) {
        response = await phone.finder({ domain: params.domain });
      } else if (params.linkedin) {
        response = await phone.finder({ linkedin: params.linkedin });
      } else {
        throw new Error(
          "At least one parameter (email, domain, or linkedin) must be provided"
        );
      }
      return response as PhoneResponse;
    } catch (error) {
      throw new Error(
        `Phone finder failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async phoneValidator(params: PhoneValidatorParams): Promise<PhoneResponse> {
    try {
      const phone = new Phone(this.client);
      const response = await phone.validator(params.phone);
      return response as PhoneResponse;
    } catch (error) {
      throw new Error(
        `Phone validation failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
