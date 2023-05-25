import axios from "axios";
import { Guid } from "guid-typescript";
const baseUrlNotes = process.env.REACT_APP_NOTES_URL !== undefined ? process.env.REACT_APP_NOTES_URL : ""
const baseUrlGetNotes = process.env.REACT_APP_GET_NOTES_URL !== undefined ? process.env.REACT_APP_GET_NOTES_URL : ""
const baseUrlUser = process.env.REACT_APP_USER_URL !== undefined ? process.env.REACT_APP_USER_URL : ""

// getting all the responses for each particular state from the API
const postNotes = ( userId : String, locationName : string, notesText : string) => {

    console.log(baseUrlNotes)
  const request = axios.post(baseUrlNotes, {
    userId: userId,
    locationName: locationName,
    notesText: notesText
  });
  return request


};

const getNotesByLocation = (requestData : string) => {
    const request =  axios.post(baseUrlGetNotes, requestData, {
        headers: {
          'Content-Type': 'application/json', 
        },
      });

      return request


}


const getUserIdByUsername = (username : string) => {
    const request = axios
    .get(baseUrlUser + username)

      return request
}



const mapNotesService = {
  postNotes,
  getNotesByLocation,
  getUserIdByUsername 
};

export default mapNotesService;