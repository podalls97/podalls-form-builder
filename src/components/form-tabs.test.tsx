import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormTabs } from './form-tabs'
import type { Form } from '../lib/types'

const mockForms: Form[] = [
  {
    id: 'form-1',
    title: 'Contact Form',
    description: '',
    fields: [],
    settings: {
      submitButtonText: 'Submit',
      successMessage: 'Thank you!',
      allowMultipleSubmissions: true,
      showProgressBar: false,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'form-2',
    title: 'Survey Form',
    description: '',
    fields: [],
    settings: {
      submitButtonText: 'Submit',
      successMessage: 'Thank you!',
      allowMultipleSubmissions: true,
      showProgressBar: false,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'form-3',
    title: 'Registration Form',
    description: '',
    fields: [],
    settings: {
      submitButtonText: 'Submit',
      successMessage: 'Thank you!',
      allowMultipleSubmissions: true,
      showProgressBar: false,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

describe('FormTabs', () => {
  let mockCallbacks: {
    onSelectForm: ReturnType<typeof vi.fn>
    onAddForm: ReturnType<typeof vi.fn>
    onDeleteForm: ReturnType<typeof vi.fn>
    onRenameForm: ReturnType<typeof vi.fn>
    onDuplicateForm: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    mockCallbacks = {
      onSelectForm: vi.fn(),
      onAddForm: vi.fn(),
      onDeleteForm: vi.fn(),
      onRenameForm: vi.fn(),
      onDuplicateForm: vi.fn(),
    }
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders all form tabs', () => {
      render(<FormTabs forms={mockForms} activeFormId="form-1" {...mockCallbacks} />)

      expect(screen.getByText('Contact Form')).toBeInTheDocument()
      expect(screen.getByText('Survey Form')).toBeInTheDocument()
      expect(screen.getByText('Registration Form')).toBeInTheDocument()
    })

    it('highlights the active form tab', () => {
      render(<FormTabs forms={mockForms} activeFormId="form-2" {...mockCallbacks} />)

      const surveyTab = screen.getByText('Survey Form').parentElement
      expect(surveyTab).toHaveClass('border-primary')
    })

    it('renders add form button', () => {
      render(<FormTabs forms={mockForms} activeFormId="form-1" {...mockCallbacks} />)

      expect(screen.getByRole('button', { name: /new form/i })).toBeInTheDocument()
    })
  })

  describe('Form Selection', () => {
    it('calls onSelectForm when a tab is clicked', async () => {
      const user = userEvent.setup()
      render(<FormTabs forms={mockForms} activeFormId="form-1" {...mockCallbacks} />)

      await user.click(screen.getByText('Survey Form'))

      expect(mockCallbacks.onSelectForm).toHaveBeenCalledWith('form-2')
      expect(mockCallbacks.onSelectForm).toHaveBeenCalledTimes(1)
    })

    it('switches between different forms', async () => {
      const user = userEvent.setup()
      render(<FormTabs forms={mockForms} activeFormId="form-1" {...mockCallbacks} />)

      await user.click(screen.getByText('Survey Form'))
      await user.click(screen.getByText('Registration Form'))

      expect(mockCallbacks.onSelectForm).toHaveBeenCalledTimes(2)
      expect(mockCallbacks.onSelectForm).toHaveBeenNthCalledWith(1, 'form-2')
      expect(mockCallbacks.onSelectForm).toHaveBeenNthCalledWith(2, 'form-3')
    })
  })

  describe('Form Renaming', () => {
    it('enters edit mode when rename button is clicked', async () => {
      const user = userEvent.setup()
      render(<FormTabs forms={mockForms} activeFormId="form-1" {...mockCallbacks} />)

      const contactTab = screen.getByText('Contact Form').parentElement
      const renameButton = contactTab?.querySelector('[title="Rename form"]')
      expect(renameButton).toBeInTheDocument()

      if (renameButton) {
        await user.click(renameButton as Element)
        expect(screen.getByDisplayValue('Contact Form')).toBeInTheDocument()
      }
    })

    it('updates form title on Enter key', async () => {
      const user = userEvent.setup()
      render(<FormTabs forms={mockForms} activeFormId="form-1" {...mockCallbacks} />)

      const contactTab = screen.getByText('Contact Form').parentElement
      const renameButton = contactTab?.querySelector('[title="Rename form"]') as Element
      await user.click(renameButton)

      const input = screen.getByDisplayValue('Contact Form')
      await user.clear(input)
      await user.type(input, 'New Contact Form{Enter}')

      expect(mockCallbacks.onRenameForm).toHaveBeenCalledWith('form-1', 'New Contact Form')
    })

    it('updates form title when clicking check button', async () => {
      const user = userEvent.setup()
      render(<FormTabs forms={mockForms} activeFormId="form-1" {...mockCallbacks} />)

      const contactTab = screen.getByText('Contact Form').parentElement
      const renameButton = contactTab?.querySelector('[title="Rename form"]') as Element
      await user.click(renameButton)

      const input = screen.getByDisplayValue('Contact Form')
      await user.clear(input)
      await user.type(input, 'Updated Form')

      const checkButton = screen.getByRole('button', { name: '' }).parentElement?.querySelector('button')
      if (checkButton) {
        await user.click(checkButton)
        expect(mockCallbacks.onRenameForm).toHaveBeenCalledWith('form-1', 'Updated Form')
      }
    })

    it('cancels editing on Escape key', async () => {
      const user = userEvent.setup()
      render(<FormTabs forms={mockForms} activeFormId="form-1" {...mockCallbacks} />)

      const contactTab = screen.getByText('Contact Form').parentElement
      const renameButton = contactTab?.querySelector('[title="Rename form"]') as Element
      await user.click(renameButton)

      const input = screen.getByDisplayValue('Contact Form')
      await user.clear(input)
      await user.type(input, 'New Title{Escape}')

      expect(mockCallbacks.onRenameForm).not.toHaveBeenCalled()
      expect(screen.queryByDisplayValue('New Title')).not.toBeInTheDocument()
    })

    it('finishes editing on blur', async () => {
      const user = userEvent.setup()
      render(<FormTabs forms={mockForms} activeFormId="form-1" {...mockCallbacks} />)

      const contactTab = screen.getByText('Contact Form').parentElement
      const renameButton = contactTab?.querySelector('[title="Rename form"]') as Element
      await user.click(renameButton)

      const input = screen.getByDisplayValue('Contact Form')
      await user.clear(input)
      await user.type(input, 'Blurred Form')

      // Trigger blur by clicking outside
      await user.click(document.body)

      expect(mockCallbacks.onRenameForm).toHaveBeenCalledWith('form-1', 'Blurred Form')
    })

    it('does not rename if title is empty', async () => {
      const user = userEvent.setup()
      render(<FormTabs forms={mockForms} activeFormId="form-1" {...mockCallbacks} />)

      const contactTab = screen.getByText('Contact Form').parentElement
      const renameButton = contactTab?.querySelector('[title="Rename form"]') as Element
      await user.click(renameButton)

      const input = screen.getByDisplayValue('Contact Form')
      await user.clear(input)
      await user.type(input, '{Enter}')

      expect(mockCallbacks.onRenameForm).not.toHaveBeenCalled()
    })

    it('trims whitespace from new title', async () => {
      const user = userEvent.setup()
      render(<FormTabs forms={mockForms} activeFormId="form-1" {...mockCallbacks} />)

      const contactTab = screen.getByText('Contact Form').parentElement
      const renameButton = contactTab?.querySelector('[title="Rename form"]') as Element
      await user.click(renameButton)

      const input = screen.getByDisplayValue('Contact Form')
      await user.clear(input)
      await user.type(input, '  Trimmed Title  {Enter}')

      expect(mockCallbacks.onRenameForm).toHaveBeenCalledWith('form-1', 'Trimmed Title')
    })
  })

  describe('Form Duplication', () => {
    it('calls onDuplicateForm when duplicate button is clicked', async () => {
      const user = userEvent.setup()
      render(<FormTabs forms={mockForms} activeFormId="form-1" {...mockCallbacks} />)

      const contactTab = screen.getByText('Contact Form').parentElement
      const duplicateButton = contactTab?.querySelector('[title="Duplicate form"]') as Element
      await user.click(duplicateButton)

      expect(mockCallbacks.onDuplicateForm).toHaveBeenCalledWith('form-1')
      expect(mockCallbacks.onDuplicateForm).toHaveBeenCalledTimes(1)
    })

    it('can duplicate any form', async () => {
      const user = userEvent.setup()
      render(<FormTabs forms={mockForms} activeFormId="form-1" {...mockCallbacks} />)

      const surveyTab = screen.getByText('Survey Form').parentElement
      const duplicateButton = surveyTab?.querySelector('[title="Duplicate form"]') as Element
      await user.click(duplicateButton)

      expect(mockCallbacks.onDuplicateForm).toHaveBeenCalledWith('form-2')
    })
  })

  describe('Form Deletion', () => {
    it('shows delete button when there are multiple forms', () => {
      render(<FormTabs forms={mockForms} activeFormId="form-1" {...mockCallbacks} />)

      const contactTab = screen.getByText('Contact Form').parentElement
      const deleteButton = contactTab?.querySelector('[title="Delete form"]')
      expect(deleteButton).toBeInTheDocument()
    })

    it('does not show delete button when there is only one form', () => {
      const singleForm = [mockForms[0]]
      render(<FormTabs forms={singleForm} activeFormId="form-1" {...mockCallbacks} />)

      const contactTab = screen.getByText('Contact Form').parentElement
      const deleteButton = contactTab?.querySelector('[title="Delete form"]')
      expect(deleteButton).not.toBeInTheDocument()
    })

    it('calls onDeleteForm when delete is confirmed', async () => {
      const user = userEvent.setup()
      // Mock window.confirm to always return true
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

      render(<FormTabs forms={mockForms} activeFormId="form-1" {...mockCallbacks} />)

      const contactTab = screen.getByText('Contact Form').parentElement
      const deleteButton = contactTab?.querySelector('[title="Delete form"]') as Element
      await user.click(deleteButton)

      expect(confirmSpy).toHaveBeenCalledWith('Delete form "Contact Form"?')
      expect(mockCallbacks.onDeleteForm).toHaveBeenCalledWith('form-1')

      confirmSpy.mockRestore()
    })

    it('does not delete when deletion is cancelled', async () => {
      const user = userEvent.setup()
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)

      render(<FormTabs forms={mockForms} activeFormId="form-1" {...mockCallbacks} />)

      const contactTab = screen.getByText('Contact Form').parentElement
      const deleteButton = contactTab?.querySelector('[title="Delete form"]') as Element
      await user.click(deleteButton)

      expect(mockCallbacks.onDeleteForm).not.toHaveBeenCalled()

      confirmSpy.mockRestore()
    })
  })

  describe('Add Form', () => {
    it('calls onAddForm when add button is clicked', async () => {
      const user = userEvent.setup()
      render(<FormTabs forms={mockForms} activeFormId="form-1" {...mockCallbacks} />)

      const addButton = screen.getByRole('button', { name: /new form/i })
      await user.click(addButton)

      expect(mockCallbacks.onAddForm).toHaveBeenCalledTimes(1)
    })

    it('can add multiple forms in sequence', async () => {
      const user = userEvent.setup()
      render(<FormTabs forms={mockForms} activeFormId="form-1" {...mockCallbacks} />)

      const addButton = screen.getByRole('button', { name: /new form/i })
      await user.click(addButton)
      await user.click(addButton)
      await user.click(addButton)

      expect(mockCallbacks.onAddForm).toHaveBeenCalledTimes(3)
    })
  })

  describe('Tab Interactions', () => {
    it('does not trigger selection when clicking action buttons', async () => {
      const user = userEvent.setup()
      render(<FormTabs forms={mockForms} activeFormId="form-1" {...mockCallbacks} />)

      const contactTab = screen.getByText('Contact Form').parentElement
      const duplicateButton = contactTab?.querySelector('[title="Duplicate form"]') as Element
      await user.click(duplicateButton)

      expect(mockCallbacks.onSelectForm).not.toHaveBeenCalled()
      expect(mockCallbacks.onDuplicateForm).toHaveBeenCalledWith('form-1')
    })
  })
})
