import { Flashcard } from "../domain/flashcard";
export class FlashcardAnswerService {
  static validateCompletionAnswer(
    card: Flashcard, 
    selectedWords: string[]
  ): { isCorrect: boolean; processedChallenge: string } {
    const blanks = card.challenge.match(/___/g) || [];
    
    if (selectedWords.length !== blanks.length) {
      return { isCorrect: false, processedChallenge: card.challenge };
    }

    // Replace blanks with selected words
    let processedChallenge = card.challenge;
    let wordIndex = 0;
    
    processedChallenge = processedChallenge.replace(/___/g, () => {
      return selectedWords[wordIndex++] || '___';
    });

    // Check if selected words match solution words in order
    const expectedWords = card.solutionWords.slice(0, blanks.length);
    const isCorrect = selectedWords.every((word, index) => word === expectedWords[index]);

    return { isCorrect, processedChallenge };
  }

  static getDisplayChallenge(card: Flashcard, selectedWords: string[] = []): string {
    if (card.type === 'conceptual') {
      return card.challenge;
    }

    // For completion and code_fill, replace blanks with selected words
    let challenge = card.challenge;
    let wordIndex = 0;

    return challenge.replace(/___/g, () => {
      const selectedWord = selectedWords[wordIndex++];
      return selectedWord ? `[${selectedWord}]` : '___';
    });
  }
}