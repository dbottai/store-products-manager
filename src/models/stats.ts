export interface StatsCategory {
  category: string;
  numberOfProducts: number;
}

export interface StatsDataset {
  label: string;
  data: number[];
  borderWidth: number;
}

export interface StatsState {
  labels: string[];
  datasets: StatsDataset[];
}
