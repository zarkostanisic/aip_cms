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
