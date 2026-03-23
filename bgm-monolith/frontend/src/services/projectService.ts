import { apiFetch } from './api'
import type { Project } from './types'

export const projectService = {
  list: () => apiFetch<{ items: Project[]; total: number }>('/api/projects'),
  get: (id: string) => apiFetch<Project>(`/api/projects/${id}`),
  create: (name: string, description?: string) =>
    apiFetch<Project>('/api/projects', { method: 'POST', body: JSON.stringify({ name, description }) }),
  getFileTree: (projectId: string) =>
    apiFetch<{ items: { path: string }[] }>(`/api/projects/${projectId}/files`),
}
