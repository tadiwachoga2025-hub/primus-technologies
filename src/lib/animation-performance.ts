/**
 * Performance Utilities for Heavy WebGL Animations
 * Optimized for voronoi shattering + kaleidoscopic effects
 *
 * Features:
 * - Device capability detection (GPU tier)
 * - Adaptive quality scaling based on FPS
 * - Visibility-based throttling
 * - Memory management (texture pooling)
 * - Frame budget monitoring
 * - Mobile optimization
 */

// ============================================================================
// Types
// ============================================================================

export type DeviceCapability = 'high' | 'medium' | 'low';
export type QualityLevel = 'ultra' | 'high' | 'medium' | 'low' | 'minimal';

export interface QualitySettings {
  resolution: number;        // 0.5 = half resolution, 1.0 = full resolution
  particleCount: number;     // Number of voronoi particles
  bloomQuality: 'high' | 'medium' | 'low' | 'none';
  chromaticAberration: boolean;
  tileCount: number;         // Kaleidoscope tile grid size
  useSimpleShader: boolean;
  antialiasing: boolean;
  shadowQuality: 'high' | 'low' | 'none';
}

export interface FrameMetrics {
  fps: number;
  frameTime: number;
  droppedFrames: number;
  averageFPS: number;
}

export interface TexturePoolConfig {
  maxTextures: number;
  textureSize: number;
  format: number;
}

// ============================================================================
// Device Capability Detection
// ============================================================================

export class DeviceCapabilityDetector {
  private static instance: DeviceCapabilityDetector;
  private capability: DeviceCapability | null = null;

  static getInstance(): DeviceCapabilityDetector {
    if (!this.instance) {
      this.instance = new DeviceCapabilityDetector();
    }
    return this.instance;
  }

  getDeviceCapability(): DeviceCapability {
    if (this.capability) return this.capability;

    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      this.capability = 'medium';
      return this.capability;
    }

    let score = 0;

    // 1. Check GPU info
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

        // High-end GPUs
        if (/(NVIDIA|AMD|Apple M[1-9]|Intel Iris)/i.test(renderer)) {
          score += 3;
        }
        // Integrated graphics
        else if (/Intel/i.test(renderer)) {
          score += 1;
        }
      }

      // Check max texture size
      const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      if (maxTextureSize >= 8192) score += 2;
      else if (maxTextureSize >= 4096) score += 1;

      // Check max render buffer size
      const maxRenderBufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
      if (maxRenderBufferSize >= 8192) score += 1;
    }

    // 2. Check device memory (Chrome only)
    const nav = navigator as unknown as { deviceMemory?: number };
    const memory = nav.deviceMemory;
    if (memory) {
      if (memory >= 8) score += 2;
      else if (memory >= 4) score += 1;
    }

    // 3. Check CPU cores
    const cores = navigator.hardwareConcurrency || 2;
    if (cores >= 8) score += 2;
    else if (cores >= 4) score += 1;

    // 4. Mobile detection (mobile = automatic penalty)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    if (isMobile) {
      score = Math.max(0, score - 3); // Penalty for mobile
    }

    // 5. Screen resolution
    const pixelRatio = window.devicePixelRatio || 1;
    const screenPixels = window.innerWidth * window.innerHeight * pixelRatio;
    if (screenPixels > 2073600) score -= 1; // 1080p+ = performance hit

    // Calculate capability
    if (score >= 7) this.capability = 'high';
    else if (score >= 4) this.capability = 'medium';
    else this.capability = 'low';

    console.log('[Performance] Device capability:', this.capability, `(score: ${score})`);

    return this.capability;
  }

  isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  isLowPowerMode(): boolean {
    // Check battery API for low power mode hints
    if ('getBattery' in navigator) {
      const nav = navigator as unknown as { getBattery: () => Promise<{ level: number }> };
      return nav.getBattery().then((battery) => {
        return battery.level < 0.2; // Low battery = reduce quality
      }) as unknown as boolean;
    }
    return false;
  }
}

