import LeafletLogo from "../icons/leaflet_logo.jsx";
import "../index.css";
function BrandPanel() {
  return (
    <div className="bg-primary w-full md:w-1/2 h-auto hidden md:block md:h-screen  py-6 px-6 sm:px-8 md:px-10 lg:px-18 md:py-12 md:sticky top-0">
      <div className="flex items-center gap-2">
        <LeafletLogo className="w-8 h-8 md:w-10 md:h-10  text-surface" />
        <p className="text-background">leaflet</p>
      </div>

      <div className="max-w-md md:block mt-10 md:mt-23  mr-2 md:mr-2 lg:mr-12 lg:mt-24 xl:mt-32">
        <p className="text-background text-2xl md:text-3xl lg:text-4xl font-semibold">A quiet place</p>
        <p className="text-background text-2xl md:text-3xl lg:text-4xl font-semibold"> for your thoughts</p>

        <p className="text-text-muted  mt-6 lg:mt-10 text-sm leading-7">
          Every note, organized and within reach — nothing else competing for
          your attention.
        </p>
      </div>
    </div>
  );
}

export default BrandPanel;