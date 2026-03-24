export default function TreeNode({ path }: { path: string }) {
  return (
    <div data-testid={`tree-node-${path}`} style={{ padding: '4px 12px', fontSize: 12, color: '#ccc', cursor: 'pointer' }}>
      {path}
    </div>
  )
}
