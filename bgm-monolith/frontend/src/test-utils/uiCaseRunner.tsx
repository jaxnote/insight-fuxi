import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'

interface UiCase {
  id: string
  action?: { type: string; target: string; value?: string } | string
  expected: Array<{
    selector?: string
    visible?: boolean
    text?: string
    count?: number
  }>
}

export async function runUiCase(tc: UiCase, renderFn: () => void) {
  renderFn()

  if (tc.action && tc.action !== 'render_page') {
    const action = tc.action as { type: string; target: string; value?: string }
    const testId = action.target.replace('[data-testid=', '').replace(']', '')
    const el = screen.getByTestId(testId)
    if (action.type === 'click') await userEvent.click(el)
    if (action.type === 'fill' && action.value) await userEvent.type(el, action.value)
  }

  for (const exp of tc.expected) {
    if (exp.selector) {
      const testId = exp.selector.replace('[data-testid=', '').replace(']', '')
      if (exp.visible === true) {
        expect(screen.getByTestId(testId)).toBeVisible()
      } else if (exp.visible === false) {
        expect(screen.queryByTestId(testId)).not.toBeInTheDocument()
      }
      if (exp.text) {
        expect(screen.getByTestId(testId)).toHaveTextContent(exp.text)
      }
    }
  }
}
