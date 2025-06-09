import { supabase } from "../../../config/supabaseClient";
import ModelClient, { isUnexpected } from '@azure-rest/ai-inference';
import { AzureKeyCredential } from "@azure/core-auth";
import { v4 as uuidv4 } from 'uuid';
import { Flashcard, FlashcardType } from "../Domain/flashcard.entity";
import { FlashcardAIResult } from "../Domain/flashcardAIResult.entity";
import { fetchNoteById } from "../../Notes/Infrastructure/notes.repository";
import { NoteEntity } from "../../Notes/Domain/note.entity";
import { convertTipTapToText } from "./flashchard.utils";
import { FLASHCARD_SYSTEM_PROMPT } from "./flashcard-prompt";

const GITHUB_AI_ENDPOINT =  'https://models.github.ai/inference';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

export async function generateFlashCards(
    noteId: string, model: string
): Promise<Flashcard[]> {
    console.log("I am inside the repository call");
    const note: NoteEntity | null = await fetchNoteById(noteId);
    if (note === null) {
        throw new Error(`Note with ID ${noteId} not found`);
    }
    console.log("The note is", note);
    const content = note.content;
    const text = convertTipTapToText(content);
    console.log("The text is", text);
    //openai/gpt-4o
    //xai/grok-3
    //openai/gpt-4.1
    const myModel = "openai/gpt-4o";
    const client = ModelClient(
        GITHUB_AI_ENDPOINT, 
        new AzureKeyCredential(GITHUB_TOKEN)
    );

    console.log("I am just behind the client creation");
    const aiResponse = await client.path('/chat/completions').post({
        body: {
            model: myModel,
            temperature: 1.0,
            top_p: 1.0,
            max_tokens: 5000,
            messages: [
                {
                    role: 'system',
                    content: FLASHCARD_SYSTEM_PROMPT
                },
                {
                    role: 'user',
                    content: `Generate flashcards from the following text: ${text}`
                }
            ]
        }
    });
    console.log("I am just after the AI response");
    console.log("The AI response is", aiResponse);

    if (isUnexpected(aiResponse)) {
        throw new Error(`Unexpected response from AI model: ${aiResponse.body.error.message}`);
    }

    const raw = aiResponse.body.choices[0].message.content as string;
    let aiCards: FlashcardAIResult[];
    try {
        console.log("I am before the AI cards parsing");
        console.log("The raw is", aiResponse.body.choices);
        console.log("The parse is", JSON.parse(raw));

        aiCards = JSON.parse(raw) as FlashcardAIResult[];
    }
    catch (err){
        throw new Error(`Error parsing AI response: ${err}`);
    }

    console.log("I am before the AI cards mapping");

    const flashcards: Flashcard[] = aiCards.map((r) => ({
        id: uuidv4(),
        noteId,
        type: r.type,
        challenge: r.challenge,
        solution: r.solution,
        tags: r.tags,
        solutionWords: r.solutionWords || [],
        difficulty: r.difficulty,
        contextSnippet: r.contextSnippet,
        hint: r.hint,
        explanation: r.explanation || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }));

    console.log("The flashcards are", flashcards);

    const { error } = await supabase
        .from('flashcards')
        .insert(flashcards.map(card => ({
            id: card.id,
            note_id: card.noteId,
            type: card.type,
            challenge: card.challenge,
            solution: card.solution,
            tags: card.tags,
            solution_words: card.solutionWords,
            difficulty: card.difficulty,
            context_snippet: card.contextSnippet,
            hint: card.hint,
            explanation: card.explanation,
            created_at: card.createdAt,
            updated_at: card.updatedAt
        })));

    console.log("I am after the insert operation");

    if (error) {
        throw new Error(`Error inserting flashcards: ${error.message}`);
    }
    return flashcards;
}

export async function fetchFlashcardsByNoteId(noteId: string): Promise<Flashcard[]> {
    const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('note_id', noteId);

    if (error) {
        console.error("Error fetching flashcards:", error);
        throw new Error("Error fetching flashcards");
    }

    return (data as Array<{
        id: string;
        note_id: string;
        type: FlashcardType;
        challenge: string;
        solution: string;
        tags: string[];
        solution_words: string[];
        difficulty?: string;
        context_snippet?: string;
        hint?: string;
        explanation?: string;
        created_at: string;
        updated_at: string;
    }> ).map((row) => ({
        id: row.id,
        noteId: row.note_id,
        type: row.type,
        challenge: row.challenge,
        solution: row.solution,
        tags: row.tags,
        solutionWords: row.solution_words,
        difficulty: row.difficulty,
        contextSnippet: row.context_snippet,
        hint: row.hint,
        explanation: row.explanation || '',
        createdAt: row.created_at,
        updatedAt: row.updated_at
    }));
}
