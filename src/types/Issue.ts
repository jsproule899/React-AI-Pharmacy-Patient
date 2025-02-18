import { Scenario } from "./Scenario";

export interface Issue {
    _id: string;
    Status: string;
    Category: string;
    Details: String;
    Scenario: Scenario;
    createdAt: Date;
    updatedAt: Date;
}
