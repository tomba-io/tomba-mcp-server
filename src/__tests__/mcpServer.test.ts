import { TombaMCPServer } from "../server/mcpServer";
import { TombaMcpClient } from "../client/mcpClient";
import { TombaClient } from "tomba";

// Mock the dependencies
jest.mock("../client/mcpClient");
jest.mock("@modelcontextprotocol/sdk/server/index.js", () => ({
  Server: jest.fn().mockImplementation(() => ({
    setRequestHandler: jest.fn(),
    connect: jest.fn(),
    onerror: null,
  })),
}));

const MockedTombaClient = TombaClient as jest.MockedClass<typeof TombaClient>;

describe("TombaMCPServer", () => {
  let server: TombaMCPServer;
  let mockTombaClient: jest.Mocked<TombaClient>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockTombaClient = {
      domainSearch: jest.fn(),
      emailFinder: jest.fn(),
      emailVerifier: jest.fn(),
      emailEnrichment: jest.fn(),
      authorFinder: jest.fn(),
      linkedinFinder: jest.fn(),
      phoneFinder: jest.fn(),
      phoneValidator: jest.fn(),
    } as any;

    MockedTombaClient.mockImplementation(() => mockTombaClient);

    server = new TombaMCPServer();
  });

  describe("constructor", () => {
    it("should initialize server", () => {
      expect(server).toBeInstanceOf(TombaMCPServer);
    });
  });

  describe("setCredentials", () => {
    it("should create TombaClient with credentials", () => {
      const config = {
        apiKey: "test_api_key",
        secretKey: "test_secret_key",
      };

      server.setCredentials(config);

      expect(MockedTombaClient).toHaveBeenCalledWith(config);
    });
  });

  describe("tool handlers", () => {
    beforeEach(() => {
      server.setCredentials({
        apiKey: "test_api_key",
        secretKey: "test_secret_key",
      });
    });
  });
});
