export interface Scenario {
  _id: string;
  id: Number;
  Theme: string;
  Context: string;
  Name: string;
  Self: boolean;
  Other_Person: OtherPerson;
  Age: {Years: String, Months: String}
  Gender: string;
  Medicines: string;
  AdditionalMeds: string;
  History: string;
  Symptoms: string;
  Allergies: string;
  Emotion: string;
  Time: string;
  Outcome: string;
  AdditionalInfo: string;
  AI: string;
  Model: string;
  TTS: string;
  Voice: string;
  Avatar: string;
  Visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OtherPerson {
  Name: string;
  Age: {Years: String, Months: String};
  Gender: string;
  Relationship: string;
}