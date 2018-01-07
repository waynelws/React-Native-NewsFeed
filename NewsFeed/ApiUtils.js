const generalErrorMessage = 'Failed to load news from server.';

var ApiUtils = {
  checkStatus: function(response) {
    if (response.ok) {
      return response;
    } else if (response.statusText == null){
      let error = new Error(generalErrorMessage);
      error.response = response;
      throw error;
    } else {
      let error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }
};
export { ApiUtils as default };
