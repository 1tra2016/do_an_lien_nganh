import React from "react";
import './../css/App.css';
import './../css/lam.css';
import './../css/binh.css';
import './../css/phi.css';
import './../css/quanmain.css';
import './../css/quanfooter.css';

import Myheader from './Myheader';
import Footer from './Footer';

import HomeSlider from '../components/home/HomeSlider';
import HomeBanner from '../components/home/HomeBanner';
import SpecialOffers from '../components/home/SpecialOffers';
import CategoryGrid from '../components/home/CategoryGrid';
import FlashSale from '../components/home/FlashSale';
import Recommend4Laptops from '../components/home/Recommend4Laptops';
import MarketingSection from '../components/home/MarketingSection';
import SuggestionSection from '../components/home/SuggestionSection';
import FullPageSection from '../components/home/FullPageSection';
import BottomSection from '../components/home/BottomSection';

const Home = () => {
  return (
    <div>
      <main>
      <Myheader />
        <section className="main-section">
          <div className="background-blur"  />
          <div className="container" style={{ marginLeft: '10%' }} >
            <HomeSlider />
            <HomeBanner />
          </div>
        </section>
        <SpecialOffers />
        <CategoryGrid />
      </main>
      <div className="binhtongcabai">
        <div className="binhtong">
          <FlashSale />
          <div className ="binhtong2">
            <Recommend4Laptops /> {/* quảng cáo */}
            </div>
        </div>
        <MarketingSection />
        <SuggestionSection /> {/* quảng cáo */}
      </div>
      <FullPageSection />{/* quảng cáo */}
      <BottomSection /> 
      <Footer />
    </div>
  );
}

export default Home;
