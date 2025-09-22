#!/usr/bin/env node

import { TombaMCPServer } from "./server/mcpServer.js";

async function main() {
  const server = new TombaMCPServer();

  // Get credentials from environment variables
  const apiKey = process.env.TOMBA_API_KEY;
  const secretKey = process.env.TOMBA_SECRET_KEY;

  if (!apiKey || !secretKey) {
    console.error(
      "Error: TOMBA_API_KEY and TOMBA_SECRET_KEY environment variables are required"
    );
    process.exit(1);
  }

  server.setCredentials({
    apiKey,
    secretKey,
  });

  await server.run();
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.error("Received SIGINT, shutting down gracefully");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.error("Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

// Run if this is the main module
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
