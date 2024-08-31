import React from 'react';
import ReportCoverImage from '../../assets/img/brand/Report-Cover-Image.png';


const ReportCover = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${ReportCoverImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: '100%',
        height: '120vh',
        position: 'relative',
        padding: '5px'
      }}
    >
      <div style={{ 
        position: 'absolute',
        bottom: '20px',
        right: '70px',
        color: 'white',
        textAlign: 'center'
      }}>
        <h4 style={{ margin: 0 }}>Report Generated at:</h4>
        <h4 style={{ margin: 0 }}>21-08-2024</h4>
        <h4 style={{ margin: 0 }}>Report Duration:</h4>
        <h4 style={{ margin: 0 }}>04-06-2024 - 31-07-2024</h4>
      </div>
    </div>
  );
};

export default ReportCover;
