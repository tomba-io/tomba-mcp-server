import { z } from "zod";

export interface TombaConfig {
    apiKey: string;
    secretKey: string;
}

export interface DomainSearchParams {
    domain: string;
    limit?: number;
    page?: number;
    department?: string;
    country?: string;
}

export interface EmailFinderParams {
    domain: string;
    firstName: string;
    lastName: string;
}

export interface EmailVerifierParams {
    email: string;
}

export interface EmailEnrichmentParams {
    email: string;
}

export interface AuthorFinderParams {
    url: string;
}

export interface LinkedinFinderParams {
    url: string;
}

export interface PhoneFinderParams {
    email?: string;
    domain?: string;
    linkedin?: string;
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
export const TombaConfigSchema = z.object({
    apiKey: z
        .string()
        .min(1, "API key is required")
        .regex(
            /^ta_[a-z0-9]+$/,
            "API key must start with 'ta_' followed by lowercase alphanumeric characters"
        ),
    secretKey: z
        .string()
        .min(1, "Secret key is required")
        .regex(
            /^ts_[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
            "Secret key must start with 'ts_' followed by UUID format"
        ),
});
export const DomainSearchParamsSchema = z.object({
    domain: z
        .string()
        .min(1, "Domain is required")
        .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid domain format"),
    limit: z
        .number()
        .int()
        .min(1, "Limit must be at least 1")
        .max(100, "Limit cannot exceed 100")
        .optional()
        .default(10),
    page: z
        .number()
        .int()
        .min(1, "Page must be at least 1")
        .optional()
        .default(1),
    department: z.string().min(1, "Department cannot be empty").optional(),
    country: z
        .string()
        .length(2, "Country code must be 2 characters")
        .regex(/^[A-Z]{2}$/, "Country code must be uppercase letters")
        .optional(),
});

export const EmailFinderParamsSchema = z.object({
    domain: z
        .string()
        .min(1, "Domain is required")
        .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid domain format"),
    firstName: z
        .string()
        .min(1, "First name is required")
        .max(50, "First name too long")
        .regex(/^[a-zA-Z\s-']+$/, "Invalid characters in first name"),
    lastName: z
        .string()
        .min(1, "Last name is required")
        .max(50, "Last name too long")
        .regex(/^[a-zA-Z\s-']+$/, "Invalid characters in last name"),
});

export const EmailVerifierParamsSchema = z.object({
    email: z.email("Invalid email format").min(1, "Email is required"),
});

export const EmailEnrichmentParamsSchema = z.object({
    email: z.email("Invalid email format").min(1, "Email is required"),
});

export const AuthorFinderParamsSchema = z.object({
    url: z.string().min(1, "URL is required"),
});

export const LinkedinFinderParamsSchema = z.object({
    url: z
        .string()
        .regex(/linkedin\.com/, "Must be a LinkedIn URL")
        .min(1, "LinkedIn URL is required"),
});

export const PhoneFinderParamsSchema = z
    .object({
        email: z.email("Invalid email format").optional(),
        domain: z
            .string()
            .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid domain format")
            .optional(),
        linkedin: z
            .url("Invalid LinkedIn URL format")
            .regex(/linkedin\.com/, "Must be a LinkedIn URL")
            .optional(),
    })
    .refine((data) => data.email || data.domain || data.linkedin, {
        message: "At least one of email, domain, or linkedin must be provided",
        path: ["email", "domain", "linkedin"],
    });

export const PhoneValidatorParamsSchema = z.object({
    phone: z.string().min(1, "Phone number is required"),

    country: z
        .string()
        .length(2, "Country code must be 2 characters")
        .regex(/^[A-Z]{2}$/, "Country code must be uppercase letters")
        .optional(),
});

export const EmailCountParamsSchema = z.object({
    domain: z
        .string()
        .min(1, "Domain is required")
        .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid domain format"),
});

export const SimilarFinderParamsSchema = z.object({
    domain: z
        .string()
        .min(1, "Domain is required")
        .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid domain format"),
});

export const TechnologyFinderParamsSchema = z.object({
    domain: z
        .string()
        .min(1, "Domain is required")
        .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid domain format"),
});

// Additional validation schemas for common patterns
export const PaginationSchema = z.object({
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(10),
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
