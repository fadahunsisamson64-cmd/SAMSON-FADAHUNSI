const fs = require('fs');

let content = fs.readFileSync('app/dashboard/page.tsx', 'utf8');

// We'll update the `checkUser` function to sync the user and fetch data.
const newCheckUser = `
    const checkUser = async () => {
      try {
        const supabase = getSupabase();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/login');
          return;
        }
        
        setUser(session.user);

        // Sync user in background (or wait)
        const { syncUserAction } = await import('@/app/actions/auth');
        const syncResult = await syncUserAction({
          id: session.user.id,
          email: session.user.email,
          user_metadata: session.user.user_metadata
        });

        // Fetch real data
        const { getDashboardData } = await import('@/app/actions/dashboard');
        const dbData = await getDashboardData(session.user.id);
        
        if (dbData.success && dbData.data) {
           setDashboardData(dbData.data);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
`;

content = content.replace(/const checkUser = async \(\) => \{[\s\S]*?checkUser\(\);/m, newCheckUser + "\n    checkUser();");

// Add state for dashboardData
content = content.replace(/const \[user, setUser\] = useState<any>\(null\);/g, "const [user, setUser] = useState<any>(null);\n  const [dashboardData, setDashboardData] = useState<any>(null);");

// Replace upcomingAppointments array with our state
content = content.replace(/const upcomingAppointments = \[[\s\S]*?\];/m, "");
content = content.replace(/\{upcomingAppointments\.map\(\(item\) => \(/g, "{dashboardData?.upcomingAppointments?.length > 0 ? dashboardData.upcomingAppointments.map((item: any) => (");
content = content.replace(/<\/table>/g, "</table>\n              {!dashboardData?.upcomingAppointments?.length && <div className=\"p-8 text-center text-brand-muted\">No upcoming appointments.</div>}");

// And make sure to close the curly brace for the new conditional map correctly.
content = content.replace(/<\/tr>\n                    \}\)\}/, "</tr>\n                    ))} : null}");

fs.writeFileSync('app/dashboard/page.tsx', content);
