// LexiLens Background Service Worker

import { DEFAULT_SETTINGS, LexiLensSettings } from '../types';
import { getSettings, saveSettings } from '../utils/storage';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Initialize default settings on installation
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    console.log('[LexiLens] Extension installed, setting defaults');
    await saveSettings(DEFAULT_SETTINGS);
  } else if (details.reason === 'update') {
    console.log('[LexiLens] Extension updated to version', chrome.runtime.getManifest().version);
    // Merge new default settings with existing settings
    const existing = await getSettings();
    const merged = { ...DEFAULT_SETTINGS, ...existing };
    await saveSettings(merged);
  }
});


// Context menu setup
const setupContextMenus = () => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'lexilens-read-selection',
      title: '🔊 Read with LexiLens',
      contexts: ['selection'],
    });

    chrome.contextMenus.create({
      id: 'lexilens-summarize-selection',
      title: '📝 Summarize with LexiLens',
      contexts: ['selection'],
    });

    chrome.contextMenus.create({
      id: 'lexilens-create-comic',
      title: '🍌 Create Nano Banana Comic',
      contexts: ['selection'],
    });
  });
};

chrome.runtime.onInstalled.addListener(() => {
  // onInstalled handles both install and update (and reload in dev mode usually)
  setupContextMenus();
});


// Helper to inject scripts safely
const injectIrisScripts = (tabId: number) => {
  chrome.scripting.executeScript({
    target: { tabId },
    files: ['webgazer.js'],
    world: 'MAIN',
  }, () => {
    if (chrome.runtime.lastError) {
      console.error('Failed to inject WebGazer:', JSON.stringify(chrome.runtime.lastError));
      return;
    }
    chrome.scripting.executeScript({
      target: { tabId },
      files: ['iris-driver.js'],
      world: 'MAIN',
    });
  });
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'INJECT_IRIS' && sender.tab?.id) {
    injectIrisScripts(sender.tab.id);
  }
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.selectionText && tab?.id) {
    if (info.menuItemId === 'lexilens-read-selection') {
      chrome.tabs.sendMessage(tab.id, {
        type: 'READ_TEXT',
        payload: info.selectionText,
      });
    } else if (info.menuItemId === 'lexilens-summarize-selection') {
      chrome.tabs.sendMessage(tab.id, {
        type: 'SUMMARIZE_TEXT',
        payload: info.selectionText,
      });
    } else if (info.menuItemId === 'lexilens-create-comic') {
      chrome.tabs.sendMessage(tab.id, {
        type: 'GENERATE_COMIC',
        payload: info.selectionText,
      });
    }
  }
});

