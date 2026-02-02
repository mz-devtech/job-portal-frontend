// app/page.tsx
import BecomeSection from '@/components/BecomeSection';
import CandidateNavbar from '@/components/CandidateNavbar';
import ClientsTestimonial from '@/components/ClientsTestimonial';
import EmployerNavbar from '@/components/EmployerNavbar';
import FeaturedJobs from '@/components/FeaturedJobs';
import Footer from '@/components/Footer';
import HowJobPilotWorks from '@/components/HowJobPilotWorks';
import HeroSection from '@/components/JobHero';
import Navbar from '@/components/Navbar';
import PopularCategories from '@/components/PopularCategories';
import PopularVacancies from '@/components/PopularVacancies';
import SecondNavbar from '@/components/SecondNavbar';
import TopCompanies from '@/components/TopCompanies';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <Navbar/>
      <SecondNavbar/>
      {/* <CandidateNavbar/> */}
      {/* <EmployerNavbar/> */}
      <HeroSection/>
      <PopularVacancies/>
      <HowJobPilotWorks/>
      <PopularCategories/>
      <FeaturedJobs/>
      <TopCompanies/>
      <ClientsTestimonial/>
      <BecomeSection/>
      <Footer/>
    </main>
  );
}