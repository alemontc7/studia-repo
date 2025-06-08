// application/use-cases/flashcard-session.use-case.ts
import { Flashcard, FlashcardSession, FlashcardProgress } from '../domain/flashcard';
import { FlashcardSessionPort } from '../domain/flashcarsSessionPort';
import { FlashcardRepositoryPort } from '../domain/flashcardRepositoryPort';

export class FlashcardSessionUseCase implements FlashcardSessionPort {
  private session: FlashcardSession | null = null;

  constructor(private flashcardRepository: FlashcardRepositoryPort) {}

  async initializeSession(cards: Flashcard[]): Promise<FlashcardSession> {
    this.session = {
      id: crypto.randomUUID(),
      cards,
      currentCardIndex: 0,
      completedCards: [],
      sessionStats: {
        totalCards: cards.length,
        completedCards: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        averageTimePerCard: 0
      }
    };
    return this.session;
  }

  getCurrentCard(): Flashcard | null {
    if (!this.session || this.session.currentCardIndex >= this.session.cards.length) {
      return null;
    }
    return this.session.cards[this.session.currentCardIndex];
  }

  goToNextCard(): boolean {
    if (!this.session || this.session.currentCardIndex >= this.session.cards.length - 1) {
      return false;
    }
    this.session.currentCardIndex++;
    return true;
  }

  goToPreviousCard(): boolean {
    if (!this.session || this.session.currentCardIndex <= 0) {
      return false;
    }
    this.session.currentCardIndex--;
    return true;
  }

  markCardAsCompleted(cardId: string, difficulty: 'easy' | 'medium' | 'hard'): void {
    if (!this.session) return;

    if (!this.session.completedCards.includes(cardId)) {
      this.session.completedCards.push(cardId);
      this.session.sessionStats.completedCards++;
    }

    // save progress asynchronously
    this.saveCardProgress(cardId, difficulty);
  }

  getProgress(): { current: number; total: number } {
    if (!this.session) return { current: 0, total: 0 };
    return {
      current: this.session.currentCardIndex + 1,
      total: this.session.cards.length
    };
  }

  isSessionCompleted(): boolean {
    if (!this.session) return false;
    return this.session.completedCards.length === this.session.cards.length;
  }

  private async saveCardProgress(cardId: string, difficulty: 'easy' | 'medium' | 'hard'): Promise<void> {
    const progress: FlashcardProgress[] = [{
      cardId,
      isCompleted: true,
      difficulty,
      timeSpent: 0, // You'd track this in a real implementation
      attempts: 1
    }];
    
    await this.flashcardRepository.saveProgress(progress);
  }
}