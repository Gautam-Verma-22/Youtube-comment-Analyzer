import React, { useState } from "react";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineController, LineElement, PointElement } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

// Register all chart components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement
);

const App = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [data, setData] = useState(null);

  const analyzeComments = async () => {
    try {
      const commentsRes = await axios.post("https://youtube-comment-analyzer-49cl.onrender.com/fetch-comments", { videoUrl });
      const analysisRes = await axios.post("https://youtube-comment-analyzer-49cl.onrender.com/analyze-comments", commentsRes.data);
      setData(analysisRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Chart data configuration
  const chartData = {
    labels: ["Agree", "Disagree", "Neutral"],
    datasets: [{
      label: 'Sentiment Analysis',
      data: data ? [data.agree, data.disagree, data.neutral] : [],
      backgroundColor: ["#4CAF50", "#F44336", "yellow"],
      borderColor: ["#388E3C", "#D32F2F", "yellow"],
      borderWidth: 1
    }]
  };

  return (
    <div className="app-container">
      <div className="input-container">
        <h1>YouTube Comments Sentiment Analyzer</h1>
        <input 
          type="text" 
          placeholder="Enter video URL" 
          value={videoUrl} 
          onChange={(e) => setVideoUrl(e.target.value)} 
        />
        <button onClick={analyzeComments}>Analyze</button>
      </div>

      {data && (
        <div className="analytics-container">
          {/* Top Row - Pie and Line Charts */}
          <div className="chart-row">
            {/* Pie Chart Section */}
            <div className="chart-section">
              <h2 className="chart-title">Pie Chart Analysis</h2>
              <div className="chart-wrapper">
                <Pie 
                  data={chartData} 
                  options={{ 
                    maintainAspectRatio: false,
                    responsive: true
                  }} 
                />
              </div>
              <div className="legend-container">
                {chartData.labels.map((label, index) => (
                  <div key={label} className="legend-item">
                    <span 
                      className="color-box" 
                      style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}
                    ></span>
                    <span>{label}: {chartData.datasets[0].data[index]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Line Chart Section */}
            <div className="chart-section">
              <h2 className="chart-title">Line Chart Analysis</h2>
              <div className="chart-wrapper">
                <Line 
                  data={{
                    labels: chartData.labels,
                    datasets: [{
                      label: 'Sentiment Analysis',
                      data: chartData.datasets[0].data,
                      backgroundColor: chartData.datasets[0].backgroundColor,
                      borderColor: 'white',
                      borderWidth: 2,
                      tension: 0.1,
                      fill: false
                    }]
                  }} 
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }} 
                />
              </div>
              <div className="legend-container">
                {chartData.labels.map((label, index) => (
                  <div key={label} className="legend-item">
                    <span 
                      className="color-box" 
                      style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}
                    ></span>
                    <span>{label}: {chartData.datasets[0].data[index]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row - Bar Chart */}
          <div className="bar-chart-container">
            <h2 className="chart-title">Bar Chart Analysis</h2>
            <div className="chart-wrapper">
              <Bar 
                data={chartData} 
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }} 
              />
            </div>
            <div className="legend-container">
              {chartData.labels.map((label, index) => (
                <div key={label} className="legend-item">
                  <span 
                    className="color-box" 
                    style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}
                  ></span>
                  <span>{label}: {chartData.datasets[0].data[index]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;