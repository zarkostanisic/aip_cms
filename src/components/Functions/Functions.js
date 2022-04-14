// Function for formatting image file into base64 format
export const fileToBase64 = (files) => {
  return new Promise(resolve => {
    const file = files;
    const reader = new FileReader();
    // Read file content on file loaded event
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    // Convert data to base64 
    reader.readAsDataURL(file);
  });
};

// Function for formatting dates from calendar, to send to API
export const formatDateHandler = (date) => {
  const new_date = new Date(date);
  const dateString = new Date(new_date.getTime() - (new_date.getTimezoneOffset() * 60000));
  return dateString.toISOString().split('T')[0];
};
