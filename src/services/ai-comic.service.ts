// Service to offload AI generation to the background script
// to avoid CORS and CSP issues in the content script.

export class AiComicService {
    constructor() { }

    /**
     * Generates a 3-panel comic strip SVG for the given text.
     * @param text The text context to visualize.
     * @returns Raw SVG string.
     */
    async generateComic(text: string): Promise<string> {
        try {
            const response = await chrome.runtime.sendMessage({
                type: 'FETCH_COMIC_FROM_BACKGROUND',
                payload: text
            });

            if (response && response.success) {
                return response.data;
            } else {
                console.error("Nano Banana AI Error:", response?.error);
                // Alert the specific error to help user debug
                alert(`Nano Banana AI Error:\n${response?.error}`);
                return this.getFallbackSVG();
            }
        } catch (error) {
            console.error("Message Passing Failed:", error);
            return this.getFallbackSVG();
        }
    }

    private getFallbackSVG(): string {
        return `<svg viewBox="0 0 1200 400" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="400" fill="#FDFCF2"/>
      <rect x="10" y="10" width="380" height="380" fill="none" stroke="#2D2F33" stroke-width="4"/>
      <rect x="410" y="10" width="380" height="380" fill="none" stroke="#2D2F33" stroke-width="4"/>
      <rect x="810" y="10" width="380" height="380" fill="none" stroke="#2D2F33" stroke-width="4"/>
      <text x="600" y="200" font-family="sans-serif" font-size="24" text-anchor="middle" fill="#2D2F33">Comic Generation Unavailable</text>
    </svg>`;
    }
}

export const aiComicService = new AiComicService();
