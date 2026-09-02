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
    Sources,
    Format,
    Status,
    Location,
    Enrichment,
    Account,
    Usage,
    Flag,
    Leads,
    Keys,
    Logs,
} from "tomba";
import type {
    TombaAccount,
    UsageResponse,
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
    EmailSourcesParams,
    EmailFormatParams,
    DomainStatusParams,
    AutocompleteParams,
    LocationParams,
    PersonEnrichmentParams,
    CompanyEnrichmentParams,
    CombinedEnrichmentParams,
    ListFlagsParams,
    CreateFlagParams,
    ListLeadsParams,
    CreateLeadParams,
    GetLogsParams,
} from "../types";

export class TombaMcpClient {
    private client: TombaClient;
    private static readonly MAX_RETRIES = 3;
    private static readonly TIMEOUT_MS = 120_000;

    constructor(config: TombaConfig) {
        this.client = new TombaClient();
        this.client.setKey(config.apiKey);
        this.client.setSecret(config.secretKey);
    }

    private async withRetry<T>(fn: () => Promise<T>): Promise<T> {
        let lastError: unknown;
        for (let attempt = 0; attempt < TombaMcpClient.MAX_RETRIES; attempt++) {
            try {
                const result = await Promise.race([
                    fn(),
                    new Promise<never>((_, reject) =>
                        setTimeout(
                            () => reject(new Error("Request timed out after 120s")),
                            TombaMcpClient.TIMEOUT_MS,
                        ),
                    ),
                ]);
                return result;
            } catch (error: unknown) {
                lastError = error;
                const statusCode =
                    error instanceof Error && "statusCode" in error
                        ? (error as { statusCode: number }).statusCode
                        : undefined;
                const isRetryable =
                    statusCode === 429 ||
                    (statusCode !== undefined && statusCode >= 500);
                if (!isRetryable || attempt === TombaMcpClient.MAX_RETRIES - 1) {
                    throw error;
                }
                const delay = Math.pow(2, attempt) * 1000;
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
        throw lastError;
    }

    async domainSearch(
        params: DomainSearchParams,
    ): Promise<DomainSearchResponse> {
        try {
            const domain = new Domain(this.client);
            const requestParams: DomainSearchParams = {};

            if (params.domain) requestParams.domain = params.domain;
            if (params.company) requestParams.company = params.company;
            if (params.page) requestParams.page = params.page;
            if (params.limit) requestParams.limit = params.limit;
            if (params.country) requestParams.country = params.country;
            if (params.department) requestParams.department = params.department;

            const response = await this.withRetry(() =>
                domain.domainSearch(requestParams),
            );
            return response;
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
            const requestParams: EmailFinderParams = {};

            if (params.domain) requestParams.domain = params.domain;
            if (params.company) requestParams.company = params.company;
            if (params.fullName) requestParams.fullName = params.fullName;
            if (params.firstName) requestParams.firstName = params.firstName;
            if (params.lastName) requestParams.lastName = params.lastName;
            if (params.enrich_mobile !== undefined)
                requestParams.enrich_mobile = params.enrich_mobile;

            const response = await this.withRetry(() =>
                finder.emailFinder(requestParams),
            );
            return response;
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
            const requestParams: EmailVerifierParams = { email: params.email };
            if (params.enrich_mobile !== undefined)
                requestParams.enrich_mobile = params.enrich_mobile;
            const response = await this.withRetry(() =>
                verifier.emailVerifier(
                    requestParams.email,
                    requestParams.enrich_mobile,
                ),
            );
            return response;
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
            const requestParams: EmailEnrichmentParams = {
                email: params.email,
            };
            if (params.enrich_mobile !== undefined)
                requestParams.enrich_mobile = params.enrich_mobile;
            const response = await this.withRetry(() =>
                finder.emailEnrichment(
                    requestParams.email,
                    requestParams.enrich_mobile,
                ),
            );
            return response;
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
            const response = await this.withRetry(() =>
                finder.authorFinder(params.url),
            );
            return response;
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
            const requestParams: LinkedinFinderParams = { url: params.url };
            if (params.enrich_mobile !== undefined)
                requestParams.enrich_mobile = params.enrich_mobile;
            if (params.full !== undefined) requestParams.full = params.full;
            const response = await this.withRetry(() =>
                finder.linkedinFinder(
                    requestParams.url,
                    requestParams.enrich_mobile,
                    requestParams.full,
                ),
            );
            return response;
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
            const requestParams: PhoneFinderParams = {};

            if (params.email) requestParams.email = params.email;
            if (params.domain) requestParams.domain = params.domain;
            if (params.linkedin) requestParams.linkedin = params.linkedin;
            if (params.full !== undefined) requestParams.full = params.full;

            if (!params.email && !params.domain && !params.linkedin) {
                throw new Error(
                    "At least one parameter (email, domain, or linkedin) must be provided",
                );
            }

            const response = await this.withRetry(() =>
                phone.finder(requestParams),
            );
            return response;
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
            const response = (await this.withRetry(() =>
                phone.validator(params.phone),
            )) as PhoneResponse;
            return response;
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
            const response = await this.withRetry(() =>
                count.emailCount(params.domain),
            );
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
            const response = await this.withRetry(() =>
                similar.websites(params.domain),
            );
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
            const response = await this.withRetry(() =>
                technology.list(params.domain),
            );
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
            const response = await this.withRetry(() =>
                reveal.companiesSearch(requestParams),
            );
            return response;
        } catch (error) {
            throw new Error(
                `Companies search failed: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            );
        }
    }

    async emailSources(params: EmailSourcesParams): Promise<unknown> {
        try {
            const sources = new Sources(this.client);
            const response = await this.withRetry(() =>
                sources.emailSources(params.email),
            );
            return response;
        } catch (error) {
            throw new Error(
                `Email sources failed: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            );
        }
    }

    async emailFormat(params: EmailFormatParams): Promise<unknown> {
        try {
            const format = new Format(this.client);
            const response = await this.withRetry(() =>
                format.emailFormat(params.domain),
            );
            return response;
        } catch (error) {
            throw new Error(
                `Email format failed: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            );
        }
    }

    async domainStatus(params: DomainStatusParams): Promise<Record<string, unknown>> {
        try {
            const status = new Status(this.client);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const response = await this.withRetry(() =>
                status.domainStatus(params.domain),
            );
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return response;
        } catch (error) {
            throw new Error(
                `Domain status failed: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            );
        }
    }

    async autoComplete(params: AutocompleteParams): Promise<Record<string, unknown>> {
        try {
            const status = new Status(this.client);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const response = await this.withRetry(() =>
                status.autoComplete(params.query),
            );
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return response;
        } catch (error) {
            throw new Error(
                `Autocomplete failed: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            );
        }
    }

    async getLocation(params: LocationParams): Promise<Record<string, unknown>> {
        try {
            const location = new Location(this.client);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const response = await this.withRetry(() =>
                location.getLocation(params.domain),
            );
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return response;
        } catch (error) {
            throw new Error(
                `Location lookup failed: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            );
        }
    }

    async personEnrichment(params: PersonEnrichmentParams): Promise<Record<string, unknown>> {
        try {
            const enrichment = new Enrichment(this.client);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const response = await this.withRetry(() =>
                enrichment.person(params.email),
            );
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return response;
        } catch (error) {
            throw new Error(
                `Person enrichment failed: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            );
        }
    }

    async companyEnrichment(params: CompanyEnrichmentParams): Promise<Record<string, unknown>> {
        try {
            const enrichment = new Enrichment(this.client);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const response = await this.withRetry(() =>
                enrichment.company(params.domain),
            );
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return response;
        } catch (error) {
            throw new Error(
                `Company enrichment failed: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            );
        }
    }

    async combinedEnrichment(params: CombinedEnrichmentParams): Promise<Record<string, unknown>> {
        try {
            const enrichment = new Enrichment(this.client);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const response = await this.withRetry(() =>
                enrichment.combined(params.email),
            );
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return response;
        } catch (error) {
            throw new Error(
                `Combined enrichment failed: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            );
        }
    }

    async getAccount(): Promise<TombaAccount> {
        try {
            const account = new Account(this.client);
            const response = await this.withRetry<TombaAccount>(() =>
                account.getAccount(),
            );
            return response;
        } catch (error) {
            throw new Error(
                `Account info failed: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            );
        }
    }

    async getUsage(): Promise<UsageResponse> {
        try {
            const usage = new Usage(this.client);
            const response = await this.withRetry<UsageResponse>(() =>
                usage.getUsage(),
            );
            return response;
        } catch (error) {
            throw new Error(
                `Usage info failed: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            );
        }
    }

    async listFlags(params: ListFlagsParams): Promise<Record<string, unknown>> {
        try {
            const flag = new Flag(this.client);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const response = await this.withRetry(() =>
                flag.listFlags(params),
            );
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return response;
        } catch (error) {
            throw new Error(
                `List flags failed: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            );
        }
    }

    async createFlag(params: CreateFlagParams): Promise<Record<string, unknown>> {
        try {
            const flag = new Flag(this.client);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const response = await this.withRetry(() =>
                flag.createFlag(params as Parameters<typeof flag.createFlag>[0]),
            );
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return response;
        } catch (error) {
            throw new Error(
                `Create flag failed: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            );
        }
    }

    async listLeads(params: ListLeadsParams): Promise<Record<string, unknown>> {
        try {
            const leads = new Leads(this.client);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const response = await this.withRetry(() =>
                leads.listLeads(params),
            );
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return response;
        } catch (error) {
            throw new Error(
                `List leads failed: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            );
        }
    }

    async createLead(params: CreateLeadParams): Promise<Record<string, unknown>> {
        try {
            const leads = new Leads(this.client);
            const response = await this.withRetry(() =>
                leads.createLead(params),
            );
            return response as unknown as Record<string, unknown>;
        } catch (error) {
            throw new Error(
                `Create lead failed: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            );
        }
    }

    async listKeys(): Promise<Record<string, unknown>> {
        try {
            const keys = new Keys(this.client);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const response = await this.withRetry(() =>
                keys.getKeys(),
            );
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return response;
        } catch (error) {
            throw new Error(
                `List keys failed: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            );
        }
    }

    async getLogs(params: GetLogsParams): Promise<Record<string, unknown>> {
        try {
            const logs = new Logs(this.client);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const response = await this.withRetry(() =>
                logs.getLogs(params),
            );
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return response;
        } catch (error) {
            throw new Error(
                `Get logs failed: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            );
        }
    }
}
