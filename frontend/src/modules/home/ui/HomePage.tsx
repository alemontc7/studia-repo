// frontend/src/app/home/page.tsx
'use client';
import { NotesProvider } from '@/modules/notes/ui/NotesContent';
import Sidebar from '../components/Sidebar';
import EditorArea from '../components/EditorArea';

export default function HomePage() {
  return (
    <NotesProvider>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <EditorArea />
        </main>
      </div>
    </NotesProvider>
  );
}
