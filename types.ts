
export interface MathProblem {
  id: number;
  question: string;
  answer: string;
  topic: 'Percentage' | 'RatioSimplify' | 'RatioDivide';
}

export interface GameState {
  currentProblemId: number | null;
  history: number[];
  bingoWinners: { name: string; timestamp: number }[];
}

export interface UserRole {
  role: 'teacher' | 'student' | null;
  name: string;
}

export interface SyncMessage {
  type: 'UPDATE_GAME' | 'BINGO_CLAIM';
  payload: any;
}
