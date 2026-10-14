import NavBar from './NavBar.jsx'
import Banner from './Banner.jsx'
import About from './About.jsx'
import Achievements from './Achievements.jsx'
import Gallery from './Gallery.jsx'
import FeaturedArticles from './FeaturedArticles.jsx'
import FeaturedTutorials from './FeaturedTutorials.jsx'
import Footer from './Footer.jsx'

// Top-level parent. Nothing is bundled into one giant component —
// each section of the original HTML page (plus the new Featured
// Articles / Featured Tutorials sections required by the P3 brief)
// is its own child component.
function HomePage() {
  return (
    <>
      <NavBar />
      <Banner />
      <About />
      <Achievements />
      <Gallery />
      <FeaturedArticles />
      <FeaturedTutorials />
      <Footer />
    </>
  )
}

export default HomePage
