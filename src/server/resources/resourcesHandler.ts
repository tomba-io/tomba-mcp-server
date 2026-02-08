import type {
    ReadResourceRequest,
    ReadResourceResult,
} from "@modelcontextprotocol/sdk/types.js";
import { TombaMcpClient } from "../../client/mcpClient.js";

export async function handleResourceRead(
    request: ReadResourceRequest,
    client: TombaMcpClient,
): Promise<ReadResourceResult> {
    const { uri } = request.params;

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
                            2,
                        ),
                    },
                ],
            };
        }

        if (uri.startsWith("tomba://domain/")) {
            const domain = uri.replace("tomba://domain/", "");
            const result = await client.domainSearch({
                domain,
                limit: "10",
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
- **Required**: domain or company
- **Optional**: limit, page, department, country

## 2. email_finder
Find a specific person's email address.
- **Required**: domain or company, firstName, lastName or fullName
- **Optional**: enrichMobile

## 3. email_verifier
Verify if an email address is valid and deliverable.
- **Required**: email
- **Optional**: enrichMobile

## 4. email_enrichment
Get detailed information about an email address.
- **Required**: email
- **Optional**: enrichMobile

## 5. author_finder
Find email addresses of article authors from a URL.
- **Required**: url

## 6. linkedin_finder
Find email addresses from LinkedIn profile URLs.
- **Required**: url
- **Optional**: enrichMobile

## 7. phone_finder
Find phone numbers associated with emails or domains.
- **Required**: At least one of (email, domain, linkedin)
- **Optional**: full

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
            const result = await client.technologyFinder({ domain });
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
                error instanceof Error ? error.message : "Unknown error"
            }`,
        );
    }
}
