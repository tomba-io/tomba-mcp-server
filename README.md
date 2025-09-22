# [<img src="https://tomba.io/logo.svg" alt="Tomba" width="25"/>](https://tomba.io/) Tomba.io MCP Server

A Model Context Protocol (MCP) server for integrating with the Tomba.io API. This server provides comprehensive email discovery, verification, and enrichment capabilities through a standardized MCP interface.

## Features

- **Domain Search**: Find all email addresses associated with a domain
- **Email Finder**: Generate likely email addresses from names and domains
- **Email Verifier**: Verify email deliverability and check database presence
- **Email Enrichment**: Enrich emails with additional contact data
- **Author Finder**: Discover email addresses of article authors
- **LinkedIn Finder**: Find emails from LinkedIn profile URLs
- **Phone Finder**: Search phone numbers by email, domain, or LinkedIn
- **Phone Validator**: Validate phone numbers and check carrier info

## Installation

```bash
yarn
```

## Configuration

Set your Tomba.io API credentials as environment variables:

```bash
export TOMBA_API_KEY="your_api_key"
export TOMBA_SECRET_KEY="your_secret_key"
```

Alternatively, create a `.env` file in the root directory:

```env
TOMBA_API_KEY=your_api_key
TOMBA_SECRET_KEY=your_secret_key
```

## Usage

### Development

```bash
yarn dev
```

### Production

```bash
yarn build
npm start
```

### Running Tests

```bash
# Run tests once
npm test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage
```

### Linting

```bash
# Check for linting errors
yarn lint

# Fix linting errors
yarn lint:fix
```

## 🔍 Debugging & Testing

### MCP Inspector (Recommended)

The easiest way to test and debug your MCP server:

```bash
# Build and launch MCP Inspector
yarn debug
```

This opens a web interface where you can:

- 📋 View all available tools
- 🧪 Test tools interactively
- 📊 Inspect requests/responses
- 🐛 Debug in real-time

### Alternative Debug Methods

```bash
# Debug TypeScript directly
yarn debug:dev

# Run integration tests
yarn test:integration

# Manual testing
yarn build
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node dist/index.js
```

### VS Code Debugging

If using VS Code, use the included debug configurations:

- **Debug MCP Server**: Debug the compiled JavaScript
- **Debug TypeScript**: Debug TypeScript source directly
- **Debug with Inspector**: Debug with MCP Inspector
- **Run Tests**: Debug Jest tests

See `DEBUG_GUIDE.md` for comprehensive debugging instructions.

## 🧪 Testing Individual Tools

### 1. Domain Search

Search for email addresses associated with a domain name.

```json
{
  "name": "domain_search",
  "arguments": {
    "domain": "example.com",
    "limit": 10,
    "offset": 0,
    "type": "personal",
    "sources": true
  }
}
```

### 2. Email Finder

Generate likely email addresses from domain, first name, and last name.

```json
{
  "name": "email_finder",
  "arguments": {
    "domain": "example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### 3. Email Verifier

Verify email address deliverability and check database presence.

```json
{
  "name": "email_verifier",
  "arguments": {
    "email": "john.doe@example.com"
  }
}
```

### 4. Email Enrichment

Enrich an email address with additional contact information.

```json
{
  "name": "email_enrichment",
  "arguments": {
    "email": "john.doe@example.com"
  }
}
```

### 5. Author Finder

Find email addresses of article authors from a URL.

```json
{
  "name": "author_finder",
  "arguments": {
    "url": "https://example.com/article"
  }
}
```

### 6. LinkedIn Finder

Find email addresses from LinkedIn profile URLs.

```json
{
  "name": "linkedin_finder",
  "arguments": {
    "url": "https://linkedin.com/in/johndoe"
  }
}
```

### 8. Phone Finder

Search for phone numbers based on email, domain, or LinkedIn profile.

```json
{
  "name": "phone_finder",
  "arguments": {
    "email": "john.doe@example.com"
  }
}
```

### 9. Phone Validator

Validate phone numbers and check carrier information.

```json
{
  "name": "phone_validator",
  "arguments": {
    "phone": "+1234567890"
  }
}
```

## API Response Examples

### Domain Search Response

```json
{
  "domain": "example.com",
  "emails": [
    {
      "email": "john.doe@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "position": "Developer",
      "department": "Engineering",
      "type": "personal",
      "confidence": 95,
      "sources": [
        {
          "uri": "https://example.com/about",
          "website_piece": "contact",
          "extracted_on": "2023-01-01",
          "last_seen_on": "2023-01-01",
          "still_on_page": true
        }
      ]
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0
}
```

### Email Verification Response

```json
{
  "email": {
    "email": "john.doe@example.com",
    "gibberish": false,
    "disposable": false,
    "webmail": false,
    "result": "deliverable",
    "score": 95
  },
  "sources": []
}
```

### About Tomba

Founded in 2020, Tomba prides itself on being the most reliable, accurate, and in-depth source of Email address data available anywhere. We process terabytes of data to produce our Email finder API, company.

[![image](https://avatars.githubusercontent.com/u/67979591?s=200&v=4)](https://tomba.io/)

## Contribution

1. Fork it (<https://github.com/tomba-io/tomba-mcp-server/fork>)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request

## License

Please see the [Apache 2.0 license](http://www.apache.org/licenses/LICENSE-2.0.html) file for more information.
