export interface AIProvider {
  generateText(prompt: string): Promise<string>;
}

/**
 * Temporary development provider.
 *
 * This deliberately does NOT call an external AI API yet.
 * It allows us to test the content-engine architecture
 * without introducing API keys, billing, or network failures.
 */
export class MockAIProvider implements AIProvider {
  async generateText(_prompt: string): Promise<string> {
    throw new Error("MockAIProvider is not connected to an AI model yet.");
  }
}
