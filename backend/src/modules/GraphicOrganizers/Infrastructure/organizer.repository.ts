import { supabase } from "../../../config/supabaseClient";
import ModelClient, { isUnexpected } from '@azure-rest/ai-inference';
import { AzureKeyCredential } from "@azure/core-auth";
import { v4 as uuidv4 } from 'uuid';
import { GraphicOrganizer } from "../Domain/organizer.entity";
import { fetchNoteById } from "../../Notes/Infrastructure/notes.repository"; // Reutilizamos esta función
import { NoteEntity } from "../../Notes/Domain/note.entity";
import { convertTipTapToText } from "../../Flashcards/Infrastructure/flashchard.utils"; // Reutilizamos esta también

// 1. Creamos un nuevo prompt específico para Mermaid
const GRAPHIC_ORGANIZER_SYSTEM_PROMPT = `You are an AI that transforms complex text into a single, **interconnected conceptual map**. Your primary goal is to illustrate the relationships between concepts.

Follow these rules STRICTLY:
1.  **Connectivity**: The diagram MUST be a **single, fully connected graph**. Do not create multiple disconnected sub-graphs or standalone nodes. Every concept must be linked to at least one other concept to show its relationship within the overall topic.
2.  **Hierarchy**: Start with a central, high-level concept and branch out to more specific details. All branches should ideally connect back to the main structure.
3.  **Output Format**: The output MUST be ONLY the Mermaid syntax code for a top-to-bottom flowchart (\`graph TD\`) inside a single \`\`\`mermaid ... \`\`\` block. Do not add ANY explanation.
4.  **Conciseness**: The diagram MUST be a high-level summary. Limit it to a **maximum of 8 to 12 key nodes**.
5.  **Node Content**: The text inside each node MUST be a clean, short concept (2-4 words). It **MUST NOT** contain special characters like \`()\`, \`{}\`, \`[]\`, \`@\`, \`;\`, or \`:\`.

DONT MAKE A VERY BIG GRAPH, MAKE IT SMALL AND CONCISE. WITH FEW NODES BUT CONNECTED.
MAKE SURE THE SYNTAX OF THE MERMAID GRAPH IS CORRECT AND THAT IT IS A SINGLE, INTERCONNECTED GRAPH.
AVOID USING SPECIAL CHARACTERS IN THE NODES, KEEP THEM SIMPLE AND CONCISE.
YOU SHOULD NOT USE SPECIAL CHARACTERS LIKE \`()\`, \`{}\`, \`[]\`, \`@\`, \`;\`, or \`:\` IN THE NODES.
DO NOT APPEND PARENTHESIS TO THE ANSWER IF YOU DO, EVERYTHING WILL GET RUINED
AVOID PARENTHESIS IN THE NODES, KEEP THEM SIMPLE AND CONCISE. 
IF YOU ADD PARENTHESIS, THE MERMAID GRAPH WILL NOT WORK PROPERLY.
---
**EXAMPLE of a CORRECT, interconnected graph:**
\`\`\`mermaid
graph TD
    A[Programacion Orientada a Objetos] --> B[Pilares Fundamentales];
    A --> C[Principios de Diseño];

    B --> D[Encapsulamiento];
    B --> E[Herencia];
    B --> F[Polimorfismo];

    C --> G[SOLID];
    C --> H[Patrones de Diseño];

    %% Example of connecting different branches
    F -- se aplica en --> H;
\`\`\`
---
Now, proceed with the user's text.
`;

const GITHUB_AI_ENDPOINT = 'https://models.github.ai/inference';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

export async function generateGraphicOrganizer(noteId: string): Promise<GraphicOrganizer> {
  // Obtenemos el contenido de la nota (lógica reutilizada)
  const note: NoteEntity | null = await fetchNoteById(noteId);
  if (!note) {
    throw new Error(`Note with ID ${noteId} not found`);
  }
  const text = convertTipTapToText(note.content);

  // Llamada al modelo de IA (misma configuración, diferente prompt)
  const client = ModelClient(GITHUB_AI_ENDPOINT, new AzureKeyCredential(GITHUB_TOKEN));
  //openai/gpt-4o
  //xai/grok-3
  //openai/gpt-4.1
  const myModel = "xai/grok-3";

  const aiResponse = await client.path('/chat/completions').post({
    body: {
      model: myModel,
      temperature: 0.7,
      max_tokens: 2000,
      messages: [
        { role: 'system', content: GRAPHIC_ORGANIZER_SYSTEM_PROMPT },
        { role: 'user', content: `Generate a graphic organizer in Mermaid syntax from the following text: ${text}` }
      ]
    }
  });

  if (isUnexpected(aiResponse)) {
    throw new Error(`Unexpected response from AI model: ${aiResponse.body.error.message}`);
  }

  // 2. El parseo de la respuesta es más simple
  let mermaidCode = aiResponse.body.choices[0].message.content || '';

  // Limpiamos el bloque de código de Markdown si la IA lo incluye
  if (mermaidCode.startsWith('```mermaid')) {
    mermaidCode = mermaidCode.replace(/```mermaid\n/g, '').replace(/```/g, '');
  }

  // 3. Creamos la nueva entidad
  const organizer: GraphicOrganizer = {
    id: uuidv4(),
    noteId,
    title: `Organizador para "${note.title}"`,
    mermaidCode: mermaidCode.trim(),
    createdAt: new Date().toISOString()
  };

  // 4. (Opcional pero recomendado) Guardamos el organizador en la base de datos
  const { error } = await supabase.from('graphic_organizers').insert({
    id: organizer.id,
    note_id: organizer.noteId,
    title: organizer.title,
    mermaid_code: organizer.mermaidCode,
    created_at: organizer.createdAt
  });

  if (error) {
    throw new Error(`Error inserting graphic organizer: ${error.message}`);
  }

  return organizer;
}

export async function fetchOrganizerByNoteId(noteId: string): Promise<GraphicOrganizer | null> {
  const { data, error } = await supabase
    .from('graphic_organizers')
    .select('*')
    .eq('note_id', noteId)
    .limit(1) // Nos aseguramos de que solo devuelva uno
    .single(); // .single() es genial: devuelve el objeto o null si no se encuentra.

  if (error && error.code !== 'PGRST116') {
    // Ignoramos el error 'PGRST116' que significa "no rows found"
    // y simplemente devolvemos null, pero sí lanzamos otros errores.
    console.error("Error fetching graphic organizer:", error);
    throw new Error("Error fetching graphic organizer");
  }

  const organizer: GraphicOrganizer = {
        id: data.id,
        noteId: data.note_id,
        title: data.title,
        mermaidCode: data.mermaid_code,
        createdAt: data.created_at,
    };

  // Si no hay datos, data será null, que es lo que queremos devolver.
  return organizer;
}