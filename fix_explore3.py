import re

with open("app/explore/page.tsx", "r") as f:
    content = f.read()

# Make ExplorePage take searchParams
content = content.replace("export default async function ExplorePage() {", "export default async function ExplorePage(props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {\n  const searchParams = await props.searchParams;\n  const q = typeof searchParams?.q === 'string' ? searchParams.q : undefined;\n")

# Add where clause for prisma query
find_many_replacement = """  const businesses = await prisma.business.findMany({
    where: q ? {
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { services: { some: { name: { contains: q, mode: 'insensitive' } } } }
      ]
    } : undefined,
    include: {"""

content = content.replace("  const businesses = await prisma.business.findMany({\n    include: {", find_many_replacement)

# Replace input with SearchInput
input_div = """          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search for businesses, services..." 
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-none shadow-xl shadow-brand-dark/5 bg-white text-lg focus:ring-2 focus:ring-brand-primary outline-none transition-shadow"
            />
          </div>"""

content = content.replace(input_div, "          <Suspense fallback={<div className=\"h-14\"></div>}>\n            <SearchInput />\n          </Suspense>")

with open("app/explore/page.tsx", "w") as f:
    f.write(content)
