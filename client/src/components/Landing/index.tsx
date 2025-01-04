import React from 'react'
import HeroSection from './HeroSection'
import FeaturesSection from './FeatureSection'
import TestimonialsSection from './TestimonialsSection'

const Landing:React.FC = () => {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
    </div>
  )
}

export default Landing
