import type { Prompt } from "@modelcontextprotocol/sdk/types.js";

export const promptsList: Prompt[] = [
    {
        name: "find_contact",
        description: "Find contact information for a person at a company",
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
        description: "Verify a list of email addresses for deliverability",
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
        description: "Research a company's contact information and structure",
        arguments: [
            {
                name: "domain",
                description: "Company domain name",
                required: true,
            },
            {
                name: "department",
                description: "Specific department to focus on (optional)",
                required: false,
            },
        ],
    },
    {
        name: "enrich_lead",
        description: "Enrich a lead with all available information",
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
                description: "Comma-separated list of article URLs",
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
                description: "LinkedIn profile URL of the contact",
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
                description: "Country code for the phone number (optional)",
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
                description: "Target domain to analyze competitors for",
                required: true,
            },
            {
                name: "include_technology",
                description: "Include technology stack analysis (true/false)",
                required: false,
            },
        ],
    },
    {
        name: "technology_audit",
        description: "Comprehensive technology audit of a website",
        arguments: [
            {
                name: "domain",
                description: "Domain to audit technology stack for",
                required: true,
            },
            {
                name: "include_similar",
                description: "Include similar domains analysis (true/false)",
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
                description: "Include sample email addresses (true/false)",
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
                description: "Comma-separated list of domains to research",
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
            "Find companies matching specific criteria using advanced filters",
        arguments: [
            {
                name: "location",
                description: "Target location (city, state, or country)",
                required: false,
            },
            {
                name: "industry",
                description:
                    "Industry sector (e.g., 'Computer Software', 'Financial Services', 'Hospital & Health Care'). Based on LinkedIn Industry Codes V2",
                required: false,
            },
            {
                name: "size",
                description:
                    "Company size range: 1-10 (Micro), 11-50 (Small), 51-250 (Mid-sized), 251-1K (Medium-large), 1K-5K (Large), 5K-10K (Very large), 10K-50K (Enterprise), 50K-100K (Massive), 100K+ (Global)",
                required: false,
            },
            {
                name: "type",
                description:
                    "Company type: education, government, nonprofit, private, public, or personal",
                required: false,
            },
            {
                name: "revenue",
                description:
                    "Revenue range: $0-$1M, $1M-$10M, $10M-$50M, $50M-$100M, $100M-$250M, $250M-$500M, $500M-$1B, $1B-$10B, $10B+",
                required: false,
            },
        ],
    },
    {
        name: "market_research",
        description:
            "Research companies in a specific market segment with comprehensive filtering",
        arguments: [
            {
                name: "industry",
                description:
                    "Industry to research (e.g., 'Computer Software', 'Financial Services', 'Retail'). Based on LinkedIn Industry Codes V2",
                required: true,
            },
            {
                name: "location",
                description: "Geographic location (city, state, or country)",
                required: true,
            },
            {
                name: "size_range",
                description:
                    "Company size: 1-10, 11-50, 51-250, 251-1K, 1K-5K, 5K-10K, 10K-50K, 50K-100K, 100K+",
                required: false,
            },
            {
                name: "revenue_range",
                description:
                    "Revenue range: $0-$1M, $1M-$10M, $10M-$50M, $50M-$100M, $100M-$250M, $250M-$500M, $500M-$1B, $1B-$10B, $10B+",
                required: false,
            },
            {
                name: "company_type",
                description:
                    "Company type: education, government, nonprofit, private, public, personal",
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
        description: "Generate leads by finding companies and their contacts",
        arguments: [
            {
                name: "company_query",
                description: "Search query for target companies",
                required: true,
            },
            {
                name: "target_department",
                description: "Department to find contacts in (optional)",
                required: false,
            },
            {
                name: "contact_role",
                description: "Role or position to target (optional)",
                required: false,
            },
        ],
    },
    {
        name: "prospect_enrichment",
        description: "Enrich company prospects with comprehensive data",
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
                description: "Include technology stack analysis (true/false)",
                required: false,
            },
            {
                name: "get_contacts",
                description: "Include contact information (true/false)",
                required: false,
            },
        ],
    },
    {
        name: "industry_analysis",
        description:
            "Analyze companies within a specific industry and location with detailed segmentation",
        arguments: [
            {
                name: "industry",
                description:
                    "Industry to analyze (e.g., 'Computer Software', 'Hospital & Health Care', 'Banking'). Based on LinkedIn Industry Codes V2",
                required: true,
            },
            {
                name: "location",
                description: "Geographic location (city, state, or country)",
                required: true,
            },
            {
                name: "company_sizes",
                description:
                    "Comma-separated sizes: 1-10, 11-50, 51-250, 251-1K, 1K-5K, 5K-10K, 10K-50K, 50K-100K, 100K+",
                required: false,
            },
            {
                name: "revenue_ranges",
                description:
                    "Comma-separated revenue: $0-$1M, $1M-$10M, $10M-$50M, $50M-$100M, $100M-$250M, $250M-$500M, $500M-$1B, $1B-$10B, $10B+",
                required: false,
            },
            {
                name: "company_types",
                description:
                    "Comma-separated types: education, government, nonprofit, private, public, personal",
                required: false,
            },
            {
                name: "include_technology",
                description: "Include technology analysis (true/false)",
                required: false,
            },
        ],
    },
];
