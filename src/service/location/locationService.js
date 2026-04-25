export const fetchGPSLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        resolve({
          latitude,
          longitude,
          address: `Lat: ${latitude}, Lng: ${longitude}`,
        });
      },
      () => reject("Location permission denied")
    );
  });
};
