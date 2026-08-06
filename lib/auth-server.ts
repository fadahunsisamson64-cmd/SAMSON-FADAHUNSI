import { getSupabase } from './supabase';
import { prisma } from './prisma';

export async function verifyServerToken(token: string) {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return null;
  }
  return user;
}

export async function verifyAdmin(token: string) {
  const user = await verifyServerToken(token);
  if (!user) return null;
  
  const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
  if (dbUser?.role !== 'ADMIN') return null;
  
  return dbUser;
}