// ============================================================================
// Quality Preset Manager
// ============================================================================

export class QualityPresetManager {
  static readonly PRESETS: Record<QualityLevel, QualitySettings> = {
    ultra: {
      resolution: 1.0,
      particleCount: 150,
      bloomQuality: 'high',
      chromaticAberration: true,
      tileCount: 8,
      useSimpleShader: false,
      antialiasing: true,
      shadowQuality: 'high',
    },
    high: {
      resolution: 1.0,
      particleCount: 100,
      bloomQuality: 'high',
      chromaticAberration: true,
      tileCount: 8,
      useSimpleShader: false,
      antialiasing: true,
      shadowQuality: 'high',
    },
    medium: {
      resolution: 0.75,
      particleCount: 60,
      bloomQuality: 'medium',
      chromaticAberration: true,
      tileCount: 6,
      useSimpleShader: false,
      antialiasing: false,
      shadowQuality: 'low',
    },
    low: {
      resolution: 0.5,
      particleCount: 30,
      bloomQuality: 'low',
      chromaticAberration: false,
      tileCount: 4,
      useSimpleShader: true,
      antialiasing: false,
      shadowQuality: 'none',
    },
    minimal: {
      resolution: 0.5,
      particleCount: 15,
      bloomQuality: 'none',
      chromaticAberration: false,
      tileCount: 4,
      useSimpleShader: true,
      antialiasing: false,
      shadowQuality: 'none',
    },
  };

  static getPresetForCapability(capability: DeviceCapability): QualitySettings {
    switch (capability) {
      case 'high':
        return { ...this.PRESETS.high };
      case 'medium':
        return { ...this.PRESETS.medium };
      case 'low':
        return { ...this.PRESETS.low };
    }
  }

  static getPresetForMobile(): QualitySettings {
    return { ...this.PRESETS.low };
  }
}

// ============================================================================
// Adaptive Quality Controller (FPS-based)
// ============================================================================

export class AdaptiveQualityController {
  private currentQuality: QualitySettings;
  private targetFPS: number;
  private fpsHistory: number[] = [];
  private readonly historySize = 60; // 1 second at 60fps
  private lastAdjustTime = 0;
  private readonly adjustCooldown = 3000; // 3 seconds between adjustments
  private onQualityChange?: (settings: QualitySettings) => void;

  constructor(
    initialQuality: QualitySettings,
    targetFPS: number = 30,
    onQualityChange?: (settings: QualitySettings) => void
  ) {
    this.currentQuality = { ...initialQuality };
    this.targetFPS = targetFPS;
    this.onQualityChange = onQualityChange;
  }

  recordFrame(deltaTime: number): void {
    const fps = 1000 / deltaTime;
    this.fpsHistory.push(fps);

    if (this.fpsHistory.length > this.historySize) {
      this.fpsHistory.shift();
    }

    // Check if we should adjust quality
    if (this.fpsHistory.length >= 30) { // Wait for 0.5s of data
      this.checkAndAdjustQuality();
    }
  }

  private checkAndAdjustQuality(): void {
    const now = Date.now();
    if (now - this.lastAdjustTime < this.adjustCooldown) {
      return; // Too soon to adjust again
    }

    const avgFPS = this.getAverageFPS();

    // FPS too low - reduce quality
    if (avgFPS < this.targetFPS * 0.8) {
      this.reduceQuality();
      this.lastAdjustTime = now;
    }
    // FPS stable and high - try increasing quality
    else if (avgFPS > this.targetFPS * 1.2 && avgFPS > 50) {
      this.increaseQuality();
      this.lastAdjustTime = now;
    }
  }

