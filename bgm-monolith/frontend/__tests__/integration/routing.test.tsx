import { describe, it, expect } from 'vitest'
import { render } from '../../src/test-utils/render'
import { screen } from '@testing-library/react'
import App from '../../src/App'

describe('路由配置', () => {
  it('根路径 / 重定向到 /nl-analysis', () => {
    render(<App />, { route: '/' })
    expect(screen.getByTestId('nl-analysis-page')).toBeInTheDocument()
  })

  it('/nl-analysis 路径渲染 NLAnalysis 页面', () => {
    render(<App />, { route: '/nl-analysis' })
    expect(screen.getByTestId('nl-analysis-page')).toBeInTheDocument()
  })

  it('AppLayout 包含导航栏', () => {
    render(<App />, { route: '/nl-analysis' })
    expect(screen.getByTestId('app-layout')).toBeInTheDocument()
  })
})
