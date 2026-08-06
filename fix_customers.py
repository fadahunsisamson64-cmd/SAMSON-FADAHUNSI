import re

with open("app/dashboard/customers/page.tsx", "r") as f:
    content = f.read()

# Add search state
content = content.replace("const [customers, setCustomers] = useState<any[]>([]);", "const [customers, setCustomers] = useState<any[]>([]);\n  const [search, setSearch] = useState('');")

# Add value and onChange to input
input_element = """                  <input 
                    type="text" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search customers..." 
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary w-full sm:w-64"
                  />"""

content = re.sub(r"<input\s+type=\"text\"\s+placeholder=\"Search customers\.\.\.\"\s+className=\"[^\"]+\"\s*/>", input_element, content)

# Filter customers
filtered_map = """                    {customers.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase())).map((c) => ("""

content = content.replace("{customers.map((c) => (", filtered_map)

with open("app/dashboard/customers/page.tsx", "w") as f:
    f.write(content)
