import React from "react";

const DefaultFooter = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        position: "fixed",
        left: "0",
        bottom: "0",
        backgroundColor: "#f8f8f8",
        padding: "20px",
        textAlign: "center",
        boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      {" "}
      <span>&copy; 2023-24</span>
      <span className="ml-auto">
        Powered by{" "}
        <a target="_blank" rel="noreferrer" href="https://www.sukriti.ngo/">
          Sukriti Social Pvt. Ltd.
        </a>
      </span>
    </div>
  );
};

export default DefaultFooter;
