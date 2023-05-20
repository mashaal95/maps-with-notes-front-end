import { useEffect, useState } from "react";
import {
  GoogleMap,
  MarkerF,
  useJsApiLoader,
  InfoWindow,
  OverlayView
} from "@react-google-maps/api";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import {
  TextField,
  Popover,
  Dialog,
  IconButton,
  Button,
  CardActions
} from "@mui/material";
import DialogBox from "../Components/dialog";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

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

  if (!isLoaded) return <div>Loading...</div>;

  return <MapLoad />;
};

const MapLoad = () => {
  const [currentLocation, setCurrentLocation] =
    useState<null | google.maps.LatLng>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [selectedMarker, setSelectedMarker] =
    useState<null | google.maps.LatLng>(null);

  const initialNotes = [
    { id: 1, text: "Note 1", location: { lat: 42.35, lng: -70.9 } },
    { id: 2, text: "Note 2", location: { lat: 42.5, lng: -71.2 } }
  ];
  const [notes, setNotes] = useState(initialNotes);
  const [isCardOpen, setIsCardOpen] = useState(false);

  const handleMarkerDoubleClick = () => {
    setIsDialogOpen(true);
    handleMarkerClickClose();
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

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

    setNotes(initialNotes);
  }, []);

  const handleMarkerClick = (marker: any) => {
    setSelectedMarker(marker === selectedMarker ? null : marker);
    setIsCardOpen(true);
  };

  const handleMarkerClickClose = () => {
    setSelectedMarker(null);
    setIsCardOpen(false);
  };

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 1
        }}
      >
        <TextField
          variant="standard"
          placeholder="Search..."
          InputProps={{
            startAdornment: <SearchIcon />
          }}
        />
      </div>

      <GoogleMap
        options={{ disableDefaultUI: true }}
        mapContainerStyle={containerStyle}
        center={currentLocation ? currentLocation.toJSON() : center}
        zoom={12}
      >
        {/* Render a marker at the current location */}
        {currentLocation && (
          <>
            <MarkerF
              onDblClick={handleMarkerDoubleClick}
              position={{
                lat: currentLocation.lat(),
                lng: currentLocation.lng()
              }}
              onClick={() => handleMarkerClick(currentLocation)}
              // onMouseOut={() => handleMarkerHover(false, null)}
            />

            {selectedMarker && isCardOpen && (
              <OverlayView
                position={selectedMarker}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                getPixelPositionOffset={(width, height) => ({
                  x: -(width / 2),
                  y: -(height + 10)
                })}
              >
                <Card>
                  <CardContent>
                    <Typography variant="h6">Marker Info</Typography>
                    <Typography>{`Latitude: ${selectedMarker.lat()}`}</Typography>
                    <Typography>{`Longitude: ${selectedMarker.lng()}`}</Typography>
                    {/* Add any other information you want to display */}
                  </CardContent>
                  <CardActions>
                    <Button
                      onClick={handleMarkerClickClose}
                      size="small"
                      color="primary"
                    >
                      Close
                    </Button>
                  </CardActions>
                </Card>
              </OverlayView>
            )}
          </>
        )}
      </GoogleMap>
      <DialogBox
        isDialogOpen={isDialogOpen}
        handleDialogClose={handleDialogClose}
      />
    </>
  );
};

export default Map;
