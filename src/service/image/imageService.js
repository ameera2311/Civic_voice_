// src/services/image/imageService.js

/**
 * Opens file picker to select an image
 * @param {boolean} useCamera - true to prefer camera (mobile)
 * @returns {Promise<File|null>}
 */
export const pickImage = (useCamera = false) => {
  return new Promise((resolve) => {
    const input = document.createElement("input");

    input.type = "file";
    input.accept = "image/*";

    // For mobile camera support
    if (useCamera) {
      input.setAttribute("capture", "environment");
    }

    input.onchange = () => {
      const file = input.files?.[0];
      resolve(file || null);
    };

    input.click();
  });
};
