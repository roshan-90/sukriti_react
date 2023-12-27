import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "reactstrap";

const styles = {
  errorBoundary: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    flexDirection: "column",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    zIndex: 9999,
  },
  errorImage: {
    width: "300px",
    marginBottom: "20px",
  },
  errorMessage: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#c00",
  },
};

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);

  const goBack = () => {
    window.history.back();
  };

  const componentDidCatch = (error, errorInfo) => {
    // You can log the error or send it to an error reporting service here
    console.error("errorBoundary", error, errorInfo);

    setHasError(true);
    setError(error);
    setErrorInfo(errorInfo);
  };

  if (hasError) {
    return (
      <div style={styles.errorBoundary}>
        <img
          src="https://th.bing.com/th/id/R.63df95953ba78c808a1c6db1c472de86?rik=IwKSr2fTBdyL7g&riu=http%3a%2f%2f1.bp.blogspot.com%2f-1T2uTBQ-5RQ%2fVAxRDK2ApSI%2fAAAAAAAALxA%2fFAkzLN1K_sU%2fs1600%2foops-smiley.jpg&ehk=BXRiBsYtLtwdirD%2fGlwkD7h0S8z3Ntiu11%2beUA1TM%2fg%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1" // Replace with your error image URL
          alt="Error Occurred"
          style={styles.errorImage}
        />
        <p style={styles.errorMessage}>Oops! Something went wrong.</p>
        <p>Error: {error.toString()}</p>
        <pre>{errorInfo.componentStack}</pre>
        <Button
          outline
          color="primary"
          className="px-4"
          style={{
            float: "right",
          }}
          onClick={goBack}
        >
          <i className="fa fa-lock"></i> Go Back
        </Button>
      </div>
    );
  }

  return children;
};

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
