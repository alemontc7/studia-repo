import { Flashcard, SessionCard, SessionStats, FlashcardSession } from '../domain/flashcard';

export class FlashcardSessionUseCase {
    private session: FlashcardSession | null = null;
    
    constructor() {}
    
    initializeSession(cards: Flashcard[]): void {
        
        if (cards.length === 0) return;
        const sessionCards: SessionCard[] = cards.map(card => ({
            ...card,
            isAttempted: false,
            isCorrect: null,
        }));
        
        this.session = {
            id: crypto.randomUUID(),
            cards: sessionCards,
            currentCardIndex: 0,
            isCompleted: false,
            stats: {
                startTime: Date.now(),
                endTime: null,
                questionsAttempted: 0,
                questionsCorrect: 0,
                conceptualCardsReviewed: 0,
            },
        };
    }
    
    submitAnswer(cardId: string, isCorrect: boolean): void {
        if (!this.session) return;
        const card = this.session.cards.find(c => c.id === cardId);
        
        if (!card || card.isAttempted) {
            return;
        }
        
        card.isAttempted = true;
        card.isCorrect = isCorrect;
        this.session.stats.questionsAttempted++;
        if (isCorrect) {
            this.session.stats.questionsCorrect++;
        }
    }
    
    goToNextCard(): boolean {
        if (!this.session) return false;
        const currentCard = this.session.cards[this.session.currentCardIndex];
        
        if (currentCard.type === 'conceptual' && !currentCard.isAttempted) {
            this.session.stats.conceptualCardsReviewed++;
            currentCard.isAttempted = true;
        }
        
        if (this.session.currentCardIndex >= this.session.cards.length - 1) {
            if (!this.session.isCompleted) {
                this.session.isCompleted = true;
                this.session.stats.endTime = Date.now();
            }
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

getSessionState(): {
    card: SessionCard | null;
    progress: { current: number; total: number };
    isCompleted: boolean;
    stats: SessionStats | null;
} {
    if (!this.session) {
        return { card: null, progress: { current: 0, total: 0 }, isCompleted: false, stats: null };
    }
    
    return {
        card: this.session.cards[this.session.currentCardIndex],
        progress: {
            current: this.session.currentCardIndex + 1,
            total: this.session.cards.length,
        },
        isCompleted: this.session.isCompleted,
        stats: this.session.stats,
    };
}
}