  private reduceQuality(): void {
    let changed = false;

    // Step 1: Reduce resolution
    if (this.currentQuality.resolution > 0.5) {
      this.currentQuality.resolution = Math.max(0.5, this.currentQuality.resolution - 0.25);
      changed = true;
      console.log('[Performance] Reduced resolution to', this.currentQuality.resolution);
    }
    // Step 2: Reduce particle count
    else if (this.currentQuality.particleCount > 15) {
      this.currentQuality.particleCount = Math.max(15, this.currentQuality.particleCount - 20);
      changed = true;
      console.log('[Performance] Reduced particles to', this.currentQuality.particleCount);
    }
    // Step 3: Disable chromatic aberration
    else if (this.currentQuality.chromaticAberration) {
      this.currentQuality.chromaticAberration = false;
      changed = true;
      console.log('[Performance] Disabled chromatic aberration');
    }
    // Step 4: Reduce bloom quality
    else if (this.currentQuality.bloomQuality !== 'none') {
      const bloomLevels: Array<'high' | 'medium' | 'low' | 'none'> = ['high', 'medium', 'low', 'none'];
      const currentIndex = bloomLevels.indexOf(this.currentQuality.bloomQuality);
      this.currentQuality.bloomQuality = bloomLevels[currentIndex + 1];
      changed = true;
      console.log('[Performance] Reduced bloom to', this.currentQuality.bloomQuality);
    }
    // Step 5: Use simple shader
    else if (!this.currentQuality.useSimpleShader) {
      this.currentQuality.useSimpleShader = true;
      changed = true;
      console.log('[Performance] Switched to simple shader');
    }
    // Step 6: Reduce tile count
    else if (this.currentQuality.tileCount > 4) {
      this.currentQuality.tileCount = Math.max(4, this.currentQuality.tileCount - 2);
      changed = true;
      console.log('[Performance] Reduced tiles to', this.currentQuality.tileCount);
    }

    if (changed && this.onQualityChange) {
      this.onQualityChange({ ...this.currentQuality });
    }
  }

  private increaseQuality(): void {
    let changed = false;

    // Reverse order of reduction
    if (this.currentQuality.tileCount < 8) {
      this.currentQuality.tileCount = Math.min(8, this.currentQuality.tileCount + 2);
      changed = true;
    } else if (this.currentQuality.useSimpleShader) {
      this.currentQuality.useSimpleShader = false;
      changed = true;
    } else if (this.currentQuality.bloomQuality !== 'high') {
      const bloomLevels: Array<'none' | 'low' | 'medium' | 'high'> = ['none', 'low', 'medium', 'high'];
      const currentIndex = bloomLevels.indexOf(this.currentQuality.bloomQuality);
      this.currentQuality.bloomQuality = bloomLevels[currentIndex + 1];
      changed = true;
    } else if (!this.currentQuality.chromaticAberration) {
      this.currentQuality.chromaticAberration = true;
      changed = true;
    } else if (this.currentQuality.particleCount < 100) {
      this.currentQuality.particleCount = Math.min(100, this.currentQuality.particleCount + 20);
      changed = true;
    } else if (this.currentQuality.resolution < 1.0) {
      this.currentQuality.resolution = Math.min(1.0, this.currentQuality.resolution + 0.25);
      changed = true;
    }

    if (changed && this.onQualityChange) {
      console.log('[Performance] Increased quality');
      this.onQualityChange({ ...this.currentQuality });
    }
  }

  getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return 60;
    return this.fpsHistory.reduce((sum, fps) => sum + fps, 0) / this.fpsHistory.length;
  }

  getCurrentQuality(): QualitySettings {
    return { ...this.currentQuality };
  }

  getMetrics(): FrameMetrics {
    const avgFPS = this.getAverageFPS();
    const recentFrames = this.fpsHistory.slice(-10);
    const droppedFrames = recentFrames.filter(fps => fps < this.targetFPS).length;

    return {
      fps: this.fpsHistory[this.fpsHistory.length - 1] || 60,
      frameTime: recentFrames.length ? 1000 / recentFrames[recentFrames.length - 1] : 16.67,
      droppedFrames,
      averageFPS: avgFPS,
    };
  }
}

// ============================================================================
// Visibility Handler (Pause when not visible)
// ============================================================================

export class VisibilityHandler {
  private isVisible = true;
  private isPaused = false;
  private onVisibilityChange?: (visible: boolean) => void;
  private observer: IntersectionObserver | null = null;
  private element: HTMLElement | null = null;

