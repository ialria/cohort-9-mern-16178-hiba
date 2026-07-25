import LeafletLogo from "./leaflet_logo.jsx";
import "../index.css";
function BrandPanel() {
  return (
    <div className="bg-[#362B4A] w-1/2 h-screen px-20 py-12 sticky top-0">
      <div className="flex items-center gap-2">
        <LeafletLogo className="w-10 h-10  text-[#FFFFFF]" />
        <p className="text-[#FAF9F6]">leaflet</p>
      </div>

      <div className="my-30 mr-38">
        <p className="text-[#FAF9F6] text-4xl">A quiet place</p>
        <p className="text-[#FAF9F6] text-4xl"> for your thoughts</p>

        <p className="text-[#9891A3] mt-10 text-sm">
          Every note, organized and within reach — nothing else competing for
          your attention.
        </p>
      </div>
    </div>
  );
}

export default BrandPanel;