import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Faq from "@/components/sections/Faq";
import Main from "@/components/sections/Main";
import Reviews from "@/components/sections/Reviews";
import Services from "@/components/sections/Services";

export default function Home() {
  return (
    <>
    <div className="flex flex-col gap-10 py-8 px-5 max-w-7xl mx-auto">
      <div className="flex flex-col h-screen">
        <Navbar />
        <Main />
      </div>
      <hr className="w-full  border-t border-gray-300" />
      <Reviews /> 
      <hr className="w-full  border-t border-gray-300" />
      <Services />
      <hr className="w-full  border-t border-gray-300" />
      <Faq />

    </div>
      <Footer />
    </>
  );
}
