"use client"

import type { FormSettings } from "../lib/types"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Switch } from "../ui/switch"
import { Card } from "../ui/card"

interface FormSettingsPanelProps {
  settings: FormSettings
  onUpdate: (settings: FormSettings) => void
}

export function FormSettingsPanel({ settings, onUpdate }: FormSettingsPanelProps) {
  return (
    <Card className="p-4 space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">Form Settings</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="submit-button-text">Submit Button Text</Label>
          <Input
            id="submit-button-text"
            value={settings.submitButtonText}
            onChange={(e) => onUpdate({ ...settings, submitButtonText: e.target.value })}
            placeholder="Submit"
          />
        </div>

        <div>
          <Label htmlFor="success-message">Success Message</Label>
          <Textarea
            id="success-message"
            value={settings.successMessage}
            onChange={(e) => onUpdate({ ...settings, successMessage: e.target.value })}
            placeholder="Thank you for your submission!"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="redirect-url">Redirect URL (Optional)</Label>
          <Input
            id="redirect-url"
            value={settings.redirectUrl || ""}
            onChange={(e) => onUpdate({ ...settings, redirectUrl: e.target.value })}
            placeholder="https://example.com/thank-you"
          />
          <p className="text-xs text-muted-foreground mt-1">Redirect users after successful submission</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="multiple-submissions">Allow Multiple Submissions</Label>
            <p className="text-xs text-muted-foreground">Users can submit the form multiple times</p>
          </div>
          <Switch
            id="multiple-submissions"
            checked={settings.allowMultipleSubmissions}
            onCheckedChange={(checked) => onUpdate({ ...settings, allowMultipleSubmissions: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="progress-bar">Show Progress Bar</Label>
            <p className="text-xs text-muted-foreground">Display progress indicator for multi-step forms</p>
          </div>
          <Switch
            id="progress-bar"
            checked={settings.showProgressBar}
            onCheckedChange={(checked) => onUpdate({ ...settings, showProgressBar: checked })}
          />
        </div>
      </div>
    </Card>
  )
}
