import os
import re

with open('app/book/[slug]/page.tsx', 'r') as f:
    content = f.read()

# Replace mock calendar with native date input
mock_calendar = """                      {/* Simple Date Mock */}
                      <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-center h-48 text-brand-muted text-sm text-center">
                        <div>
                          <Calendar className="w-6 h-6 mx-auto mb-2 opacity-50" />
                          Select a date (mock calendar)
                        </div>
                      </div>"""

real_calendar = """                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Calendar className="w-5 h-5 text-brand-muted" />
                        </div>
                        <input
                          type="date"
                          value={selectedDate.toISOString().split('T')[0]}
                          onChange={(e) => setSelectedDate(new Date(e.target.value))}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-brand-dark"
                        />
                      </div>
                      <p className="text-xs text-brand-muted mt-2">Select a date for your appointment.</p>"""

content = content.replace(mock_calendar, real_calendar)

with open('app/book/[slug]/page.tsx', 'w') as f:
    f.write(content)
