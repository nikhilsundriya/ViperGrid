import { Container, Text, Graphics } from "pixi.js";
import { COLORS, CANVAS_WIDTH, CANVAS_HEIGHT } from "../utils/Constants";

export class HUD {
  public container: Container;

  private scoreText: Text;
  private highScoreText: Text;
  private levelText: Text;

  private speedBarBg: Graphics;
  private speedIndicator: Graphics;

  private currentSpeedProgress: number = 0;
  private targetSpeedProgress: number = 0;

  private pulseTime: number = 0;

  constructor() {
    this.container = new Container();

    // 🔥 SCORE (Top Left)
    this.scoreText = new Text({
      text: "Score: 0",
      style: {
        fontFamily: "Arial, sans-serif",
        fontSize: 26,
        fill: COLORS.text,
        fontWeight: "bold",
        letterSpacing: 1,
      },
    });
    this.scoreText.position.set(20, 20);

    // 🔥 HIGH SCORE (Top Right)
    this.highScoreText = new Text({
      text: "High: 0",
      style: {
        fontFamily: "Arial, sans-serif",
        fontSize: 26,
        fill: COLORS.text,
        fontWeight: "bold",
      },
    });
    this.highScoreText.anchor.set(1, 0);
    this.highScoreText.position.set(CANVAS_WIDTH - 20, 20);

    // 🔥 LEVEL (Bottom Left)
    this.levelText = new Text({
      text: "Level: 1",
      style: {
        fontFamily: "Arial, sans-serif",
        fontSize: 20,
        fill: COLORS.text,
      },
    });
    this.levelText.position.set(20, CANVAS_HEIGHT - 50);

    // 🔥 Speed Bar Background
    this.speedBarBg = new Graphics();
    this.speedBarBg.roundRect(
      CANVAS_WIDTH / 2 - 150,
      CANVAS_HEIGHT - 35,
      300,
      14,
      8
    );
    this.speedBarBg.fill({ color: 0x222222, alpha: 0.6 });

    // 🔥 Speed Bar Foreground
    this.speedIndicator = new Graphics();

    this.container.addChild(
      this.scoreText,
      this.highScoreText,
      this.levelText,
      this.speedBarBg,
      this.speedIndicator
    );
  }

  public update(
    score: number,
    highScore: number,
    level: number,
    speedProgress: number,
    deltaMS: number
  ): void {
    this.scoreText.text = `Score: ${score}`;
    this.highScoreText.text = `High: ${highScore}`;
    this.levelText.text = `Level: ${level}`;

    // Smooth animation towards target speed
    this.targetSpeedProgress = Math.max(0, Math.min(1, speedProgress));
    this.currentSpeedProgress +=
      (this.targetSpeedProgress - this.currentSpeedProgress) * 0.08;

    this.drawSpeedBar();

    // Pulse effect when speed high
    if (this.currentSpeedProgress > 0.85) {
      this.pulseTime += deltaMS * 0.005;
      const pulse = 1 + Math.sin(this.pulseTime) * 0.05;
      this.speedIndicator.scale.set(pulse, 1);
    } else {
      this.speedIndicator.scale.set(1, 1);
    }
  }

  private drawSpeedBar(): void {
    this.speedIndicator.clear();

    const width = 300 * this.currentSpeedProgress;

    // 🌈 Smooth color blending (Green → Yellow → Red)
    let color: number;

    if (this.currentSpeedProgress < 0.5) {
      color = 0x00ff88; // Green
    } else if (this.currentSpeedProgress < 0.8) {
      color = 0xffd93d; // Yellow
    } else {
      color = 0xff3c3c; // Red
    }

    this.speedIndicator.roundRect(
      CANVAS_WIDTH / 2 - 150,
      CANVAS_HEIGHT - 35,
      width,
      14,
      8
    );

    this.speedIndicator.fill({ color, alpha: 0.9 });
  }
}