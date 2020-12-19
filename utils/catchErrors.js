export default function catchErrors(error, displayError) {
  let errorMsg;
  if (error.response) {
    // The request was made and the server responded with an error
    errorMsg = error.response.data;
    console.error('error response: ', errorMsg);
    if (error.response.data.error) {
      errorMsg = error.response.data.error.message;
      console.error('error response: ', errorMsg);
    }
  } else if (error.request) {
    //   The request was made but no response was received
    errorMsg = error.request;
    console.error('error request: ', errorMsg);
  } else {
    // something else happened
    errorMsg = error.message;
    console.error('error message', errorMsg);
  }
  displayError(errorMsg);
}
