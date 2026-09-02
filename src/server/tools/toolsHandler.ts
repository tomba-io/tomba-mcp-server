import type {
    CallToolRequest,
    CallToolResult,
} from "@modelcontextprotocol/sdk/types.js";
import { TombaMcpClient } from "../../client/mcpClient.js";
import {
    DomainSearchParamsSchema,
    EmailFinderParamsSchema,
    EmailVerifierParamsSchema,
    EmailEnrichmentParamsSchema,
    AuthorFinderParamsSchema,
    LinkedinFinderParamsSchema,
    PhoneFinderParamsSchema,
    PhoneValidatorParamsSchema,
    EmailCountParamsSchema,
    SimilarFinderParamsSchema,
    TechnologyFinderParamsSchema,
    CompaniesSearchParamsSchema,
    EmailSourcesParamsSchema,
    EmailFormatParamsSchema,
    DomainStatusParamsSchema,
    AutocompleteParamsSchema,
    LocationParamsSchema,
    PersonEnrichmentParamsSchema,
    CompanyEnrichmentParamsSchema,
    CombinedEnrichmentParamsSchema,
    ListFlagsParamsSchema,
    CreateFlagParamsSchema,
    ListLeadsParamsSchema,
    CreateLeadParamsSchema,
    ListKeysParamsSchema,
    GetLogsParamsSchema,
} from "../../types/index.js";
import {
    validateToolArguments,
    ValidationError,
} from "../../utils/validation.js";

