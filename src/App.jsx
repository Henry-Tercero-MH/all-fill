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

export default function App() {
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
    </div>
  )
}
