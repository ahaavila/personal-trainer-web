import './ComingSoonPage.css'

interface ComingSoonPageProps {
  title: string
}

function ComingSoonPage({ title }: ComingSoonPageProps) {
  return (
    <main className="coming-soon-page">
      <span className="coming-soon-page__eyebrow">Em construção</span>
      <h1>{title}</h1>
      <p>Esta área estará disponível em breve.</p>
    </main>
  )
}

export default ComingSoonPage
