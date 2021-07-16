export class Zone {
  id: number;
  deleted: number;
  name: string;
  updatedTime: string;
  createdTime: string;
  weight: number;
  weightLabel: string;

  constructor(id: number, deleted: number, name: string, updatedTime: string, createdTime: string, weight: number, weightLabel: string) {
    this.id = id;
    this.deleted = deleted;
    this.name = name;
    this.updatedTime = updatedTime;
    this.createdTime = createdTime;
    this.weight = weight;
    this.weightLabel = weightLabel;
  }
}
