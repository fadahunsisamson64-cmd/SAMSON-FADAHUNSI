import os
import re

with open('app/dashboard/calendar/page.tsx', 'r') as f:
    content = f.read()

# Import and state
import_statement = "import { getCalendarBookings } from '@/app/actions/calendar';\n"
content = content.replace("import DashboardNavbar from '@/components/DashboardNavbar';", "import DashboardNavbar from '@/components/DashboardNavbar';\n" + import_statement)
content = content.replace("const [user, setUser] = useState<any>(null);", "const [user, setUser] = useState<any>(null);\n  const [bookings, setBookings] = useState<any[]>([]);")

# Check user and fetch bookings
new_checkUser = """    const checkUser = async () => {
      try {
        const supabase = getSupabase();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/login');
          return;
        }
        
        setUser(session.user);

        const res = await getCalendarBookings(session.user.id);
        if (res.success && res.data) {
          setBookings(res.data);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };"""
content = re.sub(r'    const checkUser = async \(\) => \{[\s\S]*?\};\n', new_checkUser + "\n", content)

# update UI map
ui_replacement = """                const dayNumber = i - 1;
                const isCurrentMonth = dayNumber > 0 && dayNumber <= 31;
                const todayBookings = bookings.filter(b => {
                  const d = new Date(b.startTime);
                  return d.getDate() === dayNumber && d.getMonth() === new Date().getMonth(); // Simplified for current month
                });

                return (
                  <div key={i} className={cn("bg-white p-2 min-h-[100px]", !isCurrentMonth && "bg-gray-50/50")}>
                    {isCurrentMonth && (
                      <span className={cn("inline-flex w-7 h-7 items-center justify-center rounded-full text-sm font-medium mb-1", dayNumber === new Date().getDate() ? "bg-brand-primary text-white" : "text-brand-dark")}>
                        {dayNumber}
                      </span>
                    )}
                    
                    {isCurrentMonth && todayBookings.map((booking: any) => (
                      <div key={booking.id} className="px-2 py-1 bg-brand-accent/10 text-brand-accent rounded text-xs font-medium truncate mb-1" title={`${booking.service?.name} with ${booking.customer?.name}`}>
                        {new Date(booking.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {booking.service?.name}
                      </div>
                    ))}
                  </div>
                );
"""

content = re.sub(r'                const dayNumber = i - 1;[\s\S]*?                  </div>\n                \);\n', ui_replacement, content)

with open('app/dashboard/calendar/page.tsx', 'w') as f:
    f.write(content)
