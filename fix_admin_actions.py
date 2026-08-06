import re

with open("app/actions/admin.ts", "r") as f:
    content = f.read()

content = "import { verifyAdmin } from '@/lib/auth-server';\n" + content

# Replace each function
content = re.sub(r'export async function getAdminDashboardData\(\)\s*\{\s*try\s*\{', "export async function getAdminDashboardData(token: string) {\n  try {\n    const admin = await verifyAdmin(token);\n    if (!admin) return { success: false, error: 'Unauthorized' };", content)
content = re.sub(r'export async function getAdminBusinesses\(\)\s*\{\s*try\s*\{', "export async function getAdminBusinesses(token: string) {\n  try {\n    const admin = await verifyAdmin(token);\n    if (!admin) return { success: false, error: 'Unauthorized' };", content)
content = re.sub(r'export async function getAdminUsers\(\)\s*\{\s*try\s*\{', "export async function getAdminUsers(token: string) {\n  try {\n    const admin = await verifyAdmin(token);\n    if (!admin) return { success: false, error: 'Unauthorized' };", content)

with open("app/actions/admin.ts", "w") as f:
    f.write(content)
