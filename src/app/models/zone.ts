export class Zone {
  id!: number;
  deleted!: number;
  name!: string;
  updatedTime!: string;
  createdTime!: string;

  constructor(deleted: number) {
    this.deleted = deleted;
  }
}
