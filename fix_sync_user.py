import re

with open("app/actions/auth.ts", "r") as f:
    content = f.read()

content = "import { verifyServerToken } from '@/lib/auth-server';\n" + content

new_func = """export async function syncUserAction(token: string) {
  try {
    const supabaseUser = await verifyServerToken(token);
    if (!supabaseUser) return { success: false, error: 'Unauthorized' };
    
    const user = await prisma.user.upsert({
      where: { email: supabaseUser.email },
      update: {
        name: supabaseUser.user_metadata?.full_name || supabaseUser.email.split('@')[0],
      },
      create: {
        id: supabaseUser.id,
        email: supabaseUser.email,
        name: supabaseUser.user_metadata?.full_name || supabaseUser.email.split('@')[0],
        role: 'BUSINESS_OWNER',
      }
    });"""
    
content = re.sub(r'export async function syncUserAction\(supabaseUser[^)]+\)\s*\{\s*try\s*\{\s*const user = await prisma.user.upsert\(\{[^;]+;\s*', new_func, content)

with open("app/actions/auth.ts", "w") as f:
    f.write(content)
