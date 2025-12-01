// Airtable Base
export interface AirtableBase {
  id: string;
  name: string;
}

// Airtable Table
export interface AirtableTable {
  id: string;
  name: string;
}

// Airtable Field
export interface AirtableField {
  id: string;
  name: string;
  type: string;
  options?: {
    choices?: { id: string; name: string }[];
  };
}

// Conditional Logic Types
export type Operator = "equals" | "notEquals" | "contains";

export interface Condition {
  questionKey: string;
  operator: Operator;
  value: string;
}

export interface ConditionalRules {
  logic: "AND" | "OR";
  conditions: Condition[];
}

// Question Structure
export interface FormQuestion {
  questionKey: string;
  airtableFieldId: string;
  label: string;
  type: string;
  required: boolean;
  options: string[];
  conditionalRules: ConditionalRules | null;
}

// Form Save API Payload
export interface CreateFormPayload {
  ownerUserId: string;
  airtableBaseId: string;
  airtableTableId: string;
  title: string;
  questions: FormQuestion[];
}

// Form Create Response
export interface CreateFormResponse {
  _id: string;
}
