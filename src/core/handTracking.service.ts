import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

export class HandTrackingService {
    private static instance: HandTrackingService;
    private handLandmarker: HandLandmarker | null = null;
    private video: HTMLVideoElement | null = null;
    private lastSubtitlesY = -1;
    private lastTime = 0;
    private isTracking = false;
    private animationFrameId: number | null = null;

    // Configuration Constants
    private readonly VELOCITY_THRESHOLD_HIGH = 1.5; // Fast movement
    private readonly VELOCITY_THRESHOLD_LOW = 0.2;  // Slow movement
    private readonly MIN_LINE_HEIGHT = 1.5;
    private readonly MAX_LINE_HEIGHT = 2.5;
    private readonly MIN_SPACING = 0; // px
    private readonly MAX_SPACING = 4; // px

    private constructor() { }

    public static getInstance(): HandTrackingService {
        if (!HandTrackingService.instance) {
            HandTrackingService.instance = new HandTrackingService();
        }
        return HandTrackingService.instance;
    }

    public async initialize(): Promise<void> {
        if (this.handLandmarker) return;

        try {
            const vision = await FilesetResolver.forVisionTasks(
                'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm'
            );

            this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
                    delegate: 'GPU',
                },
                runningMode: 'VIDEO',
                numHands: 1,
            });

            console.log('HandTrackingService: Initialized');
        } catch (error) {
            console.error('HandTrackingService: Initialization failed', error);
        }
    }

    public async startTracking(videoElement: HTMLVideoElement): Promise<void> {
        if (!this.handLandmarker) await this.initialize();
        this.video = videoElement;
        this.isTracking = true;
        this.processVideo();
    }

    public stopTracking(): void {
        this.isTracking = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        // creating a cleaner visual exit state could be done here
        document.documentElement.style.removeProperty('--lexi-velocity');
        document.documentElement.style.removeProperty('--lexi-line-height');
        document.documentElement.style.removeProperty('--lexi-spacing');
    }

    private processVideo() {
        if (!this.isTracking || !this.video || !this.handLandmarker) return;

        const startTimeMs = performance.now();

        // Throttling to ~20Hz (50ms) if needed, but requestAnimationFrame is usually 60Hz.
        // We will measure delta time to calculate velocity accurately regardless of frame rate.

        if (this.video.currentTime !== this.lastTime) {
            const detections = this.handLandmarker.detectForVideo(this.video, startTimeMs);

            if (detections.landmarks && detections.landmarks.length > 0) {
                this.handleHandData(detections.landmarks[0], startTimeMs);
            }
            this.lastTime = this.video.currentTime;
        }

        this.animationFrameId = requestAnimationFrame(() => this.processVideo());
    }

    private handleHandData(landmarks: any[], time: number) {
        // Index finger tip is landmark 8
        const indexTip = landmarks[8];
        const y = indexTip.y; // Normalized 0-1

        // Calculate Y-Velocity 
        // We assume the hand moving DOWN (reading) is positive progress, but speed is absolute.
        // For "conducting", we care about speed (magnitude).

        // We need state to calculate delta.
        // Initial state check
        if (this.lastSubtitlesY === -1) {
            this.lastSubtitlesY = y;
            return;
        }

        // Delta Y
        const dy = Math.abs(y - this.lastSubtitlesY);
        // Delta Time (in seconds to make sense of speed)
        // processVideo runs often, but `time` is high precision
        // We can use a simpler frame-to-frame delta for visual effects

        const velocity = dy * 100; // Scale up for usability

        this.updateCSSVariables(velocity);
        this.lastSubtitlesY = y;
    }

    private updateCSSVariables(velocity: number) {
        // Map velocity to Line Height and Spacing
        // Fast hand = Reading fast = tighter spacing, standard line height
        // Slow hand = Reading slow/struggling = expand spacing, increase line height

        // Normalizing velocity 0 to VELOCITY_THRESHOLD_HIGH
        const t = Math.min(Math.max(velocity, this.VELOCITY_THRESHOLD_LOW), this.VELOCITY_THRESHOLD_HIGH);
        const normalizedSpeed = (t - this.VELOCITY_THRESHOLD_LOW) / (this.VELOCITY_THRESHOLD_HIGH - this.VELOCITY_THRESHOLD_LOW);

        // Invert relationship: Higher speed = Lower expansion (closer to normal)
        // Lower speed = Higher expansion (easier to read)
        const expansionFactor = 1 - normalizedSpeed; // 1 (slow) to 0 (fast)

        const lineHeight = this.MIN_LINE_HEIGHT + (expansionFactor * (this.MAX_LINE_HEIGHT - this.MIN_LINE_HEIGHT));
        const spacing = this.MIN_SPACING + (expansionFactor * (this.MAX_SPACING - this.MIN_SPACING));

        // Direct DOM manipulation - NO React State triggers
        document.documentElement.style.setProperty('--lexi-velocity', velocity.toFixed(2));
        document.documentElement.style.setProperty('--lexi-line-height', lineHeight.toFixed(2));
        document.documentElement.style.setProperty('--lexi-spacing', `${spacing.toFixed(1)}px`);
    }
}
