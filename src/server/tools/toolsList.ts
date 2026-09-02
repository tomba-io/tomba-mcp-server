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
                            description:
                                "Filter by industry (based on LinkedIn Industry Codes V2). Use keywords filter if industry not listed.",
                            properties: {
                                include: {
                                    type: "array",
                                    items: {
                                        type: "string",
                                        enum: [
                                            "Computer Software",
                                            "Information Technology and Services",
                                            "Internet",
                                            "Computer Hardware",
                                            "Computer Networking",
                                            "Computer & Network Security",
                                            "Semiconductors",
                                            "Telecommunications",
                                            "Wireless",
                                            "Management Consulting",
                                            "Human Resources",
                                            "Staffing and Recruiting",
                                            "Professional Training & Coaching",
                                            "Business Supplies and Equipment",
                                            "Outsourcing/Offshoring",
                                            "Financial Services",
                                            "Banking",
                                            "Investment Banking",
                                            "Investment Management",
                                            "Venture Capital & Private Equity",
                                            "Insurance",
                                            "Accounting",
                                            "Hospital & Health Care",
                                            "Medical Devices",
                                            "Pharmaceuticals",
                                            "Biotechnology",
                                            "Health, Wellness and Fitness",
                                            "Mental Health Care",
                                            "Veterinary",
                                            "Automotive",
                                            "Aviation & Aerospace",
                                            "Chemicals",
                                            "Civil Engineering",
                                            "Construction",
                                            "Electrical/Electronic Manufacturing",
                                            "Industrial Automation",
                                            "Machinery",
                                            "Manufacturing",
                                            "Mechanical or Industrial Engineering",
                                            "Mining & Metals",
                                            "Oil & Energy",
                                            "Plastics",
                                            "Renewables & Environment",
                                            "Utilities",
                                            "Retail",
                                            "Consumer Electronics",
                                            "Consumer Goods",
                                            "Consumer Services",
                                            "Cosmetics",
                                            "Food & Beverages",
                                            "Food Production",
                                            "Luxury Goods & Jewelry",
                                            "Sporting Goods",
                                            "Supermarkets",
                                            "Wine and Spirits",
                                            "Broadcast Media",
                                            "Entertainment",
                                            "Media Production",
                                            "Motion Pictures and Film",
                                            "Music",
                                            "Newspapers",
                                            "Online Media",
                                            "Publishing",
                                            "Animation",
                                            "Computer Games",
                                            "Gambling & Casinos",
                                            "Marketing and Advertising",
                                            "Market Research",
                                            "Public Relations and Communications",
                                            "Events Services",
                                            "Graphic Design",
                                            "Education Management",
                                            "E-Learning",
                                            "Higher Education",
                                            "Primary/Secondary Education",
                                            "Research",
                                            "Law Practice",
                                            "Legal Services",
                                            "Government Administration",
                                            "Government Relations",
                                            "Judiciary",
                                            "Legislative Office",
                                            "Military",
                                            "Public Policy",
                                            "Public Safety",
                                            "Real Estate",
                                            "Commercial Real Estate",
                                            "Property Management",
                                            "Airlines/Aviation",
                                            "Logistics and Supply Chain",
                                            "Maritime",
                                            "Package/Freight Delivery",
                                            "Railroad Manufacture",
                                            "Shipbuilding",
                                            "Transportation/Trucking/Railroad",
                                            "Warehousing",
                                            "Hospitality",
                                            "Hotels",
                                            "Restaurants",
                                            "Leisure, Travel & Tourism",
                                            "Recreational Facilities and Services",
                                            "Nonprofit Organization Management",
                                            "Philanthropy",
                                            "Religious Institutions",
                                            "Think Tanks",
                                            "Civic & Social Organization",
                                            "Political Organization",
                                            "Agriculture",
                                            "Apparel & Fashion",
                                            "Architecture & Planning",
                                            "Arts and Crafts",
                                            "Building Materials",
                                            "Design",
                                            "Environmental Services",
                                            "Facilities Services",
                                            "Fine Art",
                                            "Fishery",
                                            "Furniture",
                                            "Glass, Ceramics & Concrete",
                                            "Import and Export",
                                            "Individual & Family Services",
                                            "International Affairs",
                                            "International Trade and Development",
                                            "Law Enforcement",
                                            "Libraries",
                                            "Nanotechnology",
                                            "Museums and Institutions",
                                            "Packaging and Containers",
                                            "Paper & Forest Products",
                                            "Performing Arts",
                                            "Photography",
                                            "Printing",
                                            "Program Development",
                                            "Ranching",
                                            "Security and Investigations",
                                            "Sports",
                                            "Textiles",
                                            "Tobacco",
                                            "Translation and Localization",
                                            "Writing and Editing",
                                            "Wholesale",
                                        ],
                                    },
                                    description:
                                        "Industries to include (based on LinkedIn Industry Codes V2)",
                                },
                                exclude: {
                                    type: "array",
                                    items: { type: "string" },
                                    description: "Industries to exclude",
                                },
                            },
                        },
                        type: {
                            type: "object",
                            description:
                                "Filter by company type: education, government, nonprofit, private, public, personal",
                            properties: {
                                include: {
                                    type: "array",
                                    items: {
                                        type: "string",
                                        enum: [
                                            "education",
                                            "government",
                                            "nonprofit",
                                            "private",
                                            "public",
                                            "personal",
                                        ],
                                    },
                                    description:
                                        "Company types to include: education (school/college/university), government (agency/department), nonprofit (non-profit organization), private (privately owned), public (publicly traded), personal (individual's website)",
                                },
                                exclude: {
                                    type: "array",
                                    items: {
                                        type: "string",
                                        enum: [
                                            "education",
                                            "government",
                                            "nonprofit",
                                            "private",
                                            "public",
                                            "personal",
                                        ],
                                    },
                                    description: "Company types to exclude",
                                },
                            },
                        },
                        size: {
                            type: "object",
                            description:
                                "Filter by company size range: 1-10 (Micro), 11-50 (Small), 51-250 (Mid-sized), 251-1K (Medium-large), 1K-5K (Large), 5K-10K (Very large), 10K-50K (Enterprise), 50K-100K (Massive), 100K+ (Global)",
                            properties: {
                                include: {
                                    type: "array",
                                    items: {
                                        type: "string",
                                        enum: [
                                            "1-10",
                                            "11-50",
                                            "51-250",
                                            "251-1K",
                                            "1K-5K",
                                            "5K-10K",
                                            "10K-50K",
                                            "50K-100K",
                                            "100K+",
                                        ],
                                    },
                                    description:
                                        "Company sizes to include: 1-10 (Micro-sized team), 11-50 (Small-sized business), 51-250 (Mid-sized company), 251-1K (Medium-large business), 1K-5K (Large company), 5K-10K (Very large company), 10K-50K (Enterprise-scale company), 50K-100K (Massive corporation), 100K+ (Global enterprise)",
                                },
                                exclude: {
                                    type: "array",
                                    items: {
                                        type: "string",
                                        enum: [
                                            "1-10",
                                            "11-50",
                                            "51-250",
                                            "251-1K",
                                            "1K-5K",
                                            "5K-10K",
                                            "10K-50K",
                                            "50K-100K",
                                            "100K+",
                                        ],
                                    },
                                    description: "Company sizes to exclude",
                                },
                            },
                        },
                        revenue: {
                            type: "object",
                            description:
                                "Filter by annual revenue range: $0-$1M (Startup), $1M-$10M (Small), $10M-$50M (Mid-sized), $50M-$100M (Large), $100M-$250M (Very large), $250M-$500M (Enterprise), $500M-$1B (Major corp), $1B-$10B (Large corp), $10B+ (Global)",
                            properties: {
                                include: {
                                    type: "array",
                                    items: {
                                        type: "string",
                                        enum: [
                                            "$0-$1M",
                                            "$1M-$10M",
                                            "$10M-$50M",
                                            "$50M-$100M",
                                            "$100M-$250M",
                                            "$250M-$500M",
                                            "$500M-$1B",
                                            "$1B-$10B",
                                            "$10B+",
                                        ],
                                    },
                                    description:
                                        "Revenue ranges to include: $0-$1M (Startup/very small), $1M-$10M (Small business), $10M-$50M (Mid-sized), $50M-$100M (Large), $100M-$250M (Very large), $250M-$500M (Enterprise), $500M-$1B (Major corporation), $1B-$10B (Large corporation), $10B+ (Global enterprise)",
                                },
                                exclude: {
                                    type: "array",
                                    items: {
                                        type: "string",
                                        enum: [
                                            "$0-$1M",
                                            "$1M-$10M",
                                            "$10M-$50M",
                                            "$50M-$100M",
                                            "$100M-$250M",
                                            "$250M-$500M",
                                            "$500M-$1B",
                                            "$1B-$10B",
                                            "$10B+",
                                        ],
                                    },
                                    description: "Revenue ranges to exclude",
                                },
                            },
                        },
                        sic: {
                            type: "object",
                            description: "Filter by SIC codes",
                            properties: {
                                include: {
                                    type: "array",
                                    items: { type: "string" },
                                    description: "SIC codes to include",
                                },
                                exclude: {
                                    type: "array",
                                    items: { type: "string" },
                                    description: "SIC codes to exclude",
                                },
                            },
                        },
                        naics: {
                            type: "object",
                            description: "Filter by NAICS codes",
                            properties: {
                                include: {
                                    type: "array",
                                    items: { type: "string" },
                                    description: "NAICS codes to include",
                                },
                                exclude: {
                                    type: "array",
                                    items: { type: "string" },
                                    description: "NAICS codes to exclude",
                                },
                            },
                        },
                        keywords: {
                            type: "object",
                            description:
                                "Filter by keywords (use this if your target industry is not in the industry list)",
                            properties: {
                                include: {
                                    type: "array",
                                    items: { type: "string" },
                                    description: "Keywords to include",
                                },
                                exclude: {
                                    type: "array",
                                    items: { type: "string" },
                                    description: "Keywords to exclude",
                                },
                            },
                        },
                        founded: {
                            type: "object",
                            description: "Filter by founding year",
                            properties: {
                                include: {
                                    type: "array",
                                    items: { type: "string" },
                                    description: "Founding years to include",
                                },
                                exclude: {
                                    type: "array",
                                    items: { type: "string" },
                                    description: "Founding years to exclude",
                                },
                            },
                        },
                        similar: {
                            type: "object",
                            description: "Filter by similar domains",
                            properties: {
                                include: {
                                    type: "array",
                                    items: { type: "string" },
                                    description: "Similar domains to include",
                                },
                                exclude: {
                                    type: "array",
                                    items: { type: "string" },
                                    description: "Similar domains to exclude",
                                },
                            },
                        },
                    },
                },
                page: {
                    type: "number",
                    description: "Page number for pagination (default: 1)",
                },
            },
            required: ["filters"],
        },
    },
    {
        name: "email_sources",
        description: "Find where an email address was found on the web",
        annotations: { readOnlyHint: true },
        inputSchema: {
            type: "object",
            properties: {
                email: { type: "string", description: "Email address to find sources for" },
            },
            required: ["email"],
        },
    },
    {
        name: "email_format",
        description: "Get the email format patterns used by a specific domain",
        annotations: { readOnlyHint: true },
        inputSchema: {
            type: "object",
            properties: {
                domain: { type: "string", description: "Domain name to get email format for" },
            },
            required: ["domain"],
        },
    },
    {
        name: "domain_status",
        description: "Check if a domain is a webmail provider or disposable email service",
        annotations: { readOnlyHint: true },
        inputSchema: {
            type: "object",
            properties: {
                domain: { type: "string", description: "Domain name to check status for" },
            },
            required: ["domain"],
        },
    },
    {
        name: "autocomplete",
        description: "Autocomplete company names and retrieve logo and domain information",
        annotations: { readOnlyHint: true },
        inputSchema: {
            type: "object",
            properties: {
                query: { type: "string", description: "Partial company name or domain to search" },
            },
            required: ["query"],
        },
    },
    {
        name: "location",
        description: "Get employees location count by country for a domain",
        annotations: { readOnlyHint: true },
        inputSchema: {
            type: "object",
            properties: {
                domain: { type: "string", description: "Domain name to get location data for" },
            },
            required: ["domain"],
        },
    },
    {
        name: "person_enrichment",
        description: "Find person data including name, position, company, and social profiles by email",
        annotations: { readOnlyHint: true },
        inputSchema: {
            type: "object",
            properties: {
                email: { type: "string", description: "Email address to find person data for" },
            },
            required: ["email"],
        },
    },
    {
        name: "company_enrichment",
        description: "Find company data including industry, size, location, and social profiles by domain",
        annotations: { readOnlyHint: true },
        inputSchema: {
            type: "object",
            properties: {
                domain: { type: "string", description: "Domain name to find company data for" },
            },
            required: ["domain"],
        },
    },
    {
        name: "combined_enrichment",
        description: "Combined person and company enrichment by email - returns both person and company data",
        annotations: { readOnlyHint: true },
        inputSchema: {
            type: "object",
            properties: {
                email: { type: "string", description: "Email address for combined enrichment" },
            },
            required: ["email"],
        },
    },
    {
        name: "account_info",
        description: "Get current Tomba account information including plan, credits, and usage limits",
        annotations: { readOnlyHint: true },
        inputSchema: {
            type: "object",
            properties: {},
        },
    },
    {
        name: "usage_info",
        description: "Get current API usage statistics across all endpoints",
        annotations: { readOnlyHint: true },
        inputSchema: {
            type: "object",
            properties: {},
        },
    },
    {
        name: "list_flags",
        description: "List submitted data flags for incorrect data reports",
        annotations: { readOnlyHint: true },
        inputSchema: {
            type: "object",
            properties: {
                page: {
                    type: "number",
                    description: "Page number for pagination",
                    default: 1,
                },
                limit: {
                    type: "number",
                    description: "Maximum number of results per page (1-100)",
                    default: 10,
                },
            },
        },
    },
    {
        name: "create_flag",
        description: "Report incorrect data (e.g. hard bounce, wrong email) for credit recovery",
        inputSchema: {
            type: "object",
            properties: {
                flag_type: {
                    type: "string",
                    enum: ["email", "organization", "phone", "author_url", "website"],
                    description: "Type of data being flagged",
                },
                value: {
                    type: "string",
                    description: "The value being flagged (e.g. the email address or domain)",
                },
                reason: {
                    type: "string",
                    enum: ["hard_bounce", "invalid_email", "wrong_person", "outdated", "other", "wrong_company", "wrong_phone", "broken_url"],
                    description: "Reason for flagging the data",
                },
                comment: {
                    type: "string",
                    description: "Optional comment with additional details",
                },
            },
            required: ["flag_type", "value", "reason"],
        },
    },
    {
        name: "list_leads",
        description: "List leads with optional domain filter and pagination",
        annotations: { readOnlyHint: true },
        inputSchema: {
            type: "object",
            properties: {
                page: {
                    type: "number",
                    description: "Page number for pagination",
                    default: 1,
                },
                limit: {
                    type: "number",
                    description: "Maximum number of results per page (1-100)",
                    default: 10,
                },
                domain: {
                    type: "string",
                    description: "Filter leads by domain",
                },
            },
        },
    },
    {
        name: "create_lead",
        description: "Create a new lead record with email and list assignment",
        inputSchema: {
            type: "object",
            properties: {
                email: {
                    type: "string",
                    description: "Email address of the lead",
                },
                list_id: {
                    type: "number",
                    description: "ID of the leads list to add this lead to",
                },
                first_name: {
                    type: "string",
                    description: "First name of the lead",
                },
                last_name: {
                    type: "string",
                    description: "Last name of the lead",
                },
                company: {
                    type: "string",
                    description: "Company name of the lead",
                },
                position: {
                    type: "string",
                    description: "Job position of the lead",
                },
            },
            required: ["email", "list_id"],
        },
    },
    {
        name: "list_keys",
        description: "List your API keys",
        annotations: { readOnlyHint: true },
        inputSchema: {
            type: "object",
            properties: {},
        },
    },
    {
        name: "get_logs",
        description: "Get API request logs from the last 3 months",
        annotations: { readOnlyHint: true },
        inputSchema: {
            type: "object",
            properties: {
                page: {
                    type: "number",
                    description: "Page number for pagination",
                    default: 1,
                },
                limit: {
                    type: "number",
                    description: "Maximum number of results per page (1-100)",
                    default: 10,
                },
            },
        },
    },
];
