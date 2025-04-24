const db = require('../db');

// Haversine formula to calculate distance between 2 coordinates
function getDistance(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Radius of Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

exports.addSchool = (req, res) => {
  const { id, name, address, latitude, longitude } = req.body;

  if (!id || !name || !address || isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const query = 'INSERT INTO schools (id, name, address, latitude, longitude) VALUES ($1, $2, $3, $4, $5) RETURNING id';
  const values = [id, name, address, latitude, longitude];

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(201).json({
      message: 'School added successfully',
      id: result.rows[0].id
    });
  });
};


exports.listSchools = (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: 'Invalid coordinates' });
  }

  db.query('SELECT * FROM schools', (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    const sorted = result.rows
      .map(school => ({
        ...school,
        distance: getDistance(userLat, userLon, school.latitude, school.longitude)
      }))
      .sort((a, b) => a.distance - b.distance);

    res.json(sorted);
  });
};
