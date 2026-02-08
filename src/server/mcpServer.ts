import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    ListResourcesRequestSchema,
    ReadResourceRequestSchema,
    ListPromptsRequestSchema,
    GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";

import { TombaMcpClient } from "../client/mcpClient.js";
import type { TombaConfig } from "../types/index";
import { toolsList } from "./tools/toolsList.js";
import { handleToolCall } from "./tools/toolsHandler.js";
import { promptsList } from "./prompts/promptsList.js";
import { handlePromptRequest } from "./prompts/promptsHandler.js";
import { resourcesList } from "./resources/resourcesList.js";
import { handleResourceRead } from "./resources/resourcesHandler.js";
import pkg from "../../package.json" with { type: "json" };
export class TombaMCPServer {
    private server: Server;
    private tombaMcpClient: TombaConfig | null = null;
    private transports: Record<string, StreamableHTTPServerTransport> = {};

    constructor() {
        this.server = new Server(
            {
                name: "tomba-mcp-server",
                version: pkg.version,
            },
            {
                capabilities: {
                    tools: {},
                    resources: {},
                    prompts: {},
                },
            },
        );

        this.setupToolHandlers();
        this.setupResourceHandlers();
        this.setupPromptHandlers();
    }

    private setupToolHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: toolsList,
            };
        });

        this.server.setRequestHandler(
            CallToolRequestSchema,
            async (request) => {
                if (!this.tombaMcpClient) {
                    throw new Error(
                        "Tomba client not initialized. Please set API credentials first.",
                    );
                }

                const client = new TombaMcpClient(this.tombaMcpClient);
                return await handleToolCall(request, client);
            },
        );
    }

    private setupResourceHandlers() {
        this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
            return {
                resources: resourcesList,
            };
        });

        this.server.setRequestHandler(
            ReadResourceRequestSchema,
            async (request) => {
                if (!this.tombaMcpClient) {
                    throw new Error("Tomba client not initialized");
                }

                const client = new TombaMcpClient(this.tombaMcpClient);
                return await handleResourceRead(request, client);
            },
        );
    }

    private setupPromptHandlers() {
        this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
            return {
                prompts: promptsList,
            };
        });

        this.server.setRequestHandler(
            GetPromptRequestSchema,
            async (request) => {
                return await handlePromptRequest(request);
            },
        );
    }

    // Authorization middleware for HTTP transport
    private authMiddleware(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        if (!this.tombaMcpClient) {
            res.status(401).json({
                error: "Unauthorized",
                message: "Invalid API credentials",
            });
        }

        next();
    }

    public setCredentials(config: TombaConfig) {
        this.tombaMcpClient = config;
    }

    public async run(transportType: string = "stdio", port: number = 3000) {
        if (transportType === "http") {
            await this.runHttpTransport(port);
        } else {
            await this.runStdioTransport();
        }
    }

    private async runStdioTransport() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error("Tomba MCP server running on stdio");
    }

    private async runHttpTransport(port: number) {
        const app = express();
        app.use(express.json());
        app.use(cors());
        // POST endpoint for client-to-server communication
        app.post("/mcp", this.authMiddleware.bind(this), async (req, res) => {
            // Check for existing session ID
            const sessionId = req.headers["mcp-session-id"] as
                | string
                | undefined;
            let transport: StreamableHTTPServerTransport;

            if (sessionId && this.transports[sessionId]) {
                // Reuse existing transport
                transport = this.transports[sessionId];
            } else if (!sessionId && isInitializeRequest(req.body)) {
                // New initialization request
                transport = new StreamableHTTPServerTransport({
                    sessionIdGenerator: () => randomUUID(),
                    onsessioninitialized: (sessionId) => {
                        // Store the transport by session ID
                        this.transports[sessionId] = transport;
                    },
                });

                // Clean up transport when closed
                transport.onclose = () => {
                    if (transport.sessionId) {
                        delete this.transports[transport.sessionId];
                    }
                };

                // Connect to the MCP server
                await this.server.connect(transport);
            } else {
                // Invalid request
                res.status(400).json({
                    jsonrpc: "2.0",
                    error: {
                        code: -32000,
                        message: "Bad Request: No valid session ID provided",
                    },
                    id: null,
                });
                return;
            }

            // Handle the request
            await transport.handleRequest(req, res, req.body);
            return;
        });

        // GET endpoint for server-to-client notifications via Streamable HTTP
        app.get("/mcp", this.authMiddleware.bind(this), async (req, res) => {
            const sessionId = req.headers["x-session-id"] as string;

            if (!sessionId) {
                res.status(400).json({
                    jsonrpc: "2.0",
                    error: {
                        code: -32600,
                        message: "Missing X-Session-Id header",
                    },
                    id: null,
                });
                return;
            }

            const transport = this.transports[sessionId];

            if (!transport) {
                res.status(404).json({
                    jsonrpc: "2.0",
                    error: {
                        code: -32001,
                        message: `Session not found: ${sessionId}`,
                    },
                    id: null,
                });
                return;
            }

            try {
                await transport.handleRequest(req, res);
                return;
            } catch (error) {
                console.error("Error handling GET request:", error);
                if (!res.headersSent) {
                    res.status(500).json({
                        jsonrpc: "2.0",
                        error: {
                            code: -32603,
                            message:
                                error instanceof Error
                                    ? error.message
                                    : "Internal server error",
                        },
                        id: null,
                    });
                }
                return;
            }
        });

        // DELETE endpoint for session termination
        app.delete("/mcp", this.authMiddleware.bind(this), async (req, res) => {
            const sessionId = req.headers["x-session-id"] as string;

            if (!sessionId) {
                res.status(400).json({
                    jsonrpc: "2.0",
                    error: {
                        code: -32600,
                        message: "Missing X-Session-Id header",
                    },
                    id: null,
                });
                return;
            }

            const transport = this.transports[sessionId];

            if (!transport) {
                res.status(404).json({
                    jsonrpc: "2.0",
                    error: {
                        code: -32001,
                        message: `Session not found: ${sessionId}`,
                    },
                    id: null,
                });
                return;
            }

            try {
                // Close the transport connection
                await transport.close();

                // Remove the transport from the map
                delete this.transports[sessionId];

                console.error(`Session terminated: ${sessionId}`);

                res.status(200).json({
                    success: true,
                    message: "Session terminated successfully",
                    sessionId: sessionId,
                });
                return;
            } catch (error) {
                console.error("Error terminating session:", error);
                if (!res.headersSent) {
                    res.status(500).json({
                        jsonrpc: "2.0",
                        error: {
                            code: -32603,
                            message:
                                error instanceof Error
                                    ? error.message
                                    : "Internal server error",
                        },
                        id: null,
                    });
                }
                return;
            }
        });

        // Health check endpoint
        app.get("/health", (req, res) => {
            return res.json({
                status: "ok",
                server: "tomba-mcp-server",
                version: pkg.version,
                transport: "http",
                activeSessions: Object.keys(this.transports).length,
            });
        });

        // List active sessions endpoint (useful for debugging)
        app.get("/sessions", this.authMiddleware.bind(this), (req, res) => {
            return res.json({
                activeSessions: Object.keys(this.transports).length,
                sessionIds: Object.keys(this.transports),
            });
        });

        app.listen(port, () => {
            console.error(
                `Tomba MCP server running on http://localhost:${port}/mcp`,
            );
            console.error(
                `Health check available at http://localhost:${port}/health`,
            );
            console.error(
                `Session management available at http://localhost:${port}/sessions`,
            );
        });
    }
}
