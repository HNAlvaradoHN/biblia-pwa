import { Route, Routes } from 'react-router'
import { AppShell } from './AppShell'
import { HomePage } from '../features/home/HomePage'
import { BiblePage } from '../features/bible/BiblePage'
import { BookPage } from '../features/bible/BookPage'
import { ReaderPage } from '../features/bible/ReaderPage'
import { FocusedReaderPage } from '../features/bible/FocusedReaderPage'
import { FavoritesPage, NotesPage } from '../features/saved/SavedPages'
import { ComingSoonPage } from '../features/placeholders/ComingSoonPage'
import { SearchPage } from '../features/search/SearchPage'
import { SermonEditorPage, SermonsPage } from '../features/sermons/SermonsPage'

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="biblia" element={<BiblePage />} />
        <Route path="biblia/:bookId" element={<BookPage />} />
        <Route path="biblia/:bookId/:chapter" element={<ReaderPage />} />
        <Route path="biblia/:bookId/:chapter/foco" element={<FocusedReaderPage />} />
        <Route path="favoritos" element={<FavoritesPage />} />
        <Route path="notas" element={<NotesPage />} />
        <Route path="predicas" element={<SermonsPage />} />
        <Route path="predicas/:sermonId" element={<SermonEditorPage />} />
        <Route path="buscar" element={<SearchPage />} />
        <Route
          path="*"
          element={
            <ComingSoonPage
              title="Página no encontrada"
              description="Esta ruta todavía no existe en la aplicación."
            />
          }
        />
      </Route>
    </Routes>
  )
}
