export class Car {
  id: number;
  name: string;
  carNumber: string;
  updatedTime: string;
  createdTime: string;


  constructor(id: number, name: string, carNumber: string, updatedTime: string, createdTime: string) {
    this.id = id;
    this.name = name;
    this.carNumber = carNumber;
    this.updatedTime = updatedTime;
    this.createdTime = createdTime;
  }
}
