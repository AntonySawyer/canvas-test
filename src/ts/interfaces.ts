export interface IWidget {
  id: string;
  x?: number;
  y?: number;
  readonly width: number;
  readonly height: number;
  color?: string;
}
