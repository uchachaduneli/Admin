import {City} from "./city";
import {Route} from "./route";
import {UserStatus} from "./user-status";
import {Role} from "./role";

export class User {
  id: number
  deleted: number
  name: string
  lastName: string
  phone: string
  personalNumber: string
  city: City
  route: Route
  role: Role[]
  status: UserStatus
  updatedTime: string
  createdTime: string
  token: string
}
