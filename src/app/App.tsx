import { Route, Routes } from 'react-router'
import { AppShell } from './AppShell'
import { HomePage } from '../features/home/HomePage'
import { BiblePage } from '../features/bible/BiblePage'
import { BookPage } from '../features/bible/BookPage'
import { ReaderPage } from '../features/bible/ReaderPage'
import { ComingSoonPage } from '../features/placeholders/ComingSoonPage'

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="biblia" element={<BiblePage />} />
        <Route path="biblia/:bookId" element={<BookPage />} />
        <Route path="biblia/:bookId/:chapter" element={<ReaderPage />} />
        <Route
          path="predicas"
          element={
            <ComingSoonPage
              title="Prédicas"
              description="El editor de prédicas se construirá cuando cerremos la base bíblica y el lector."
            />
          }
        />
        <Route
          path="buscar"
          element={
            <ComingSoonPage
              title="Buscar"
              description="La búsqueda de palabras y frases bíblicas pertenece a la siguiente etapa del lector."
            />
          }
        />
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
