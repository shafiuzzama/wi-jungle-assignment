import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell, Legend, ResponsiveContainer
} from 'recharts';
import './App.css';
import data from './data.json';

const App = () => {
  const [parsedData, setParsedData] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark' : 'light';
  }, [isDarkMode]);

  useEffect(() => {
    const parseData = data.map(entry => ({
      ...entry,
      timestamp: new Date(entry.timestamp),
      severity: entry.alert.severity,
      src_ip: entry.src_ip
    }));
    setParsedData(parseData);
  }, []);

  const severityData = parsedData.reduce((acc, entry) => {
    acc[entry.severity] = (acc[entry.severity] || 0) + 1;
    return acc;
  }, {});

  const severityArray = Object.keys(severityData).map(key => ({
    severity: key,
    count: severityData[key]
  }));

  const topSrcIPs = parsedData.reduce((acc, entry) => {
    acc[entry.src_ip] = (acc[entry.src_ip] || 0) + 1;
    return acc;
  }, {});

  const topSrcIPsArray = Object.keys(topSrcIPs).map(key => ({
    src_ip: key,
    count: topSrcIPs[key]
  })).sort((a, b) => b.count - a.count).slice(0, 10);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#d0ed57', '#a4de6c', '#d4a6a6', '#a28bfc', '#6f8aff'];

  return (
    <div className="App">
      <button
        className="toggle-button"
        onClick={() => setIsDarkMode(prevMode => !prevMode)}
      >
        Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
      </button>

      <h1>Dashboard</h1>

      <h2>Alerts Over Time</h2>
      <ResponsiveContainer width="95%" height={400}>
        <LineChart data={parsedData}>
          <XAxis dataKey="timestamp" tickFormatter={timeStr => new Date(timeStr).toLocaleDateString()} />
          <YAxis />
          <Tooltip contentStyle={{ backgroundColor: isDarkMode ? 'rgba(36, 28, 28, 0.75)' : 'rgba(255, 255, 255, 0.75)', border: 'none', color: isDarkMode ? '#ffffff' : '#000000' }} />
          <Legend verticalAlign="top" height={36} />
          <Line type="monotone" dataKey="flow_id" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

      <h2>Alerts by Severity</h2>
      <ResponsiveContainer width="95%" height={400}>
        <BarChart data={severityArray}>
          <XAxis dataKey="severity" />
          <YAxis />
          <Tooltip contentStyle={{ backgroundColor: isDarkMode ? 'rgba(36, 28, 28, 0.75)' : 'rgba(255, 255, 255, 0.75)', border: 'none', color: isDarkMode ? '#ffffff' : '#000000' }} />
          <Legend verticalAlign="top" height={36} />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <h2>Top 10 Source IPs</h2>
      <ResponsiveContainer width="95%" height={400}>
        <PieChart>
          <Pie data={topSrcIPsArray} dataKey="count" nameKey="src_ip" cx="50%" cy="50%" outerRadius={100}>
            {topSrcIPsArray.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: isDarkMode ? 'rgba(36, 28, 28, 0.75)' : 'rgba(255, 255, 255, 0.75)', border: 'none', color: isDarkMode ? '#ffffff' : '#000000' }} />
          <Legend verticalAlign="top" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default App;
