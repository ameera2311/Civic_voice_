// src/models/complaintModel.js

export const createComplaint = ({
  customerName = "",
  customerNumber = "",
  issue = "",
  description = "",
  predictedIssue = "",
  urgency = "Normal",
  manualLocation = "",
  gpsLocation = "",
  latitude = null,
  longitude = null,
  category = "Others",
  image = null,
} = {}) => {
  return {
    customerName,
    customerNumber,
    issue,
    description,
    predictedIssue,
    urgency,
    manualLocation,
    gpsLocation,
    latitude,
    longitude,
    category,
    image,

    status: "Processing",       // default
    assignedTo: null,            // admin usage
    date: new Date().toLocaleString(),
  };
};
