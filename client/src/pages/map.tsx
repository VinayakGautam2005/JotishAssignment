import { useState } from "react";
import { useEmployees } from "@/hooks/use-employees";
import { Layout } from "@/components/layout";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

// Coordinates are [longitude, latitude] for react-simple-maps
const CITY_COORDS: Record<string, [number, number]> = {
  "Edinburgh": [-3.1883, 55.9533],
  "Tokyo": [139.6503, 35.6762],
  "San Francisco": [-122.4194, 37.7749],
  "New York": [-74.0060, 40.7128],
  "London": [-0.1278, 51.5074],
  "Singapore": [103.8198, 1.3521],
  "Sidney": [151.2093, -33.8688],
  "Melbourne": [144.9631, -37.8136],
};

export default function CityMap() {
  const { data: employees } = useEmployees();
  const [tooltip, setTooltip] = useState<{ city: string; count: number } | null>(null);

  // Aggregate employees by city
  const cityCounts = employees?.reduce((acc, emp) => {
    acc[emp.city] = (acc[emp.city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <Layout title="Geographic Distribution" showBack>
      <div className="bg-white rounded-3xl p-6 border border-border shadow-sm overflow-hidden relative min-h-[650px] flex flex-col bg-grid-pattern">
        <div className="absolute top-8 left-8 z-[1000] pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-border shadow-lg">
            <h3 className="text-lg font-bold font-display text-foreground">Global Presence</h3>
            <p className="text-sm text-muted-foreground">Distribution across {Object.keys(cityCounts).length} major cities</p>
          </div>
        </div>

        <div className="flex-1 min-h-[450px] rounded-2xl overflow-hidden border border-border shadow-inner relative bg-[#fafafa] flex items-center justify-center">
          <ComposableMap projection="geoMercator" projectionConfig={{ scale: 130 }} className="w-full h-full">
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#e5e5e5"
                    stroke="#ffffff"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#d4d4d4", outline: "none", cursor: "pointer" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>

            {Object.entries(cityCounts).map(([city, count]) => {
              const position = CITY_COORDS[city];
              if (!position) return null;

              return (
                <Marker
                  key={city}
                  coordinates={position}
                  onMouseEnter={() => setTooltip({ city, count })}
                  onMouseLeave={() => setTooltip(null)}
                >
                  <g className="cursor-pointer transition-transform hover:scale-[1.2]" style={{ transformOrigin: "0px 0px" }}>
                    <circle r={7} fill="hsl(48, 100%, 50%)" stroke="#fff" strokeWidth={2} style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2)' }} />
                    <circle r={2.5} fill="#000" />
                  </g>
                  {tooltip?.city === city && (
                    <g transform="translate(0, -50)">
                      <rect x="-60" y="0" width="120" height="42" rx="8" fill="#fff" stroke="#e5e5e5" strokeWidth={1} style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1)' }} />
                      <path d="M -6 42 L 0 48 L 6 42 Z" fill="#fff" stroke="#e5e5e5" strokeWidth={1} />
                      <path d="M -5 42 L 5 42 Z" fill="#fff" stroke="#fff" strokeWidth={2} />

                      <text textAnchor="middle" x="0" y="18" fontSize="12" fontWeight="bold" fill="#000" fontFamily="Inter, sans-serif">
                        {city}
                      </text>
                      <text textAnchor="middle" x="0" y="33" fontSize="10" fontWeight="500" fill="#666" fontFamily="Inter, sans-serif">
                        Staff: {count}
                      </text>
                    </g>
                  )}
                </Marker>
              );
            })}
          </ComposableMap>
        </div>

        {/* Floating Stats Sidebar */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(cityCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 4)
            .map(([city, count]) => (
              <div key={city} className="bg-secondary/30 p-4 rounded-2xl border border-border/50 transition-all hover:border-primary/30">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{city}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-bold font-display text-primary">{count}</p>
                  <span className="text-xs text-muted-foreground">staff</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </Layout>
  );
}
