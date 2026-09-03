export default function Category({ data, activeCategory, onSelect }) {
  return (
    <nav className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm" aria-label="Product categories">
      <h2 className="mb-3 text-lg font-bold">Categories</h2>
      <div className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-1">
        <CategoryButton label="All products" value="all" activeCategory={activeCategory} onSelect={onSelect} />
        {data.map((category) => {
          const value = typeof category === 'string' ? category : category.slug
          const label = typeof category === 'string' ? category : category.name
          return <CategoryButton key={value} label={label} value={value} activeCategory={activeCategory} onSelect={onSelect} />
        })}
      </div>
    </nav>
  )
}

function CategoryButton({ label, value, activeCategory, onSelect }) {
  const isActive = value === activeCategory

  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`block whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-medium transition lg:w-full ${isActive ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'}`}
    >
      {label}
    </button>
  )
}