// Handle messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_SETTINGS') {
    getSettings().then((settings) => {
      sendResponse({ success: true, settings });
    });
    return true; // Keep channel open for async response
  }

  if (message.type === 'SAVE_SETTINGS') {
    saveSettings(message.payload as LexiLensSettings).then(() => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (message.type === 'TOGGLE_EXTENSION') {
    getSettings().then(async (settings) => {
      const newSettings = { ...settings, enabled: !settings.enabled };
      await saveSettings(newSettings);
      sendResponse({ success: true, enabled: newSettings.enabled });
    });
    return true;
  }

  if (message.type === 'FETCH_COMIC_FROM_BACKGROUND') {
    (async () => {
      try {
        // const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
        // Temporary Debug: Hardcode check
        const API_KEY = "AIzaSyCPurivlaBpWRQXEmSJES6H7EN0BuA2lTk";

        // Debug Log: Check if key is loaded (masked)
        console.log("[LexiLens] API Key detected:", API_KEY ? `${API_KEY.substring(0, 4)}... analytics check` : "MISSING");

        if (!API_KEY || API_KEY.trim() === "") {
          console.error("Gemini API Key is missing or invalid.");
          sendResponse({ success: false, error: "MISSING_API_KEY: Please add VITE_GEMINI_API_KEY to your .env file and restart 'npm run dev'." });
          return;
        }

        const genAI = new GoogleGenerativeAI(API_KEY);

        // Use a function to try multiple models in case one is restricted/not found
        const tryGenerate = async (modelName: string) => {
          const model = genAI.getGenerativeModel({
            model: modelName,
            safetySettings: [
              { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
              { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
              { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
              { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            ]
          });

          const styles = [
            '1930s Rubber Hose Animation (classic cartoon, bouncy, ink-blot)',
            'Cyberpunk Neon-Vector (high contrast, glowing lines, vibrant purples/cyans)',
            'Minimalist Zen-Brush (elegant ink strokes, lots of negative space, brush textures)',
            'Retro-Futurism Collage (textured paper, geometric shapes, mid-century sci-fi vibe)'
          ];
          const selectedStyle = styles[Math.floor(Math.random() * styles.length)];

          const prompt = `
            ROLE: You are a Surrealist Graphic Novelist and a Neuro-Psychologist.
            TASK: Create an "Out-of-the-Box" Narrative Visualization (Nano Banana V4) for this text: "${message.payload}"
            
            CREATIVE PARADIGM:
            - ART STYLE: ${selectedStyle}.
            - VISUAL LOGIC: Never use literal translations. Use 'Visual Pun' logic for abstract nouns. 
              (e.g., if the text is about 'Economic Inflation', show the mascot tethering a giant coin-shaped balloon).
            - COMPOSITION (Conceptual Art Storyboard):
              Panel 1: Extreme Close-up (Focus on intense emotion of the mascot).
              Panel 2: Wide Cinematic Shot (Show the surreal environment/metaphor).
              Panel 3: First-Person Perspective (Through the mascot's eyes, showing success/glow-up).
            - DYNAMIC LAYOUT: Abandon boring boxes. Use skewed angles, varying sizes, and overlapping elements. 
              The mascot's arm or effects like 'POW' bursts should 'break' the panel borders.
            
            TECHNICAL INNOVATION:
            - SHADOWS & DEPTH: Use <feGaussianBlur> and <feOffset> for floating 3D layer effects.
            - META-NARRATIVE: The mascot should interact with the UI or the text itself (e.g., sweeping away letters).
            - LIGHTING: Use <radialGradient> for God Rays or spotlights in Panel 3.
            
            DIRECTIVES:
            - Background: Must be #FDFCF2. Panels can have vibrant, textured accent colors based on the style.
            - Captions: Integrate text into the art (on signs, carved into scenery). Use <text> tags with 'font-family: sans-serif; font-weight: 800;'.
            - Formatting: Return ONLY the raw <svg> code. No markdown code blocks. The SVG must be responsive (viewBox="0 0 1200 400").
          `;
          const result = await model.generateContent(prompt);
          return await result.response;
        };

        let response;
        // User requested Gemini 2.5 Flash (Year 2026)
        const modelsToTry = ["gemini-2.5-flash"];
        let firstError: Error | null = null;

        for (const modelName of modelsToTry) {
          try {
            console.log(`[LexiLens] Trying model: ${modelName}`);
            response = await tryGenerate(modelName);
            if (response) break; // Success!
          } catch (e: any) {
            console.warn(`[LexiLens] ${modelName} failed:`, e.message);
            // Capture the first error (usually the most relevant, e.g. quota or auth), 
            // instead of showing the user the error from the last fallback model.
            if (!firstError) firstError = e;
          }
        }

        if (!response) {
          throw firstError || new Error("All models failed to generate content.");
        }
        let textResponse = response.text();
        textResponse = textResponse.replace(/```svg/g, '').replace(/```/g, '').trim();

        sendResponse({ success: true, data: textResponse });
      } catch (error: any) {
        console.error("Background AI Gen Failed:", error);
        // Extract useful error message
        const errorMsg = error.message || String(error);
        sendResponse({ success: false, error: errorMsg });
      }
    })();
    return true;
  }
});

// Log when service worker starts
console.log('[LexiLens] Background service worker started');
