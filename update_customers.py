import os
with open('app/dashboard/customers/page.tsx', 'r') as f:
    content = f.read()

# Add getCustomers import and state
import_statement = "import { getCustomers } from '@/app/actions/customers';\n"
content = content.replace("import DashboardNavbar from '@/components/DashboardNavbar';", "import DashboardNavbar from '@/components/DashboardNavbar';\n" + import_statement)

content = content.replace("const [user, setUser] = useState<any>(null);", "const [user, setUser] = useState<any>(null);\n  const [customers, setCustomers] = useState<any[]>([]);")

# update checkUser to fetch customers
new_checkUser = """    const checkUser = async () => {
      try {
        const supabase = getSupabase();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/login');
          return;
        }
        
        setUser(session.user);

        const res = await getCustomers(session.user.id);
        if (res.success && res.data) {
          setCustomers(res.data);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };"""

import re
content = re.sub(r'    const checkUser = async \(\) => \{[\s\S]*?\};\n', new_checkUser + "\n", content)

# update UI to show table
ui_replacement = """            {customers.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-2">No customers yet</h3>
              <p className="text-brand-muted max-w-md mx-auto mb-6">
                When people book your services, they will appear here automatically. You can also add them manually.
              </p>
            </div>
            ) : (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-brand-muted">
                      <th className="p-4 pl-6">Customer</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Total Bookings</th>
                      <th className="p-4">Last Booking</th>
                      <th className="p-4 text-right pr-6">Total Spent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {customers.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 pl-6 font-medium text-brand-dark">{c.name || 'Unknown'}</td>
                        <td className="p-4 text-brand-muted">{c.email}</td>
                        <td className="p-4 text-brand-muted">{c.totalBookings}</td>
                        <td className="p-4 text-brand-muted">{c.lastBooking ? new Date(c.lastBooking).toLocaleDateString() : 'N/A'}</td>
                        <td className="p-4 text-right pr-6 font-medium text-brand-dark">${(c.totalSpent || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            )}
"""

content = re.sub(r'<div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col items-center justify-center p-12 text-center">.*?</p>\s*</div>', ui_replacement, content, flags=re.DOTALL)

with open('app/dashboard/customers/page.tsx', 'w') as f:
    f.write(content)
