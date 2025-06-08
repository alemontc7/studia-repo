import { FlashcardType } from "../domain/flashcard";

export interface FlashcardViewState {
  isFlipped: boolean;
  selectedAnswer: string | null;
  selectedWords: string[];
  showHint: boolean;
  isAnswerCorrect: boolean | null;
  showResult: boolean;
  cardType: FlashcardType;
}

export class FlashcardStateService {
  private state: FlashcardViewState = {
    isFlipped: false,
    selectedAnswer: null,
    selectedWords: [],
    showHint: false,
    isAnswerCorrect: null,
    showResult: false,
    cardType: 'conceptual'
  };

  private listeners: Array<(state: FlashcardViewState) => void> = [];

  getState(): FlashcardViewState {
    return { ...this.state };
  }

  setCardType(type: FlashcardType): void {
    this.state = { 
      ...this.state, 
      cardType: type,
      selectedWords: [],
      selectedAnswer: null,
      isAnswerCorrect: null,
      showResult: false,
      isFlipped: false
    };
    this.notifyListeners();
  }

  flipCard(): void {
    if (this.state.cardType === 'conceptual') {
      this.state = { ...this.state, isFlipped: !this.state.isFlipped };
      this.notifyListeners();
    }
  }

  selectAnswer(answer: string): void {
    this.state = { ...this.state, selectedAnswer: answer };
    this.notifyListeners();
  }

  toggleWordSelection(word: string): void {
    const currentSelected = [...this.state.selectedWords];
    const index = currentSelected.indexOf(word);
    
    if (index > -1) {
      currentSelected.splice(index, 1);
    } else {
      currentSelected.push(word);
    }
    
    this.state = { ...this.state, selectedWords: currentSelected };
    this.notifyListeners();
  }

  checkAnswer(correctWords: string[], challenge: string): void {
    let processedChallenge = challenge;
    const blanks = challenge.match(/___/g) || [];
    
    if (this.state.selectedWords.length !== blanks.length) {
      this.state = { 
        ...this.state, 
        isAnswerCorrect: false, 
        showResult: true 
      };
      this.notifyListeners();
      return;
    }

    let wordIndex = 0;
    processedChallenge = processedChallenge.replace(/___/g, () => {
      return this.state.selectedWords[wordIndex++] || '___';
    });

    const isCorrect = this.arraysEqual(this.state.selectedWords, correctWords.slice(0, blanks.length));
    
    this.state = { 
      ...this.state, 
      isAnswerCorrect: isCorrect, 
      showResult: true 
    };
    this.notifyListeners();
  }

  private arraysEqual(a: string[], b: string[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
  }


  showHint(): void {
    this.state = { ...this.state, showHint: true };
    this.notifyListeners();
  }

  resetCardState(): void {
    this.state = {
      isFlipped: false,
      selectedAnswer: null,
      selectedWords: [],
      showHint: false,
      isAnswerCorrect: null,
      showResult: false,
      cardType: this.state.cardType
    };
    this.notifyListeners();
  }

  subscribe(listener: (state: FlashcardViewState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }
}