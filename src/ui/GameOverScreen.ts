import { Container, Text, Graphics } from "pixi.js";
import { GlowFilter } from "@pixi/filter-glow";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../utils/Constants";

export class GameOverScreen {
  public container: Container;

  private background: Graphics;
  private vignette: Graphics;
  private scanlines: Graphics;

  private titleText: Text;
  private scoreText: Text;
  private highScoreText: Text;
  private instructionText: Text;

  private pulseTime = 0;
  private glitchTimer = 0;
  private blinkTimer = 0;
  private fadeProgress = 0;

  private glowFilter: GlowFilter;

  constructor() {
    this.container = new Container();
    this.container.visible = false;
    this.container.alpha = 0;

    // Background
    this.background = new Graphics();
    this.background.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.background.fill({ color: 0x040410, alpha: 0.95 });

    // Red vignette
    this.vignette = new Graphics();
    this.vignette.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.vignette.fill({ color: 0xff0000, alpha: 0.05 });

    // Scanlines
    this.scanlines = new Graphics();
    for (let i = 0; i < CANVAS_HEIGHT; i += 4) {
      this.scanlines.rect(0, i, CANVAS_WIDTH, 1);
    }
    this.scanlines.fill({ color: 0x000000, alpha: 0.1 });

    // TITLE
    this.titleText = new Text({
      text: "GAME OVER",
      style: {
        fontFamily: "Poppins, sans-serif",
        fontSize: 70,
        fill: 0xff003c,
        fontWeight: "bold",
        letterSpacing: 6,
      },
    });

    this.titleText.anchor.set(0.5);
    this.titleText.x = CANVAS_WIDTH / 2;
    this.titleText.y = CANVAS_HEIGHT / 2 - 120;

    this.glowFilter = new GlowFilter({
      color: 0xff003c,
      outerStrength: 4,
      distance: 25,
    });

    this.titleText.filters = [this.glowFilter as any];

    // SCORE
    this.scoreText = new Text({
      text: "SCORE: 0",
      style: {
        fontFamily: "Poppins, sans-serif",
        fontSize: 32,
        fill: 0x00f5ff,
        letterSpacing: 2,
      },
    });

    this.scoreText.anchor.set(0.5);
    this.scoreText.x = CANVAS_WIDTH / 2;
    this.scoreText.y = CANVAS_HEIGHT / 2 - 10;

    // HIGH SCORE
    this.highScoreText = new Text({
      text: "HIGH SCORE: 0",
      style: {
        fontFamily: "Poppins, sans-serif",
        fontSize: 24,
        fill: 0x7f5af0,
      },
    });

    this.highScoreText.anchor.set(0.5);
    this.highScoreText.x = CANVAS_WIDTH / 2;
    this.highScoreText.y = CANVAS_HEIGHT / 2 + 40;

    // INSTRUCTION
    this.instructionText = new Text({
      text: "PRESS SPACE TO RESTART",
      style: {
        fontFamily: "Poppins, sans-serif",
        fontSize: 18,
        fill: 0xaaaaaa,
        letterSpacing: 3,
      },
    });

    this.instructionText.anchor.set(0.5);
    this.instructionText.x = CANVAS_WIDTH / 2;
    this.instructionText.y = CANVAS_HEIGHT - 70;

    this.container.addChild(
      this.background,
      this.vignette,
      this.scanlines,
      this.titleText,
      this.scoreText,
      this.highScoreText,
      this.instructionText
    );
  }

  public show(score: number, highScore: number): void {
    this.scoreText.text = `SCORE: ${score}`;
    this.highScoreText.text = `HIGH SCORE: ${highScore}`;

    this.container.visible = true;
    this.container.alpha = 0;
    this.container.scale.set(0.9);
    this.fadeProgress = 0;
  }

  public update(deltaMS: number): void {
    if (!this.container.visible) return;

    // Fade + Zoom in
    if (this.fadeProgress < 1) {
      this.fadeProgress += deltaMS * 0.002;
      this.container.alpha = Math.min(this.fadeProgress, 1);

      const scale = 0.9 + this.fadeProgress * 0.1;
      this.container.scale.set(scale);
    }

    // Pulsing glow
    this.pulseTime += deltaMS * 0.004;
    this.glowFilter.outerStrength =
      3 + Math.sin(this.pulseTime) * 2;

    // Subtle glitch movement
    this.glitchTimer += deltaMS;
    if (this.glitchTimer > 150) {
      this.glitchTimer = 0;

      if (Math.random() < 0.25) {
        this.titleText.x =
          CANVAS_WIDTH / 2 + (Math.random() - 0.5) * 12;
      } else {
        this.titleText.x = CANVAS_WIDTH / 2;
      }
    }

    // Blinking restart text
    this.blinkTimer += deltaMS;
    this.instructionText.alpha =
      0.5 + Math.sin(this.blinkTimer * 0.005) * 0.5;
  }

  public hide(): void {
    this.container.visible = false;
    this.container.alpha = 0;
  }
}