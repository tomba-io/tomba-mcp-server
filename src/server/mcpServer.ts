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
import type {
    AuthorFinderParams,
    DomainSearchParams,
    EmailEnrichmentParams,
    EmailFinderParams,
    LinkedinFinderParams,
    PhoneFinderParams,
    PhoneValidatorParams,
    TombaConfig,
} from "../types/index";
import pkg from "../../package.json" assert { type: "json" };
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
                        inputSchema: {
                            type: "object",
                            properties: {
                                phone: {
                                    type: "string",
                                    description: "Phone number to validate",
                                },
                            },
                            required: ["phone"],
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
                            const searchParams =
                                args as unknown as DomainSearchParams;
                            if (!searchParams.domain) {
                                throw new Error(
                                    "Domain is required for domain_search tool"
                                );
                            }
                            const domainResult = await client.domainSearch({
                                domain: searchParams.domain,
                                country: searchParams.country,
                                department: searchParams.department,
                                limit: searchParams.limit,
                                page: searchParams.page,
                            });
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
                            const finderParams =
                                args as unknown as EmailFinderParams;
                            if (
                                !finderParams.domain ||
                                !finderParams.firstName ||
                                !finderParams.lastName
                            ) {
                                throw new Error(
                                    "Domain, firstName and lastName are required for email_finder tool"
                                );
                            }
                            const finderResult = await client.emailFinder({
                                domain: finderParams.domain,
                                firstName: finderParams.firstName,
                                lastName: finderParams.lastName,
                            });
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
                            const verifierParams = args as unknown as {
                                email: string;
                            };
                            if (!verifierParams.email) {
                                throw new Error(
                                    "Email is required for email_verifier tool"
                                );
                            }
                            const verifierResult = await client.emailVerifier({
                                email: verifierParams.email,
                            });
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
                            const enrichmentParams =
                                args as unknown as EmailEnrichmentParams;
                            if (!enrichmentParams.email) {
                                throw new Error(
                                    "Email is required for email_enrichment tool"
                                );
                            }
                            const enrichmentResult =
                                await client.emailEnrichment({
                                    email: enrichmentParams.email,
                                });
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
                            const authorParams =
                                args as unknown as AuthorFinderParams;
                            if (!authorParams.url) {
                                throw new Error(
                                    "URL is required for author_finder tool"
                                );
                            }
                            const authorResult = await client.authorFinder({
                                url: authorParams.url,
                            });
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
                            const linkedinParams =
                                args as unknown as LinkedinFinderParams;
                            if (!linkedinParams.url) {
                                throw new Error(
                                    "URL is required for linkedin_finder tool"
                                );
                            }
                            const linkedinResult = await client.linkedinFinder({
                                url: linkedinParams.url,
                            });
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
                            const phoneParams =
                                args as unknown as PhoneFinderParams;
                            if (
                                !phoneParams.email &&
                                !phoneParams.domain &&
                                !phoneParams.linkedin
                            ) {
                                throw new Error(
                                    "At least one of email, domain, or linkedin is required for phone_finder tool"
                                );
                            }
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
                            const validatorParams =
                                args as unknown as PhoneValidatorParams;
                            if (!validatorParams.phone) {
                                throw new Error(
                                    "Phone is required for phone_validator tool"
                                );
                            }
                            const validatorResult = await client.phoneValidator(
                                {
                                    phone: validatorParams.phone,
                                }
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

                        default:
                            throw new Error(`Unknown tool: ${name}`);
                    }
                } catch (error) {
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
`,
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
        const apiKey = req.headers["x-tomba-key"] as string;
        const secretKey = req.headers["x-tomba-secret"] as string;

        // if (!apiKey || !secretKey) {
        //   res.status(401).json({
        //     error: "Unauthorized",
        //     message: "Missing X-Tomba-Key or X-Tomba-Secret headers",
        //   });
        // }

        // if (
        //   !this.tombaMcpClient ||
        //   this.tombaMcpClient.apiKey !== apiKey ||
        //   this.tombaMcpClient.secretKey !== secretKey
        // ) {
        //   res.status(401).json({
        //     error: "Unauthorized",
        //     message: "Invalid API credentials",
        //   });
        // }

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
