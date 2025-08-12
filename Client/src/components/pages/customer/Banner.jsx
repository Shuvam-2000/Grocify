import { Link } from "react-router-dom";
import { assets } from "../../../assets/assets";

const Banner = () => {
  return (
    <div className="relative mt-2">
      <img
        src={assets.main_banner_bg}
        alt="main-banner-img"
        className="w-full hidden md:block"
      />
      <img
        src={assets.main_banner_bg_sm}
        alt="main-banner-img"
        className="w-full md:hidden"
      />
      <div className="absolute inset-0 flex flex-col items-center md:items-start justify-end md:justify-center p-24 md:pb-0 md:pl-18 lg:pl-24">
        <h1 className="text-2xl mb-4 md:text-4xl lg:text-5xl font-bold text-center md:text-left max-w-72 md:max-w-80 lg:max-w-105 leading-right lg:leading-15">
          Your Daily Grocery Needs, Just a Click Away
        </h1>

        {/* AI Feature Highlight */}
        <div className="mb-4 px-4 py-2 bg-indigo-100 text-indigo-800 rounded-md text-sm font-medium max-w-md mx-auto md:mx-0 text-center md:text-left shadow-sm select-none">
           Powered by Smart AI: Personalized Recommendations & Search
        </div>

        <div className="flex items-center mt-6 medium">
          <Link
            to={"/allproducts"}
            className="group flex items-center gap-2 px-7 md:px-9 py-3 bg-primary-dull hover:bg-primary rounded text-white cursor-pointer"
          >
            Shop Now
            <img
              className="sm:block hidden transition group-focus:translate-x-1"
              src={assets.white_arrow_icon}
              alt="arrow-icon"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;
