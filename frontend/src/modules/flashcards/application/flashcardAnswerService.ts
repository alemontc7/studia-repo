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

    let processedChallenge = card.challenge;
    let wordIndex = 0;
    
    processedChallenge = processedChallenge.replace(/___/g, () => {
      return selectedWords[wordIndex++] || '___';
    });

    const expectedWords = card.solutionWords.slice(0, blanks.length);
    const isCorrect = selectedWords.every((word, index) => word === expectedWords[index]);

    return { isCorrect, processedChallenge };
  }

  static getDisplayChallenge(card: Flashcard, selectedWords: string[] = []): string {
    if (card.type === 'conceptual') {
      return card.challenge;
    }

    let challenge = card.challenge;
    let wordIndex = 0;

    return challenge.replace(/___/g, () => {
      const selectedWord = selectedWords[wordIndex++];
      return selectedWord ? `[${selectedWord}]` : '___';
    });
  }
}