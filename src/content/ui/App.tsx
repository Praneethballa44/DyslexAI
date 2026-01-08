import React, { useState, useEffect } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import { HandTrackingService } from '@/core/handTracking.service';
import { ComicModal } from '@/components/ComicModal';
import { FAB, Panel, SummaryModal } from './components';
import { ExtensionMessage } from '@/types';
import {
  applyTypography,
  removeTypography,
  enableReadingRuler,
  updateReadingRuler,
  disableReadingRuler,
  enableScreenTint,
  updateScreenTint,
  disableScreenTint,
  enableFocusMode,
  updateFocusMode,
  disableFocusMode,
  enableBionicReading,
  disableBionicReading,
  enableSyllableSplitter,
  disableSyllableSplitter,
  enableHandConductor,
  updateHandConductor,
  disableHandConductor,
  enableHandFocus,
  updateHandFocus,
  disableHandFocus,
  enableClickMagnifier,
  disableClickMagnifier,
  enableReadingFocus,
  disableReadingFocus,
} from '../modifiers';
import { enableClickToRead, disableClickToRead } from '@/utils/speech';

export const App: React.FC = () => {
  const { settings, isLoading, initialize } = useSettingsStore();
  const [isOpen, setIsOpen] = useState(false);
  const [summaryText, setSummaryText] = useState<string | null>(null);
  const [comicModeOpen, setComicModeOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');

  // Initialize settings on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Apply/remove modifiers when settings change
  useEffect(() => {
    if (isLoading) return;

    // Master switch
    if (!settings.enabled) {
      // Remove all effects
      removeTypography();
      disableReadingRuler();
      disableScreenTint();
      disableFocusMode();
      disableBionicReading();
      disableSyllableSplitter();
      disableSyllableSplitter();
      disableClickToRead();
      disableClickMagnifier();
      disableReadingFocus();
      return;
    }

    // Typography
    applyTypography(settings.typography);

    // Reading Ruler
    if (settings.visualAids.readingRuler.enabled) {
      enableReadingRuler(settings.visualAids.readingRuler);
    } else {
      disableReadingRuler();
    }

    // Screen Tint
    if (settings.visualAids.screenTint?.enabled && settings.visualAids.screenTint.preset !== 'none') {
      enableScreenTint(settings.visualAids.screenTint);
    } else {
      disableScreenTint();
    }

    // Focus Mode
    if (settings.visualAids.focusMode?.enabled) {
      enableFocusMode(settings.visualAids.focusMode);
    } else {
      disableFocusMode();
    }

    // Bionic Reading
    if (settings.cognitive.bionicReading.enabled) {
      enableBionicReading(settings.cognitive.bionicReading);
    } else {
      disableBionicReading();
    }

    // Syllable Splitter
    if (settings.cognitive.syllableSplitter.enabled) {
      enableSyllableSplitter(settings.cognitive.syllableSplitter);
    } else {
      disableSyllableSplitter();
    }

    // Hand Conductor (Rhythm Engine)
    if (settings.visualAids.handConductor?.enabled) {
      enableHandConductor(settings.visualAids.handConductor);
    } else {
      disableHandConductor();
    }

    // Hand Focus (Hand Tracking)
    if (settings.visualAids.handFocus?.enabled) {
      enableHandFocus(settings.visualAids.handFocus);
    } else {
      disableHandFocus();
    }

    // Reading Focus (Contextual Window)
    if (settings.visualAids.readingFocus?.enabled) {
      enableReadingFocus();
    } else {
      disableReadingFocus();
    }


    // Click to Read
    if (settings.audio.clickToRead) {
      enableClickToRead(settings.audio);
    } else {
      disableClickToRead();
    }

    // Click Magnifier (Disabled by user request - too intrusive)
    // enableClickMagnifier();
    disableClickMagnifier();

  }, [settings, isLoading]);

  // Update modifiers when specific settings change
  useEffect(() => {
    if (isLoading || !settings.enabled) return;
    updateReadingRuler(settings.visualAids.readingRuler);
  }, [settings.visualAids.readingRuler, isLoading, settings.enabled]);

  useEffect(() => {
    if (isLoading || !settings.enabled) return;
    updateScreenTint(settings.visualAids.screenTint);
  }, [settings.visualAids.screenTint, isLoading, settings.enabled]);

  useEffect(() => {
    if (isLoading || !settings.enabled) return;
    updateFocusMode(settings.visualAids.focusMode);
  }, [settings.visualAids.focusMode, isLoading, settings.enabled]);

  useEffect(() => {
    if (isLoading || !settings.enabled) return;
    updateHandConductor(settings.visualAids.handConductor);
  }, [settings.visualAids.handConductor, isLoading, settings.enabled]);

  useEffect(() => {
    if (isLoading || !settings.enabled) return;
    updateHandFocus(settings.visualAids.handFocus);
  }, [settings.visualAids.handFocus, isLoading, settings.enabled]);

  // Hand Tracking Service Integration (Digital Conductor)
  useEffect(() => {
    if (!settings.enabled || !settings.visualAids.handConductor.enabled) {
      HandTrackingService.getInstance().stopTracking();
      return;
    }

    // Initialize and start tracking
    const startService = async () => {
      // We need a video element for input. 
      // In this specialized implementation, we'll create a hidden video element 
      // or rely on the existing camera setup if one exists.
      // For now, we assume the camera manager in core/camera might be needed,
      // but the service interface asks for a video element.
      // We will create an offscreen video element for this service loop.
      let video = document.getElementById('lexilens-conductor-video') as HTMLVideoElement;
      if (!video) {
        video = document.createElement('video');
        video.id = 'lexilens-conductor-video';
        video.style.display = 'none';
        video.autoplay = true;
        document.body.appendChild(video);

        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          video.srcObject = stream;
        } catch (e) {
          console.error("Camera access denied for Conductor", e);
          return;
        }
      }

      await HandTrackingService.getInstance().startTracking(video);
    };

    startService();

    return () => {
      HandTrackingService.getInstance().stopTracking();
    };
  }, [settings.enabled, settings.visualAids.handConductor.enabled]);

  // Listen for Comic Mode Trigger (e.g. from context menu or hotkey)
  useEffect(() => {
    const handleComicTrigger = () => {
      const selection = window.getSelection()?.toString();
      if (selection) {
        setSelectedText(selection);
        setComicModeOpen(true);
      }
    };

    // Example hotkey: Alt+C
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.altKey && e.code === 'KeyC') {
        handleComicTrigger();
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  // Listen for Hand Conductor Events
  useEffect(() => {
    if (!settings.enabled || !settings.visualAids.handConductor.enabled) return;

    const handleScroll = (e: CustomEvent) => {
      const { deltaY } = e.detail;
      // Smooth scroll based on hand movement
      window.scrollBy({
        top: deltaY * 2, // Multiplier for sensitivity
        behavior: 'auto' // 'smooth' might be too laggy for continuous input
      });
    };

    const handleGesture = (e: CustomEvent) => {
      const { direction } = e.detail;
      if (direction === 'RIGHT') {
        setIsOpen(prev => !prev); // Toggle panel
      } else if (direction === 'LEFT') {
        setIsOpen(false); // Close panel
      }
    };

    window.addEventListener('LEXILENS_HAND_SCROLL', handleScroll as EventListener);
    window.addEventListener('LEXILENS_HAND_GESTURE', handleGesture as EventListener);

    return () => {
      window.removeEventListener('LEXILENS_HAND_SCROLL', handleScroll as EventListener);
      window.removeEventListener('LEXILENS_HAND_GESTURE', handleGesture as EventListener);
    };
  }, [settings.enabled, settings.visualAids.handConductor.enabled]);

  // Listen for extension messages (including Summarize)
  useEffect(() => {
    const handleMessage = (message: ExtensionMessage) => {
      if (message.type === 'SUMMARIZE_TEXT' && typeof message.payload === 'string') {
        setSummaryText(message.payload);
        setIsOpen(false); // Close panel if open
      } else if (message.type === 'GENERATE_COMIC' && typeof message.payload === 'string') {
        setSelectedText(message.payload);
        setComicModeOpen(true);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      removeTypography();
      disableReadingRuler();
      disableScreenTint();
      disableFocusMode();
      disableBionicReading();
      disableSyllableSplitter();

      disableSyllableSplitter();

      disableClickToRead();
      disableClickMagnifier();
      disableReadingFocus();
    };
  }, []);

  if (isLoading) {
    return null; // Don't render until settings are loaded
  }

  return (
    <div className="fixed bottom-6 right-6 z-[2147483647] flex flex-col items-end gap-4 font-sans">
      {/* Panel */}
      {isOpen && (
        <div className="animate-slide-up">
          <Panel onClose={() => setIsOpen(false)} />
        </div>
      )}

      {/* Summary Modal */}
      {summaryText && (
        <SummaryModal
          originalText={summaryText}
          onClose={() => setSummaryText(null)}
        />
      )}

      {/* FAB */}
      <FAB onClick={() => setIsOpen(!isOpen)} isOpen={isOpen} />

      {/* Comic Mode Modal */}
      <ComicModal
        isOpen={comicModeOpen}
        onClose={() => setComicModeOpen(false)}
        selectedText={selectedText}
      />

      {/* Conductor Glow Effect */}
      {/* Uses CSS variables set by HandTrackingService for opacity/color */}
      <div
        className="fixed inset-0 pointer-events-none z-[-1] transition-opacity duration-300"
        style={{
          boxShadow: 'inset 0 0 100px rgba(253, 252, 242, var(--lexi-velocity, 0))',
          opacity: 0.6
        }}
      />
    </div>
  );
};
