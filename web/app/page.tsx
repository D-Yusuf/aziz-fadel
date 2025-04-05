import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Faq from "@/components/sections/Faq";
import Main from "@/components/sections/Main";
import Reviews from "@/components/sections/Reviews";
import Services from "@/components/sections/Services";
import Link from "next/link";

export default function Home() {
  return (
    <>
    <div className="max-w-6xl mx-auto">
    <div className="flex flex-col gap-10  px-5 max-w-7xl mx-auto">
      <div className="flex flex-col min-h-screen ">
        <Navbar />
        <Main />
      </div>
      <hr className="w-full  border-t border-gray-300" />
      <Reviews /> 
      <hr className="w-full  border-t border-gray-300" />
      <Services />
      <hr className="w-full  border-t border-gray-300" />
      <Faq />

        <div className='w-full mb-10  gap-12 p-10 bg-secondary   rounded-xl  flex items-center justify-center flex-col'>
          <h1 className='max-w-4/5 text-center lg:text-6xl md:text-4xl text-3xl  font-superbold  leading-relaxed'>ابدأ بالخطوة الأولى نحو تغيير حياتك</h1>
          <Link href='#subscribe' className='bg-accent font-extrabold md:text-xl text-base text-white px-8 py-2 rounded-md w-fit'>اشترك الآن</Link>
        </div>
    </div>
    </div>
      <Footer />
    </>
  );
}
