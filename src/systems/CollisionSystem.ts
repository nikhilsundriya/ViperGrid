import type { Position } from "../entities/Viper";
import { GRID_SIZE } from "../utils/Constants";
import { Viper} from "../entities/Viper";
import { Food } from "../entities/Food";

export class CollisionSystem {
  public checkWallCollision(position: Position): boolean {
    return (
      position.x < 0 ||
      position.x >= GRID_SIZE ||
      position.y < 0 ||
      position.y >= GRID_SIZE
    );
  }

  public checkSelfCollision(snake: Viper): boolean {
    const head = snake.getHead();
    const headKey = `${head.x},${head.y}`;

    // Check if head collides with any body segment (excluding head itself)
    for (let i = 1; i < snake.segments.length; i++) {
      const segment = snake.segments[i];
      const segmentKey = `${segment.x},${segment.y}`;
      if (headKey === segmentKey) {
        return true;
      }
    }

    return false;
  }

  public checkFoodCollision(snake: Viper, food: Food): boolean {
    const head = snake.getHead();
    return head.x === food.position.x && head.y === food.position.y;
  }

  public getOccupiedPositions(snake: Viper): Set<string> {
    const occupied = new Set<string>();
    snake.segments.forEach((segment) => {
      occupied.add(`${segment.x},${segment.y}`);
    });
    return occupied;
  }
}
