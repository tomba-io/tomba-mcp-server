import type { Tool } from "@modelcontextprotocol/sdk/types.js";

export const toolsList: Tool[] = [
    {
        name: "domain_search",
        description: "Search emails based on domain name",
        annotations: { readOnlyHint: true },
        inputSchema: {
            type: "object",
            properties: {
                domain: {
                    type: "string",
                    description: "The domain name to search for emails",
                },
                company: {
                    type: "string",
                    description: "The company name to search for",
                },
                limit: {
                    type: "string",
                    enum: ["10", "20", "50"],
                    description: "Maximum number of results to return",
                    default: "10",
                },
                page: {
                    type: "number",
                    description: "Page number for pagination",
                    default: 1,
                },
                department: {
                    type: "string",
                    enum: [
                        "engineering",
                        "sales",
                        "finance",
                        "hr",
                        "it",
                        "marketing",
                        "operations",
                        "management",
                        "executive",
                        "legal",
                        "support",
                        "communication",
                        "software",
                        "security",
                        "pr",
                        "warehouse",
                        "diversity",
                        "administrative",
                        "facilities",
                        "accounting",
                    ],
                    description: "Filter by department",
                },
                country: {
                    type: "string",
                    description: "Filter by country code (ISO 3166-1 alpha-2)",
                },
            },
        },
    },
    {
        name: "email_finder",
        description: "Find email address from domain, first name and last name",
        annotations: { readOnlyHint: true },
        inputSchema: {
            type: "object",
            properties: {
                domain: {
                    type: "string",
                    description: "The domain name",
                },
                company: {
                    type: "string",
                    description: "The company name",
                },
                fullName: {
                    type: "string",
                    description: "Full name of the person",
                },
                firstName: {
                    type: "string",
                    description: "First name of the person",
                },
                lastName: {
                    type: "string",
                    description: "Last name of the person",
                },
                enrichMobile: {
                    type: "boolean",
                    description: "Whether to enrich with mobile phone data",
                },
            },
        },
    },
    {
        name: "email_verifier",
        description: "Verify email address deliverability",
        annotations: { readOnlyHint: true },
        inputSchema: {
            type: "object",
            properties: {
                email: {
                    type: "string",
                    description: "Email address to verify",
                },
                enrichMobile: {
                    type: "boolean",
                    description: "Whether to enrich with mobile phone data",
                },
            },
            required: ["email"],
        },
    },
    {
        name: "email_enrichment",
        description: "Enrich email with additional data",
        annotations: { readOnlyHint: true },
        inputSchema: {
            type: "object",
            properties: {
                email: {
                    type: "string",
                    description: "Email address to enrich",
                },
                enrichMobile: {
                    type: "boolean",
                    description: "Whether to enrich with mobile phone data",
                },
            },
            required: ["email"],
        },
    },
    {
        name: "author_finder",
        description: "Find email addresses of article authors",
        annotations: { readOnlyHint: true },
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
        annotations: { readOnlyHint: true },
        inputSchema: {
            type: "object",
            properties: {
                url: {
                    type: "string",
                    description: "LinkedIn profile URL",
                },
                enrichMobile: {
                    type: "boolean",
                    description: "Whether to enrich with mobile phone data",
                },
            },
            required: ["url"],
        },
    },
    {
        name: "phone_finder",
        description: "Search phone numbers based on email, domain, or LinkedIn",
        annotations: { readOnlyHint: true },
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
                full: {
                    type: "boolean",
                    description: "Whether to return full phone details",
                },
            },
        },
    },
    {
        name: "phone_validator",
        description: "Validate phone numbers and check carrier information",
        annotations: { readOnlyHint: true },
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
                        "Country code in ISO 3166-1 alpha-2 format (e.g., 'US')",
                },
            },
            required: ["phone"],
        },
    },
    {
        name: "email_count",
        description: "Get the total number of email addresses for a domain",
        annotations: { readOnlyHint: true },
        inputSchema: {
            type: "object",
            properties: {
                domain: {
                    type: "string",
                    description: "Domain name to count emails for",
                },
            },
            required: ["domain"],
        },
    },
    {
        name: "similar_finder",
        description: "Find similar domains based on a specific domain",
        annotations: { readOnlyHint: true },
        inputSchema: {
            type: "object",
            properties: {
                domain: {
                    type: "string",
                    description: "Domain name to find similar domains for",
                },
            },
            required: ["domain"],
        },
    },
    {
        name: "technology_finder",
        description: "Instantly reveal the technology stack of any website",
        annotations: { readOnlyHint: true },
        inputSchema: {
            type: "object",
            properties: {
                domain: {
                    type: "string",
                    description: "Domain name to analyze technology stack for",
                },
            },
            required: ["domain"],
        },
    },
    {
        name: "companies_search",
        description:
            "Search for companies using natural language queries with advanced filters",
        annotations: { readOnlyHint: true },
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
];