  constructor(onVisibilityChange?: (visible: boolean) => void) {
    this.onVisibilityChange = onVisibilityChange;
    this.setupPageVisibility();
  }

  private setupPageVisibility(): void {
    if (typeof document === 'undefined') return;

    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
      this.updatePauseState();
    });
  }

  observeElement(element: HTMLElement, threshold = 0.1): void {
    this.element = element;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.isVisible = entry.isIntersecting;
          this.updatePauseState();
        });
      },
      { threshold }
    );

    this.observer.observe(element);
  }

  private updatePauseState(): void {
    const shouldBePaused = !this.isVisible;

    if (shouldBePaused !== this.isPaused) {
      this.isPaused = shouldBePaused;

      if (this.onVisibilityChange) {
        this.onVisibilityChange(!shouldBePaused);
      }

      console.log('[Performance] Animation', shouldBePaused ? 'paused' : 'resumed');
    }
  }

  shouldRender(): boolean {
    return !this.isPaused;
  }

  destroy(): void {
    if (this.observer && this.element) {
      this.observer.unobserve(this.element);
      this.observer.disconnect();
    }
  }
}

// ============================================================================
// Texture Memory Pool
// ============================================================================

export class TexturePool {
  private pool: WebGLTexture[] = [];
  private inUse = new Set<WebGLTexture>();
  private gl: WebGLRenderingContext | WebGL2RenderingContext;
  private maxTextures: number;
  private textureSize: number;
  private format: number;

  constructor(
    gl: WebGLRenderingContext | WebGL2RenderingContext,
    config: TexturePoolConfig
  ) {
    this.gl = gl;
    this.maxTextures = config.maxTextures;
    this.textureSize = config.textureSize;
    this.format = config.format;

    // Pre-allocate textures
    this.preallocate();
  }

  private preallocate(): void {
    for (let i = 0; i < this.maxTextures; i++) {
      const texture = this.gl.createTexture();
      if (texture) {
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texImage2D(
          this.gl.TEXTURE_2D,
          0,
          this.format,
          this.textureSize,
          this.textureSize,
          0,
          this.format,
          this.gl.UNSIGNED_BYTE,
          null
        );
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.pool.push(texture);
      }
    }
    console.log(`[Performance] Pre-allocated ${this.pool.length} textures`);
  }

  acquire(): WebGLTexture | null {
    const texture = this.pool.pop();
    if (texture) {
      this.inUse.add(texture);
      return texture;
    }
    console.warn('[Performance] Texture pool exhausted');
    return null;
  }

  release(texture: WebGLTexture): void {
    if (this.inUse.has(texture)) {
      this.inUse.delete(texture);
      this.pool.push(texture);
    }
  }

  destroy(): void {
    [...this.pool, ...Array.from(this.inUse)].forEach((texture) => {
      this.gl.deleteTexture(texture);
    });
    this.pool = [];
    this.inUse.clear();
    console.log('[Performance] Texture pool destroyed');
  }

  getStats() {
    return {
      total: this.maxTextures,
      available: this.pool.length,
      inUse: this.inUse.size,
    };
  }
}

// ============================================================================
// Frame Budget Monitor
// ============================================================================

export class FrameBudgetMonitor {
  private budgetMs: number;
  private frameStartTime = 0;
  private violations = 0;
  private totalFrames = 0;

  constructor(budgetMs: number = 16.67) { // 60fps = 16.67ms
    this.budgetMs = budgetMs;
  }

  startFrame(): void {
    this.frameStartTime = performance.now();
  }

  endFrame(): boolean {
    const frameTime = performance.now() - this.frameStartTime;
    this.totalFrames++;

    const withinBudget = frameTime <= this.budgetMs;
    if (!withinBudget) {
      this.violations++;
    }

    return withinBudget;
  }

  getStats() {
    return {
      budgetMs: this.budgetMs,
      violations: this.violations,
      totalFrames: this.totalFrames,
      violationRate: this.totalFrames > 0 ? this.violations / this.totalFrames : 0,
    };
  }

