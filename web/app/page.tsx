import Footer from "@/components/Footer";
import Faq from "@/components/sections/Faq";
import Main from "@/components/sections/Main";
import Reviews from "@/components/sections/Reviews";
import Services from "@/components/sections/Services";
export default function Home() {
  return (
    <div className="flex flex-col gap-10 p-5">
      <Main />
      <hr className="w-full  border-t border-gray-300" />
      <Services />
      <hr className="w-full  border-t border-gray-300" />
      <Reviews /> 
      <hr className="w-full  border-t border-gray-300" />
      <Faq />

    </div>
  );
}
