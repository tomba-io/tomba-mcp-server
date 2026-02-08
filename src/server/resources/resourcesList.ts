import type { Resource } from "@modelcontextprotocol/sdk/types.js";

export const resourcesList: Resource[] = [
    {
        uri: "tomba://api/status",
        name: "API Status",
        description: "Current Tomba API status and account information",
        mimeType: "application/json",
    },
    {
        uri: "tomba://domain/{domain}",
        name: "Domain Information",
        description: "Get complete information about a specific domain",
        mimeType: "application/json",
    },
    {
        uri: "tomba://email/{email}",
        name: "Email Information",
        description: "Get complete information about a specific email address",
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
        description: "List and description of all available Tomba tools",
        mimeType: "text/markdown",
    },
    {
        uri: "tomba://similar/{domain}",
        name: "Similar Domains",
        description: "Find similar domains based on a specific domain",
        mimeType: "application/json",
    },
    {
        uri: "tomba://technology/{domain}",
        name: "Domain Technology Stack",
        description: "Get technology stack information for a specific domain",
        mimeType: "application/json",
    },
];
