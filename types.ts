export enum Status {
  PENDING = 'PENDING', // Default
  FAKE_COMMITMENT = 'FAKE_COMMITMENT', // Red
  DISHONORED = 'DISHONORED', // Pink
  PARTIAL_PAYMENT = 'PARTIAL_PAYMENT', // Blue
  NO_DUES = 'NO_DUES' // Green
}

export type PageView = 'dashboard' | 'tracker' | 'financials';

export interface CommitmentRow {
  id: string;
  personName: string;
  transcript: string;
  contactNo: string;
  date: string; // ISO date string or visual date
  amount: number | string;
  branchOrProfile: string; // "Problem Summary / Profiles" from note
  status: Status;
}

export interface YearlyOutstanding {
  id: string;
  year: string;
  q1: string; // Using string to allow empty state for easy editing
  q2: string;
  q3: string;
  q4: string;
}

export interface AnalysisResult {
  suggestedStatus: Status;
  extractedDate: string | null;
  extractedAmount: number | null;
  reasoning: string;
}