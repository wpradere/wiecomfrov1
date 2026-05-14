import NoiseOverlay from '@/components/ui/NoiseOverlay';
import Header from '@/components/layout/Header';
import Loader from '@/components/sections/Loader';
import Hero from '@/components/sections/Hero';
import Shop from '@/components/sections/Shop';
import BrandPromise from '@/components/sections/BrandPromise';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <>
      <NoiseOverlay />
      <Loader />
      <Header />
      <main>
        <Hero />
        <Shop />
        <BrandPromise />
      </main>
      <Footer />
    </>
  );
}
