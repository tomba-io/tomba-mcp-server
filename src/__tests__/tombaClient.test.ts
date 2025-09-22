import { TombaMcpClient } from "../client/mcpClient";
import { TombaClient, Domain, Finder, Phone } from "tomba";
import {
  DomainSearchParams,
  EmailFinderParams,
  EmailVerifierParams,
  EmailEnrichmentParams,
  AuthorFinderParams,
  LinkedinFinderParams,
  PhoneFinderParams,
  PhoneValidatorParams,
} from "../types";

// Mock the tomba client
jest.mock("tomba");

const MockedClient = TombaClient as jest.MockedClass<typeof TombaClient>;

describe("TombaClient", () => {
  let tombaClient: TombaClient;
  let mockTombaInstance: jest.Mocked<TombaClient>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockTombaInstance = {
      setApiKey: jest.fn(),
      setSecretKey: jest.fn(),
      domainSearch: jest.fn(),
      emailFinder: jest.fn(),
      emailVerifier: jest.fn(),
      enrichment: jest.fn(),
      authorFinder: jest.fn(),
      linkedinFinder: jest.fn(),
      companySearch: jest.fn(),
      phoneNumbersByEmail: jest.fn(),
      phoneNumbersByDomain: jest.fn(),
      phoneNumbersByLinkedin: jest.fn(),
      phoneNumberValidation: jest.fn(),
    } as any;

    MockedClient.mockImplementation(() => mockTombaInstance);

    tombaClient = new TombaClient();
    tombaClient.setKey("test_api_key");
    tombaClient.setSecret("test_secret_key");
  });

  describe("constructor", () => {
    it("should initialize client with credentials", () => {
      expect(MockedClient).toHaveBeenCalledTimes(1);
      expect(mockTombaInstance.setKey).toHaveBeenCalledWith("test_api_key");
      expect(mockTombaInstance.setSecret).toHaveBeenCalledWith(
        "test_secret_key"
      );
    });
  });
});