  reset(): void {
    this.violations = 0;
    this.totalFrames = 0;
  }
}

// ============================================================================
// Main Performance Manager (Orchestrates Everything)
// ============================================================================

export class AnimationPerformanceManager {
  private detector: DeviceCapabilityDetector;
  private qualityController: AdaptiveQualityController | null = null;
  private visibilityHandler: VisibilityHandler;
  private budgetMonitor: FrameBudgetMonitor;
  private texturePool: TexturePool | null = null;

  constructor() {
    this.detector = DeviceCapabilityDetector.getInstance();
    this.visibilityHandler = new VisibilityHandler();
    this.budgetMonitor = new FrameBudgetMonitor(16.67);
  }

  initialize(
    element: HTMLElement,
    gl?: WebGLRenderingContext | WebGL2RenderingContext,
    onQualityChange?: (settings: QualitySettings) => void
  ): QualitySettings {
    // Detect device capability
    const capability = this.detector.getDeviceCapability();
    const isMobile = this.detector.isMobile();

    // Get initial quality settings
    const initialQuality = isMobile
      ? QualityPresetManager.getPresetForMobile()
      : QualityPresetManager.getPresetForCapability(capability);

    // Setup adaptive quality
    const targetFPS = isMobile ? 30 : 60;
    this.qualityController = new AdaptiveQualityController(
      initialQuality,
      targetFPS,
      onQualityChange
    );

    // Setup visibility observer
    this.visibilityHandler.observeElement(element);

    // Setup texture pool if WebGL context provided
    if (gl) {
      this.texturePool = new TexturePool(gl, {
        maxTextures: isMobile ? 8 : 16,
        textureSize: 512,
        format: gl.RGBA,
      });
    }

    console.log('[Performance] Initialized with quality:', initialQuality);
    return initialQuality;
  }

  onFrameStart(): void {
    this.budgetMonitor.startFrame();
  }

  onFrameEnd(deltaTime: number): void {
    const withinBudget = this.budgetMonitor.endFrame();

    if (this.qualityController) {
      this.qualityController.recordFrame(deltaTime);
    }

    if (!withinBudget) {
      console.warn('[Performance] Frame budget exceeded');
    }
  }

  shouldRender(): boolean {
    return this.visibilityHandler.shouldRender();
  }

  getCurrentQuality(): QualitySettings | null {
    return this.qualityController?.getCurrentQuality() || null;
  }

  getMetrics(): FrameMetrics | null {
    return this.qualityController?.getMetrics() || null;
  }

  getTexturePool(): TexturePool | null {
    return this.texturePool;
  }

  destroy(): void {
    this.visibilityHandler.destroy();
    this.texturePool?.destroy();
    console.log('[Performance] Manager destroyed');
  }
}

// ============================================================================
// Convenience Export
// ============================================================================

export const AnimationPerformance = {
  getDeviceCapability: () => DeviceCapabilityDetector.getInstance().getDeviceCapability(),
  createAdaptiveQuality: (targetFPS: number, onQualityChange?: (settings: QualitySettings) => void) => {
    const capability = DeviceCapabilityDetector.getInstance().getDeviceCapability();
    const initialQuality = QualityPresetManager.getPresetForCapability(capability);
    return new AdaptiveQualityController(initialQuality, targetFPS, onQualityChange);
  },
  createVisibilityHandler: (onVisibilityChange?: (visible: boolean) => void) => {
    return new VisibilityHandler(onVisibilityChange);
  },
  createTexturePool: (
    gl: WebGLRenderingContext | WebGL2RenderingContext,
    maxTextures: number
  ) => {
    return new TexturePool(gl, {
      maxTextures,
      textureSize: 512,
      format: gl.RGBA,
    });
  },
  createFrameBudget: (budgetMs: number) => {
    return new FrameBudgetMonitor(budgetMs);
  },
  createManager: () => new AnimationPerformanceManager(),
};
