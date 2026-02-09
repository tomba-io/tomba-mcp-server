import {
    TombaClient,
    Finder,
    Domain,
    Phone,
    Verifier,
    Count,
    Similar,
    Technology,
    Reveal,
} from "tomba";
import type {
    VerifierResponse,
    PhoneResponse,
    DomainSearchResponse,
    FinderResponse,
    SimilarResponse,
    TechnologyResponse,
    EmailCountResponse,
    CompaniesSearchRequest,
    CompaniesSearchResponse,
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
    EmailCountParams,
    SimilarFinderParams,
    TechnologyFinderParams,
} from "../types";

export class TombaMcpClient {
    private client: TombaClient;

    constructor(config: TombaConfig) {
        this.client = new TombaClient();
        this.client.setKey(config.apiKey);
        this.client.setSecret(config.secretKey);
    }

    async domainSearch(
        params: DomainSearchParams,
    ): Promise<DomainSearchResponse> {
        try {
            const domain = new Domain(this.client);
            const requestParams: any = {};

            if (params.domain) requestParams.domain = params.domain;
            if (params.company) requestParams.company = params.company;
            if (params.page) requestParams.page = params.page;
            if (params.limit) requestParams.limit = params.limit;
            if (params.country) requestParams.country = params.country;
            if (params.department) requestParams.department = params.department;

            const response = await domain.domainSearch(requestParams);
            return response as DomainSearchResponse;
        } catch (error) {
            throw new Error(
                `Domain search failed: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            );
        }
    }

    async emailFinder(params: EmailFinderParams): Promise<FinderResponse> {
        try {
            const finder = new Finder(this.client);
            const requestParams: any = {};

            if (params.domain) requestParams.domain = params.domain;
            if (params.company) requestParams.company = params.company;
            if (params.fullName) requestParams.full_name = params.fullName;
            if (params.firstName) requestParams.first_name = params.firstName;
            if (params.lastName) requestParams.last_name = params.lastName;
            if (params.enrich_mobile !== undefined)
                requestParams.enrich_mobile = params.enrich_mobile;

            const response = await finder.emailFinder(requestParams);
            return response as FinderResponse;
        } catch (error) {
            throw new Error(
                `Email finder failed: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            );
        }
    }

    async emailVerifier(
        params: EmailVerifierParams,
    ): Promise<VerifierResponse> {
        try {
            const verifier = new Verifier(this.client);
            const requestParams: any = { email: params.email };
            if (params.enrich_mobile !== undefined)
                requestParams.enrich_mobile = params.enrich_mobile;
            const response = await verifier.emailVerifier(requestParams);
            return response as VerifierResponse;
        } catch (error) {
            throw new Error(
                `Email verification failed: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            );
        }
    }

    async emailEnrichment(
        params: EmailEnrichmentParams,
    ): Promise<FinderResponse> {
        try {
            const finder = new Finder(this.client);
            const requestParams: any = { email: params.email };
            if (params.enrich_mobile !== undefined)
                requestParams.enrich_mobile = params.enrich_mobile;
            const response = await finder.emailEnrichment(requestParams);
            return response as FinderResponse;
        } catch (error) {
            throw new Error(
                `Email enrichment failed: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
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
                }`,
            );
        }
    }

    async linkedinFinder(
        params: LinkedinFinderParams,
    ): Promise<FinderResponse> {
        try {
            const finder = new Finder(this.client);
            const requestParams: any = { url: params.url };
            if (params.enrich_mobile !== undefined)
                requestParams.enrich_mobile = params.enrich_mobile;
            const response = await finder.linkedinFinder(requestParams);
            return response as FinderResponse;
        } catch (error) {
            throw new Error(
                `LinkedIn finder failed: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            );
        }
    }

    async phoneFinder(params: PhoneFinderParams): Promise<PhoneResponse> {
        try {
            const phone = new Phone(this.client);
            const requestParams: any = {};

            if (params.email) requestParams.email = params.email;
            if (params.domain) requestParams.domain = params.domain;
            if (params.linkedin) requestParams.linkedin = params.linkedin;
            if (params.full !== undefined) requestParams.full = params.full;

            if (!params.email && !params.domain && !params.linkedin) {
                throw new Error(
                    "At least one parameter (email, domain, or linkedin) must be provided",
                );
            }

            const response = await phone.finder(requestParams);
            return response as PhoneResponse;
        } catch (error) {
            throw new Error(
                `Phone finder failed: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
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
                }`,
            );
        }
    }

    async emailCount(params: EmailCountParams): Promise<EmailCountResponse> {
        try {
            const count = new Count(this.client);
            const response = await count.emailCount(params.domain);
            return response;
        } catch (error) {
            throw new Error(
                `Email count failed: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            );
        }
    }

    async similarFinder(params: SimilarFinderParams): Promise<SimilarResponse> {
        try {
            const similar = new Similar(this.client);
            const response = await similar.websites(params.domain);
            return response;
        } catch (error) {
            throw new Error(
                `Similar finder failed: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            );
        }
    }

    async technologyFinder(
        params: TechnologyFinderParams,
    ): Promise<TechnologyResponse> {
        try {
            const technology = new Technology(this.client);
            const response = await technology.list(params.domain);
            return response;
        } catch (error) {
            throw new Error(
                `Technology finder failed: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            );
        }
    }

    async companiesSearch(
        params: CompaniesSearchRequest,
    ): Promise<CompaniesSearchResponse> {
        try {
            const reveal = new Reveal(this.client);
            const requestParams = {
                filters: params.filters,
                page: params.page,
            };
            const response = await reveal.companiesSearch(requestParams);
            return response as CompaniesSearchResponse;
        } catch (error) {
            throw new Error(
                `Companies search failed: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            );
        }
    }
}
