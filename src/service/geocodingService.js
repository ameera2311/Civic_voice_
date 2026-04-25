export const getFullAddress = async (lat, lon) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    const data = await res.json();
    return data.display_name || "Unknown Area";
  } catch (e) {
    console.error("Reverse geocoding failed", e);
    return "Unknown Area";
  }
};
