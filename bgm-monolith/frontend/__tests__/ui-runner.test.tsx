import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '../src/test-utils/render'
import userEvent from '@testing-library/user-event'
import { loadCases } from '../src/test-utils/loadCases'
import PanelContainer from '../src/pages/nl-analysis/components/PanelContainer'
import { usePanelStore } from '../src/pages/nl-analysis/stores/panelStore'

const panelCases = loadCases('ui/nl-analysis/panel-layout.cases.yaml')

describe.each(panelCases)('$id: $name', (tc: any) => {
  beforeEach(() => {
    usePanelStore.setState({
      panelA: { visible: false, width: 240 },
      panelB: { visible: true, width: 600 },
      panelC: { visible: false, width: 400 },
      panelD: { visible: false, width: 240 },
    })

    if (tc.setup?.store_state) {
      const storeState = tc.setup.store_state
      const currentState = usePanelStore.getState()
      const newState: any = {}
      for (const [key, val] of Object.entries(storeState)) {
        newState[key] = { ...currentState[key as keyof typeof currentState], ...(val as object) }
      }
      usePanelStore.setState(newState)
    }
  })

  it('passes', async () => {
    const user = userEvent.setup()
    render(<PanelContainer />)

    if (tc.action && tc.action !== 'render_page') {
      const { type, target } = tc.action
      if (type === 'click') {
        const el = screen.getByTestId(target)
        await user.click(el)
      }
    }

    for (const exp of tc.expected) {
      const testId = exp.selector.replace('[data-testid=', '').replace(']', '').replace(/"/g, '')
      if (exp.visible === true) {
        expect(screen.getByTestId(testId)).toBeInTheDocument()
      } else if (exp.visible === false) {
        expect(screen.queryByTestId(testId)).not.toBeInTheDocument()
      }
    }
  })
})
