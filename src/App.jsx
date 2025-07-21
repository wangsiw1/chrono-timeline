
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Entry from './pages/Entry';
import Timeline from './pages/Timeline';
import Edit from './pages/Edit';

function App() {
  const [timelineData, setTimelineData] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Entry setTimelineData={setTimelineData} />} />
        <Route path="/timeline" element={<Timeline timelineData={timelineData} setTimelineData={setTimelineData} />} />
        <Route path="/edit" element={<Edit timelineData={timelineData} setTimelineData={setTimelineData} />} />
      </Routes>
    </Router>
  );
}

export default App
