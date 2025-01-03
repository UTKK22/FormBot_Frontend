import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFormAnalytics } from "../api/analyticsService";
import styles from "./AnalyticsPage.module.css";
import { close } from "../data/useImportAssets";
import { PieChart } from "react-minimal-pie-chart";
import { useTheme } from "../context/ThemeContext";
const AnalyticsPage = () => {
  const { shareableLink } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getFormAnalytics(shareableLink);
        setAnalytics(data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    fetchAnalytics();
  }, [shareableLink]);

  if (!analytics) {
    return <div>Loading...</div>;
  }

  // Format date as "Jul 17, 3:23 PM"
  const formatDate = (dateString) => {
    const options = {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Date(dateString).toLocaleString("en-US", options);
  };

  // Collect all unique field labels from the submissions
  const fieldLabels = new Set();
  analytics.submissions.forEach((submission) => {
    submission.userResponses.forEach((response) => {
      fieldLabels.add(response.label);
    });
  });
  const handleform = () => {
    navigate("/form");
  };
  const headers = ["Sr no.", "Submitted At", ...fieldLabels];

  return (
    <div
      className={`${styles.analyticsContainer} ${
        isDarkMode ? "" : styles.lightContainer
      }`}
    >
      <header
        style={isDarkMode ? {} : { filter: "invert(1)" }}
        className={styles.header}
      >
        <div className={styles.button_container}>
          <button
            style={{ cursor: "pointer" }}
            onClick={handleform}
            className={`${styles.button} ${styles.active}`}
          >
            Flow
          </button>
          <button
            style={{ cursor: "pointer" }}
            className={`${styles.button} ${styles.active}`}
          >
            Response
          </button>
        </div>
        <div className={styles.button}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              alignContent: "center",
              padding: "8px 9px",
            }}
          >
            Light
            <div
              onClick={toggleTheme}
              style={{
                borderRadius: "20px",
                width: "50px",
                height: "20px",
                backgroundColor: isDarkMode
                  ? "rgba(26, 95, 255, 1)"
                  : "rgba(177, 177, 177, 1)",
                display: "flex",
                alignItems: "center",
                justifyContent: isDarkMode ? "flex-end" : "flex-start",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  borderRadius: "50px",
                  backgroundColor: "white",
                  height: "15px",
                  width: "15px",
                }}
              ></div>
            </div>
            Dark
          </div>
          <button className={styles.share}>Share</button>
          <button className={styles.save}>Save</button>
          <img
            src={close}
            alt="close image"
            onClick={() => navigate("/workspace")}
          />
        </div>
      </header>
      <div className={styles.analyticsOverview}>
        <div className={styles.analyticsCard}>
          <p>Views</p>
          <p>{analytics.totalViews}</p>
        </div>
        <div className={styles.analyticsCard}>
          <p>Starts</p>
          <p>{analytics.totalStarts}</p>
        </div>
      </div>
      <table
        className={`${styles.submissionsTable} ${
          isDarkMode ? "" : styles.lighttable
        }`}
      >
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {analytics.submissions.map((submission, submissionIndex) => (
            <tr key={submission._id}>
              <td>{submissionIndex + 1}</td>
              <td>{formatDate(submission.createdAt)}</td>
              {Array.from(fieldLabels).map((label, index) => {
                const response = submission.userResponses.find(
                  (r) => r.label === label
                );
                return (
                  <td key={index}>{response ? response.response : " "}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "7%",
          alignItems: "center",
          gap:"150px",
          position:"relative",
        }}
      >
        <div style={{height:"25%", width:"25%",}}>
          <PieChart
            data={[
              { title: "Uncompleted", value: 75, color: "rgba(144, 144, 144, 1)" },
              { title: "Completed", value: 25, color: "rgba(59, 130, 246, 1)" },
            ]}
            lineWidth={30}
            radius={50}
            segmentsShift={0.4}
            // segmentsStyle={{
            //   stroke: "red",
            //   strokeWidth: 2,  
            // }}
            style={{
              border: isDarkMode
                ? "2px solid rgba(255, 255, 255, 1)"
                : "2px solid black",
              borderRadius: "50%",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              
            }}
            // label={({ dataEntry }) => {
            //   if (dataEntry.title === "Completed") {
            //     return `Completed ${dataEntry.value}`;
            //   }
            //   return ""; 
            // }}
            // labelStyle={{
            //   fontSize: "5px",
            //   fontWeight: "bold",
            //   fill: "white",
            //  textAnchor:"middle",
            //  dominantBaseline: "middle"
            // }}
            // labelPosition={140}
            background="white"
            
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column",color:isDarkMode?"":"black",textAlign:"center" ,position:"absolute",left:"47.7%",top:"17%"}}>
          <p>Completed</p>
          <p>{analytics.completionRate.toFixed(2)}</p>
        </div>
        <div className={styles.completion}>
          <p>Completion rate</p>
          <p>{analytics.completionRate.toFixed(2)}%</p>
        </div>
      </div>
      <div style={{marginTop:"7%",color:isDarkMode?"#18171C":"white"} }>f</div>
    </div>
  );
};

export default AnalyticsPage;
