import { describe, it, expect } from 'vitest'
import { formTemplates } from './templates'
import type { FormTemplate } from './types'

describe('Form Templates', () => {
  describe('Template Structure', () => {
    it('should have 4 built-in templates', () => {
      expect(formTemplates).toHaveLength(4)
    })

    it('each template should have required properties', () => {
      formTemplates.forEach((template) => {
        expect(template).toHaveProperty('id')
        expect(template).toHaveProperty('name')
        expect(template).toHaveProperty('description')
        expect(template).toHaveProperty('category')
        expect(template).toHaveProperty('fields')
        expect(template).toHaveProperty('settings')
      })
    })

    it('each template should have a non-empty fields array', () => {
      formTemplates.forEach((template) => {
        expect(template.fields).toBeDefined()
        expect(Array.isArray(template.fields)).toBe(true)
        expect(template.fields.length).toBeGreaterThan(0)
      })
    })

    it('each template should have valid settings', () => {
      formTemplates.forEach((template) => {
        expect(template.settings).toBeDefined()
        expect(template.settings.submitButtonText).toBeDefined()
        expect(template.settings.successMessage).toBeDefined()
        expect(typeof template.settings.allowMultipleSubmissions).toBe('boolean')
        expect(typeof template.settings.showProgressBar).toBe('boolean')
      })
    })
  })

  describe('Contact Form Template', () => {
    const contactForm = formTemplates.find((t) => t.id === 'contact') as FormTemplate

    it('should exist', () => {
      expect(contactForm).toBeDefined()
    })

    it('should have correct metadata', () => {
      expect(contactForm.name).toBe('Contact Form')
      expect(contactForm.category).toBe('General')
      expect(contactForm.description).toBeTruthy()
    })

    it('should have 4 fields', () => {
      expect(contactForm.fields).toHaveLength(4)
    })

    it('should include name, email, phone, and message fields', () => {
      const fieldTypes = contactForm.fields.map((f) => f.type)
      expect(fieldTypes).toContain('text')
      expect(fieldTypes).toContain('email')
      expect(fieldTypes).toContain('tel')
      expect(fieldTypes).toContain('textarea')
    })

    it('should have appropriate required fields', () => {
      const requiredFields = contactForm.fields.filter((f) => f.required)
      expect(requiredFields.length).toBeGreaterThan(0)
    })

    it('should have custom submit button text', () => {
      expect(contactForm.settings.submitButtonText).toBe('Send Message')
    })
  })

  describe('Event Registration Template', () => {
    const registrationForm = formTemplates.find((t) => t.id === 'registration') as FormTemplate

    it('should exist', () => {
      expect(registrationForm).toBeDefined()
    })

    it('should have correct metadata', () => {
      expect(registrationForm.name).toBe('Event Registration')
      expect(registrationForm.category).toBe('Events')
    })

    it('should include layout elements (heading, divider)', () => {
      const fieldTypes = registrationForm.fields.map((f) => f.type)
      expect(fieldTypes).toContain('heading')
      expect(fieldTypes).toContain('divider')
    })

    it('should include select field with options', () => {
      const selectField = registrationForm.fields.find((f) => f.type === 'select')
      expect(selectField).toBeDefined()
      expect(selectField?.options).toBeDefined()
      expect(selectField?.options?.length).toBeGreaterThan(0)
    })

    it('should include number field with min/max', () => {
      const numberField = registrationForm.fields.find((f) => f.type === 'number')
      expect(numberField).toBeDefined()
      expect(numberField?.min).toBeDefined()
      expect(numberField?.max).toBeDefined()
    })

    it('should not allow multiple submissions', () => {
      expect(registrationForm.settings.allowMultipleSubmissions).toBe(false)
    })

    it('should show progress bar', () => {
      expect(registrationForm.settings.showProgressBar).toBe(true)
    })
  })

  describe('Customer Survey Template', () => {
    const surveyForm = formTemplates.find((t) => t.id === 'survey') as FormTemplate

    it('should exist', () => {
      expect(surveyForm).toBeDefined()
    })

    it('should have correct metadata', () => {
      expect(surveyForm.name).toBe('Customer Survey')
      expect(surveyForm.category).toBe('Feedback')
    })

    it('should include rating field', () => {
      const ratingField = surveyForm.fields.find((f) => f.type === 'rating')
      expect(ratingField).toBeDefined()
      expect(ratingField?.max).toBe(5)
    })

    it('should include radio field with options', () => {
      const radioField = surveyForm.fields.find((f) => f.type === 'radio')
      expect(radioField).toBeDefined()
      expect(radioField?.options).toBeDefined()
      expect(radioField?.options?.length).toBeGreaterThan(0)
    })

    it('should include checkbox field with options', () => {
      const checkboxField = surveyForm.fields.find((f) => f.type === 'checkbox')
      expect(checkboxField).toBeDefined()
      expect(checkboxField?.options).toBeDefined()
      expect(checkboxField?.options?.length).toBeGreaterThan(0)
    })

    it('should include paragraph field for introduction', () => {
      const paragraphField = surveyForm.fields.find((f) => f.type === 'paragraph')
      expect(paragraphField).toBeDefined()
    })
  })

  describe('Job Application Template', () => {
    const jobAppForm = formTemplates.find((t) => t.id === 'job-application') as FormTemplate

    it('should exist', () => {
      expect(jobAppForm).toBeDefined()
    })

    it('should have correct metadata', () => {
      expect(jobAppForm.name).toBe('Job Application')
      expect(jobAppForm.category).toBe('HR')
    })

    it('should include URL field for LinkedIn', () => {
      const urlField = jobAppForm.fields.find((f) => f.type === 'url')
      expect(urlField).toBeDefined()
    })

    it('should include file upload fields', () => {
      const fileFields = jobAppForm.fields.filter((f) => f.type === 'file')
      expect(fileFields.length).toBeGreaterThan(0)
    })

    it('should have file upload with accept attribute', () => {
      const fileField = jobAppForm.fields.find((f) => f.type === 'file' && f.accept)
      expect(fileField).toBeDefined()
      expect(fileField?.accept).toContain('.pdf')
    })

    it('should have helper text on file field', () => {
      const fileFieldWithHelp = jobAppForm.fields.find(
        (f) => f.type === 'file' && f.helperText
      )
      expect(fileFieldWithHelp).toBeDefined()
    })

    it('should have multiple select fields', () => {
      const selectFields = jobAppForm.fields.filter((f) => f.type === 'select')
      expect(selectFields.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Template Field Validation', () => {
    it('all fields should have a type property', () => {
      formTemplates.forEach((template) => {
        template.fields.forEach((field) => {
          expect(field.type).toBeDefined()
          expect(typeof field.type).toBe('string')
        })
      })
    })

    it('all fields should have a label property', () => {
      formTemplates.forEach((template) => {
        template.fields.forEach((field) => {
          expect(field.label).toBeDefined()
          expect(typeof field.label).toBe('string')
        })
      })
    })

    it('fields with options should have valid options array', () => {
      formTemplates.forEach((template) => {
        template.fields
          .filter((f) => ['select', 'radio', 'checkbox'].includes(f.type))
          .forEach((field) => {
            if (field.options) {
              expect(Array.isArray(field.options)).toBe(true)
              expect(field.options.length).toBeGreaterThan(0)
              field.options.forEach((option) => {
                expect(typeof option).toBe('string')
              })
            }
          })
      })
    })
  })

  describe('Template Settings Validation', () => {
    it('all templates should have non-empty submit button text', () => {
      formTemplates.forEach((template) => {
        expect(template.settings.submitButtonText).toBeTruthy()
        expect(template.settings.submitButtonText.length).toBeGreaterThan(0)
      })
    })

    it('all templates should have non-empty success message', () => {
      formTemplates.forEach((template) => {
        expect(template.settings.successMessage).toBeTruthy()
        expect(template.settings.successMessage.length).toBeGreaterThan(0)
      })
    })

    it('templates should have varied settings', () => {
      const allowMultipleTrue = formTemplates.filter(
        (t) => t.settings.allowMultipleSubmissions
      )
      const allowMultipleFalse = formTemplates.filter(
        (t) => !t.settings.allowMultipleSubmissions
      )

      // Should have variety in settings
      expect(allowMultipleTrue.length).toBeGreaterThan(0)
      expect(allowMultipleFalse.length).toBeGreaterThan(0)
    })
  })
})
