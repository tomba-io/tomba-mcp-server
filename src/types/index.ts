import { z } from "zod";

export interface TombaConfig {
    apiKey: string;
    secretKey: string;
}

export interface DomainSearchParams {
    domain?: string;
    company?: string;
    page?: number;
    limit?: "10" | "20" | "50";
    country?: string;
    department?:
        | "engineering"
        | "sales"
        | "finance"
        | "hr"
        | "it"
        | "marketing"
        | "operations"
        | "management"
        | "executive"
        | "legal"
        | "support"
        | "communication"
        | "software"
        | "security"
        | "pr"
        | "warehouse"
        | "diversity"
        | "administrative"
        | "facilities"
        | "accounting";
}

export interface EmailFinderParams {
    domain?: string;
    company?: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    enrich_mobile?: boolean;
}

export interface EmailVerifierParams {
    email: string;
    enrich_mobile?: boolean;
}

export interface EmailEnrichmentParams {
    email: string;
    enrich_mobile?: boolean;
}

export interface AuthorFinderParams {
    url: string;
}

export interface LinkedinFinderParams {
    url: string;
    enrich_mobile?: boolean;
}

export interface PhoneFinderParams {
    email?: string;
    domain?: string;
    linkedin?: string;
    full?: boolean;
}

export interface PhoneValidatorParams {
    phone: string;
}

export interface EmailCountParams {
    domain: string;
}

export interface SimilarFinderParams {
    domain: string;
}

export interface TechnologyFinderParams {
    domain: string;
}

