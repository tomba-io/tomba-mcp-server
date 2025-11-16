import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    ListResourcesRequestSchema,
    ReadResourceRequestSchema,
    ListPromptsRequestSchema,
    GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";

import { TombaMcpClient } from "../client/mcpClient.js";
import type { TombaConfig } from "../types/index";
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
} from "../types/index.js";
import { validateToolArguments, ValidationError } from "../utils/validation.js";
import pkg from "../../package.json" with { type: "json" };
export class TombaMCPServer {
    private server: Server;
    private tombaMcpClient: TombaConfig | null = null;
    private transports: Record<string, StreamableHTTPServerTransport> = {};

    constructor() {
        this.server = new Server(
            {
                name: "tomba-mcp-server",
                version: pkg.version,
            },
            {
                capabilities: {
                    tools: {},
                    resources: {},
                    prompts: {},
                },
            }
        );

        this.setupToolHandlers();
        this.setupResourceHandlers();
        this.setupPromptHandlers();
    }

    private setupToolHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: [
                    {
                        name: "domain_search",
                        description: "Search emails based on domain name",
                        annotations: { readOnly: true },
                        inputSchema: {
                            type: "object",
                            properties: {
                                domain: {
                                    type: "string",
                                    description:
                                        "The domain name to search for emails",
                                },
                                limit: {
                                    type: "number",
                                    description:
                                        "Maximum number of results to return",
                                    default: 10,
                                },
                                page: {
                                    type: "number",
                                    description: "Page number for pagination",
                                    default: 1,
                                },
                                department: {
                                    type: "string",
                                    description: "Filter by department",
                                },
                                country: {
                                    type: "string",
                                    description: "Filter by country code",
                                },
                            },
                            required: ["domain"],
                        },
                    },
                    {
                        name: "email_finder",
                        description:
                            "Find email address from domain, first name and last name",
                        annotations: { readOnly: true },
                        inputSchema: {
                            type: "object",
                            properties: {
                                domain: {
                                    type: "string",
                                    description: "The domain name",
                                },
                                firstName: {
                                    type: "string",
                                    description: "First name of the person",
                                },
                                lastName: {
                                    type: "string",
                                    description: "Last name of the person",
                                },
                            },
                            required: ["domain", "firstName", "lastName"],
                        },
                    },
                    {
                        name: "email_verifier",
                        description: "Verify email address deliverability",
                        annotations: { readOnly: true },
                        inputSchema: {
                            type: "object",
                            properties: {
                                email: {
                                    type: "string",
                                    description: "Email address to verify",
                                },
                            },
                            required: ["email"],
                        },
                    },
                    {
                        name: "email_enrichment",
                        description: "Enrich email with additional data",
                        annotations: { readOnly: true },
                        inputSchema: {
                            type: "object",
                            properties: {
                                email: {
                                    type: "string",
                                    description: "Email address to enrich",
                                },
                            },
                            required: ["email"],
                        },
                    },
                    {
                        name: "author_finder",
                        description: "Find email addresses of article authors",
                        annotations: { readOnly: true },
                        inputSchema: {
                            type: "object",
                            properties: {
                                url: {
                                    type: "string",
                                    description: "URL of the article",
                                },
                            },
                            required: ["url"],
                        },
                    },
                    {
                        name: "linkedin_finder",
                        description: "Find email addresses from LinkedIn URLs",
                        annotations: { readOnly: true },
                        inputSchema: {
                            type: "object",
                            properties: {
                                url: {
                                    type: "string",
                                    description: "LinkedIn profile URL",
                                },
                            },
                            required: ["url"],
                        },
                    },
                    {
                        name: "phone_finder",
                        description:
                            "Search phone numbers based on email, domain, or LinkedIn",
                        annotations: { readOnly: true },
                        inputSchema: {
                            type: "object",
                            properties: {
                                email: {
                                    type: "string",
                                    description: "Email address",
                                },
                                domain: {
                                    type: "string",
                                    description: "Domain name",
                                },
                                linkedin: {
                                    type: "string",
                                    description: "LinkedIn profile URL",
                                },
                            },
                        },
                    },
                    {
                        name: "phone_validator",
                        description:
                            "Validate phone numbers and check carrier information",
                        annotations: { readOnly: true },
                        inputSchema: {
                            type: "object",
                            properties: {
                                phone: {
                                    type: "string",
                                    description: "Phone number to validate",
                                },
                                country: {
                                    type: "string",
                                    description:
                                        "Country code (e.g., +1 for US)",
                                },
                            },
                            required: ["phone"],
                        },
                    },
                    {
                        name: "email_count",
                        description:
                            "Get the total number of email addresses for a domain",
                        annotations: { readOnly: true },
                        inputSchema: {
                            type: "object",
                            properties: {
                                domain: {
                                    type: "string",
                                    description:
                                        "Domain name to count emails for",
                                },
                            },
                            required: ["domain"],
                        },
                    },
                    {
                        name: "similar_finder",
                        description:
                            "Find similar domains based on a specific domain",
                        annotations: { readOnly: true },
                        inputSchema: {
                            type: "object",
                            properties: {
                                domain: {
                                    type: "string",
                                    description:
                                        "Domain name to find similar domains for",
                                },
                            },
                            required: ["domain"],
                        },
                    },
                    {
                        name: "technology_finder",
                        description:
                            "Instantly reveal the technology stack of any website",
                        annotations: { readOnly: true },
                        inputSchema: {
                            type: "object",
                            properties: {
                                domain: {
                                    type: "string",
                                    description:
                                        "Domain name to analyze technology stack for",
                                },
                            },
                            required: ["domain"],
                        },
                    },
                    {
                        name: "companies_search",
                        description:
                            "Search for companies using natural language queries with advanced filters",
                        annotations: { readOnly: true },
                        inputSchema: {
                            type: "object",
                            properties: {
                                query: {
                                    type: "string",
                                    description:
                                        "Natural language search query (e.g., 'technology companies in san francisco')",
                                },
                                filters: {
                                    type: "object",
                                    description: "Advanced filters for company search",
                                    properties: {
                                        location_city: {
                                            type: "object",
                                            properties: {
                                                include: {
                                                    type: "array",
                                                    items: { type: "string" },
                                                    description: "Cities to include",
                                                },
                                                exclude: {
                                                    type: "array",
                                                    items: { type: "string" },
                                                    description: "Cities to exclude",
                                                },
                                            },
                                        },
                                        location_state: {
                                            type: "object",
                                            properties: {
                                                include: {
                                                    type: "array",
                                                    items: { type: "string" },
                                                    description: "States to include",
                                                },
                                                exclude: {
                                                    type: "array",
                                                    items: { type: "string" },
                                                    description: "States to exclude",
                                                },
                                            },
                                        },
                                        location_country: {
                                            type: "object",
                                            properties: {
                                                include: {
                                                    type: "array",
                                                    items: { type: "string" },
                                                    description: "Countries to include",
                                                },
                                                exclude: {
                                                    type: "array",
                                                    items: { type: "string" },
                                                    description: "Countries to exclude",
                                                },
                                            },
                                        },
                                        industry: {
                                            type: "object",
                                            properties: {
                                                include: {
                                                    type: "array",
                                                    items: { type: "string" },
                                                    description: "Industries to include",
                                                },
                                                exclude: {
                                                    type: "array",
                                                    items: { type: "string" },
                                                    description: "Industries to exclude",
                                                },
                                            },
                                        },
                                        size: {
                                            type: "object",
                                            properties: {
                                                include: {
                                                    type: "array",
                                                    items: { type: "string" },
                                                    description:
                                                        "Company sizes to include (e.g., '51-200', '201-500')",
                                                },
                                                exclude: {
                                                    type: "array",
                                                    items: { type: "string" },
                                                    description: "Company sizes to exclude",
                                                },
                                            },
                                        },
                                        revenue: {
                                            type: "object",
                                            properties: {
                                                include: {
                                                    type: "array",
                                                    items: { type: "string" },
                                                    description: "Revenue ranges to include",
                                                },
                                                exclude: {
                                                    type: "array",
                                                    items: { type: "string" },
                                                    description: "Revenue ranges to exclude",
                                                },
                                            },
                                        },
                                    },
                                },
                                page: {
                                    type: "number",
                                    description: "Page number for pagination (default: 1)",
                                },
                                limit: {
                                    type: "number",
                                    description:
                                        "Number of results per page (default: 10, max: 100)",
                                },
                            },
                            required: ["query"],
                        },
                    },
                ],
            };
        });

        this.server.setRequestHandler(
            CallToolRequestSchema,
            async (request) => {
                if (!this.tombaMcpClient) {
                    throw new Error(
                        "Tomba client not initialized. Please set API credentials first."
                    );
                }

                const client = new TombaMcpClient(this.tombaMcpClient);
                const { name, arguments: args } = request.params;

                try {
                    switch (name) {
                        case "domain_search":
                            const searchParams = validateToolArguments(
                                DomainSearchParamsSchema,
                                args,
                                "domain_search"
                            );
                            const domainResult = await client.domainSearch(
                                searchParams
                            );
                            return {
                                content: [
                                    {
                                        type: "text",
                                        text: JSON.stringify(
                                            domainResult,
                                            null,
                                            2
                                        ),
                                    },
                                ],
                            };

                        case "email_finder":
                            const finderParams = validateToolArguments(
                                EmailFinderParamsSchema,
                                args,
                                "email_finder"
                            );
                            const finderResult = await client.emailFinder(
                                finderParams
                            );
                            return {
                                content: [
                                    {
                                        type: "text",
                                        text: JSON.stringify(
                                            finderResult,
                                            null,
                                            2
                                        ),
                                    },
                                ],
                            };

                        case "email_verifier":
                            const verifierParams = validateToolArguments(
                                EmailVerifierParamsSchema,
                                args,
                                "email_verifier"
                            );
                            const verifierResult = await client.emailVerifier(
                                verifierParams
                            );
                            return {
                                content: [
                                    {
                                        type: "text",
                                        text: JSON.stringify(
                                            verifierResult,
                                            null,
                                            2
                                        ),
                                    },
                                ],
                            };

                        case "email_enrichment":
                            const enrichmentParams = validateToolArguments(
                                EmailEnrichmentParamsSchema,
                                args,
                                "email_enrichment"
                            );
                            const enrichmentResult =
                                await client.emailEnrichment(enrichmentParams);
                            return {
                                content: [
                                    {
                                        type: "text",
                                        text: JSON.stringify(
                                            enrichmentResult,
                                            null,
                                            2
                                        ),
                                    },
                                ],
                            };

                        case "author_finder":
                            const authorParams = validateToolArguments(
                                AuthorFinderParamsSchema,
                                args,
                                "author_finder"
                            );
                            const authorResult = await client.authorFinder(
                                authorParams
                            );
                            return {
                                content: [
                                    {
                                        type: "text",
                                        text: JSON.stringify(
                                            authorResult,
                                            null,
                                            2
                                        ),
                                    },
                                ],
                            };

                        case "linkedin_finder":
                            const linkedinParams = validateToolArguments(
                                LinkedinFinderParamsSchema,
                                args,
                                "linkedin_finder"
                            );
                            const linkedinResult = await client.linkedinFinder(
                                linkedinParams
                            );
                            return {
                                content: [
                                    {
                                        type: "text",
                                        text: JSON.stringify(
                                            linkedinResult,
                                            null,
                                            2
                                        ),
                                    },
                                ],
                            };

                        case "phone_finder":
                            const phoneParams = validateToolArguments(
                                PhoneFinderParamsSchema,
                                args,
                                "phone_finder"
                            );
                            const phoneResult = await client.phoneFinder(
                                phoneParams
                            );
                            return {
                                content: [
                                    {
                                        type: "text",
                                        text: JSON.stringify(
                                            phoneResult,
                                            null,
                                            2
                                        ),
                                    },
                                ],
                            };

                        case "phone_validator":
                            const validatorParams = validateToolArguments(
                                PhoneValidatorParamsSchema,
                                args,
                                "phone_validator"
                            );
                            const validatorResult = await client.phoneValidator(
                                validatorParams
                            );
                            return {
                                content: [
                                    {
                                        type: "text",
                                        text: JSON.stringify(
                                            validatorResult,
                                            null,
                                            2
                                        ),
                                    },
                                ],
                            };

                        case "email_count":
                            const countParams = validateToolArguments(
                                EmailCountParamsSchema,
                                args,
                                "email_count"
                            );
                            const countResult = await client.emailCount(
                                countParams
                            );
                            return {
                                content: [
                                    {
                                        type: "text",
                                        text: JSON.stringify(
                                            countResult,
                                            null,
                                            2
                                        ),
                                    },
                                ],
                            };

                        case "similar_finder":
                            const similarParams = validateToolArguments(
                                SimilarFinderParamsSchema,
                                args,
                                "similar_finder"
                            );
                            const similarResult = await client.similarFinder(
                                similarParams
                            );
                            return {
                                content: [
                                    {
                                        type: "text",
                                        text: JSON.stringify(
                                            similarResult,
                                            null,
                                            2
                                        ),
                                    },
                                ],
                            };

                        case "technology_finder":
                            const technologyParams = validateToolArguments(
                                TechnologyFinderParamsSchema,
                                args,
                                "technology_finder"
                            );
                            const technologyResult =
                                await client.technologyFinder(technologyParams);
                            return {
                                content: [
                                    {
                                        type: "text",
                                        text: JSON.stringify(
                                            technologyResult,
                                            null,
                                            2
                                        ),
                                    },
                                ],
                            };

                        case "companies_search":
                            const companiesParams = validateToolArguments(
                                CompaniesSearchParamsSchema,
                                args,
                                "companies_search"
                            );
                            const companiesResult =
                                await client.companiesSearch(companiesParams);
                            return {
                                content: [
                                    {
                                        type: "text",
                                        text: JSON.stringify(
                                            companiesResult,
                                            null,
                                            2
                                        ),
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
                                        error.field
                                            ? ` (Field: ${error.field})`
                                            : ""
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
                                    error instanceof Error
                                        ? error.message
                                        : "Unknown error"
                                }`,
                            },
                        ],
                        isError: true,
                    };
                }
            }
        );
    }

    private setupResourceHandlers() {
        this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
            return {
                resources: [
                    {
                        uri: "tomba://api/status",
                        name: "API Status",
                        description:
                            "Current Tomba API status and account information",
                        mimeType: "application/json",
                    },
                    {
                        uri: "tomba://domain/{domain}",
                        name: "Domain Information",
                        description:
                            "Get complete information about a specific domain",
                        mimeType: "application/json",
                    },
                    {
                        uri: "tomba://email/{email}",
                        name: "Email Information",
                        description:
                            "Get complete information about a specific email address",
                        mimeType: "application/json",
                    },
                    {
                        uri: "tomba://docs/api",
                        name: "API Documentation",
                        description: "Tomba API documentation and usage guide",
                        mimeType: "text/markdown",
                    },
                    {
                        uri: "tomba://docs/tools",
                        name: "Available Tools",
                        description:
                            "List and description of all available Tomba tools",
                        mimeType: "text/markdown",
                    },
                    {
                        uri: "tomba://similar/{domain}",
                        name: "Similar Domains",
                        description:
                            "Find similar domains based on a specific domain",
                        mimeType: "application/json",
                    },
                    {
                        uri: "tomba://technology/{domain}",
                        name: "Domain Technology Stack",
                        description:
                            "Get technology stack information for a specific domain",
                        mimeType: "application/json",
                    },
                ],
            };
        });

        this.server.setRequestHandler(
            ReadResourceRequestSchema,
            async (request) => {
                const { uri } = request.params;

                if (!this.tombaMcpClient) {
                    throw new Error("Tomba client not initialized");
                }

                const client = new TombaMcpClient(this.tombaMcpClient);

                try {
                    if (uri === "tomba://api/status") {
                        return {
                            contents: [
                                {
                                    uri,
                                    mimeType: "application/json",
                                    text: JSON.stringify(
                                        {
                                            status: "operational",
                                            server: "tomba-mcp-server",
                                            version: "1.0.0",
                                            authenticated: true,
                                            timestamp: new Date().toISOString(),
                                        },
                                        null,
                                        2
                                    ),
                                },
                            ],
                        };
                    }

                    if (uri.startsWith("tomba://domain/")) {
                        const domain = uri.replace("tomba://domain/", "");
                        const result = await client.domainSearch({
                            domain,
                            limit: 10,
                        });
                        return {
                            contents: [
                                {
                                    uri,
                                    mimeType: "application/json",
                                    text: JSON.stringify(result, null, 2),
                                },
                            ],
                        };
                    }

                    if (uri.startsWith("tomba://email/")) {
                        const email = uri.replace("tomba://email/", "");
                        const result = await client.emailEnrichment({ email });
                        return {
                            contents: [
                                {
                                    uri,
                                    mimeType: "application/json",
                                    text: JSON.stringify(result, null, 2),
                                },
                            ],
                        };
                    }

                    if (uri === "tomba://docs/api") {
                        return {
                            contents: [
                                {
                                    uri,
                                    mimeType: "text/markdown",
                                    text: `# Tomba API Documentation

## Overview
Tomba is a powerful email finding and verification service that helps you discover and validate email addresses.

## Authentication

## Rate Limits
- Free tier: 50 requests per month
- Paid tiers: Varies by plan

## API Endpoints
- Domain Search: Find all email addresses for a domain
- Email Finder: Find specific email addresses
- Email Verifier: Verify email deliverability
- Email Enrichment: Get additional data about an email
- Author Finder: Find author emails from articles
- LinkedIn Finder: Find emails from LinkedIn profiles
- Phone Finder: Find phone numbers
- Phone Validator: Validate phone numbers

## Support
Visit https://tomba.io for more information.
`,
                                },
                            ],
                        };
                    }

                    if (uri === "tomba://docs/tools") {
                        return {
                            contents: [
                                {
                                    uri,
                                    mimeType: "text/markdown",
                                    text: `# Available Tomba Tools

## 1. domain_search
Search for all email addresses associated with a domain.
- **Required**: domain
- **Optional**: limit, page, department, country

## 2. email_finder
Find a specific person's email address.
- **Required**: domain, firstName, lastName

## 3. email_verifier
Verify if an email address is valid and deliverable.
- **Required**: email

## 4. email_enrichment
Get detailed information about an email address.
- **Required**: email

## 5. author_finder
Find email addresses of article authors from a URL.
- **Required**: url

## 6. linkedin_finder
Find email addresses from LinkedIn profile URLs.
- **Required**: url

## 7. phone_finder
Find phone numbers associated with emails or domains.
- **Required**: At least one of (email, domain, linkedin)

## 8. phone_validator
Validate phone numbers and get carrier information.
- **Required**: phone
- **Optional**: country

## 9. email_count
Get the total number of email addresses for a domain.
- **Required**: domain

## 10. similar_finder
Find similar domains based on a specific domain.
- **Required**: domain

## 11. technology_finder
Discover the technology stack used by a website.
- **Required**: domain

## 12. companies_search
Search for companies using natural language queries with advanced filters.
- **Required**: query
- **Optional**: filters (location_city, location_state, location_country, industry, size, revenue), page, limit
`,
                                },
                            ],
                        };
                    }

                    if (uri.startsWith("tomba://similar/")) {
                        const domain = uri.replace("tomba://similar/", "");
                        const result = await client.similarFinder({ domain });
                        return {
                            contents: [
                                {
                                    uri,
                                    mimeType: "application/json",
                                    text: JSON.stringify(result, null, 2),
                                },
                            ],
                        };
                    }

                    if (uri.startsWith("tomba://technology/")) {
                        const domain = uri.replace("tomba://technology/", "");
                        const result = await client.technologyFinder({
                            domain,
                        });
                        return {
                            contents: [
                                {
                                    uri,
                                    mimeType: "application/json",
                                    text: JSON.stringify(result, null, 2),
                                },
                            ],
                        };
                    }

                    throw new Error(`Unknown resource URI: ${uri}`);
                } catch (error) {
                    throw new Error(
                        `Failed to read resource: ${
                            error instanceof Error
                                ? error.message
                                : "Unknown error"
                        }`
                    );
                }
            }
        );
    }

    private setupPromptHandlers() {
        this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
            return {
                prompts: [
                    {
                        name: "find_contact",
                        description:
                            "Find contact information for a person at a company",
                        arguments: [
                            {
                                name: "firstName",
                                description: "First name of the person",
                                required: true,
                            },
                            {
                                name: "lastName",
                                description: "Last name of the person",
                                required: true,
                            },
                            {
                                name: "company",
                                description: "Company domain or name",
                                required: true,
                            },
                        ],
                    },
                    {
                        name: "verify_email_list",
                        description:
                            "Verify a list of email addresses for deliverability",
                        arguments: [
                            {
                                name: "emails",
                                description:
                                    "Comma-separated list of email addresses to verify",
                                required: true,
                            },
                        ],
                    },
                    {
                        name: "research_company",
                        description:
                            "Research a company's contact information and structure",
                        arguments: [
                            {
                                name: "domain",
                                description: "Company domain name",
                                required: true,
                            },
                            {
                                name: "department",
                                description:
                                    "Specific department to focus on (optional)",
                                required: false,
                            },
                        ],
                    },
                    {
                        name: "enrich_lead",
                        description:
                            "Enrich a lead with all available information",
                        arguments: [
                            {
                                name: "email",
                                description: "Email address of the lead",
                                required: false,
                            },
                            {
                                name: "linkedin",
                                description: "LinkedIn profile URL of the lead",
                                required: false,
                            },
                        ],
                    },
                    {
                        name: "find_journalists",
                        description:
                            "Find contact information for journalists who wrote specific articles",
                        arguments: [
                            {
                                name: "urls",
                                description:
                                    "Comma-separated list of article URLs",
                                required: true,
                            },
                        ],
                    },
                    {
                        name: "finder_phone",
                        description: "Find phone numbers for a contact",
                        arguments: [
                            {
                                name: "email",
                                description: "Email address of the contact",
                                required: true,
                            },
                            {
                                name: "linkedin",
                                description:
                                    "LinkedIn profile URL of the contact",
                                required: false,
                            },
                        ],
                    },
                    {
                        name: "validate_phone",
                        description: "Validate a phone number",
                        arguments: [
                            {
                                name: "phone",
                                description: "Phone number to validate",
                                required: true,
                            },
                            {
                                name: "country",
                                description:
                                    "Country code for the phone number (optional)",
                                required: false,
                            },
                        ],
                    },
                    {
                        name: "competitor_analysis",
                        description:
                            "Analyze competitors using similar domain finder and technology stack",
                        arguments: [
                            {
                                name: "domain",
                                description:
                                    "Target domain to analyze competitors for",
                                required: true,
                            },
                            {
                                name: "include_technology",
                                description:
                                    "Include technology stack analysis (true/false)",
                                required: false,
                            },
                        ],
                    },
                    {
                        name: "technology_audit",
                        description:
                            "Comprehensive technology audit of a website",
                        arguments: [
                            {
                                name: "domain",
                                description:
                                    "Domain to audit technology stack for",
                                required: true,
                            },
                            {
                                name: "include_similar",
                                description:
                                    "Include similar domains analysis (true/false)",
                                required: false,
                            },
                        ],
                    },
                    {
                        name: "domain_insights",
                        description:
                            "Get comprehensive insights about a domain including email count and technology",
                        arguments: [
                            {
                                name: "domain",
                                description: "Domain to analyze",
                                required: true,
                            },
                            {
                                name: "include_samples",
                                description:
                                    "Include sample email addresses (true/false)",
                                required: false,
                            },
                        ],
                    },
                    {
                        name: "bulk_domain_research",
                        description:
                            "Research multiple domains for email counts and basic information",
                        arguments: [
                            {
                                name: "domains",
                                description:
                                    "Comma-separated list of domains to research",
                                required: true,
                            },
                            {
                                name: "include_technology",
                                description:
                                    "Include technology stack for each domain (true/false)",
                                required: false,
                            },
                        ],
                    },
                    {
                        name: "find_target_companies",
                        description:
                            "Find companies matching specific criteria using natural language search",
                        arguments: [
                            {
                                name: "query",
                                description:
                                    "Natural language search query for companies",
                                required: true,
                            },
                            {
                                name: "location",
                                description: "Target location (city, state, or country)",
                                required: false,
                            },
                            {
                                name: "industry",
                                description: "Industry sector to focus on",
                                required: false,
                            },
                            {
                                name: "size",
                                description:
                                    "Company size range (e.g., '51-200', '201-500')",
                                required: false,
                            },
                        ],
                    },
                    {
                        name: "market_research",
                        description:
                            "Research companies in a specific market segment",
                        arguments: [
                            {
                                name: "industry",
                                description: "Industry to research",
                                required: true,
                            },
                            {
                                name: "location",
                                description: "Geographic location",
                                required: true,
                            },
                            {
                                name: "size_range",
                                description:
                                    "Company size range (e.g., '51-200')",
                                required: false,
                            },
                            {
                                name: "include_contacts",
                                description:
                                    "Include contact information for companies (true/false)",
                                required: false,
                            },
                        ],
                    },
                    {
                        name: "lead_generation",
                        description:
                            "Generate leads by finding companies and their contacts",
                        arguments: [
                            {
                                name: "company_query",
                                description: "Search query for target companies",
                                required: true,
                            },
                            {
                                name: "target_department",
                                description:
                                    "Department to find contacts in (optional)",
                                required: false,
                            },
                            {
                                name: "contact_role",
                                description:
                                    "Role or position to target (optional)",
                                required: false,
                            },
                        ],
                    },
                    {
                        name: "prospect_enrichment",
                        description:
                            "Enrich company prospects with comprehensive data",
                        arguments: [
                            {
                                name: "company_name",
                                description: "Name of the company to enrich",
                                required: true,
                            },
                            {
                                name: "location",
                                description: "Company location (optional)",
                                required: false,
                            },
                            {
                                name: "get_technology",
                                description:
                                    "Include technology stack analysis (true/false)",
                                required: false,
                            },
                            {
                                name: "get_contacts",
                                description:
                                    "Include contact information (true/false)",
                                required: false,
                            },
                        ],
                    },
                    {
                        name: "industry_analysis",
                        description:
                            "Analyze companies within a specific industry and location",
                        arguments: [
                            {
                                name: "industry",
                                description: "Industry to analyze",
                                required: true,
                            },
                            {
                                name: "location",
                                description: "Geographic location",
                                required: true,
                            },
                            {
                                name: "company_sizes",
                                description:
                                    "Comma-separated list of company sizes (e.g., '51-200,201-500')",
                                required: false,
                            },
                            {
                                name: "include_technology",
                                description:
                                    "Include technology analysis (true/false)",
                                required: false,
                            },
                        ],
                    },
                ],
            };
        });

        this.server.setRequestHandler(
            GetPromptRequestSchema,
            async (request) => {
                const { name, arguments: args } = request.params;

                switch (name) {
                    case "find_contact":
                        const firstName = args?.firstName as string;
                        const lastName = args?.lastName as string;
                        const company = args?.company as string;

                        if (!firstName || !lastName || !company) {
                            throw new Error(
                                "firstName, lastName, and company are required"
                            );
                        }

                        return {
                            messages: [
                                {
                                    role: "user",
                                    content: {
                                        type: "text",
                                        text: `I need to find contact information for ${firstName} ${lastName} who works at ${company}. Please:

1. Use the email_finder tool to find their email address
2. Use the email_verifier tool to verify the email is valid
3. Use the email_enrichment tool to get additional information
4. If possible, use the phone_finder tool to find their phone number
5. Provide a summary of all the information found

Company domain: ${company}
First name: ${firstName}
Last name: ${lastName}`,
                                    },
                                },
                            ],
                        };

                    case "verify_email_list":
                        const emails = (args?.emails as string)
                            ?.split(",")
                            .map((e) => e.trim());

                        if (!emails || emails.length === 0) {
                            throw new Error("emails parameter is required");
                        }

                        return {
                            messages: [
                                {
                                    role: "user",
                                    content: {
                                        type: "text",
                                        text: `I need to verify the following email addresses for deliverability:

${emails.map((email, i) => `${i + 1}. ${email}`).join("\n")}

Please:
1. Use the email_verifier tool for each email address
2. Create a summary table showing:
   - Email address
   - Status (valid/invalid)
   - Deliverability score
   - Any issues found
3. Provide recommendations for any problematic emails`,
                                    },
                                },
                            ],
                        };

                    case "research_company":
                        const domain = args?.domain as string;
                        const department = args?.department as string;

                        if (!domain) {
                            throw new Error("domain parameter is required");
                        }

                        const deptFilter = department
                            ? `\n4. Focus specifically on the ${department} department`
                            : "";

                        return {
                            messages: [
                                {
                                    role: "user",
                                    content: {
                                        type: "text",
                                        text: `I need to research the company at domain: ${domain}

Please:
1. Use the domain_search tool to find all available email addresses
2. Analyze the email patterns and organizational structure
3. Identify key departments and roles${deptFilter}
4. Provide insights about:
   - Company size (estimated from email count)
   - Common email patterns
   - Department structure
   - Key contacts

Domain: ${domain}${department ? `\nDepartment: ${department}` : ""}`,
                                    },
                                },
                            ],
                        };

                    case "enrich_lead":
                        const email = args?.email as string;
                        const linkedin = args?.linkedin as string;

                        if (!email && !linkedin) {
                            throw new Error(
                                "Either email or linkedin parameter is required"
                            );
                        }

                        let enrichText =
                            "I need to enrich a lead with all available information.\n\nPlease:\n";

                        if (email) {
                            enrichText += `1. Use the email_verifier tool to verify: ${email}\n`;
                            enrichText += `2. Use the email_enrichment tool to get detailed information\n`;
                            enrichText += `3. Use the phone_finder tool with the email to find phone numbers\n`;
                        }

                        if (linkedin) {
                            enrichText += `${
                                email ? "4" : "1"
                            }. Use the linkedin_finder tool to find email from: ${linkedin}\n`;
                            enrichText += `${
                                email ? "5" : "2"
                            }. Use the phone_finder tool with the LinkedIn URL\n`;
                        }

                        enrichText += `\nProvide a comprehensive profile including:
- Contact information (email, phone)
- Professional details
- Social media presence
- Verification status`;

                        return {
                            messages: [
                                {
                                    role: "user",
                                    content: {
                                        type: "text",
                                        text: enrichText,
                                    },
                                },
                            ],
                        };

                    case "find_journalists":
                        const urls = (args?.urls as string)
                            ?.split(",")
                            .map((u) => u.trim());

                        if (!urls || urls.length === 0) {
                            throw new Error("urls parameter is required");
                        }

                        return {
                            messages: [
                                {
                                    role: "user",
                                    content: {
                                        type: "text",
                                        text: `I need to find contact information for journalists who wrote the following articles:

${urls.map((url, i) => `${i + 1}. ${url}`).join("\n")}

Please:
1. Use the author_finder tool for each article URL
2. For each author found, use the email_verifier tool to verify their email
3. Try to find phone numbers using the phone_finder tool
4. Create a summary table with:
   - Article URL
   - Author name
   - Email address
   - Phone number (if found)
   - Verification status
5. Provide any additional insights about the journalists`,
                                    },
                                },
                            ],
                        };

                    case "competitor_analysis":
                        const targetDomain = args?.domain as string;
                        const includeTechnology =
                            args?.include_technology as string;

                        if (!targetDomain) {
                            throw new Error("domain parameter is required");
                        }

                        let analysisText = `I need to analyze competitors for the domain: ${targetDomain}\n\nPlease:\n`;
                        analysisText += `1. Use the similar_finder tool to find similar domains\n`;
                        analysisText += `2. Analyze the competition landscape and market positioning\n`;
                        analysisText += `3. For each similar domain, provide:\n`;
                        analysisText += `   - Domain name and similarity score\n`;
                        analysisText += `   - Business category and description\n`;
                        analysisText += `   - Competitive advantages/differences\n`;

                        if (includeTechnology === "true") {
                            analysisText += `4. Use the technology_finder tool to analyze the target domain's tech stack\n`;
                            analysisText += `5. Compare technology choices with competitors\n`;
                        }

                        analysisText += `\nProvide a comprehensive competitive analysis report including:\n`;
                        analysisText += `- Market positioning insights\n`;
                        analysisText += `- Key competitors and their strengths\n`;
                        analysisText += `- Opportunities and threats\n`;
                        if (includeTechnology === "true") {
                            analysisText += `- Technology stack comparison\n`;
                        }

                        return {
                            messages: [
                                {
                                    role: "user",
                                    content: {
                                        type: "text",
                                        text: analysisText,
                                    },
                                },
                            ],
                        };

                    case "technology_audit":
                        const auditDomain = args?.domain as string;
                        const includeSimilar = args?.include_similar as string;

                        if (!auditDomain) {
                            throw new Error("domain parameter is required");
                        }

                        let auditText = `I need to perform a comprehensive technology audit for: ${auditDomain}\n\nPlease:\n`;
                        auditText += `1. Use the technology_finder tool to discover the complete technology stack\n`;
                        auditText += `2. Analyze the technologies by category:\n`;
                        auditText += `   - Web frameworks and libraries\n`;
                        auditText += `   - Frontend technologies\n`;
                        auditText += `   - Backend and server technologies\n`;
                        auditText += `   - Database and storage solutions\n`;
                        auditText += `   - Analytics and tracking tools\n`;
                        auditText += `   - Security and performance tools\n`;
                        auditText += `3. Evaluate technology choices for:\n`;
                        auditText += `   - Performance implications\n`;
                        auditText += `   - Security considerations\n`;
                        auditText += `   - Scalability factors\n`;
                        auditText += `   - Development efficiency\n`;

                        if (includeSimilar === "true") {
                            auditText += `4. Use the similar_finder tool to find comparable websites\n`;
                            auditText += `5. Compare technology choices with industry peers\n`;
                        }

                        auditText += `\nProvide a detailed technology audit report including:\n`;
                        auditText += `- Complete technology inventory\n`;
                        auditText += `- Technology assessment and recommendations\n`;
                        auditText += `- Performance and security analysis\n`;
                        auditText += `- Modernization opportunities\n`;
                        if (includeSimilar === "true") {
                            auditText += `- Industry technology trends and comparisons\n`;
                        }

                        return {
                            messages: [
                                {
                                    role: "user",
                                    content: {
                                        type: "text",
                                        text: auditText,
                                    },
                                },
                            ],
                        };

                    case "domain_insights":
                        const insightDomain = args?.domain as string;
                        const includeSamples = args?.include_samples as string;

                        if (!insightDomain) {
                            throw new Error("domain parameter is required");
                        }

                        let insightText = `I need comprehensive insights about the domain: ${insightDomain}\n\nPlease:\n`;
                        insightText += `1. Use the email_count tool to get the total number of email addresses\n`;
                        insightText += `2. Use the technology_finder tool to discover the technology stack\n`;
                        insightText += `3. Use the similar_finder tool to find comparable domains\n`;

                        if (includeSamples === "true") {
                            insightText += `4. Use the domain_search tool to get sample email addresses (limit 5)\n`;
                        }

                        insightText += `\nProvide a comprehensive domain analysis report including:\n`;
                        insightText += `- Email infrastructure overview (total count, estimated patterns)\n`;
                        insightText += `- Technology stack summary and analysis\n`;
                        insightText += `- Market positioning and similar competitors\n`;
                        insightText += `- Business insights and opportunities\n`;
                        if (includeSamples === "true") {
                            insightText += `- Sample email patterns and structure\n`;
                        }

                        return {
                            messages: [
                                {
                                    role: "user",
                                    content: {
                                        type: "text",
                                        text: insightText,
                                    },
                                },
                            ],
                        };

                    case "bulk_domain_research":
                        const domains = (args?.domains as string)
                            ?.split(",")
                            .map((d) => d.trim());
                        const includeTech = args?.include_technology as string;

                        if (!domains || domains.length === 0) {
                            throw new Error("domains parameter is required");
                        }

                        let bulkText = `I need to research the following domains:\n\n${domains
                            .map((domain, i) => `${i + 1}. ${domain}`)
                            .join("\n")}\n\nPlease:\n`;
                        bulkText += `1. Use the email_count tool for each domain to get total email counts\n`;
                        bulkText += `2. Use the domain_search tool for each domain to understand email structure (limit 3 per domain)\n`;

                        if (includeTech === "true") {
                            bulkText += `3. Use the technology_finder tool for each domain to analyze tech stacks\n`;
                        }

                        bulkText += `\nProvide a comparative analysis table including:\n`;
                        bulkText += `- Domain name\n`;
                        bulkText += `- Total email count\n`;
                        bulkText += `- Sample email patterns\n`;
                        bulkText += `- Business category/industry\n`;
                        if (includeTech === "true") {
                            bulkText += `- Key technologies used\n`;
                        }
                        bulkText += `- Insights and recommendations\n`;

                        return {
                            messages: [
                                {
                                    role: "user",
                                    content: {
                                        type: "text",
                                        text: bulkText,
                                    },
                                },
                            ],
                        };

                    case "find_target_companies":
                        const query = args?.query as string;
                        const location = args?.location as string;
                        const industry = args?.industry as string;
                        const size = args?.size as string;

                        if (!query) {
                            throw new Error("query parameter is required");
                        }

                        let filters: any = {};
                        if (location) {
                            if (location.includes(",")) {
                                filters.location_city = {
                                    include: location.split(",").map((l) => l.trim()),
                                };
                            } else {
                                filters.location_city = { include: [location] };
                            }
                        }
                        if (industry) {
                            filters.industry = {
                                include: industry.split(",").map((i) => i.trim()),
                            };
                        }
                        if (size) {
                            filters.size = {
                                include: size.split(",").map((s) => s.trim()),
                            };
                        }

                        const hasFilters = Object.keys(filters).length > 0;
                        let targetText = `I need to find companies matching: "${query}"\n\n`;
                        if (hasFilters) {
                            targetText += `Filters:\n`;
                            if (location)
                                targetText += `- Location: ${location}\n`;
                            if (industry)
                                targetText += `- Industry: ${industry}\n`;
                            if (size) targetText += `- Size: ${size}\n`;
                            targetText += `\n`;
                        }

                        targetText += `Please:\n`;
                        targetText += `1. Use the companies_search tool with query: "${query}"`;
                        if (hasFilters) {
                            targetText += ` and filters: ${JSON.stringify(
                                filters,
                                null,
                                2
                            )}`;
                        }
                        targetText += `\n2. Analyze the results and provide:\n`;
                        targetText += `   - List of matching companies with key details\n`;
                        targetText += `   - Company names and domains\n`;
                        targetText += `   - Business descriptions\n`;
                        targetText += `   - Contact opportunities\n`;
                        targetText += `3. Suggest next steps for outreach or engagement\n`;

                        return {
                            messages: [
                                {
                                    role: "user",
                                    content: {
                                        type: "text",
                                        text: targetText,
                                    },
                                },
                            ],
                        };

                    case "market_research":
                        const researchIndustry = args?.industry as string;
                        const researchLocation = args?.location as string;
                        const sizeRange = args?.size_range as string;
                        const includeContacts = args?.include_contacts as string;

                        if (!researchIndustry || !researchLocation) {
                            throw new Error(
                                "industry and location parameters are required"
                            );
                        }

                        let marketFilters: any = {
                            industry: { include: [researchIndustry] },
                            location_city: { include: [researchLocation] },
                        };
                        if (sizeRange) {
                            marketFilters.size = { include: [sizeRange] };
                        }

                        let marketText = `I need to research the ${researchIndustry} market in ${researchLocation}\n\n`;
                        marketText += `Please:\n`;
                        marketText += `1. Use the companies_search tool to find companies in ${researchIndustry} industry located in ${researchLocation}`;
                        if (sizeRange) {
                            marketText += ` with size ${sizeRange}`;
                        }
                        marketText += `\n2. Analyze market landscape including:\n`;
                        marketText += `   - Total number of companies found\n`;
                        marketText += `   - Company size distribution\n`;
                        marketText += `   - Key players and their domains\n`;
                        marketText += `   - Market trends and insights\n`;

                        if (includeContacts === "true") {
                            marketText += `3. For top 5 companies, use domain_search to find key contacts\n`;
                            marketText += `4. Provide contact information for decision makers\n`;
                        }

                        marketText += `\nProvide a comprehensive market research report with actionable insights.\n`;

                        return {
                            messages: [
                                {
                                    role: "user",
                                    content: {
                                        type: "text",
                                        text: marketText,
                                    },
                                },
                            ],
                        };

                    case "lead_generation":
                        const companyQuery = args?.company_query as string;
                        const targetDepartment = args?.target_department as string;
                        const contactRole = args?.contact_role as string;

                        if (!companyQuery) {
                            throw new Error(
                                "company_query parameter is required"
                            );
                        }

                        let leadText = `I need to generate leads from companies matching: "${companyQuery}"\n\n`;
                        leadText += `Please:\n`;
                        leadText += `1. Use the companies_search tool to find companies matching: "${companyQuery}"\n`;
                        leadText += `2. For each company found:\n`;
                        leadText += `   - Extract the company domain\n`;
                        leadText += `   - Use domain_search to find email addresses`;
                        if (targetDepartment) {
                            leadText += ` in ${targetDepartment} department`;
                        }
                        leadText += `\n`;

                        if (contactRole) {
                            leadText += `3. Filter contacts for ${contactRole} roles\n`;
                        }

                        leadText += `4. Create a lead list with:\n`;
                        leadText += `   - Company name and domain\n`;
                        leadText += `   - Contact name and email\n`;
                        leadText += `   - Role/title\n`;
                        leadText += `   - Department\n`;
                        leadText += `5. Prioritize leads based on relevance and contact quality\n`;

                        return {
                            messages: [
                                {
                                    role: "user",
                                    content: {
                                        type: "text",
                                        text: leadText,
                                    },
                                },
                            ],
                        };

                    case "prospect_enrichment":
                        const companyName = args?.company_name as string;
                        const prospectLocation = args?.location as string;
                        const getTechnology = args?.get_technology as string;
                        const getContacts = args?.get_contacts as string;

                        if (!companyName) {
                            throw new Error(
                                "company_name parameter is required"
                            );
                        }

                        let enrichQuery = companyName;
                        if (prospectLocation) {
                            enrichQuery += ` in ${prospectLocation}`;
                        }

                        let prospectText = `I need to enrich prospect information for: ${companyName}`;
                        if (prospectLocation) {
                            prospectText += ` (${prospectLocation})`;
                        }
                        prospectText += `\n\nPlease:\n`;
                        prospectText += `1. Use companies_search to find "${enrichQuery}"\n`;
                        prospectText += `2. Extract the company domain from results\n`;

                        if (getTechnology === "true") {
                            prospectText += `3. Use technology_finder to analyze the tech stack\n`;
                        }

                        if (getContacts === "true") {
                            prospectText += `${
                                getTechnology === "true" ? "4" : "3"
                            }. Use domain_search to find key contacts\n`;
                            prospectText += `${
                                getTechnology === "true" ? "5" : "4"
                            }. Use email_verifier to verify contact emails\n`;
                        }

                        prospectText += `\nProvide a comprehensive prospect profile including:\n`;
                        prospectText += `- Company overview and domain\n`;
                        prospectText += `- Industry and location details\n`;
                        if (getTechnology === "true") {
                            prospectText += `- Technology stack analysis\n`;
                        }
                        if (getContacts === "true") {
                            prospectText += `- Key contact information with verification status\n`;
                        }
                        prospectText += `- Engagement recommendations\n`;

                        return {
                            messages: [
                                {
                                    role: "user",
                                    content: {
                                        type: "text",
                                        text: prospectText,
                                    },
                                },
                            ],
                        };

                    case "industry_analysis":
                        const analysisIndustry = args?.industry as string;
                        const analysisLocation = args?.location as string;
                        const companySizes = args?.company_sizes as string;
                        const industryIncludeTechnology =
                            args?.include_technology as string;

                        if (!analysisIndustry || !analysisLocation) {
                            throw new Error(
                                "industry and location parameters are required"
                            );
                        }

                        let analysisFilters: any = {
                            industry: { include: [analysisIndustry] },
                            location_city: { include: [analysisLocation] },
                        };
                        if (companySizes) {
                            analysisFilters.size = {
                                include: companySizes
                                    .split(",")
                                    .map((s) => s.trim()),
                            };
                        }

                        let industryText = `I need to analyze the ${analysisIndustry} industry in ${analysisLocation}\n\n`;
                        industryText += `Please:\n`;
                        industryText += `1. Use companies_search to find all ${analysisIndustry} companies in ${analysisLocation}`;
                        if (companySizes) {
                            industryText += ` with sizes: ${companySizes}`;
                        }
                        industryText += `\n2. Segment companies by size and analyze:\n`;
                        industryText += `   - Market composition\n`;
                        industryText += `   - Company distribution by size\n`;
                        industryText += `   - Key industry players\n`;

                        if (industryIncludeTechnology === "true") {
                            industryText += `3. For top 10 companies, use technology_finder to analyze tech adoption\n`;
                            industryText += `4. Identify technology trends in the industry\n`;
                        }

                        industryText += `\nProvide a detailed industry analysis report including:\n`;
                        industryText += `- Market overview and statistics\n`;
                        industryText += `- Competitive landscape\n`;
                        industryText += `- Key companies and their domains\n`;
                        if (industryIncludeTechnology === "true") {
                            industryText += `- Technology trends and adoption patterns\n`;
                        }
                        industryText += `- Market opportunities and insights\n`;

                        return {
                            messages: [
                                {
                                    role: "user",
                                    content: {
                                        type: "text",
                                        text: industryText,
                                    },
                                },
                            ],
                        };

                    default:
                        throw new Error(`Unknown prompt: ${name}`);
                }
            }
        );
    }

    // Authorization middleware for HTTP transport
    private authMiddleware(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (!this.tombaMcpClient) {
            res.status(401).json({
                error: "Unauthorized",
                message: "Invalid API credentials",
            });
        }

        next();
    }

    public setCredentials(config: TombaConfig) {
        this.tombaMcpClient = config;
    }

    public async run(transportType: string = "stdio", port: number = 3000) {
        if (transportType === "http") {
            await this.runHttpTransport(port);
        } else {
            await this.runStdioTransport();
        }
    }

    private async runStdioTransport() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error("Tomba MCP server running on stdio");
    }

    private async runHttpTransport(port: number) {
        const app = express();
        app.use(express.json());
        app.use(cors());
        // POST endpoint for client-to-server communication
        app.post("/mcp", this.authMiddleware.bind(this), async (req, res) => {
            // Check for existing session ID
            const sessionId = req.headers["mcp-session-id"] as
                | string
                | undefined;
            let transport: StreamableHTTPServerTransport;

            if (sessionId && this.transports[sessionId]) {
                // Reuse existing transport
                transport = this.transports[sessionId];
            } else if (!sessionId && isInitializeRequest(req.body)) {
                // New initialization request
                transport = new StreamableHTTPServerTransport({
                    sessionIdGenerator: () => randomUUID(),
                    onsessioninitialized: (sessionId) => {
                        // Store the transport by session ID
                        this.transports[sessionId] = transport;
                    },
                });

                // Clean up transport when closed
                transport.onclose = () => {
                    if (transport.sessionId) {
                        delete this.transports[transport.sessionId];
                    }
                };

                // Connect to the MCP server
                await this.server.connect(transport);
            } else {
                // Invalid request
                res.status(400).json({
                    jsonrpc: "2.0",
                    error: {
                        code: -32000,
                        message: "Bad Request: No valid session ID provided",
                    },
                    id: null,
                });
                return;
            }

            // Handle the request
            await transport.handleRequest(req, res, req.body);
            return;
        });

        // GET endpoint for server-to-client notifications via Streamable HTTP
        app.get("/mcp", this.authMiddleware.bind(this), async (req, res) => {
            const sessionId = req.headers["x-session-id"] as string;

            if (!sessionId) {
                res.status(400).json({
                    jsonrpc: "2.0",
                    error: {
                        code: -32600,
                        message: "Missing X-Session-Id header",
                    },
                    id: null,
                });
                return;
            }

            const transport = this.transports[sessionId];

            if (!transport) {
                res.status(404).json({
                    jsonrpc: "2.0",
                    error: {
                        code: -32001,
                        message: `Session not found: ${sessionId}`,
                    },
                    id: null,
                });
                return;
            }

            try {
                await transport.handleRequest(req, res);
                return;
            } catch (error) {
                console.error("Error handling GET request:", error);
                if (!res.headersSent) {
                    res.status(500).json({
                        jsonrpc: "2.0",
                        error: {
                            code: -32603,
                            message:
                                error instanceof Error
                                    ? error.message
                                    : "Internal server error",
                        },
                        id: null,
                    });
                }
                return;
            }
        });

        // DELETE endpoint for session termination
        app.delete("/mcp", this.authMiddleware.bind(this), async (req, res) => {
            const sessionId = req.headers["x-session-id"] as string;

            if (!sessionId) {
                res.status(400).json({
                    jsonrpc: "2.0",
                    error: {
                        code: -32600,
                        message: "Missing X-Session-Id header",
                    },
                    id: null,
                });
                return;
            }

            const transport = this.transports[sessionId];

            if (!transport) {
                res.status(404).json({
                    jsonrpc: "2.0",
                    error: {
                        code: -32001,
                        message: `Session not found: ${sessionId}`,
                    },
                    id: null,
                });
                return;
            }

            try {
                // Close the transport connection
                await transport.close();

                // Remove the transport from the map
                delete this.transports[sessionId];

                console.error(`Session terminated: ${sessionId}`);

                res.status(200).json({
                    success: true,
                    message: "Session terminated successfully",
                    sessionId: sessionId,
                });
                return;
            } catch (error) {
                console.error("Error terminating session:", error);
                if (!res.headersSent) {
                    res.status(500).json({
                        jsonrpc: "2.0",
                        error: {
                            code: -32603,
                            message:
                                error instanceof Error
                                    ? error.message
                                    : "Internal server error",
                        },
                        id: null,
                    });
                }
                return;
            }
        });

        // Health check endpoint
        app.get("/health", (req, res) => {
            return res.json({
                status: "ok",
                server: "tomba-mcp-server",
                version: pkg.version,
                transport: "http",
                activeSessions: Object.keys(this.transports).length,
            });
        });

        // List active sessions endpoint (useful for debugging)
        app.get("/sessions", this.authMiddleware.bind(this), (req, res) => {
            return res.json({
                activeSessions: Object.keys(this.transports).length,
                sessionIds: Object.keys(this.transports),
            });
        });

        app.listen(port, () => {
            console.error(
                `Tomba MCP server running on http://localhost:${port}/mcp`
            );
            console.error(
                `Health check available at http://localhost:${port}/health`
            );
            console.error(
                `Session management available at http://localhost:${port}/sessions`
            );
        });
    }
}
