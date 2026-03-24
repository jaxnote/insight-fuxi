export default function ProjectSelector() {
  return (
    <div data-testid="project-selector" style={{ padding: '8px' }}>
      <select style={{ width: '100%', background: '#1e1e3a', color: '#ccc', border: '1px solid #444', borderRadius: 4, padding: 4, fontSize: 12 }}>
        <option>Select Project...</option>
      </select>
    </div>
  )
}
