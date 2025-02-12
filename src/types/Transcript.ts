import { Scenario } from "./Scenario";

export interface Transcript {
  _id: string;
  Filename: string;
  Data: string;
  Scenario: Scenario;
  Student: string;
  createdAt: Date;
  updatedAt: Date;

}