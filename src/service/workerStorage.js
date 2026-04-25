const STORAGE_KEY = "workers";

export const WorkerStorage = {
  // Load workers from localStorage
  loadWorkers() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Save workers to localStorage
  saveWorkers(workers) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workers));
  },

  // Add a new worker
  addWorker(worker) {
    const workers = this.loadWorkers();
    workers.push({ ...worker, workload: 0 });
    this.saveWorkers(workers);
    return workers;
  },

  // Delete worker by index
  deleteWorker(index) {
    const workers = this.loadWorkers();
    if (index >= 0 && index < workers.length) {
      workers.splice(index, 1);
      this.saveWorkers(workers);
    }
    return workers;
  },

  // Find least busy worker
  getLeastBusyWorker() {
    const workers = this.loadWorkers();
    if (workers.length === 0) return null;

    return workers.reduce((min, w) =>
      (w.workload ?? 0) < (min.workload ?? 0) ? w : min
    );
  },

  // Update workload
  updateWorkload(name, delta) {
    const workers = this.loadWorkers();
    const updated = workers.map(w =>
      w.name === name
        ? { ...w, workload: (w.workload ?? 0) + delta }
        : w
    );
    this.saveWorkers(updated);
    return updated;
  },

  // Reset workloads
  resetAllWorkloads() {
    const workers = this.loadWorkers().map(w => ({
      ...w,
      workload: 0
    }));
    this.saveWorkers(workers);
    return workers;
  }
};
