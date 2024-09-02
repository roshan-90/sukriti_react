import React from 'react';
import ReportCoverImage from '../../assets/img/brand/Report-Cover-Image.png';


const ReportCover = ({StartDate, EndDate}) => {
  let start_date = formatChange(StartDate);
  let end_date = formatChange(EndDate);
  let today_date = formatChange();

  function formatChange(old_date = null) {
    let date;
    if(old_date){
      date = new Date(old_date);
    } else {
      date = new Date();
    }
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    return formattedDate;
  }

  return (
    <div
      style={{
        backgroundImage: `url(${ReportCoverImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: '100%',
        height: '110vh',
        position: 'relative',
        padding: '5px'
      }}
    >
      <div style={{ 
        position: 'absolute',
        bottom: '20px',
        right: '68px',
        color: 'white',
        textAlign: 'center'
      }}>
        <h4 style={{ margin: 0 }}>Report Generated at:</h4>
        <h4 style={{ margin: 0 }}>{`${today_date}`}</h4>
        <h4 style={{ margin: 0 }}>Report Duration:</h4>
        <h4 style={{ margin: 0 }}>{`${start_date}-${end_date}`}</h4>
      </div>
    </div>
  );
};

export default ReportCover;
