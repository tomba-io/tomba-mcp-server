import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
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

export class TombaMCPServer {
  private server: Server;
  private tombaMcpClient: TombaMcpClient | null = null;

  constructor() {
    this.server = new Server(
      {
        name: "tomba-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
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
                  description: "The domain name to search for emails",
                },
                limit: {
                  type: "number",
                  description: "Maximum number of results to return",
                  default: 10,
                },
                offset: {
                  type: "number",
                  description: "Number of results to skip",
                  default: 0,
                },
                type: {
                  type: "string",
                  enum: ["personal", "generic"],
                  description: "Type of emails to search for",
                },
                sources: {
                  type: "boolean",
                  description: "Include sources information",
                  default: true,
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
            description: "Validate phone numbers and check carrier information",
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

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (!this.tombaMcpClient) {
        throw new Error(
          "Tomba client not initialized. Please set API credentials first."
        );
      }

      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "domain_search":
            const searchParams = args as unknown as DomainSearchParams;
            if (!searchParams.domain) {
              throw new Error("Domain is required for domain_search tool");
            }
            const domainResult = await this.tombaMcpClient.domainSearch({
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
                  text: JSON.stringify(domainResult, null, 2),
                },
              ],
            };

          case "email_finder":
            const finderParams = args as unknown as EmailFinderParams;
            if (
              !finderParams.domain ||
              !finderParams.firstName ||
              !finderParams.lastName
            ) {
              throw new Error(
                "Domain, firstName and lastName are required for email_finder tool"
              );
            }
            const finderResult = await this.tombaMcpClient.emailFinder({
              domain: finderParams.domain,
              firstName: finderParams.firstName,
              lastName: finderParams.lastName,
            });
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(finderResult, null, 2),
                },
              ],
            };

          case "email_verifier":
            const verifierParams = args as unknown as { email: string };
            if (!verifierParams.email) {
              throw new Error("Email is required for email_verifier tool");
            }
            const verifierResult = await this.tombaMcpClient.emailVerifier({
              email: verifierParams.email,
            });
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(verifierResult, null, 2),
                },
              ],
            };

          case "email_enrichment":
            const enrichmentParams = args as unknown as EmailEnrichmentParams;
            if (!enrichmentParams.email) {
              throw new Error("Email is required for email_enrichment tool");
            }
            const enrichmentResult = await this.tombaMcpClient.emailEnrichment({
              email: enrichmentParams.email,
            });
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(enrichmentResult, null, 2),
                },
              ],
            };

          case "author_finder":
            const authorParams = args as unknown as AuthorFinderParams;
            if (!authorParams.url) {
              throw new Error("URL is required for author_finder tool");
            }
            const authorResult = await this.tombaMcpClient.authorFinder({
              url: authorParams.url,
            });
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(authorResult, null, 2),
                },
              ],
            };

          case "linkedin_finder":
            const linkedinParams = args as unknown as LinkedinFinderParams;
            if (!linkedinParams.url) {
              throw new Error("URL is required for linkedin_finder tool");
            }
            const linkedinResult = await this.tombaMcpClient.linkedinFinder({
              url: linkedinParams.url,
            });
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(linkedinResult, null, 2),
                },
              ],
            };

          case "phone_finder":
            const phoneParams = args as unknown as PhoneFinderParams;
            if (
              !phoneParams.email &&
              !phoneParams.domain &&
              !phoneParams.linkedin
            ) {
              throw new Error(
                "At least one of email, domain, or linkedin is required for phone_finder tool"
              );
            }
            const phoneResult = await this.tombaMcpClient.phoneFinder(
              phoneParams
            );
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(phoneResult, null, 2),
                },
              ],
            };

          case "phone_validator":
            const validatorParams = args as unknown as PhoneValidatorParams;
            if (!validatorParams.phone) {
              throw new Error("Phone is required for phone_validator tool");
            }
            const validatorResult = await this.tombaMcpClient.phoneValidator({
              phone: validatorParams.phone,
            });
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(validatorResult, null, 2),
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
                error instanceof Error ? error.message : "Unknown error"
              }`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  public setCredentials(config: TombaConfig) {
    this.tombaMcpClient = new TombaMcpClient(config);
  }

  public async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Tomba MCP server running on stdio");
  }
}
