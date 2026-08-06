import re

with open("app/dashboard/settings/page.tsx", "r") as f:
    content = f.read()

# Imports
content = content.replace("import DashboardNavbar from '@/components/DashboardNavbar';", "import DashboardNavbar from '@/components/DashboardNavbar';\nimport { getBusinessProfile, updateBusinessProfile } from '@/app/actions/settings';")

# State
state_add = """
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
"""

content = content.replace("const [user, setUser] = useState<any>(null);", "const [user, setUser] = useState<any>(null);\n" + state_add)

# In checkUser
fetch_logic = """
        setUser(session.user);
        
        const profileRes = await getBusinessProfile(session.access_token);
        if (profileRes.success && profileRes.data) {
          setBusinessName(profileRes.data.name || '');
          setDescription(profileRes.data.description || '');
        }
"""
content = content.replace("setUser(session.user);", fetch_logic)

# Save handler
save_handler = """
  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const supabase = getSupabase();
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const res = await updateBusinessProfile(session.access_token, {
        name: businessName,
        description
      });
      
      if (res.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully.' });
      } else {
        setMessage({ type: 'error', text: res.error || 'Failed to update.' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setIsSaving(false);
    }
  };
"""

content = content.replace("const handleLogout", save_handler + "\n  const handleLogout")

# Inputs
content = content.replace(
    '<input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" placeholder="e.g. Glow Spa" />',
    '<input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" placeholder="e.g. Glow Spa" />'
)

description_field = """
                  <div className="md:col-span-2 mt-4">
                    <label className="text-sm font-medium text-brand-dark block mb-2">Description</label>
                    <textarea 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)} 
                      rows={4} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary resize-none" 
                      placeholder="Briefly describe your business..." 
                    />
                  </div>
"""

content = content.replace("</div>\n              </div>\n              <div className=\"pt-6 border-t border-gray-100\">", "</div>\n" + description_field + "              </div>\n              <div className=\"pt-6 border-t border-gray-100\">")

# Button and message
button_replacement = """
                {message.text && (
                  <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                  </div>
                )}
                <button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="bg-brand-primary hover:bg-brand-secondary disabled:opacity-70 text-white px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
"""

content = re.sub(
    r"<button className=\"bg-brand-primary hover:bg-brand-secondary text-white px-6 py-2\.5 rounded-xl font-medium transition-colors\">\s*Save Changes\s*</button>",
    button_replacement,
    content
)


with open("app/dashboard/settings/page.tsx", "w") as f:
    f.write(content)
