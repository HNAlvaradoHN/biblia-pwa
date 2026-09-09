import { Link } from 'react-router'

interface ComingSoonPageProps {
  title: string
  description: string
}

export function ComingSoonPage({ title, description }: ComingSoonPageProps) {
  return (
    <div className="page">
      <section className="placeholder-card">
        <p className="eyebrow">Próxima fase</p>
        <h1>{title}</h1>
        <p className="muted">{description}</p>
        <Link className="button primary" to="/">Volver al Inicio</Link>
      </section>
    </div>
  )
}
