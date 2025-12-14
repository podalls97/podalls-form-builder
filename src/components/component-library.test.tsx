import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentLibrary } from './component-library'

describe('ComponentLibrary', () => {
  describe('Rendering', () => {
    it('renders all component categories', () => {
      const mockOnAddField = vi.fn()
      render(<ComponentLibrary onAddField={mockOnAddField} />)

      // Use getAllByText since some texts appear both as category and component names
      expect(screen.getByRole('heading', { name: /Basic Inputs/i, level: 3 })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /Selection/i, level: 3 })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /Date & Time/i, level: 3 })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /Advanced/i, level: 3 })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /Layout/i, level: 3 })).toBeInTheDocument()
    })

    it('renders all basic input components', () => {
      const mockOnAddField = vi.fn()
      render(<ComponentLibrary onAddField={mockOnAddField} />)

      expect(screen.getByText('Text Input')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('Number')).toBeInTheDocument()
      expect(screen.getByText('Phone')).toBeInTheDocument()
      expect(screen.getByText('URL')).toBeInTheDocument()
      expect(screen.getByText('Text Area')).toBeInTheDocument()
    })

    it('renders all selection components', () => {
      const mockOnAddField = vi.fn()
      render(<ComponentLibrary onAddField={mockOnAddField} />)

      expect(screen.getByText('Dropdown')).toBeInTheDocument()
      expect(screen.getByText('Radio Button')).toBeInTheDocument()
      expect(screen.getByText('Checkbox')).toBeInTheDocument()
    })

    it('renders all date & time components', () => {
      const mockOnAddField = vi.fn()
      render(<ComponentLibrary onAddField={mockOnAddField} />)

      expect(screen.getByText('Date Picker')).toBeInTheDocument()
      expect(screen.getByText('Time Picker')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Date & Time.*Date and time/i })).toBeInTheDocument()
    })

    it('renders all advanced components', () => {
      const mockOnAddField = vi.fn()
      render(<ComponentLibrary onAddField={mockOnAddField} />)

      expect(screen.getByText('File Upload')).toBeInTheDocument()
      expect(screen.getByText('Slider')).toBeInTheDocument()
      expect(screen.getByText('Color Picker')).toBeInTheDocument()
      expect(screen.getByText('Rating')).toBeInTheDocument()
    })

    it('renders all layout components', () => {
      const mockOnAddField = vi.fn()
      render(<ComponentLibrary onAddField={mockOnAddField} />)

      expect(screen.getByText('Label')).toBeInTheDocument()
      expect(screen.getByText('Heading')).toBeInTheDocument()
      expect(screen.getByText('Paragraph')).toBeInTheDocument()
      expect(screen.getByText('Divider')).toBeInTheDocument()
    })

    it('displays component descriptions', () => {
      const mockOnAddField = vi.fn()
      render(<ComponentLibrary onAddField={mockOnAddField} />)

      expect(screen.getByText('Single line text')).toBeInTheDocument()
      expect(screen.getByText('Email address')).toBeInTheDocument()
      expect(screen.getByText('Numeric input')).toBeInTheDocument()
      expect(screen.getByText('Select from options')).toBeInTheDocument()
      expect(screen.getByText('Star rating')).toBeInTheDocument()
    })
  })

  describe('Field Addition', () => {
    it('calls onAddField with correct type when text input is clicked', async () => {
      const user = userEvent.setup()
      const mockOnAddField = vi.fn()
      render(<ComponentLibrary onAddField={mockOnAddField} />)

      const textButton = screen.getByRole('button', { name: /Text Input/i })
      await user.click(textButton)

      expect(mockOnAddField).toHaveBeenCalledWith('text')
      expect(mockOnAddField).toHaveBeenCalledTimes(1)
    })

    it('calls onAddField with correct type when email is clicked', async () => {
      const user = userEvent.setup()
      const mockOnAddField = vi.fn()
      render(<ComponentLibrary onAddField={mockOnAddField} />)

      const emailButton = screen.getByRole('button', { name: /Email/i })
      await user.click(emailButton)

      expect(mockOnAddField).toHaveBeenCalledWith('email')
    })

    it('calls onAddField with correct type when dropdown is clicked', async () => {
      const user = userEvent.setup()
      const mockOnAddField = vi.fn()
      render(<ComponentLibrary onAddField={mockOnAddField} />)

      const dropdownButton = screen.getByRole('button', { name: /Dropdown/i })
      await user.click(dropdownButton)

      expect(mockOnAddField).toHaveBeenCalledWith('select')
    })

    it('calls onAddField with correct type when date picker is clicked', async () => {
      const user = userEvent.setup()
      const mockOnAddField = vi.fn()
      render(<ComponentLibrary onAddField={mockOnAddField} />)

      const dateButton = screen.getByRole('button', { name: /Date Picker/i })
      await user.click(dateButton)

      expect(mockOnAddField).toHaveBeenCalledWith('date')
    })

    it('calls onAddField with correct type when rating is clicked', async () => {
      const user = userEvent.setup()
      const mockOnAddField = vi.fn()
      render(<ComponentLibrary onAddField={mockOnAddField} />)

      const ratingButton = screen.getByRole('button', { name: /Rating/i })
      await user.click(ratingButton)

      expect(mockOnAddField).toHaveBeenCalledWith('rating')
    })

    it('calls onAddField with correct type when heading is clicked', async () => {
      const user = userEvent.setup()
      const mockOnAddField = vi.fn()
      render(<ComponentLibrary onAddField={mockOnAddField} />)

      const headingButton = screen.getByRole('button', { name: /Heading/i })
      await user.click(headingButton)

      expect(mockOnAddField).toHaveBeenCalledWith('heading')
    })

    it('can add multiple fields in sequence', async () => {
      const user = userEvent.setup()
      const mockOnAddField = vi.fn()
      render(<ComponentLibrary onAddField={mockOnAddField} />)

      await user.click(screen.getByRole('button', { name: /Text Input/i }))
      await user.click(screen.getByRole('button', { name: /Email/i }))
      await user.click(screen.getByRole('button', { name: /Dropdown/i }))

      expect(mockOnAddField).toHaveBeenCalledTimes(3)
      expect(mockOnAddField).toHaveBeenNthCalledWith(1, 'text')
      expect(mockOnAddField).toHaveBeenNthCalledWith(2, 'email')
      expect(mockOnAddField).toHaveBeenNthCalledWith(3, 'select')
    })
  })

  describe('Component Count', () => {
    it('has 6 basic input components', () => {
      const mockOnAddField = vi.fn()
      render(<ComponentLibrary onAddField={mockOnAddField} />)

      const basicInputsSection = screen.getByText('Basic Inputs').parentElement
      const buttons = basicInputsSection?.querySelectorAll('button')
      expect(buttons?.length).toBe(6)
    })

    it('has 3 selection components', () => {
      const mockOnAddField = vi.fn()
      render(<ComponentLibrary onAddField={mockOnAddField} />)

      const selectionSection = screen.getByText('Selection').parentElement
      const buttons = selectionSection?.querySelectorAll('button')
      expect(buttons?.length).toBe(3)
    })

    it('has 3 date & time components', () => {
      const mockOnAddField = vi.fn()
      render(<ComponentLibrary onAddField={mockOnAddField} />)

      const dateTimeSection = screen.getByRole('heading', { name: /Date & Time/i, level: 3 }).parentElement
      const buttons = dateTimeSection?.querySelectorAll('button')
      expect(buttons?.length).toBe(3)
    })

    it('has 4 advanced components', () => {
      const mockOnAddField = vi.fn()
      render(<ComponentLibrary onAddField={mockOnAddField} />)

      const advancedSection = screen.getByText('Advanced').parentElement
      const buttons = advancedSection?.querySelectorAll('button')
      expect(buttons?.length).toBe(4)
    })

    it('has 4 layout components', () => {
      const mockOnAddField = vi.fn()
      render(<ComponentLibrary onAddField={mockOnAddField} />)

      const layoutSection = screen.getByText('Layout').parentElement
      const buttons = layoutSection?.querySelectorAll('button')
      expect(buttons?.length).toBe(4)
    })

    it('has 20 total field type components', () => {
      const mockOnAddField = vi.fn()
      render(<ComponentLibrary onAddField={mockOnAddField} />)

      const allButtons = screen.getAllByRole('button')
      expect(allButtons.length).toBe(20)
    })
  })

  describe('Accessibility', () => {
    it('all components are keyboard accessible', async () => {
      const user = userEvent.setup()
      const mockOnAddField = vi.fn()
      render(<ComponentLibrary onAddField={mockOnAddField} />)

      const textButton = screen.getByRole('button', { name: /Text Input/i })
      textButton.focus()
      await user.keyboard('{Enter}')

      expect(mockOnAddField).toHaveBeenCalledWith('text')
    })

    it('buttons have accessible names', () => {
      const mockOnAddField = vi.fn()
      render(<ComponentLibrary onAddField={mockOnAddField} />)

      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        expect(button).toHaveAccessibleName()
      })
    })
  })
})
