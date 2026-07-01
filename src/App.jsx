import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProductsProvider } from './context/ProductsContext'
import { StoreProvider } from './context/StoreContext'
import Navbar from './components/Navbar'
import HeroBento from './components/HeroBento'
import CategoryCircles from './components/CategoryCircles'
import FeaturedCarousel from './components/FeaturedCarousel'
import Catalog from './components/Catalog'
import HowItWorks from './components/HowItWorks'
import Quoter from './components/Quoter'
import Gallery from './components/Gallery'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import FavoritesDrawer from './components/FavoritesDrawer'
import ProductModal from './components/ProductModal'
import OfflineOverlay from './components/OfflineOverlay'
import ErrorBoundary from './components/ErrorBoundary'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

function Site() {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main>
        <HeroBento />
        <CategoryCircles />
        <FeaturedCarousel />
        <Catalog />
        <HowItWorks />
        <Quoter />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <CartDrawer />
      <FavoritesDrawer />
      <ProductModal />
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <OfflineOverlay />
        <Routes>
          <Route
            path="/"
            element={
              <ProductsProvider>
                <StoreProvider>
                  <Site />
                </StoreProvider>
              </ProductsProvider>
            }
          />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
