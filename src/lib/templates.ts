import type { FormTemplate } from "./types"

export const formTemplates: FormTemplate[] = [
  {
    id: "contact",
    name: "Contact Form",
    description: "Simple contact form with name, email, and message",
    category: "General",
    fields: [
      {
        type: "text",
        label: "Full Name",
        placeholder: "John Doe",
        required: true,
      },
      {
        type: "email",
        label: "Email Address",
        placeholder: "john@example.com",
        required: true,
      },
      {
        type: "tel",
        label: "Phone Number",
        placeholder: "+1 (555) 000-0000",
        required: false,
      },
      {
        type: "textarea",
        label: "Message",
        placeholder: "How can we help you?",
        required: true,
      },
    ],
    settings: {
      submitButtonText: "Send Message",
      successMessage: "Thank you! We'll get back to you soon.",
      allowMultipleSubmissions: true,
      showProgressBar: false,
    },
  },
  {
    id: "registration",
    name: "Event Registration",
    description: "Registration form for events and workshops",
    category: "Events",
    fields: [
      {
        type: "heading",
        label: "Personal Information",
      },
      {
        type: "text",
        label: "First Name",
        placeholder: "John",
        required: true,
      },
      {
        type: "text",
        label: "Last Name",
        placeholder: "Doe",
        required: true,
      },
      {
        type: "email",
        label: "Email",
        placeholder: "john@example.com",
        required: true,
      },
      {
        type: "tel",
        label: "Phone",
        placeholder: "+1 (555) 000-0000",
        required: true,
      },
      {
        type: "divider",
        label: "Divider",
      },
      {
        type: "heading",
        label: "Event Details",
      },
      {
        type: "select",
        label: "Event Session",
        placeholder: "Select a session",
        options: ["Morning Session (9AM-12PM)", "Afternoon Session (1PM-4PM)", "Evening Session (5PM-8PM)"],
        required: true,
      },
      {
        type: "number",
        label: "Number of Attendees",
        placeholder: "1",
        min: 1,
        max: 10,
        required: true,
      },
      {
        type: "textarea",
        label: "Special Requirements",
        placeholder: "Any dietary restrictions or accessibility needs?",
        required: false,
      },
    ],
    settings: {
      submitButtonText: "Complete Registration",
      successMessage: "Registration successful! Check your email for confirmation.",
      allowMultipleSubmissions: false,
      showProgressBar: true,
    },
  },
  {
    id: "survey",
    name: "Customer Survey",
    description: "Feedback survey with ratings and multiple choice",
    category: "Feedback",
    fields: [
      {
        type: "paragraph",
        label: "We value your feedback! Please take a moment to share your experience with us.",
      },
      {
        type: "text",
        label: "Your Name",
        placeholder: "Optional",
        required: false,
      },
      {
        type: "rating",
        label: "Overall Satisfaction",
        max: 5,
        required: true,
      },
      {
        type: "radio",
        label: "How likely are you to recommend us?",
        options: ["Very Likely", "Likely", "Neutral", "Unlikely", "Very Unlikely"],
        required: true,
      },
      {
        type: "checkbox",
        label: "What did you like most? (Select all that apply)",
        options: ["Product Quality", "Customer Service", "Pricing", "Delivery Speed", "Website Experience"],
        required: false,
      },
      {
        type: "textarea",
        label: "Additional Comments",
        placeholder: "Tell us more about your experience...",
        required: false,
      },
    ],
    settings: {
      submitButtonText: "Submit Feedback",
      successMessage: "Thank you for your valuable feedback!",
      allowMultipleSubmissions: false,
      showProgressBar: false,
    },
  },
  {
    id: "job-application",
    name: "Job Application",
    description: "Complete job application form with file upload",
    category: "HR",
    fields: [
      {
        type: "heading",
        label: "Applicant Information",
      },
      {
        type: "text",
        label: "Full Name",
        placeholder: "John Doe",
        required: true,
      },
      {
        type: "email",
        label: "Email Address",
        placeholder: "john@example.com",
        required: true,
      },
      {
        type: "tel",
        label: "Phone Number",
        placeholder: "+1 (555) 000-0000",
        required: true,
      },
      {
        type: "url",
        label: "LinkedIn Profile",
        placeholder: "https://linkedin.com/in/johndoe",
        required: false,
      },
      {
        type: "divider",
        label: "Divider",
      },
      {
        type: "heading",
        label: "Position Details",
      },
      {
        type: "select",
        label: "Position Applied For",
        placeholder: "Select a position",
        options: ["Software Engineer", "Product Manager", "Designer", "Marketing Manager", "Sales Representative"],
        required: true,
      },
      {
        type: "select",
        label: "Years of Experience",
        placeholder: "Select experience level",
        options: ["0-2 years", "3-5 years", "6-10 years", "10+ years"],
        required: true,
      },
      {
        type: "file",
        label: "Resume/CV",
        accept: ".pdf,.doc,.docx",
        required: true,
        helperText: "Upload your resume in PDF or Word format",
      },
      {
        type: "file",
        label: "Cover Letter",
        accept: ".pdf,.doc,.docx",
        required: false,
      },
      {
        type: "textarea",
        label: "Why do you want to work with us?",
        placeholder: "Tell us about your motivation...",
        required: true,
      },
    ],
    settings: {
      submitButtonText: "Submit Application",
      successMessage: "Application submitted successfully! We'll review it and get back to you soon.",
      allowMultipleSubmissions: false,
      showProgressBar: true,
    },
  },
]
