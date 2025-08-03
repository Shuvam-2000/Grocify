import { assets, features } from "../../../assets/assets";

const BottomBanner = () => {
  return (
    <div className="relative mt-24 mb-14">
      {/* Background Images */}
      <img
        src={assets.bottom_banner_image}
        alt="banner-bottom"
        className="w-full hidden md:block"
      />
      <img
        src={assets.bottom_banner_image_sm}
        alt="banner-bottom"
        className="w-full md:hidden"
      />

      {/* Overlay Content */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center md:justify-end px-4 md:px-24 py-10">
        <div className="p-6 rounded-xl w-full md:w-[40%] md:-translate-y-10">
          <h1 className="text-2xl md:text-3xl font-semibold text-primary mb-6 text-center md:text-left">
            Why We Are the Best
          </h1>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className="w-8 md:w-10 mt-1"
                />
                <div>
                  <h3 className="text-base md:text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomBanner;
