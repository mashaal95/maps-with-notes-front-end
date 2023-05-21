import { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  MarkerF,
  useJsApiLoader
} from "@react-google-maps/api";
import {
  Card,
  CardContent,
  Typography,
  Slide,
  IconButton,
  Button
} from "@mui/material";
import CloseIcon from "@mui/icons-material/CloseOutlined";

const containerStyle = {
  width: "100%",
  height: "100vh"
};

const center = {
  lat: -37.8076, // Initial latitude
  lng: 144.9568 // Initial longitude
};

const googleMapsApiKey = "AIzaSyDQhE94dGyUDXWEptcRpfvEo5vnZgCzIuI";

const Map = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleMapsApiKey
  });

  const [currentLocation, setCurrentLocation] =
    useState<null | google.maps.LatLng>(null);

  const [selectedMarker, setSelectedMarker] =
    useState<null | google.maps.LatLng>(null);

  useEffect(() => {
    // Get the user's current location using the Geolocation API
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation(new google.maps.LatLng(latitude, longitude));
      },
      (error) => {
        console.log("Error getting current location:", error);
      }
    );
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  const handleMarkerClick = (marker: any) => {
    setSelectedMarker(marker);
  };

  const handleCardClose = () => {
    setSelectedMarker(null);
  };

  const handleOpenAnotherCard = () => {
    setIsOpen(true);
    setSelectedMarker(null);
  };

  const handleCloseAnotherCard = () => {
    setIsOpen(false);
  };

  return (
    <>
      {selectedMarker && (
        <Slide direction="right" in={true} mountOnEnter unmountOnExit>
          <Card
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              zIndex: 1
            }}
          >
            <CardContent>
              <Typography variant="h6">Marker Info</Typography>
              <Typography>{`Latitude: ${selectedMarker.lat()}`}</Typography>
              <Typography>{`Longitude: ${selectedMarker.lng()}`}</Typography>
              <Button onClick={handleOpenAnotherCard}>Open Another Card</Button>
              {/* Add any other information you want to display */}
            </CardContent>
            <IconButton
              style={{ position: "absolute", top: 5, right: 5 }}
              onClick={handleCardClose}
            >
              <CloseIcon />
            </IconButton>
          </Card>
        </Slide>
      )}

      {isOpen && (
        <Slide direction="right" in={isOpen} mountOnEnter unmountOnExit>
          <Card
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              zIndex: 1
            }}
          >
            <CardContent>
              <Typography variant="h6">Another Card</Typography>
              <Typography>Content of the another card</Typography>
              <Button onClick={handleCloseAnotherCard}>
                Close Another Card
              </Button>
            </CardContent>
          </Card>
        </Slide>
      )}

      {isLoaded && (
        <GoogleMap
          options={{ disableDefaultUI: true }}
          mapContainerStyle={containerStyle}
          center={currentLocation || center}
          zoom={12}
        >
          {/* Render a marker at the current location */}
          {currentLocation && (
            <MarkerF
              position={{
                lat: currentLocation.lat(),
                lng: currentLocation.lng()
              }}
              onClick={() => handleMarkerClick(currentLocation)}
            />
          )}
        </GoogleMap>
      )}
    </>
  );
};

export default Map;
