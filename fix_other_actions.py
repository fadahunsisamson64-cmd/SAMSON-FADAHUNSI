import glob
import re

for filename in ["app/actions/calendar.ts", "app/actions/customers.ts"]:
    with open(filename, "r") as f:
        content = f.read()
    
    if "verifyServerToken" not in content:
        content = content.replace("export async function", "import { verifyServerToken } from '@/lib/auth-server';\n\nexport async function")
        
        # We need to find the function signature and replace it
        if "getCalendarBookings" in content:
            content = re.sub(r'export async function getCalendarBookings\(userId: string\)\s*\{\s*try\s*\{', "export async function getCalendarBookings(token: string) {\n  try {\n    const user = await verifyServerToken(token);\n    if (!user) return { success: false, error: 'Unauthorized' };\n    const userId = user.id;", content)
            
        if "getCustomers" in content:
            content = re.sub(r'export async function getCustomers\(userId: string\)\s*\{\s*try\s*\{', "export async function getCustomers(token: string) {\n  try {\n    const user = await verifyServerToken(token);\n    if (!user) return { success: false, error: 'Unauthorized' };\n    const userId = user.id;", content)
            
        with open(filename, "w") as f:
            f.write(content)
