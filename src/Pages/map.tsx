import { useEffect, useState } from "react";
import {
  GoogleMap,
  MarkerF,
  useJsApiLoader
} from "@react-google-maps/api";
import {
  Card,
  CardContent,
  Typography,
  Slide,
  IconButton,
  Button,
  TextField,
  Snackbar,
  Box,
  Pagination
} from "@mui/material";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Note } from "../Components/types";
import { Guid } from "guid-typescript";

const containerStyle = {
  width: "100%",
  height: "100vh"
};

const center = {
  lat: -37.8076, // Initial latitude
  lng: 144.9568 // Initial longitude
};

const googleMapsApiKey = "AIzaSyDQhE94dGyUDXWEptcRpfvEo5vnZgCzIuI";
const notesPerPage = 4; 

const Map = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleMapsApiKey
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [currentLocation, setCurrentLocation] =
    useState<null | google.maps.LatLng>(null);

  const [selectedMarker, setSelectedMarker] =
    useState<null | google.maps.LatLng>(null);

    const [currentPage, setCurrentPage] = useState(1);

    const [notes, setNotes] = useState<Note[]>([{
      userId: Guid.createEmpty(),
      locationName: "Melbourne",
      notesText : "as"
    }])


useEffect(() => {
    // Fetch notes from the API
    axios
      .get("https://localhost:7129/api/Notes")
      .then((response) => {
        setNotes(response.data);
      })
      .catch((error) => {
        console.log("Error fetching notes:", error);
      });
  }, []);

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
    setCurrentPage(1);
    setIsOpen(true);
    setSelectedMarker(null);
  };

  const handleCloseAnotherCard = (marker: any) => {
    
    setIsOpen(false);
    setSelectedMarker(marker);
  };

  const [notesText, setNotesText] = useState("");
  const [username, setUsername] = useState("");
  const [locationName, setLocationName] = useState("");
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const [selectedNote, setSelectedNote] = useState(null);

  const handleOpenNote = (note : any) => {
    setSelectedNote(note);
  };

  const handleCloseNote = () => {

    setSelectedNote(null);
    setIsOpen(false);
  };
  // Pagination logic
  const totalNotes = notes.length;
  const totalPages = Math.ceil(totalNotes / notesPerPage);
const handlePageChange = (event: any,pageNumber: number) => {
  if (pageNumber >= 1 && pageNumber <= totalPages) {
    setCurrentPage(pageNumber);
  }
};

const indexOfLastNote = currentPage * notesPerPage;
const indexOfFirstNote = indexOfLastNote - notesPerPage;
const currentNotes = notes.slice(indexOfFirstNote, indexOfLastNote);


  const onSubmit = (data: any) => {
    // Make an API request to save the notes
    // Replace 'apiEndpoint' with your actual API endpoint
    // event.preventDefault();

 
    axios
      .post("https://localhost:7129/api/Notes", {
        userId: data.userId,
        locationName: data.locationName,
        notesText: data.notesText
      })
      .then((response) => {
        // Handle the response data if needed
  
        console.log(response.data);
      })
      .catch((error) => {
        // Handle the error if needed
        console.log("Error saving notes:", error);
      });

    setSnackbarOpen(true);
    // Reset the form
    reset();
    
  };

    const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  }
 

  return (
    <>
      {selectedMarker && (
        <Slide direction="right" in={true} mountOnEnter unmountOnExit>
          <Card
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              zIndex: 1,
              width: "15rem"
            }}
          >
            <CardContent>
              <Typography variant="h6">Notes:</Typography>
              {currentNotes.map((note) => (
                <Card key={note.messageId} style={{ marginBottom: "1rem", borderRadius: "10px" }}>
                  <CardContent>
                    <Typography>{note.notesText}</Typography>
                  </CardContent>
                </Card>
              ))}
              {totalPages > 1 && (
              <div style={{ marginTop: "2rem", marginBottom: "1rem" }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                />
              </div>
            )}
              <Button onClick={handleOpenAnotherCard}>Add Note</Button>
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
              <Typography variant="h6">Add Notes</Typography>
              <form onSubmit={handleSubmit(onSubmit) } style={{height: "10%", display:"flex", flexDirection:"column", justifyContent:"center",}}>
                <TextField
                  label="Location Name"
                  size="small"
                  {...register("locationName", { required: true })}
                  error={!!errors.locationName}
                  helperText={errors.locationName ? "Location name is required" : ""}
                  style={{ marginBottom: "1rem" }} 
                />
                <TextField
                  label="Username"
                  size="small"
                  {...register("userId", { required: true })}
                  error={!!errors.username}
                  helperText={errors.username ? "Username is required" : ""}
                  style={{ marginBottom: "1rem" }} 
                />
                <TextField
                  label="Notes Text"
                  size="small"
                  multiline
                  rows={2}
                  {...register("notesText", { required: true })}
                  error={!!errors.notesText}
                  helperText={errors.notesText ? "Notes text is required" : ""}
                  style={{ marginBottom: "1rem" }} 
                />
                <Button type="submit">Save Notes</Button>
                <Button onClick={handleCloseAnotherCard}>Go Back</Button>
                <Button onClick={handleCloseNote}>Cancel</Button>
              </form>
               <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="Note saved successfully!"
      />
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
