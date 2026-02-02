// app/page.tsx
import BecomeSection from '@/components/BecomeSection';
import ClientsTestimonial from '@/components/ClientsTestimonial';
import FeaturedJobs from '@/components/FeaturedJobs';
import Footer from '@/components/Footer';
import HowJobPilotWorks from '@/components/HowJobPilotWorks';
import HeroSection from '@/components/JobHero';
import DynamicNavbar from '@/components/DynamicNavbar';
import PopularCategories from '@/components/PopularCategories';
import PopularVacancies from '@/components/PopularVacancies';
import SecondNavbar from '@/components/SecondNavbar';
import TopCompanies from '@/components/TopCompanies';

export default function Home() {
  return (
    <main>
      <DynamicNavbar />
      <SecondNavbar />
      <HeroSection />
      <PopularVacancies />
      <HowJobPilotWorks />
      <PopularCategories />
      <FeaturedJobs />
      <TopCompanies />
      <ClientsTestimonial />
      <BecomeSection />
      <Footer />
    </main>
  );
}