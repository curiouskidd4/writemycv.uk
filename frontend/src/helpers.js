import axios from "axios";
import { getDownloadURL } from "firebase/storage";

function objectId () {
    return hex(Date.now() / 1000) +
      ' '.repeat(16).replace(/./g, () => hex(Math.random() * 16))
  }
  
  function hex (value) {
    return Math.floor(value).toString(16)
  }


  async function downloadStorageContent(ref) {
    const url = await getDownloadURL(ref);
    const response = await axios.get(url, {
        responseType: "blob",
    });
    return response.data;
  }
  
  export  {objectId, downloadStorageContent}