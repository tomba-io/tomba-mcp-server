# [<img src="https://tomba.io/logo.svg" alt="Tomba" width="25"/>](https://tomba.io/) Tomba.io MCP Server

A Model Context Protocol (MCP) server for integrating with the Tomba.io API. This server provides comprehensive email discovery, verification, and enrichment capabilities through a standardized MCP interface.

## Features

### Tools (8 available)

-   **[Domain Search](https://tomba.io/domain-search)**: Find all email addresses associated with a domain
-   **[Email Finder](https://tomba.io/email-finder)**: Generate likely email addresses from names and domains
-   **[Email Verifier](https://tomba.io/email-verifier)**: Verify email deliverability and check database presence
-   **[Email Enrichment](https://tomba.io/enrichment)**: Enrich emails with additional contact data
-   **[Author Finder](https://tomba.io/author-finder)**: Discover email addresses of article authors
-   **[LinkedIn Finder](https://tomba.io/linkedin-finder)**: Find emails from LinkedIn profile URLs
-   **[Phone Finder](https://tomba.io/phone-finder)**: Search phone numbers by email, domain, or LinkedIn
-   **[Phone Validator](https://tomba.io/phone-validator)**: Validate phone numbers and check carrier info

### Resources (5 available)

-   `tomba://api/status` - API status and account info
-   `tomba://domain/{domain}` - Domain information
-   `tomba://email/{email}` - Email information
-   `tomba://docs/api` - API documentation
-   `tomba://docs/tools` - Tools documentation

### Prompts (7 pre-built workflows)

-   **find_contact** - Find complete contact info for a person
-   **verify_email_list** - Batch verify email addresses
-   **research_company** - Research company contacts and structure
-   **enrich_lead** - Enrich a lead with all available data
-   **find_journalists** - Find journalist contacts from articles
-   **finder_phone** - Find phone numbers for contacts
-   **validate_phone** - Validate a phone number

### Transport Options

-   **stdio** - Standard input/output (default, for Claude Desktop)
-   **http** - HTTP server with REST endpoints

## Installation

### Prerequisites

-   Node.js 18 or higher
-   npm or yarn
-   Tomba API account ([Sign up here](https://tomba.io))

### Option 1: Install via NPX (Recommended)

The easiest way to use the Tomba MCP server is via npx, which doesn't require cloning the repository:

#### macOS/Linux

Add to your `claude_desktop_config.json` (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
    "mcpServers": {
        "tomba": {
            "command": "npx",
            "args": ["-y", "tomba-mcp-server"],
            "env": {
                "TOMBA_API_KEY": "your-api-key-here",
                "TOMBA_SECRET_KEY": "your-secret-key-here"
            }
        }
    }
}
```

#### Windows

Add to your `claude_desktop_config.json` (`%APPDATA%\Claude\claude_desktop_config.json`):

```json
{
    "mcpServers": {
        "tomba": {
            "command": "npx",
            "args": ["-y", "tomba-mcp-server"],
            "env": {
                "TOMBA_API_KEY": "your-api-key-here",
                "TOMBA_SECRET_KEY": "your-secret-key-here"
            }
        }
    }
}
```

**Note:** The `-y` flag automatically accepts the installation prompt, and npx will always fetch the latest version.

### Option 2: Install from Source

If you want to modify the server or contribute to development:

```bash
# Clone the repository
git clone https://github.com/tomba-io/tomba-mcp-server.git
cd tomba-mcp-server

# Install dependencies
yarn install

# Build the project
yarn build
```

## Configuration

### Claude Desktop Setup

To use this server with Claude Desktop, add the configuration to your `claude_desktop_config.json` file.

#### Using NPX (Recommended)

This method automatically uses the latest published version:

**macOS/Linux** (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
    "mcpServers": {
        "tomba": {
            "command": "npx",
            "args": ["-y", "tomba-mcp-server"],
            "env": {
                "TOMBA_API_KEY": "your-api-key-here",
                "TOMBA_SECRET_KEY": "your-secret-key-here"
            }
        }
    }
}
```

**Windows** (`%APPDATA%\Claude\claude_desktop_config.json`):

```json
{
    "mcpServers": {
        "tomba": {
            "command": "npx",
            "args": ["-y", "tomba-mcp-server"],
            "env": {
                "TOMBA_API_KEY": "your-api-key-here",
                "TOMBA_SECRET_KEY": "your-secret-key-here"
            }
        }
    }
}
```

#### Using Local Installation

If you've built from source, use the absolute path to your installation:

**macOS/Linux:**

```json
{
    "mcpServers": {
        "tomba": {
            "command": "node",
            "args": ["/ABSOLUTE/PATH/TO/tomba-mcp-server/server/index.js"],
            "env": {
                "TOMBA_API_KEY": "your-api-key-here",
                "TOMBA_SECRET_KEY": "your-secret-key-here"
            }
        }
    }
}
```

**Windows:**

```json
{
    "mcpServers": {
        "tomba": {
            "command": "node",
            "args": [
                "C:\\ABSOLUTE\\PATH\\TO\\tomba-mcp-server\\server\\index.js"
            ],
            "env": {
                "TOMBA_API_KEY": "your-api-key-here",
                "TOMBA_SECRET_KEY": "your-secret-key-here"
            }
        }
    }
}
```

**Important Notes:**

-   Replace `your-api-key-here` and `your-secret-key-here` with your actual Tomba API credentials
-   For local installation, replace `/ABSOLUTE/PATH/TO/tomba-mcp-server` with the full path to your installation directory
-   Restart Claude Desktop after updating the configuration

### Getting Tomba API Credentials

1. Visit [https://tomba.io](https://tomba.io)
2. Sign up for an account or log in
3. Navigate to your dashboard
4. Go to API settings
5. Copy your API Key and Secret Key

### Alternative: Using HTTP Transport

For HTTP transport with npx:

```json
{
    "mcpServers": {
        "tomba": {
            "command": "npx",
            "args": [
                "-y",
                "tomba-mcp-server",
                "--transport",
                "http",
                "--port",
                "3000"
            ],
            "env": {
                "TOMBA_API_KEY": "your-api-key-here",
                "TOMBA_SECRET_KEY": "your-secret-key-here"
            }
        }
    }
}
```

For HTTP transport with local installation:

```json
{
    "mcpServers": {
        "tomba": {
            "command": "node",
            "args": [
                "/ABSOLUTE/PATH/TO/tomba-mcp-server/server/index.js",
                "--transport",
                "http",
                "--port",
                "3000"
            ],
            "env": {
                "TOMBA_API_KEY": "your-api-key-here",
                "TOMBA_SECRET_KEY": "your-secret-key-here"
            }
        }
    }
}
```

## Usage

### Command-line Options

```bash
Usage: tomba-mcp-server [options]

Options:
  --transport <type>    Transport type: 'stdio' or 'http' (default: stdio)
  --port <number>       Port number for HTTP transport (default: 3000)
  --help                Show help message

Environment Variables:
  TOMBA_API_KEY         Your Tomba API key (required)
  TOMBA_SECRET_KEY      Your Tomba secret key (required)

Examples:
  # Run with stdio transport (default)
  node server/index.js

  # Run with HTTP transport on default port (3000)
  node server/index.js --transport http

  # Run with HTTP transport on custom port
  node server/index.js --transport http --port 8080
```

### Standalone HTTP Server

You can also run the server as a standalone HTTP service:

```bash
export TOMBA_API_KEY="your-api-key"
export TOMBA_SECRET_KEY="your-secret-key"
node server/index.js --transport http --port 3000
```

#### HTTP API Endpoints

-   **POST /mcp** - Send JSON-RPC requests
-   **GET /mcp** - Server-Sent Events for notifications (requires X-Session-Id header)
-   **DELETE /mcp** - Terminate a session (requires X-Session-Id header)
-   **GET /health** - Health check endpoint
-   **GET /sessions** - List active sessions (requires authentication)

#### Example HTTP Request

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "email_finder",
      "arguments": {
        "domain": "stripe.com",
        "firstName": "Patrick",
        "lastName": "Collison"
      }
    },
    "id": 1
  }'
```

## 🔧 Development

### Development Commands

```bash
# Run in development mode
yarn dev

# Build the project
yarn build

# Run tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage

# Lint code
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

-   📋 View all available tools
-   🧪 Test tools interactively
-   📊 Inspect requests/responses
-   🐛 Debug in real-time

### Alternative Debug Methods

```bash
# Debug TypeScript directly
yarn debug:dev

# Run integration tests
yarn test:integration

# Manual testing
yarn build
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node server/index.js
```

### VS Code Debugging

If using VS Code, use the included debug configurations:

-   **Debug MCP Server**: Debug the compiled JavaScript
-   **Debug TypeScript**: Debug TypeScript source directly
-   **Debug with Inspector**: Debug with MCP Inspector
-   **Run Tests**: Debug Jest tests

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
        "page": 1,
        "department": "engineering",
        "country": "US"
    }
}
```

**Response:**

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
            "confidence": 95
        }
    ],
    "total": 1
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

**Response:**

```json
{
    "email": {
        "email": "john.doe@example.com",
        "gibberish": false,
        "disposable": false,
        "webmail": false,
        "result": "deliverable",
        "score": 95
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

### 7. Phone Finder

Search for phone numbers based on email, domain, or LinkedIn profile.

```json
{
    "name": "phone_finder",
    "arguments": {
        "email": "john.doe@example.com"
    }
}
```

### 8. Phone Validator

Validate phone numbers and check carrier information.

```json
{
    "name": "phone_validator",
    "arguments": {
        "phone": "+1234567890"
    }
}
```

## Troubleshooting

### Server Not Starting in Claude Desktop

1. **Check Node.js version**: Ensure you have Node.js 18 or higher

    ```bash
    node --version
    ```

2. **Using NPX:**

    - Ensure you have a stable internet connection for the first run
    - The `-y` flag should auto-accept the installation
    - NPX will cache the package after first use

3. **Using Local Installation:**

    - Verify absolute path is correct in your config
    - Ensure `server/index.js` exists: `ls -la server/index.js`
    - Make sure you ran `yarn build` successfully

4. **Verify API credentials**: Ensure your Tomba API keys are correct

5. **Check Claude logs**:
    - macOS: `~/Library/Logs/Claude/mcp*.log`
    - Windows: `%APPDATA%\Claude\logs\mcp*.log`

### NPX-Specific Issues

**"npx command not found":**

-   Ensure npm is installed: `npm --version`
-   NPX comes with npm 5.2.0+, update if needed: `npm install -g npm`

**Package not found:**

-   Verify the package is published: `npm view tomba-mcp-server`
-   Try clearing npm cache: `npm cache clean --force`

**Always downloading package:**

-   This is normal behavior with `-y` flag
-   NPX caches the package after first download
-   For a permanent installation, use local installation method

### Authentication Errors

-   Verify your API keys at [https://tomba.io/dashboard](https://tomba.io/dashboard)
-   Ensure environment variables are properly set in the config
-   Check that your API subscription is active

### Tools Not Responding

-   Check your Tomba API rate limits
-   Verify network connectivity
-   Review server logs for error messages

## About Tomba

Founded in 2020, Tomba prides itself on being the most reliable, accurate, and in-depth source of email address data available anywhere. We process terabytes of data to produce our Email finder API.

[![image](https://avatars.githubusercontent.com/u/67979591?s=200&v=4)](https://tomba.io/)

## Contributing

1. Fork it (<https://github.com/tomba-io/tomba-mcp-server/fork>)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request

## License

Please see the [License](LICENSE) file for more information.

## Support

-   [GitHub Issues](https://github.com/tomba-io/tomba-mcp-server/issues)
-   [Email Support](mailto:support@tomba.io)
-   [Website](https://tomba.io)
