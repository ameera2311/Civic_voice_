const db = require("../models/db");

exports.getAnalytics = (req, res) => {

  const analytics = {
    total: 0,
    pending: 0,
    resolved: 0,
    categoryData: [],
    statusData: []
  };

  // Total complaints
  db.query(
    "SELECT COUNT(*) AS total FROM complaints",
    (err, totalResult) => {

      if (err) return res.status(500).json(err);

      analytics.total = totalResult[0].total;

      // Pending complaints
      db.query(
        "SELECT COUNT(*) AS pending FROM complaints WHERE status != 'Resolved'",
        (err2, pendingResult) => {

          if (err2) return res.status(500).json(err2);

          analytics.pending = pendingResult[0].pending;

          // Resolved complaints
          db.query(
            "SELECT COUNT(*) AS resolved FROM complaints WHERE status = 'Resolved'",
            (err3, resolvedResult) => {

              if (err3) return res.status(500).json(err3);

              analytics.resolved = resolvedResult[0].resolved;

              // Category data
              db.query(
                "SELECT category AS name, COUNT(*) AS value FROM complaints GROUP BY category",
                (err4, categoryResult) => {

                  if (err4) return res.status(500).json(err4);

                  analytics.categoryData = categoryResult;

                  // Status data
                  db.query(
                    "SELECT status AS name, COUNT(*) AS value FROM complaints GROUP BY status",
                    (err5, statusResult) => {

                      if (err5) return res.status(500).json(err5);

                      analytics.statusData = statusResult;

                      res.json(analytics);

                    }
                  );

                }
              );

            }
          );

        }
      );

    }
  );

};