export async function handleToolCall(
    request: CallToolRequest,
    client: TombaMcpClient,
): Promise<CallToolResult> {
    const { name, arguments: args } = request.params;

    try {
        switch (name) {
            case "domain_search":
                const searchParams = validateToolArguments(
                    DomainSearchParamsSchema,
                    args,
                    "domain_search",
                );
                const domainResult = await client.domainSearch(searchParams);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(domainResult, null, 2),
                        },
                    ],
                };

            case "email_finder":
                const finderParams = validateToolArguments(
                    EmailFinderParamsSchema,
                    args,
                    "email_finder",
                );
                const finderResult = await client.emailFinder(finderParams);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(finderResult, null, 2),
                        },
                    ],
                };

            case "email_verifier":
                const verifierParams = validateToolArguments(
                    EmailVerifierParamsSchema,
                    args,
                    "email_verifier",
                );
                const verifierResult =
                    await client.emailVerifier(verifierParams);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(verifierResult, null, 2),
                        },
                    ],
                };

            case "email_enrichment":
                const enrichmentParams = validateToolArguments(
                    EmailEnrichmentParamsSchema,
                    args,
                    "email_enrichment",
                );
                const enrichmentResult =
                    await client.emailEnrichment(enrichmentParams);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(enrichmentResult, null, 2),
                        },
                    ],
                };

            case "author_finder":
                const authorParams = validateToolArguments(
                    AuthorFinderParamsSchema,
                    args,
                    "author_finder",
                );
                const authorResult = await client.authorFinder(authorParams);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(authorResult, null, 2),
                        },
                    ],
                };

            case "linkedin_finder":
                const linkedinParams = validateToolArguments(
                    LinkedinFinderParamsSchema,
                    args,
                    "linkedin_finder",
                );
                const linkedinResult =
                    await client.linkedinFinder(linkedinParams);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(linkedinResult, null, 2),
                        },
                    ],
                };

            case "phone_finder":
                const phoneParams = validateToolArguments(
                    PhoneFinderParamsSchema,
                    args,
                    "phone_finder",
                );
                const phoneResult = await client.phoneFinder(phoneParams);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(phoneResult, null, 2),
                        },
                    ],
                };

            case "phone_validator":
                const validatorParams = validateToolArguments(
                    PhoneValidatorParamsSchema,
                    args,
                    "phone_validator",
                );
                const validatorResult =
                    await client.phoneValidator(validatorParams);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(validatorResult, null, 2),
                        },
                    ],
                };

            case "email_count":
                const countParams = validateToolArguments(
                    EmailCountParamsSchema,
                    args,
                    "email_count",
                );
                const countResult = await client.emailCount(countParams);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(countResult, null, 2),
                        },
                    ],
                };

            case "similar_finder":
                const similarParams = validateToolArguments(
                    SimilarFinderParamsSchema,
                    args,
                    "similar_finder",
                );
                const similarResult = await client.similarFinder(similarParams);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(similarResult, null, 2),
                        },
                    ],
                };

            case "technology_finder":
                const technologyParams = validateToolArguments(
                    TechnologyFinderParamsSchema,
                    args,
                    "technology_finder",
                );
                const technologyResult =
                    await client.technologyFinder(technologyParams);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(technologyResult, null, 2),
                        },
                    ],
                };

            case "companies_search":
                const companiesParams = validateToolArguments(
                    CompaniesSearchParamsSchema,
                    args,
                    "companies_search",
                );
                const companiesResult =
                    await client.companiesSearch(companiesParams);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(companiesResult, null, 2),
                        },
                    ],
                };

            case "email_sources":
                const sourcesParams = validateToolArguments(
                    EmailSourcesParamsSchema,
                    args,
                    "email_sources",
                );
                const sourcesResult = await client.emailSources(sourcesParams);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(sourcesResult, null, 2),
                        },
                    ],
                };

            case "email_format":
                const formatParams = validateToolArguments(
                    EmailFormatParamsSchema,
                    args,
                    "email_format",
                );
                const formatResult = await client.emailFormat(formatParams);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(formatResult, null, 2),
                        },
                    ],
                };

            case "domain_status":
                const statusParams = validateToolArguments(
                    DomainStatusParamsSchema,
                    args,
                    "domain_status",
                );
                const statusResult = await client.domainStatus(statusParams);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(statusResult, null, 2),
                        },
                    ],
                };

            case "autocomplete":
                const autocompleteParams = validateToolArguments(
                    AutocompleteParamsSchema,
                    args,
                    "autocomplete",
                );
                const autocompleteResult =
                    await client.autoComplete(autocompleteParams);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(autocompleteResult, null, 2),
                        },
                    ],
                };

            case "location":
                const locationParams = validateToolArguments(
                    LocationParamsSchema,
                    args,
                    "location",
                );
                const locationResult =
                    await client.getLocation(locationParams);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(locationResult, null, 2),
                        },
                    ],
                };

            case "person_enrichment":
                const personParams = validateToolArguments(
                    PersonEnrichmentParamsSchema,
                    args,
                    "person_enrichment",
                );
                const personResult =
                    await client.personEnrichment(personParams);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(personResult, null, 2),
                        },
                    ],
                };

            case "company_enrichment":
                const companyParams = validateToolArguments(
                    CompanyEnrichmentParamsSchema,
                    args,
                    "company_enrichment",
                );
                const companyResult =
                    await client.companyEnrichment(companyParams);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(companyResult, null, 2),
                        },
                    ],
                };

            case "combined_enrichment":
                const combinedParams = validateToolArguments(
                    CombinedEnrichmentParamsSchema,
                    args,
                    "combined_enrichment",
                );
                const combinedResult =
                    await client.combinedEnrichment(combinedParams);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(combinedResult, null, 2),
                        },
                    ],
                };

            case "account_info":
                const accountResult = await client.getAccount();
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(accountResult, null, 2),
                        },
                    ],
                };

            case "usage_info":
                const usageResult = await client.getUsage();
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(usageResult, null, 2),
                        },
                    ],
                };

            case "list_flags":
                const listFlagsParams = validateToolArguments(
                    ListFlagsParamsSchema,
                    args,
                    "list_flags",
                );
                const listFlagsResult = await client.listFlags(listFlagsParams);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(listFlagsResult, null, 2),
                        },
                    ],
                };

            case "create_flag":
                const createFlagParams = validateToolArguments(
                    CreateFlagParamsSchema,
                    args,
                    "create_flag",
                );
                const createFlagResult = await client.createFlag(createFlagParams);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(createFlagResult, null, 2),
                        },
                    ],
                };

            case "list_leads":
                const listLeadsParams = validateToolArguments(
                    ListLeadsParamsSchema,
                    args,
                    "list_leads",
                );
                const listLeadsResult = await client.listLeads(listLeadsParams);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(listLeadsResult, null, 2),
                        },
                    ],
                };

            case "create_lead":
                const createLeadParams = validateToolArguments(
                    CreateLeadParamsSchema,
                    args,
                    "create_lead",
                );
                const createLeadResult = await client.createLead(createLeadParams);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(createLeadResult, null, 2),
                        },
                    ],
                };

            case "list_keys":
                validateToolArguments(
                    ListKeysParamsSchema,
                    args,
                    "list_keys",
                );
                const listKeysResult = await client.listKeys();
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(listKeysResult, null, 2),
                        },
                    ],
                };

            case "get_logs":
                const getLogsParams = validateToolArguments(
                    GetLogsParamsSchema,
                    args,
                    "get_logs",
                );
                const getLogsResult = await client.getLogs(getLogsParams);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(getLogsResult, null, 2),
                        },
                    ],
                };

            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    } catch (error) {
        if (error instanceof ValidationError) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Validation Error: ${error.message}${
                            error.field ? ` (Field: ${error.field})` : ""
                        }`,
                    },
                ],
                isError: true,
            };
        }

        return {
            content: [
                {
                    type: "text",
                    text: `Error: ${
                        error instanceof Error ? error.message : "Unknown error"
                    }`,
                },
            ],
            isError: true,
        };
    }
}
