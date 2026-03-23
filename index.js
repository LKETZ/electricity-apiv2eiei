const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Helper: Load Data with error handling
const DATA_DIR = path.join(__dirname, 'data');
const loadData = (file) => {
  try {
    const filePath = path.join(DATA_DIR, file);
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw { status: 404, message: `Data file ${file} not found` };
    }
    throw { status: 500, message: 'Error reading data file' };
  }
};
// 1. API: Total electricity usage for each year
app.get('/api/usage/total-by-year', (req, res) => {
  try {
    const data = loadData('electricity_usages_en.json');
    const totals = data.reduce((acc, curr) => {
      const year = curr.year;
      const totalUsage = Object.keys(curr)
        .filter(key => key.endsWith('_kwh'))
        .reduce((sum, key) => sum + (curr[key] || 0), 0);
      acc[year] = (acc[year] || 0) + totalUsage;
      return acc;
    }, {});
    res.json(totals);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Internal server error' });
  }
});

// 2. API: Total electricity users for each year
app.get('/api/users/total-by-year', (req, res) => {
  try {
    const data = loadData('electricity_users_en.json');
    const totals = data.reduce((acc, curr) => {
      const year = curr.year;
      const totalUsers = Object.keys(curr)
        .filter(key => key.endsWith('_count'))
        .reduce((sum, key) => sum + (curr[key] || 0), 0);
      acc[year] = (acc[year] || 0) + totalUsers;
      return acc;
    }, {});
    res.json(totals);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Internal server error' });
  }
});

// 5. API: Usage history for a specific province (MUST come before /:province/:year)
app.get('/api/usage/history/:province', (req, res) => {
  try {
    const { province } = req.params;
    if (!province) {
      return res.status(400).json({ error: 'Province is required' });
    }
    const data = loadData('electricity_usages_en.json');
    const result = data.filter(d => d.province_name.toLowerCase() === province.toLowerCase());
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Internal server error' });
  }
});

// 6. API: User history for a specific province (MUST come before /:province/:year)
app.get('/api/users/history/:province', (req, res) => {
  try {
    const { province } = req.params;
    if (!province) {
      return res.status(400).json({ error: 'Province is required' });
    }
    const data = loadData('electricity_users_en.json');
    const result = data.filter(d => d.province_name.toLowerCase() === province.toLowerCase());
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Internal server error' });
  }
});

// 3. API: Usage by province and year
app.get('/api/usage/:province/:year', (req, res) => {
  try {
    const { province, year } = req.params;
    if (!province || !year) {
      return res.status(400).json({ error: 'Province and year are required' });
    }
    const data = loadData('electricity_usages_en.json');
    const result = data.find(d => d.province_name.toLowerCase() === province.toLowerCase() && d.year == year);
    res.json(result || { message: 'Data not found' });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Internal server error' });
  }
});

// 4. API: Users by province and year
app.get('/api/users/:province/:year', (req, res) => {
  try {
    const { province, year } = req.params;
    if (!province || !year) {
      return res.status(400).json({ error: 'Province and year are required' });
    }
    const data = loadData('electricity_users_en.json');
    const result = data.find(d => d.province_name.toLowerCase() === province.toLowerCase() && d.year == year);
    res.json(result || { message: 'Data not found' });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || 'Internal server error' });
  }
});
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
module.exports = app; // Export for testing