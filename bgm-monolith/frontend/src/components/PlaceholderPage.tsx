import { Link } from 'react-router-dom'

export interface PlaceholderPageProps {
  title: string
}

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div
      data-testid="placeholder-page"
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        minHeight: 0,
        padding: 32,
        background: 'var(--bg-0)',
        color: 'var(--text-2)',
        fontFamily: 'var(--sans)',
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: 20,
          fontWeight: 600,
          color: 'var(--text-1)',
        }}
      >
        {title}
      </h1>
      <p style={{ margin: 0, fontSize: 14, color: 'var(--text-3)' }}>该页面建设中，敬请期待。</p>
      <Link
        to="/nl-analysis"
        style={{
          marginTop: 8,
          fontSize: 13,
          color: 'var(--accent)',
          textDecoration: 'none',
        }}
      >
        返回问答对话
      </Link>
    </div>
  )
}
