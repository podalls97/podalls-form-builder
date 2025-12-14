import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormSettingsPanel } from './form-settings-panel'
import type { FormSettings } from '../lib/types'

const mockSettings: FormSettings = {
  submitButtonText: 'Submit',
  successMessage: 'Thank you for your submission!',
  redirectUrl: '',
  allowMultipleSubmissions: true,
  showProgressBar: false,
}

describe('FormSettingsPanel', () => {
  describe('Rendering', () => {
    it('renders form settings title', () => {
      const mockOnUpdate = vi.fn()
      render(<FormSettingsPanel settings={mockSettings} onUpdate={mockOnUpdate} />)

      expect(screen.getByText('Form Settings')).toBeInTheDocument()
    })

    it('renders submit button text input with value', () => {
      const mockOnUpdate = vi.fn()
      render(<FormSettingsPanel settings={mockSettings} onUpdate={mockOnUpdate} />)

      const input = screen.getByLabelText(/Submit Button Text/i)
      expect(input).toBeInTheDocument()
      expect(input).toHaveValue('Submit')
    })

    it('renders success message textarea with value', () => {
      const mockOnUpdate = vi.fn()
      render(<FormSettingsPanel settings={mockSettings} onUpdate={mockOnUpdate} />)

      const textarea = screen.getByLabelText(/Success Message/i)
      expect(textarea).toBeInTheDocument()
      expect(textarea).toHaveValue('Thank you for your submission!')
    })

    it('renders redirect URL input', () => {
      const mockOnUpdate = vi.fn()
      render(<FormSettingsPanel settings={mockSettings} onUpdate={mockOnUpdate} />)

      const input = screen.getByLabelText(/Redirect URL/i)
      expect(input).toBeInTheDocument()
    })

    it('renders allow multiple submissions switch', () => {
      const mockOnUpdate = vi.fn()
      render(<FormSettingsPanel settings={mockSettings} onUpdate={mockOnUpdate} />)

      expect(screen.getByLabelText(/Allow Multiple Submissions/i)).toBeInTheDocument()
      expect(screen.getByText('Users can submit the form multiple times')).toBeInTheDocument()
    })

    it('renders show progress bar switch', () => {
      const mockOnUpdate = vi.fn()
      render(<FormSettingsPanel settings={mockSettings} onUpdate={mockOnUpdate} />)

      expect(screen.getByLabelText(/Show Progress Bar/i)).toBeInTheDocument()
      expect(screen.getByText('Display progress indicator for multi-step forms')).toBeInTheDocument()
    })
  })

  describe('Submit Button Text Update', () => {
    it('calls onUpdate when submit button text changes', async () => {
      const user = userEvent.setup()
      const mockOnUpdate = vi.fn()
      render(<FormSettingsPanel settings={mockSettings} onUpdate={mockOnUpdate} />)

      const input = screen.getByLabelText(/Submit Button Text/i)
      await user.type(input, 'X')

      expect(mockOnUpdate).toHaveBeenCalled()
      // Check that onUpdate was called with submitButtonText property
      const lastCall = mockOnUpdate.mock.calls[mockOnUpdate.mock.calls.length - 1][0]
      expect(lastCall).toHaveProperty('submitButtonText')
      expect(lastCall.submitButtonText).toContain('Submit')
    })

    it('preserves other settings when updating submit button text', async () => {
      const user = userEvent.setup()
      const mockOnUpdate = vi.fn()
      render(<FormSettingsPanel settings={mockSettings} onUpdate={mockOnUpdate} />)

      const input = screen.getByLabelText(/Submit Button Text/i)
      await user.type(input, 'X')

      const lastCall = mockOnUpdate.mock.calls[mockOnUpdate.mock.calls.length - 1][0]
      expect(lastCall.successMessage).toBe('Thank you for your submission!')
      expect(lastCall.allowMultipleSubmissions).toBe(true)
      expect(lastCall.showProgressBar).toBe(false)
    })
  })

  describe('Success Message Update', () => {
    it('calls onUpdate when success message changes', async () => {
      const user = userEvent.setup()
      const mockOnUpdate = vi.fn()
      render(<FormSettingsPanel settings={mockSettings} onUpdate={mockOnUpdate} />)

      const textarea = screen.getByLabelText(/Success Message/i)
      await user.type(textarea, 'X')

      expect(mockOnUpdate).toHaveBeenCalled()
      // Check that onUpdate was called with successMessage property
      const lastCall = mockOnUpdate.mock.calls[mockOnUpdate.mock.calls.length - 1][0]
      expect(lastCall).toHaveProperty('successMessage')
    })

    it('handles multiline success messages', async () => {
      const user = userEvent.setup()
      const mockOnUpdate = vi.fn()
      render(<FormSettingsPanel settings={mockSettings} onUpdate={mockOnUpdate} />)

      const textarea = screen.getByLabelText(/Success Message/i)
      await user.type(textarea, '{Enter}')

      const lastCall = mockOnUpdate.mock.calls[mockOnUpdate.mock.calls.length - 1][0]
      expect(lastCall).toHaveProperty('successMessage')
      expect(lastCall.successMessage).toContain('\n')
    })
  })

  describe('Redirect URL Update', () => {
    it('calls onUpdate when redirect URL changes', async () => {
      const user = userEvent.setup()
      const mockOnUpdate = vi.fn()
      render(<FormSettingsPanel settings={mockSettings} onUpdate={mockOnUpdate} />)

      const input = screen.getByLabelText(/Redirect URL/i)
      await user.type(input, 'x')

      expect(mockOnUpdate).toHaveBeenCalled()
      // Check that onUpdate was called with redirectUrl property
      const lastCall = mockOnUpdate.mock.calls[mockOnUpdate.mock.calls.length - 1][0]
      expect(lastCall).toHaveProperty('redirectUrl')
      expect(typeof lastCall.redirectUrl).toBe('string')
    })

    it('handles empty redirect URL', () => {
      const settingsWithRedirect: FormSettings = {
        ...mockSettings,
        redirectUrl: undefined,
      }
      const mockOnUpdate = vi.fn()
      render(<FormSettingsPanel settings={settingsWithRedirect} onUpdate={mockOnUpdate} />)

      const input = screen.getByLabelText(/Redirect URL/i)
      expect(input).toHaveValue('')
    })

    it('displays redirect URL helper text', () => {
      const mockOnUpdate = vi.fn()
      render(<FormSettingsPanel settings={mockSettings} onUpdate={mockOnUpdate} />)

      expect(screen.getByText('Redirect users after successful submission')).toBeInTheDocument()
    })
  })

  describe('Allow Multiple Submissions Toggle', () => {
    it('calls onUpdate when multiple submissions toggle is changed', async () => {
      const user = userEvent.setup()
      const mockOnUpdate = vi.fn()
      render(<FormSettingsPanel settings={mockSettings} onUpdate={mockOnUpdate} />)

      const toggle = screen.getByRole('switch', { name: /Allow Multiple Submissions/i })
      await user.click(toggle)

      expect(mockOnUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          allowMultipleSubmissions: false,
        })
      )
    })

    it('reflects current state of multiple submissions setting', () => {
      const mockOnUpdate = vi.fn()
      const settingsDisabled: FormSettings = {
        ...mockSettings,
        allowMultipleSubmissions: false,
      }
      render(<FormSettingsPanel settings={settingsDisabled} onUpdate={mockOnUpdate} />)

      const toggle = screen.getByRole('switch', { name: /Allow Multiple Submissions/i })
      expect(toggle).not.toBeChecked()
    })

    it('can toggle multiple submissions on and off', async () => {
      const user = userEvent.setup()
      let currentSettings = { ...mockSettings }
      const mockOnUpdate = vi.fn().mockImplementation((newSettings) => {
        currentSettings = newSettings
      })

      const { rerender } = render(
        <FormSettingsPanel settings={currentSettings} onUpdate={mockOnUpdate} />
      )

      // Toggle off
      const toggle = screen.getByRole('switch', { name: /Allow Multiple Submissions/i })
      await user.click(toggle)
      expect(mockOnUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ allowMultipleSubmissions: false })
      )

      // Re-render with updated state
      rerender(<FormSettingsPanel settings={currentSettings} onUpdate={mockOnUpdate} />)

      // Toggle back on
      const toggleAfter = screen.getByRole('switch', { name: /Allow Multiple Submissions/i })
      await user.click(toggleAfter)
      expect(mockOnUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ allowMultipleSubmissions: true })
      )
    })
  })

  describe('Show Progress Bar Toggle', () => {
    it('calls onUpdate when progress bar toggle is changed', async () => {
      const user = userEvent.setup()
      const mockOnUpdate = vi.fn()
      render(<FormSettingsPanel settings={mockSettings} onUpdate={mockOnUpdate} />)

      const toggle = screen.getByRole('switch', { name: /Show Progress Bar/i })
      await user.click(toggle)

      expect(mockOnUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          showProgressBar: true,
        })
      )
    })

    it('reflects current state of progress bar setting', () => {
      const mockOnUpdate = vi.fn()
      const settingsWithProgress: FormSettings = {
        ...mockSettings,
        showProgressBar: true,
      }
      render(<FormSettingsPanel settings={settingsWithProgress} onUpdate={mockOnUpdate} />)

      const toggle = screen.getByRole('switch', { name: /Show Progress Bar/i })
      expect(toggle).toBeChecked()
    })
  })

  describe('Settings Preservation', () => {
    it('preserves all settings when updating individual fields', async () => {
      const user = userEvent.setup()
      const mockOnUpdate = vi.fn()
      const fullSettings: FormSettings = {
        submitButtonText: 'Submit Now',
        successMessage: 'Success!',
        redirectUrl: 'https://example.com/thanks',
        allowMultipleSubmissions: false,
        showProgressBar: true,
      }
      render(<FormSettingsPanel settings={fullSettings} onUpdate={mockOnUpdate} />)

      // Update submit button text
      const input = screen.getByLabelText(/Submit Button Text/i)
      await user.type(input, 'X')

      const lastCall = mockOnUpdate.mock.calls[mockOnUpdate.mock.calls.length - 1][0]
      // Verify all settings are present (preserved)
      expect(lastCall).toHaveProperty('submitButtonText')
      expect(lastCall.successMessage).toBe('Success!')
      expect(lastCall.redirectUrl).toBe('https://example.com/thanks')
      expect(lastCall.allowMultipleSubmissions).toBe(false)
      expect(lastCall.showProgressBar).toBe(true)
    })
  })

  describe('Accessibility', () => {
    it('has proper labels for all inputs', () => {
      const mockOnUpdate = vi.fn()
      render(<FormSettingsPanel settings={mockSettings} onUpdate={mockOnUpdate} />)

      expect(screen.getByLabelText(/Submit Button Text/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Success Message/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Redirect URL/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Allow Multiple Submissions/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Show Progress Bar/i)).toBeInTheDocument()
    })

    it('has helper text for complex settings', () => {
      const mockOnUpdate = vi.fn()
      render(<FormSettingsPanel settings={mockSettings} onUpdate={mockOnUpdate} />)

      expect(screen.getByText('Redirect users after successful submission')).toBeInTheDocument()
      expect(screen.getByText('Users can submit the form multiple times')).toBeInTheDocument()
      expect(screen.getByText('Display progress indicator for multi-step forms')).toBeInTheDocument()
    })
  })
})
