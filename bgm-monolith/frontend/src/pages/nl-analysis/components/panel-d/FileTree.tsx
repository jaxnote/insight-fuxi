import { useFileTreeStore } from '../../stores/fileTreeStore'
import TreeNode from './TreeNode'

export default function FileTree() {
  const { files } = useFileTreeStore()
  return (
    <div data-testid="file-tree" style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
      {files.map((f) => <TreeNode key={f.path} path={f.path} />)}
    </div>
  )
}
