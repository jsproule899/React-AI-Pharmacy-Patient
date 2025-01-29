import { Scenario } from "./Scenario";

export interface Transcript {
  _id: string;
  Filename: string;
  Data: string;
  Scenario: Scenario;
  createdAt: Date;
  updatedAt: Date;

}