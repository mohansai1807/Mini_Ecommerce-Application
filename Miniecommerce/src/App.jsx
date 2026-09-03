import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import Category from './category'
import './App.css'

const productsUrl = 'https://dummyjson.com/products?limit=200'
const categoriesUrl = 'https://dummyjson.com/products/category-list'

function App() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('default')
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadStore = async () => {
      try {
        const [categoriesResponse, productsResponse] = await Promise.all([
          axios.get(categoriesUrl),
          axios.get(productsUrl),
        ])
        setCategories(Array.isArray(categoriesResponse.data) ? categoriesResponse.data : [])
        setProducts(productsResponse.data.products || [])
      } catch (requestError) {
        console.error(requestError)
        setError('We could not load the catalog. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadStore()
  }, [])

  const visibleProducts = useMemo(() => {
    const filteredProducts = products.filter((product) => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
      const searchableText = `${product.title} ${product.description}`.toLowerCase()
      return matchesCategory && searchableText.includes(searchTerm.toLowerCase())
    })

    return [...filteredProducts].sort((firstProduct, secondProduct) => {
      if (sortOrder === 'price-low') return firstProduct.price - secondProduct.price
      if (sortOrder === 'price-high') return secondProduct.price - firstProduct.price
      if (sortOrder === 'rating') return secondProduct.rating - firstProduct.rating
      return 0
    })
  }, [products, searchTerm, selectedCategory, sortOrder])

  const addToCart = (product) => setCart((currentCart) => [...currentCart, product])

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Mini Market</p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Find your next favorite.</h1>
            <p className="mt-2 text-slate-600">Browse quality products, all in one place.</p>
          </div>
          <div className="rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
            Cart <span className="ml-2 rounded bg-emerald-400 px-2 py-1 text-slate-950">{cart.length}</span>
          </div>
        </header>

        <section className="mb-8 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search products..."
            className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
          <select
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-500"
          >
            <option value="default">Sort products</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="rating">Highest rated</option>
          </select>
        </section>

        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside>
            <Category data={categories} activeCategory={selectedCategory} onSelect={setSelectedCategory} />
          </aside>
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">{selectedCategory === 'all' ? 'All products' : selectedCategory}</h2>
              <span className="text-sm text-slate-500">{visibleProducts.length} items</span>
            </div>
            {loading && <p className="rounded-lg bg-white p-8 text-center text-slate-500">Loading products...</p>}
            {!loading && error && <p className="rounded-lg bg-red-50 p-8 text-center text-red-700">{error}</p>}
            {!loading && !error && visibleProducts.length === 0 && (
              <p className="rounded-lg bg-white p-8 text-center text-slate-500">No products match your search.</p>
            )}
            {!loading && !error && visibleProducts.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {visibleProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={addToCart} />)}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

function ProductCard({ product, onAdd }) {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <img src={product.thumbnail} alt={product.title} className="h-56 w-full object-cover" />
      <div className="p-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-600">{product.category}</p>
        <h3 className="truncate text-lg font-bold">{product.title}</h3>
        <p className="mt-2 h-12 overflow-hidden text-sm text-slate-600">{product.description}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xl font-bold">${product.price.toFixed(2)}</p>
            <p className="text-sm text-amber-600">★ {product.rating.toFixed(1)}</p>
          </div>
          <button type="button" onClick={() => onAdd(product)} className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700">
            Add to cart
          </button>
        </div>
      </div>
    </article>
  )
}

export default App