// Zod Schemas for validation
export const TombaConfigSchema = z
    .object({
        apiKey: z
            .string()
            .min(1, "API key is required")
            .regex(
                /^ta_[a-z0-9]+$/,
                "API key must start with 'ta_' followed by lowercase alphanumeric characters",
            ),
        secretKey: z
            .string()
            .min(1, "Secret key is required")
            .regex(
                /^ts_[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
                "Secret key must start with 'ts_' followed by UUID format",
            ),
    })
    .describe("Configuration schema for Tomba API authentication");
export const DomainSearchParamsSchema = z
    .object({
        domain: z
            .string()
            .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid domain format")
            .optional()
            .describe("The domain to search for emails (e.g., 'example.com')"),
        company: z
            .string()
            .min(3, "Company name must be at least 3 characters")
            .max(75, "Company name must be at most 75 characters")
            .optional()
            .describe("The company name to search for"),
        page: z
            .number()
            .int()
            .min(1, "Page must be at least 1")
            .optional()
            .default(1)
            .describe("Page number for pagination"),
        limit: z
            .enum(["10", "20", "50"])
            .default("10")
            .optional()
            .describe("Maximum number of results to return (10, 20, or 50)"),
        country: z
            .string()
            .length(2, "Country code must be 2 characters")
            .regex(/^[A-Z]{2}$/, "Country code must be uppercase letters")
            .optional()
            .describe("Country code in ISO 3166-1 alpha-2 format (e.g., 'US')"),
        department: z
            .enum([
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
            ])
            .optional()
            .describe("Filter results by department"),
    })
    .describe(
        "Search for email addresses associated with a domain name or company",
    );

export const EmailFinderParamsSchema = z
    .object({
        domain: z
            .string()
            .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid domain format")
            .optional()
            .describe("The domain of the company (e.g., 'example.com')"),
        company: z
            .string()
            .min(3, "Company name must be at least 3 characters")
            .max(75, "Company name must be at most 75 characters")
            .optional()
            .describe("The company name to search in"),
        fullName: z
            .string()
            .min(1, "Full name is required")
            .optional()
            .describe(
                "The full name of the person (alternative to firstName/lastName)",
            ),
        firstName: z
            .string()
            .min(1, "First name is required")
            .max(50, "First name too long")
            .regex(/^[a-zA-Z\s-']+$/, "Invalid characters in first name")
            .optional(),
        lastName: z
            .string()
            .min(1, "Last name is required")
            .max(50, "Last name too long")
            .regex(/^[a-zA-Z\s-']+$/, "Invalid characters in last name")
            .optional(),
        enrichMobile: z
            .boolean()
            .optional()
            .describe("Whether to enrich with mobile phone data"),
    })
    .describe(
        "Find email addresses by providing a domain and person's first/last name",
    );

export const EmailVerifierParamsSchema = z
    .object({
        email: z.email("Invalid email format").min(1, "Email is required"),
        enrich_mobile: z
            .boolean()
            .optional()
            .describe("Whether to enrich with mobile phone data"),
    })
    .describe(
        "Verify email address deliverability and validity with detailed verification data",
    );

export const EmailEnrichmentParamsSchema = z
    .object({
        email: z.email("Invalid email format").min(1, "Email is required"),
        enrich_mobile: z
            .boolean()
            .optional()
            .describe("Whether to enrich with mobile phone data"),
    })
    .describe(
        "Enrich email addresses with additional data including social profiles and company information",
    );

export const AuthorFinderParamsSchema = z
    .object({
        url: z.string().min(1, "URL is required"),
    })
    .describe(
        "Find email addresses of article authors from a given webpage URL",
    );

export const LinkedinFinderParamsSchema = z
    .object({
        url: z
            .string()
            .regex(/linkedin\.com/, "Must be a LinkedIn URL")
            .min(1, "LinkedIn URL is required"),
        enrich_mobile: z
            .boolean()
            .optional()
            .describe("Whether to enrich with mobile phone data"),
    })
    .describe(
        "Find email addresses from LinkedIn profile URLs with optional phone enrichment",
    );

export const PhoneFinderParamsSchema = z
    .object({
        email: z.email("Invalid email format").optional(),
        domain: z
            .string()
            .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid domain format")
            .describe("The domain of the company (e.g., 'example.com')")
            .optional(),
        linkedin: z
            .url("Invalid LinkedIn URL format")
            .regex(/linkedin\.com/, "Must be a LinkedIn URL")
            .optional(),
        full: z
            .boolean()
            .optional()
            .describe("Whether to return full phone details"),
    })
    .refine((data) => data.email || data.domain || data.linkedin, {
        message: "At least one of email, domain, or linkedin must be provided",
        path: ["email", "domain", "linkedin"],
    })
    .describe(
        "Find phone numbers based on email address, domain, or LinkedIn profile",
    );

export const PhoneValidatorParamsSchema = z
    .object({
        phone: z.string().min(1, "Phone number is required"),
        country: z
            .string()
            .length(2, "Country code must be 2 characters")
            .regex(/^[A-Z]{2}$/, "Country code must be uppercase letters")
            .describe("Country code in ISO 3166-1 alpha-2 format (e.g., 'US')")
            .optional(),
    })
    .describe(
        "Validate phone numbers and retrieve carrier information with optional country code",
    );

export const EmailCountParamsSchema = z
    .object({
        domain: z
            .string()
            .min(1, "Domain is required")
            .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid domain format"),
    })
    .describe(
        "Get the total count of email addresses available for a specific domain",
    );

export const SimilarFinderParamsSchema = z
    .object({
        domain: z
            .string()
            .min(1, "Domain is required")
            .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid domain format"),
    })
    .describe(
        "Discover similar domains and related companies based on a given domain",
    );

export const TechnologyFinderParamsSchema = z
    .object({
        domain: z
            .string()
            .min(1, "Domain is required")
            .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid domain format"),
    })
    .describe(
        "Reveal the technology stack and tools used by any website domain",
    );

export const CompaniesSearchParamsSchema = z
    .object({
        query: z
            .string()
            .min(
                10,
                "Natural language query - AI assistant will select appropriate filters for you",
            )
            .optional(),
        filters: z
            .object({
                location_city: z
                    .object({
                        include: z.array(z.string()).optional(),
                        exclude: z.array(z.string()).optional(),
                    })
                    .optional(),
                location_state: z
                    .object({
                        include: z.array(z.string()).optional(),
                        exclude: z.array(z.string()).optional(),
                    })
                    .optional(),
                location_country: z
                    .object({
                        include: z.array(z.string()).optional(),
                        exclude: z.array(z.string()).optional(),
                    })
                    .optional(),
                industry: z
                    .object({
                        include: z.array(z.string()).optional(),
                        exclude: z.array(z.string()).optional(),
                    })
                    .optional(),
                size: z
                    .object({
                        include: z.array(z.string()).optional(),
                        exclude: z.array(z.string()).optional(),
                    })
                    .optional(),
                revenue: z
                    .object({
                        include: z.array(z.string()).optional(),
                        exclude: z.array(z.string()).optional(),
                    })
                    .optional(),
                sic: z
                    .object({
                        include: z.array(z.string()).optional(),
                        exclude: z.array(z.string()).optional(),
                    })
                    .optional(),
                naics: z
                    .object({
                        include: z.array(z.string()).optional(),
                        exclude: z.array(z.string()).optional(),
                    })
                    .optional(),
                keywords: z
                    .object({
                        include: z.array(z.string()).optional(),
                        exclude: z.array(z.string()).optional(),
                    })
                    .optional(),
                founded: z
                    .object({
                        include: z.array(z.string()).optional(),
                        exclude: z.array(z.string()).optional(),
                    })
                    .optional(),
                similar: z
                    .object({
                        include: z.array(z.string()).optional(),
                        exclude: z.array(z.string()).optional(),
                    })
                    .optional(),
            })
            .optional(),
        page: z
            .number()
            .int()
            .min(1, "Page must be at least 1")
            .optional()
            .default(1),
    })
    .describe(
        "Search for companies using natural language queries or detailed filters including location, industry, size, revenue, and more",
    );

// Additional validation schemas for common patterns
export const PaginationSchema = z.object({
    page: z.number().int().min(1).default(1),
});

export const CountryCodeSchema = z
    .string()
    .length(2)
    .regex(/^[A-Z]{2}$/)
    .optional();

export const DomainSchema = z
    .string()
    .min(1)
    .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);

export const EmailSchema = z.string().email();

export const URLSchema = z.string().url();

export const LinkedInURLSchema = z
    .string()
    .url()
    .regex(/linkedin\.com/);

export const PhoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/);

// Utility type for validated parameters
export type ValidatedParams<T> = T extends z.ZodSchema<infer U> ? U : never;
