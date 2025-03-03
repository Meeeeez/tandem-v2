import { useEffect, useState } from "react";

enum FlightType {
  GLIDE = "glide",
  THERMAL = "thermal",
  SUNSET = "sunset"
}

const FlightSelctor = () => {
  const flightPrices = new Map([
    [FlightType.GLIDE, 100],
    [FlightType.THERMAL, 130],
    [FlightType.SUNSET, 150]
  ]);

  const [selectedFlight, setSelectedFlight] = useState<{type: FlightType, price: number}>({
    type: FlightType.GLIDE,
    price: flightPrices.get(FlightType.GLIDE) as number
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const flight = urlParams.get("flight");

    if (!Object.values(FlightType).includes(flight as FlightType)) {
      window.history.replaceState({}, '', `${window.location.pathname}`);
      return;
    };

    setSelectedFlight({
      type: flight as FlightType,
      price: flightPrices.get(flight as FlightType) as number
    });
  }, []);

  useEffect(() =>{
    if (selectedFlight === null) return;

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("flight", selectedFlight.type);
    window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`);
  }, [selectedFlight]);

  return (
    <section>
      <p className="text-gray-400 mb-3">Please choose the type of your flight</p>
      <div className="flex gap-3">
        <button
          onClick={() => setSelectedFlight({type: FlightType.GLIDE, price: flightPrices.get(FlightType.GLIDE) as number})}
          className={`hover:cursor-pointer hover:shadow-xl relative h-20 flex-1 rounded-lg border-2 ${selectedFlight?.type === FlightType.GLIDE ? 'border-orange-500' : 'border-slate-400'} overflow-hidden hover:shadow-lg transition-shadow`}
        >
          <p
            className="absolute font-display font-medium top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            GLIDE
          </p>
        </button>

        <button
          onClick={() => setSelectedFlight({type: FlightType.THERMAL, price: flightPrices.get(FlightType.THERMAL) as number})}
          className={`hover:cursor-pointer hover:shadow-xl relative h-20 flex-1 rounded-lg border-2 ${selectedFlight?.type === FlightType.THERMAL ? 'border-orange-500' : 'border-slate-400'} overflow-hidden transition-shadow hover:shadow-lg hover:bg-slate-100 tracking-wide`}
        >
          <p
            className="absolute font-display font-medium top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 tracking-wide"
          >
            THERMAL
          </p>
          <img
            draggable={false}
            className="relative top-3 right-20"
            src="img/mountain.svg"
            alt="Mountain"
          />
        </button>

        <button
          onClick={() => setSelectedFlight({type: FlightType.SUNSET, price: flightPrices.get(FlightType.SUNSET) as number})}
          className={`hover:cursor-pointer hover:shadow-xl bg-amber-100 relative h-20 flex-1 rounded-lg border-2 ${selectedFlight?.type=== FlightType.SUNSET ? 'border-orange-500' : 'border-slate-400'} overflow-hidden transition-shadow hover:shadow-lg hover:bg-[#fdeeb4] tracking-wide`}
          >
          <p
            className="absolute font-display font-medium top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            SUNSET
          </p>
          <img
            draggable={false}
            className="relative scale-[30%] left-28 xl:left-[140px] bottom-6 -rotate-12"
            src="img/glider.png"
            alt="Glider"
          />
          <div className="relative bg-orange-500 left-3 bottom-5 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
        </button>
      </div>
      {selectedFlight ? (
        <p className="text-slate-800 mt-4 leading-none text-5xl font-bold">
          € {selectedFlight?.price}
        </p>
      ) : (
        <p className="text-gray-400 mt-4 leading-none text-5xl font-bold">
          € 0
        </p>
      )}
    </section>
  );
};

export default FlightSelctor;