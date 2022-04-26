export class Zone {
  id!: number;
  deleted!: number;
  name!: number;
  updatedTime!: string;
  createdTime!: string;

  constructor(deleted: number) {
    this.deleted = deleted;
  }
}
