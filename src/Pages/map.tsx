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
  Pagination,
  AppBar,
  Toolbar,
  Avatar,
  CardHeader
} from "@mui/material";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Note } from "../Components/types";
import { Guid } from "guid-typescript";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { red } from "@mui/material/colors";

const containerStyle = {
  width: "100%",
  height: "100vh"
};

const center = {
  lat: -37.8076, // Initial latitude
  lng: 144.9568 // Initial longitude
};


const notesPerPage = 4; 



const apiKey = process.env.REACT_APP_SECRET_API !== undefined ? process.env.REACT_APP_SECRET_API : ""

const Map = (props : {username : string}) => {

  const [searchQuery, setSearchQuery] = useState("");


  console.log('username from app check'+props.username)
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey
  });

  const fetchLocationName = (latitude : number, longitude : number) => {

  
    const geocoder = new google.maps.Geocoder();
    const latLng = new google.maps.LatLng(latitude, longitude);
  
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK") {
        if (results && results[0]) {
          setLocationName(results[0].formatted_address);
        } else {
          console.log("No results found");
        }
      } else {
        console.log("Geocoder failed due to: " + status);
      }
    });



  };


  const handleSearchQueryChange = (event : any) => {
    setCurrentPage(1);
    setSearchQuery(event.target.value);
  };
  


  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [userId, setUserId] = useState("");

  const [currentLocation, setCurrentLocation] =
    useState<null | {latitude: number, longitude: number}>(null)


  const [selectedMarker, setSelectedMarker] =
    useState<null | google.maps.LatLng>(null);

    const [currentPage, setCurrentPage] = useState(1);

    const [notes, setNotes] = useState<Note[]>([{
      userId: Guid.createEmpty(),
      username: "mashaal95",
      locationName: "Melbourne",
      notesText : "as"
    }])




  useEffect(() => {
    // Get the user's current location using the Geolocation API
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // setCurrentLocation(new google.maps.LatLng(latitude, longitude));
        setCurrentLocation({latitude: latitude, longitude: longitude});
      },
      (error) => {
        console.log("Error getting current location:", error);
      }
    );
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  const handleMarkerClick = (marker: google.maps.LatLng) => {
    setSelectedMarker(marker);

  
  
    const { lat , lng } = marker
  fetchLocationName(lat(), lng());
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

const filteredNotes = notes.filter(
  (note) =>
    note.notesText.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.username.toLowerCase().includes(searchQuery.toLowerCase())
);


const indexOfLastNote = currentPage * notesPerPage;
const indexOfFirstNote = indexOfLastNote - notesPerPage;
const currentNotes = filteredNotes.slice(indexOfFirstNote, indexOfLastNote);


  const onSubmit = (data: any) => {
    // Make an API request to save the notes
    // Replace 'apiEndpoint' with your actual API endpoint
    // event.preventDefault();
    axios
      .post("https://localhost:7129/api/Notes", {
        userId: userId,
        locationName: locationName,
        notesText: data.notesText
      })
      .then((response) => {
        const requestData =  locationName;

        axios.post('https://localhost:7129/api/Notes/locationName', requestData, {
          headers: {
            'Content-Type': 'application/json', // Set the appropriate content type for your raw data
          },
        })
          .then((response) => {
            // Handle the response
            setNotes(response.data)
          })
          .catch((error) => {
            // Handle errors
            console.error(error);
          });    
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


  useEffect(() => {
    // Fetch notes from the API

    // axios
    //   .post("https://localhost:7129/api/Notes", {
    //     userId: userId,
    //     locationName: locationName,
    //     notesText: data.notesText
    //   })


    const requestData =  locationName;

    axios.post('https://localhost:7129/api/Notes/locationName', requestData, {
      headers: {
        'Content-Type': 'application/json', // Set the appropriate content type for your raw data
      },
    })
      .then((response) => {
        // Handle the response
        setNotes(response.data)
        console.log(response);
      })
      .catch((error) => {
        // Handle errors
        console.error(error);
      });

    
    
      axios
      .get("https://localhost:7129/api/User/"+props.username)
      .then((response) => {
        setUserId(response.data)
      })
      .catch((error) => {
        console.log("Error fetching notes:", error);
      });
  
  }, [locationName]);


  if(!isLoaded) {
    return <></>
  }
 

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>

       <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Landmark Remark
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="logout"
            onClick={event =>  window.location.href='/'}
          >
            <ExitToAppIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {selectedMarker && (
        <Slide direction="right" in={true} mountOnEnter unmountOnExit>
          <Card
            style={{
              position: "absolute",
              top: 80,
              left: 10,
              zIndex: 1,
              width: "15rem"
            }}
          >
            <CardContent>

              <Typography variant="h6">Notes</Typography>

              <Box sx={{ p: 2 }}>
        <TextField
          variant="outlined"
          label="Search Notes"
          placeholder="Search by user or content..."
          value={searchQuery}
          onChange={handleSearchQueryChange}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
        />
      </Box>

              {currentNotes.map((note) => (
                <Card key={note.messageId} style={{ marginBottom: "1rem", borderRadius: "10px" }}>
                       <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            U
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={note.username}
        subheader={note.locationName.split(' ').slice(0, 3).join(' ')}
      />
                  <CardContent>
        <Typography>
          {note.notesText}
        </Typography>
                  </CardContent>
                </Card>
              ))}
              {totalPages > 1 && (
              <div style={{ marginTop: "2rem", marginBottom: "1rem" }}>
                <Pagination
                  count={Math.ceil(filteredNotes.length / notesPerPage)}
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
              top: 80,
              left: 10,
              zIndex: 1
            }}
          >

            <CardContent>
         
              <Typography variant="h6">Add Notes</Typography>
       
              <form onSubmit={handleSubmit(onSubmit) } style={{height: "10%", display:"flex", flexDirection:"column", justifyContent:"center",}}>

                <TextField
                  label="Notes Text"
                  size="small"
                  multiline
                  rows={2}
                  {...register("notesText", { required: true })}
                  error={!!errors.notesText}
                  helperText={errors.notesText ? "Notes text is required" : ""}
                  style={{ marginBottom: "1rem" }} 
                  InputLabelProps={{
                    shrink: true
                  }}
                />
                <Button type="submit" color="success">Save Notes</Button>
                <Button onClick={handleCloseAnotherCard}>Go Back</Button>
                <Button onClick={handleCloseNote} color="error">Cancel</Button>
              </form>
                   <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Note added successfully!"
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSnackbar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
            </CardContent>
          </Card>
        </Slide>
      )}

      {isLoaded && (
        <GoogleMap
          options={{ disableDefaultUI: true }}
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
        >
          {/* Render a marker at the current location */}
          {currentLocation && (
            <MarkerF
              position={{
                lat: currentLocation.latitude,
                lng: currentLocation.longitude
              }}
              onClick={() => handleMarkerClick(new google.maps.LatLng(currentLocation.latitude,currentLocation.longitude))}
            />
          )}
        </GoogleMap>
      )}
    </div>
  );
};

export default Map;
