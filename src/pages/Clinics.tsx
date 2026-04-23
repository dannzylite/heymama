import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  MapPin,
  Navigation as NavIcon,
  Phone,
  Clock,
  Star,
  Search,
  Filter,
  Hospital,
  Stethoscope,
  Car,
  Shield,
  Loader2,
  LocateFixed
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/layout/navigation";

interface ClinicResult {
  id: number;
  name: string;
  type: string;
  address: string;
  distance: string;
  distanceNum: number;
  lat: number;
  lng: number;
  phone: string;
  emergency: boolean;
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&email=heymamacare@gmail.com`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    const data = await res.json();
    if (data.length === 0) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } finally {
    clearTimeout(timer);
  }
}

async function fetchNearbyHospitals(lat: number, lng: number): Promise<ClinicResult[]> {
  const radius = 15000;
  const query = `
[out:json][timeout:30];
(
  node["amenity"="hospital"](around:${radius},${lat},${lng});
  way["amenity"="hospital"](around:${radius},${lat},${lng});
  node["amenity"="clinic"](around:${radius},${lat},${lng});
  way["amenity"="clinic"](around:${radius},${lat},${lng});
  node["healthcare"="hospital"](around:${radius},${lat},${lng});
  way["healthcare"="hospital"](around:${radius},${lat},${lng});
);
out center tags;
  `.trim();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 35000);

  let res: Response;
  try {
    // Overpass requires form-encoded body in production browsers
    res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "data=" + encodeURIComponent(query),
      signal: controller.signal,
    });
  } catch {
    // Fallback to mirror if primary is down
    res = await fetch("https://overpass.kumi.systems/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "data=" + encodeURIComponent(query),
    });
  } finally {
    clearTimeout(timer);
  }

  const data = await res!.json();

  return (data.elements as any[])
    .filter((el) => el.tags?.name)
    .map((el) => {
      const elLat = el.lat ?? el.center?.lat;
      const elLng = el.lon ?? el.center?.lon;
      const dist = haversineKm(lat, lng, elLat, elLng);
      const tags = el.tags;
      const addressParts = [
        tags["addr:housenumber"],
        tags["addr:street"],
        tags["addr:city"],
      ].filter(Boolean);
      return {
        id: el.id,
        name: tags.name,
        type:
          tags.amenity === "hospital" || tags.healthcare === "hospital"
            ? "Hospital"
            : "Clinic",
        address: addressParts.length > 0 ? addressParts.join(", ") : "Address unavailable",
        distance: dist.toFixed(1) + " km",
        distanceNum: dist,
        lat: elLat,
        lng: elLng,
        phone:
          tags.phone ??
          tags["contact:phone"] ??
          tags["contact:mobile"] ??
          tags.mobile ??
          tags.telephone ??
          tags["phone:ng"] ??
          "",
        emergency: tags.emergency === "yes",
      } as ClinicResult;
    })
    .sort((a, b) => a.distanceNum - b.distanceNum);
}

export default function Clinics() {
  const { toast } = useToast();
  const [searchAddress, setSearchAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [locationLabel, setLocationLabel] = useState("");
  const [results, setResults] = useState<ClinicResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filters = [
    { key: "all", label: "All" },
    { key: "hospital", label: "Hospitals" },
    { key: "clinic", label: "Clinics" },
    { key: "emergency", label: "Emergency" },
  ];

  const filteredResults = results.filter((c) => {
    if (selectedFilter === "hospital") return c.type === "Hospital";
    if (selectedFilter === "clinic") return c.type === "Clinic";
    if (selectedFilter === "emergency") return c.emergency;
    return true;
  });

  async function runSearch(lat: number, lng: number, label: string) {
    setIsSearching(true);
    setLocationLabel(label);
    try {
      const clinics = await fetchNearbyHospitals(lat, lng);
      setResults(clinics);
      setHasSearched(true);
      if (clinics.length === 0) {
        toast({ title: "No facilities found", description: "Try expanding your search area." });
      }
    } catch {
      toast({ title: "Search failed", description: "Could not fetch nearby hospitals. Please try again.", variant: "destructive" });
    } finally {
      setIsSearching(false);
    }
  }

  const handleSearch = async () => {
    if (!searchAddress.trim()) return;
    const coords = await geocodeAddress(searchAddress);
    if (!coords) {
      toast({ title: "Address not found", description: "Try a more specific address.", variant: "destructive" });
      return;
    }
    runSearch(coords.lat, coords.lng, searchAddress);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Not supported", description: "Your browser doesn't support geolocation.", variant: "destructive" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        // reverse geocode for a readable label
        let label = "Your current location";
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&email=heymamacare@gmail.com`
          );
          const data = await res.json();
          label = data.display_name ?? label;
          setSearchAddress(label);
        } catch {
          setSearchAddress(label);
        }
        runSearch(latitude, longitude, label);
      },
      () => {
        toast({ title: "Location denied", description: "Please allow location access or type your address.", variant: "destructive" });
      }
    );
  };

  const handleGetDirections = (clinic: ClinicResult) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${clinic.lat},${clinic.lng}`,
      "_blank"
    );
  };

  const handleCallClinic = (clinic: ClinicResult) => {
    if (clinic.phone) {
      window.location.href = `tel:${clinic.phone}`;
    } else {
      toast({ title: "No phone number", description: "This facility has no phone number listed." });
    }
  };

  const handleEmergencyCall = () => {
    window.location.href = "tel:199";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container px-4 py-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Find Maternal Care</h1>
            <p className="text-muted-foreground">Search for hospitals and clinics near any address</p>
          </div>
          <Button
            onClick={handleEmergencyCall}
            className="bg-destructive hover:bg-destructive/90 animate-pulse-glow mt-4 sm:mt-0"
          >
            <Phone className="h-4 w-4 mr-2" />
            Emergency: 199
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6 shadow-card bg-gradient-card">
          <CardContent className="p-6 space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter your address or area..."
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10 focus:shadow-medical transition-all"
                />
              </div>
              <Button onClick={handleSearch} disabled={isSearching} className="bg-gradient-primary hover:shadow-glow">
                {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                <span className="ml-2 hidden sm:inline">Search</span>
              </Button>
              <Button variant="outline" onClick={handleUseMyLocation} disabled={isSearching} className="hover:shadow-medical">
                <LocateFixed className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">Use My Location</span>
              </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              {filters.map((f) => (
                <Button
                  key={f.key}
                  variant={selectedFilter === f.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(f.key)}
                  className="transition-all hover:shadow-medical"
                >
                  <Filter className="h-3 w-3 mr-1" />
                  {f.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Location status */}
        {hasSearched && locationLabel && (
          <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="font-medium text-foreground">Searching near: {locationLabel}</p>
                <p className="text-sm text-muted-foreground">
                  Showing {filteredResults.length} facilit{filteredResults.length === 1 ? "y" : "ies"} within 15 km
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {isSearching && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="shadow-card animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded w-1/3 mb-3" />
                  <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Results */}
        {!isSearching && hasSearched && (
          <div className="space-y-4">
            {filteredResults.map((clinic) => (
              <Card key={clinic.id} className="shadow-card bg-gradient-card hover:shadow-medical transition-all animate-fade-in">
                <CardContent className="p-6">
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center flex-wrap gap-2 mb-1">
                            <h3 className="text-xl font-bold text-foreground">{clinic.name}</h3>
                            {clinic.emergency && (
                              <Badge className="bg-destructive text-destructive-foreground">
                                <Shield className="h-3 w-3 mr-1" />
                                Emergency
                              </Badge>
                            )}
                          </div>
                          <Badge variant="outline" className="mb-2">
                            <Hospital className="h-3 w-3 mr-1" />
                            {clinic.type}
                          </Badge>
                          <p className="text-muted-foreground flex items-center text-sm mb-1">
                            <MapPin className="h-4 w-4 mr-1 shrink-0" />
                            {clinic.address}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <NavIcon className="h-4 w-4 mr-1" />
                              {clinic.distance} away
                            </span>
                            {clinic.phone && (
                              <span className="flex items-center">
                                <Phone className="h-4 w-4 mr-1" />
                                {clinic.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={() => handleGetDirections(clinic)}
                        className="w-full bg-gradient-primary hover:shadow-glow transition-all"
                      >
                        <Car className="h-4 w-4 mr-2" />
                        Get Directions
                      </Button>
                      {clinic.phone ? (
                        <Button
                          variant="outline"
                          onClick={() => handleCallClinic(clinic)}
                          className="w-full hover:shadow-medical transition-shadow"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Call Now
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() =>
                            window.open(
                              `https://www.google.com/search?q=${encodeURIComponent(clinic.name + " hospital phone number")}`,
                              "_blank"
                            )
                          }
                          className="w-full hover:shadow-medical transition-shadow"
                        >
                          <Search className="h-4 w-4 mr-2" />
                          Find Phone Number
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredResults.length === 0 && (
              <Card className="shadow-card bg-gradient-card text-center p-12">
                <div className="space-y-4">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
                  <h3 className="text-xl font-semibold text-foreground">No facilities found</h3>
                  <p className="text-muted-foreground">Try changing the filter or searching a different area.</p>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Empty state before first search */}
        {!isSearching && !hasSearched && (
          <Card className="shadow-card bg-gradient-card text-center p-16">
            <div className="space-y-4">
              <MapPin className="h-16 w-16 text-primary/40 mx-auto" />
              <h3 className="text-xl font-semibold text-foreground">Search for Nearby Facilities</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Enter your address above or use your current location to find hospitals and clinics near you.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
