import type {
    GetPromptRequest,
    GetPromptResult,
} from "@modelcontextprotocol/sdk/types.js";

export async function handlePromptRequest(
    request: GetPromptRequest,
): Promise<GetPromptResult> {
    const { name, arguments: args } = request.params;

    switch (name) {
        case "find_contact":
            return handleFindContact(args);
        case "verify_email_list":
            return handleVerifyEmailList(args);
        case "research_company":
            return handleResearchCompany(args);
        case "enrich_lead":
            return handleEnrichLead(args);
        case "find_journalists":
            return handleFindJournalists(args);
        case "competitor_analysis":
            return handleCompetitorAnalysis(args);
        case "technology_audit":
            return handleTechnologyAudit(args);
        case "domain_insights":
            return handleDomainInsights(args);
        case "bulk_domain_research":
            return handleBulkDomainResearch(args);
        case "find_target_companies":
            return handleFindTargetCompanies(args);
        case "market_research":
            return handleMarketResearch(args);
        case "lead_generation":
            return handleLeadGeneration(args);
        case "prospect_enrichment":
            return handleProspectEnrichment(args);
        case "industry_analysis":
            return handleIndustryAnalysis(args);
        default:
            throw new Error(`Unknown prompt: ${name}`);
    }
}

function handleFindContact(
    args: Record<string, unknown> | undefined,
): GetPromptResult {
    const firstName = args?.firstName as string;
    const lastName = args?.lastName as string;
    const company = args?.company as string;

    if (!firstName || !lastName || !company) {
        throw new Error("firstName, lastName, and company are required");
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
}

function handleVerifyEmailList(
    args: Record<string, unknown> | undefined,
): GetPromptResult {
    const emails = (args?.emails as string)?.split(",").map((e) => e.trim());

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
}

function handleResearchCompany(
    args: Record<string, unknown> | undefined,
): GetPromptResult {
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
}

function handleEnrichLead(
    args: Record<string, unknown> | undefined,
): GetPromptResult {
    const email = args?.email as string;
    const linkedin = args?.linkedin as string;

    if (!email && !linkedin) {
        throw new Error("Either email or linkedin parameter is required");
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
}

function handleFindJournalists(
    args: Record<string, unknown> | undefined,
): GetPromptResult {
    const urls = (args?.urls as string)?.split(",").map((u) => u.trim());

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
}

function handleCompetitorAnalysis(
    args: Record<string, unknown> | undefined,
): GetPromptResult {
    const targetDomain = args?.domain as string;
    const includeTechnology = args?.include_technology as string;

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
}

function handleTechnologyAudit(
    args: Record<string, unknown> | undefined,
): GetPromptResult {
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
}

function handleDomainInsights(
    args: Record<string, unknown> | undefined,
): GetPromptResult {
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
}

function handleBulkDomainResearch(
    args: Record<string, unknown> | undefined,
): GetPromptResult {
    const domains = (args?.domains as string)?.split(",").map((d) => d.trim());
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
}

function handleFindTargetCompanies(
    args: Record<string, unknown> | undefined,
): GetPromptResult {
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
        if (location) targetText += `- Location: ${location}\n`;
        if (industry) targetText += `- Industry: ${industry}\n`;
        if (size) targetText += `- Size: ${size}\n`;
        targetText += `\n`;
    }

    targetText += `Please:\n`;
    targetText += `1. Use the companies_search tool with query: "${query}"`;
    if (hasFilters) {
        targetText += ` and filters: ${JSON.stringify(filters, null, 2)}`;
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
}

function handleMarketResearch(
    args: Record<string, unknown> | undefined,
): GetPromptResult {
    const researchIndustry = args?.industry as string;
    const researchLocation = args?.location as string;
    const sizeRange = args?.size_range as string;
    const includeContacts = args?.include_contacts as string;

    if (!researchIndustry || !researchLocation) {
        throw new Error("industry and location parameters are required");
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
}

function handleLeadGeneration(
    args: Record<string, unknown> | undefined,
): GetPromptResult {
    const companyQuery = args?.company_query as string;
    const targetDepartment = args?.target_department as string;
    const contactRole = args?.contact_role as string;

    if (!companyQuery) {
        throw new Error("company_query parameter is required");
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
}

function handleProspectEnrichment(
    args: Record<string, unknown> | undefined,
): GetPromptResult {
    const companyName = args?.company_name as string;
    const prospectLocation = args?.location as string;
    const getTechnology = args?.get_technology as string;
    const getContacts = args?.get_contacts as string;

    if (!companyName) {
        throw new Error("company_name parameter is required");
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
}

function handleIndustryAnalysis(
    args: Record<string, unknown> | undefined,
): GetPromptResult {
    const analysisIndustry = args?.industry as string;
    const analysisLocation = args?.location as string;
    const companySizes = args?.company_sizes as string;
    const industryIncludeTechnology = args?.include_technology as string;

    if (!analysisIndustry || !analysisLocation) {
        throw new Error("industry and location parameters are required");
    }

    let analysisFilters: any = {
        industry: { include: [analysisIndustry] },
        location_city: { include: [analysisLocation] },
    };
    if (companySizes) {
        analysisFilters.size = {
            include: companySizes.split(",").map((s) => s.trim()),
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
}
