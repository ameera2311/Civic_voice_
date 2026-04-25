const KEY = "reports";

/* Load all reports */
export const loadReports = () => {
  try {
    const data = localStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Load reports failed", e);
    return [];
  }
};

/* Add single report ✅ (THIS WAS MISSING) */
export const addReport = (report) => {
  const reports = loadReports();
  reports.push(report);
  localStorage.setItem(KEY, JSON.stringify(reports));
  return reports;
};

/* Save reports */
export const saveReports = (reports) => {
  localStorage.setItem(KEY, JSON.stringify(reports));
};

/* Update status */
export const updateReportStatus = (index, status) => {
  const reports = loadReports();
  if (!reports[index]) return reports;

  reports[index].status = status;

  if (status === "Resolved") {
    reports[index].completionDate = new Date().toLocaleString();
  }

  saveReports(reports);
  return reports;
};

/* Assign worker */
export const assignReportToWorker = (index, workerName) => {
  const reports = loadReports();
  if (!reports[index]) return reports;

  reports[index].assignedWorker = workerName;
  reports[index].status = "Assigned";

  saveReports(reports);
  return reports;
};

/* Delete report */
export const deleteReportByIndex = (index) => {
  const reports = loadReports().filter((_, i) => i !== index);
  saveReports(reports);
  return reports;
};
