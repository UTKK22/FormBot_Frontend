import React from 'react'
import NavBar from '../components/LandingPage/NavBar';
import Hero from '../components/LandingPage/Hero';
import Footer from '../components/LandingPage/Footer';

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center overflow-x-hidden">
      <section className="section-margin ">
        <NavBar />
      </section>
      <section className="section-margin">
        <Hero />
      </section>
      <section className="section-margin ">
        <Footer />
      </section>
    </div>
  );
}

export default LandingPage
