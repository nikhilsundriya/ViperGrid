import { Container, Graphics } from "pixi.js";
import { GlowFilter } from "@pixi/filter-glow";
import { GRID_SIZE, CELL_SIZE } from "../utils/Constants";

export class Grid {
  public container: Container;
  private gridGraphics: Graphics;
  private pulseTime: number = 0;

  constructor() {
    this.container = new Container();
    this.gridGraphics = new Graphics();

    this.drawGrid();
    this.addNeonGlow();

    this.container.addChild(this.gridGraphics);
  }

  private drawGrid(): void {
    this.gridGraphics.clear();

    const gridColor = 0x00f5ff; // Neon cyan

    // Draw vertical lines
    for (let x = 0; x <= GRID_SIZE; x++) {
      const xPos = x * CELL_SIZE;
      this.gridGraphics.moveTo(xPos, 0).lineTo(xPos, GRID_SIZE * CELL_SIZE);
    }

    // Draw horizontal lines
    for (let y = 0; y <= GRID_SIZE; y++) {
      const yPos = y * CELL_SIZE;
      this.gridGraphics.moveTo(0, yPos).lineTo(GRID_SIZE * CELL_SIZE, yPos);
    }

    this.gridGraphics.stroke({
      width: 1,
      color: gridColor,
      alpha: 0.15
    });

    this.gridGraphics.isRenderGroup = true;
  }

  private addNeonGlow(): void {
  const glow = new GlowFilter({
    color: 0x00f5ff,
    outerStrength: 2,
    innerStrength: 0,
    distance: 15
  });

  // Cast to any to fix Pixi v8 type mismatch
  this.gridGraphics.filters = [glow as any];
}

  // 🔥 Subtle pulse animation
  public update(deltaMS: number): void {
    this.pulseTime += deltaMS * 0.002;

    const pulseAlpha = 0.12 + Math.sin(this.pulseTime) * 0.05;
    this.gridGraphics.alpha = pulseAlpha;
  }
}