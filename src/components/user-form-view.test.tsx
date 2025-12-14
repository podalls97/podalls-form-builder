import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserFormView } from './user-form-view'
import { toast } from 'sonner'

// Mock the toast module
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('UserFormView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders the form title and description', () => {
      render(<UserFormView />)
      expect(screen.getByText('Contact Information Form')).toBeInTheDocument()
      expect(screen.getByText('Please fill out your contact information below')).toBeInTheDocument()
    })

    it('renders all form fields from sample data', () => {
      render(<UserFormView />)

      // Check for text inputs
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument()

      // Check for other field types
      expect(screen.getByLabelText(/How did you hear about us/i)).toBeInTheDocument()
      expect(screen.getByText(/Preferred Contact Method/i)).toBeInTheDocument()
      expect(screen.getByText(/Areas of Interest/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Additional Comments/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Preferred Contact Date/i)).toBeInTheDocument()
    })

    it('shows required field indicators', () => {
      render(<UserFormView />)
      const requiredIndicators = screen.getAllByText('*')
      expect(requiredIndicators.length).toBeGreaterThan(0)
    })

    it('renders submit and clear buttons', () => {
      render(<UserFormView />)
      expect(screen.getByRole('button', { name: /Submit Form/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Clear/i })).toBeInTheDocument()
    })
  })

  describe('Field Updates', () => {
    it('updates text field value when user types', async () => {
      const user = userEvent.setup()
      render(<UserFormView />)

      const nameInput = screen.getByLabelText(/Full Name/i)
      await user.type(nameInput, 'John Doe')

      expect(nameInput).toHaveValue('John Doe')
    })

    it('updates email field value when user types', async () => {
      const user = userEvent.setup()
      render(<UserFormView />)

      const emailInput = screen.getByLabelText(/Email Address/i)
      await user.type(emailInput, 'john@example.com')

      expect(emailInput).toHaveValue('john@example.com')
    })

    it('updates number field value', async () => {
      const user = userEvent.setup()
      render(<UserFormView />)

      const phoneInput = screen.getByLabelText(/Phone Number/i)
      await user.type(phoneInput, '1234567890')

      expect(phoneInput).toHaveValue(1234567890)
    })

    it('updates textarea value when user types', async () => {
      const user = userEvent.setup()
      render(<UserFormView />)

      const textareaInput = screen.getByLabelText(/Additional Comments/i)
      await user.type(textareaInput, 'This is a comment')

      expect(textareaInput).toHaveValue('This is a comment')
    })

    it('updates date field value', async () => {
      const user = userEvent.setup()
      render(<UserFormView />)

      const dateInput = screen.getByLabelText(/Preferred Contact Date/i)
      await user.type(dateInput, '2024-12-25')

      expect(dateInput).toHaveValue('2024-12-25')
    })

    it('updates select field value when user selects option', async () => {
      const user = userEvent.setup()
      render(<UserFormView />)

      const selectTrigger = screen.getByRole('combobox', { name: /How did you hear about us/i })
      await user.click(selectTrigger)

      const option = screen.getByRole('option', { name: /Social Media/i })
      await user.click(option)

      expect(selectTrigger).toHaveTextContent('Social Media')
    })

    it('updates radio button selection', async () => {
      const user = userEvent.setup()
      render(<UserFormView />)

      const emailRadio = screen.getByRole('radio', { name: /Email/i })
      await user.click(emailRadio)

      expect(emailRadio).toBeChecked()
    })

    it('updates checkbox selections', async () => {
      const user = userEvent.setup()
      render(<UserFormView />)

      const newsletterCheckbox = screen.getByRole('checkbox', { name: /Newsletter/i })
      const eventsCheckbox = screen.getByRole('checkbox', { name: /Events/i })

      await user.click(newsletterCheckbox)
      await user.click(eventsCheckbox)

      expect(newsletterCheckbox).toBeChecked()
      expect(eventsCheckbox).toBeChecked()
    })

    it('unchecks checkbox when clicked twice', async () => {
      const user = userEvent.setup()
      render(<UserFormView />)

      const newsletterCheckbox = screen.getByRole('checkbox', { name: /Newsletter/i })

      await user.click(newsletterCheckbox)
      expect(newsletterCheckbox).toBeChecked()

      await user.click(newsletterCheckbox)
      expect(newsletterCheckbox).not.toBeChecked()
    })
  })

  describe('Form Submission', () => {
    it('shows error toast when required fields are missing', async () => {
      const user = userEvent.setup()
      render(<UserFormView />)

      // Fill only some required fields (not all)
      await user.type(screen.getByLabelText(/Full Name/i), 'John Doe')
      // Leave email and other required fields empty

      const form = screen.getByRole('button', { name: /Submit Form/i }).closest('form')
      if (form) {
        // Trigger form submit event
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
        form.dispatchEvent(submitEvent)
      }

      expect(toast.error).toHaveBeenCalledWith('Missing Required Fields', {
        description: 'Please fill out all required fields marked with *',
      })
    })

    it('shows success toast when all required fields are filled', async () => {
      const user = userEvent.setup()
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      render(<UserFormView />)

      // Fill required fields
      await user.type(screen.getByLabelText(/Full Name/i), 'John Doe')
      await user.type(screen.getByLabelText(/Email Address/i), 'john@example.com')

      // Select required dropdown
      const selectTrigger = screen.getByRole('combobox', { name: /How did you hear about us/i })
      await user.click(selectTrigger)
      const option = screen.getByRole('option', { name: /Social Media/i })
      await user.click(option)

      // Select required radio
      const emailRadio = screen.getByRole('radio', { name: /Email/i })
      await user.click(emailRadio)

      // Submit form
      const form = screen.getByRole('button', { name: /Submit Form/i }).closest('form')
      if (form) {
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
        form.dispatchEvent(submitEvent)
      }

      expect(toast.success).toHaveBeenCalledWith('Form Submitted Successfully!', {
        description: 'Thank you for your submission.',
      })

      expect(consoleSpy).toHaveBeenCalledWith(
        'Form Data:',
        expect.objectContaining({
          'field-2': 'John Doe',
          'field-3': 'john@example.com',
        })
      )

      consoleSpy.mockRestore()
    })

    it('logs form data to console on successful submission', async () => {
      const user = userEvent.setup()
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      render(<UserFormView />)

      // Fill required fields
      await user.type(screen.getByLabelText(/Full Name/i), 'Jane Smith')
      await user.type(screen.getByLabelText(/Email Address/i), 'jane@example.com')

      // Select required dropdown
      const selectTrigger = screen.getByRole('combobox', { name: /How did you hear about us/i })
      await user.click(selectTrigger)
      await user.click(screen.getByRole('option', { name: /Friend Referral/i }))

      // Select required radio
      await user.click(screen.getByRole('radio', { name: /Phone/i }))

      // Submit form
      const form = screen.getByRole('button', { name: /Submit Form/i }).closest('form')
      if (form) {
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
        form.dispatchEvent(submitEvent)
      }

      expect(consoleSpy).toHaveBeenCalled()
      const loggedData = consoleSpy.mock.calls[0][1]

      expect(loggedData['field-2']).toBe('Jane Smith')
      expect(loggedData['field-3']).toBe('jane@example.com')
      expect(loggedData['field-6']).toBe('Friend Referral')
      expect(loggedData['field-7']).toBe('Phone')

      consoleSpy.mockRestore()
    })
  })

  describe('Clear Functionality', () => {
    it('clears all form fields when clear button is clicked', async () => {
      const user = userEvent.setup()
      render(<UserFormView />)

      // Fill some fields
      const nameInput = screen.getByLabelText(/Full Name/i)
      const emailInput = screen.getByLabelText(/Email Address/i)

      await user.type(nameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')

      expect(nameInput).toHaveValue('John Doe')
      expect(emailInput).toHaveValue('john@example.com')

      // Click clear button
      const clearButton = screen.getByRole('button', { name: /Clear/i })
      await user.click(clearButton)

      // Verify fields are cleared
      expect(nameInput).toHaveValue('')
      expect(emailInput).toHaveValue('')
    })

    it('clears checkbox selections when clear button is clicked', async () => {
      const user = userEvent.setup()
      render(<UserFormView />)

      const newsletterCheckbox = screen.getByRole('checkbox', { name: /Newsletter/i })
      await user.click(newsletterCheckbox)

      expect(newsletterCheckbox).toBeChecked()

      // Click clear button
      await user.click(screen.getByRole('button', { name: /Clear/i }))

      // Checkbox should be unchecked
      expect(newsletterCheckbox).not.toBeChecked()
    })
  })

  describe('Label Fields', () => {
    it('renders label fields as section headings', () => {
      render(<UserFormView />)

      expect(screen.getByText('Personal Information')).toBeInTheDocument()
      expect(screen.getByText('Additional Details')).toBeInTheDocument()
    })
  })

  describe('Field Options', () => {
    it('renders all select options', async () => {
      const user = userEvent.setup()
      render(<UserFormView />)

      const selectTrigger = screen.getByRole('combobox', { name: /How did you hear about us/i })
      await user.click(selectTrigger)

      expect(screen.getByRole('option', { name: /Social Media/i })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: /Search Engine/i })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: /Friend Referral/i })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: /Advertisement/i })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: /Other/i })).toBeInTheDocument()
    })

    it('renders all radio options', () => {
      render(<UserFormView />)

      expect(screen.getByRole('radio', { name: /^Email$/i })).toBeInTheDocument()
      expect(screen.getByRole('radio', { name: /Phone/i })).toBeInTheDocument()
      expect(screen.getByRole('radio', { name: /Text Message/i })).toBeInTheDocument()
    })

    it('renders all checkbox options', () => {
      render(<UserFormView />)

      expect(screen.getByRole('checkbox', { name: /Product Updates/i })).toBeInTheDocument()
      expect(screen.getByRole('checkbox', { name: /Newsletter/i })).toBeInTheDocument()
      expect(screen.getByRole('checkbox', { name: /Special Offers/i })).toBeInTheDocument()
      expect(screen.getByRole('checkbox', { name: /Events/i })).toBeInTheDocument()
    })
  })
})
