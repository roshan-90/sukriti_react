import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Summary from "./Summary";
import Stats from "./Stats";
import ActiveTickets from "./ActiveTickets";
import HealthStatus from "./HealthStatus";
import LiveStatus from "./LiveStatus";
import WaterLevelStatus from "./WaterLevelStatus";
import QuickConfig from "./QuickConfig";
import { statsStyle, whiteSurfaceForScheduler } from "../../jsStyles/Style";
import { colorTheme, whiteSurface } from "../../jsStyles/Style";
import {
  HalfPieChart,
  FullLineChart,
  BWTHalfPieChart,
  BWTFullLineChart,
} from "../dashboard/component/ReportChart";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../features/authenticationSlice";
import "./DashboardComponent.css";
import './TableStyles.css'; // Create a separate CSS file for styles

const DashboardCarousel = ({ dashboardData , parentFrequency }) => {
  const user = useSelector(selectUser);

  if (!dashboardData || dashboardData.length === 0) {
    return <div>No data available</div>;
  }


  return (
    <Carousel
    autoPlay
    interval={parentFrequency.value ?? 10000}
    infiniteLoop
    showThumbs={false}
    showStatus={false}
    swipeable
  >
    {dashboardData?.flatMap((slideData, index) =>
      slideData?.map((item, itemIndex) => (
        <div key={`${index}-${itemIndex}`}>
          <div>
             {/* Child Carousel */}
             <Carousel
                autoPlay
                interval={10000} // Child carousel interval (1 second)
                infiniteLoop
                showThumbs={false}
                showStatus={false}
                swipeable
              >
                {/* Render StatsItems in the child carousel */}
                <div className="stats_class">
                  <StatsItem
                    name="Usage Stats"
                    total={item?.dataSummary?.usage}
                    data={item?.dashboardChartData?.usage}
                    pieChartData={item?.pieChartData?.usage}
                    complex = {item?.complexName}
                  />
                </div>
                {user?.user?.userRole === 'Super Admin' && (
                    <div className="collection_class">
                      <StatsItem
                        name="Collection Stats"
                        total={item?.dataSummary?.collection}
                        data={item?.dashboardChartData?.collection}
                        pieChartData={item?.pieChartData?.collection}
                        complex = {item?.complexName}
                      />
                    </div>
                )}
                 {user?.user?.userRole === 'Super Admin' && (
                    <div className="upi_class">
                      <StatsItem
                        name="UPI Stats"
                        total={item?.dataSummary?.upiCollection}
                        data={item?.dashboardChartData?.upiCollection}
                        pieChartData={item?.pieChartData?.upiCollection}
                        complex = {item?.complexName}
                      />
                    </div>
                  )}
                {user?.user?.userRole === 'Super Admin' && (
                  <div className="recycle_class">
                    <BWTStatsItem
                      name="Recycled Water"
                      total={item?.bwtdataSummary?.waterRecycled}
                      data={item?.bwtdashboardChartData?.waterRecycled}
                      pieChartData={item?.bwtpieChartData?.usage}
                      complex = {item?.complexName}
                    />
                  </div>
                )}
                <div className="feedback_class">
                  <StatsItem
                    name="Feedback Stats"
                    total={item?.dataSummary?.feedback}
                    data={item?.dashboardChartData?.feedback}
                    pieChartData={item?.pieChartData?.feedback}
                    complex = {item?.complexName}
                  />
                </div>
              </Carousel>
              
          </div>
          <br />
          <br />
          {/* Table */}
          {/* <table
          style={{
            width: "100%",
            fontSize: "14px",
          }}
          className="table table-bordered  pdf-section pagebreak"
        >
          <thead>
            <tr>
              <th colSpan="1" scope="colgroup"></th>
              <th colSpan="1" scope="colgroup">
              No. of Uses
              </th>
              {(user?.user?.userRole == "Super Admin") && (
                <>
                  <th colSpan="1" scope="colgroup">
                  Feedback (Out of 5.0)
                  </th>
                  <th colSpan="1" scope="colgroup">
                  Payment Collection (INR)
                  </th>
                </>
              )}
              <th colSpan="1" scope="colgroup">
                Feedback
              </th>
              {(user?.user?.userRole == "Super Admin") && (
                <th colSpan="1" scope="colgroup">
                  Recycled
                </th>
              )}
              <th colSpan="1" scope="colgroup">
                Health Flush
              </th>
              <th colSpan="1" scope="colgroup">
                Health Floor Clean
              </th>
              <th colSpan="1" scope="colgroup">
                Water Level Status
              </th>
              <th colSpan="1" scope="colgroup">
                Live Status
              </th>
              <th colSpan="1" scope="colgroup">
                Recycle Water Level
              </th>
            </tr>
            <tr></tr>
          </thead>
          <tbody>
            <tr>
            <th scope="row">Total</th>
              <td>{item.dataSummary.usage}</td>
              {user?.user?.userRole === "Super Admin" && (
                <>
                  <td>{item.dataSummary.collection}</td>
                  <td>{item.dataSummary.upiCollection}</td>
                </>
              )}
              <td>{item.dataSummary.feedback}</td>
              {user?.user?.userRole === "Super Admin" && <td>{item.bwtdataSummary.waterRecycled}</td>}
              <td>{item.HealthConnectionAggregatedData.mwc.flushHealth} / {item.HealthConnectionAggregatedData.mwc.Total}</td>
              <td>{item.HealthConnectionAggregatedData.mwc.floorCleanHealth} / {item.HealthConnectionAggregatedData.mwc.Total}</td>
              <td>{item.HealthConnectionAggregatedData.mwc.freshWaterLevel} / {item.HealthConnectionAggregatedData.mwc.Total}</td>
              <td>{item.HealthConnectionAggregatedData.mwc.connection_status} / {item.HealthConnectionAggregatedData.mwc.Total}</td>
              <td>{item.HealthConnectionAggregatedData.mwc.recycleWaterLevel} / {item.HealthConnectionAggregatedData.mwc.Total}</td>
              </tr>
              <tr>
              <th scope="row">MWC</th>
                <td>{CalculateMwc(item.dashboardChartData.usage)}</td>
                {user?.user?.userRole === "Super Admin" && (
                  <>
                    <td>{CalculateCollectionMwc(item.dashboardChartData.collection)}</td>
                    <td>{CalculateUpiMwc(item.dashboardChartData.upiCollection)}</td>
                  </>
                )}
                <td>{item.dataSummary.feedback}</td>
                {user?.user?.userRole === "Super Admin" && <td>{item.bwtdataSummary.waterRecycled}</td>}
                <td>{item.HealthConnectionAggregatedData.mwc.flushHealth} / {item.HealthConnectionAggregatedData.mwc.Total}</td>
                <td>{item.HealthConnectionAggregatedData.mwc.floorCleanHealth} / {item.HealthConnectionAggregatedData.mwc.Total}</td>
                <td>{item.HealthConnectionAggregatedData.mwc.freshWaterLevel} / {item.HealthConnectionAggregatedData.mwc.Total}</td>
                <td>{item.HealthConnectionAggregatedData.mwc.connection_status} / {item.HealthConnectionAggregatedData.mwc.Total}</td>
                <td>{item.HealthConnectionAggregatedData.mwc.recycleWaterLevel} / {item.HealthConnectionAggregatedData.mwc.Total}</td>
              </tr>
              <tr>
              <th scope="row">FWC</th>
              <td>{CalculateFwc(item.dashboardChartData.usage)}</td>
                {user?.user?.userRole === "Super Admin" && (
                  <>
                    <td>{CalculateCollectionFwc(item.dashboardChartData.collection)}</td>
                    <td>{CalculateUpiFwc(item.dashboardChartData.upiCollection)}</td>
                  </>
                )}
                <td>{item.dataSummary.feedback}</td>
                {user?.user?.userRole === "Super Admin" && <td>{item.bwtdataSummary.waterRecycled}</td>}
                <td>{item.HealthConnectionAggregatedData.fwc.flushHealth} / {item.HealthConnectionAggregatedData.fwc.Total}</td>
                <td>{item.HealthConnectionAggregatedData.fwc.floorCleanHealth} / {item.HealthConnectionAggregatedData.fwc.Total}</td>
                <td>{item.HealthConnectionAggregatedData.fwc.freshWaterLevel} / {item.HealthConnectionAggregatedData.fwc.Total}</td>
                <td>{item.HealthConnectionAggregatedData.fwc.connection_status} / {item.HealthConnectionAggregatedData.fwc.Total}</td>
                <td>{item.HealthConnectionAggregatedData.fwc.recycleWaterLevel} / {item.HealthConnectionAggregatedData.fwc.Total}</td>
            </tr>
            <tr>
            <th scope="row">PWC</th>
            <td>{CalculatePwc(item.dashboardChartData.usage)}</td>
              {user?.user?.userRole === "Super Admin" && (
                <>
                   <td>{CalculateCollectionPwc(item.dashboardChartData.collection)}</td>
                   <td>{CalculateUpiPwc(item.dashboardChartData.upiCollection)}</td>
                </>
              )}
              <td>{item.dataSummary.feedback}</td>
              {user?.user?.userRole === "Super Admin" && <td> {item.bwtdataSummary.waterRecycled}</td>}
              <td>{item.HealthConnectionAggregatedData.pwc.flushHealth} / {item.HealthConnectionAggregatedData.pwc.Total}</td>
              <td>{item.HealthConnectionAggregatedData.pwc.floorCleanHealth} / {item.HealthConnectionAggregatedData.pwc.Total}</td>
              <td>{item.HealthConnectionAggregatedData.pwc.freshWaterLevel} / {item.HealthConnectionAggregatedData.pwc.Total}</td>
              <td>{item.HealthConnectionAggregatedData.pwc.connection_status} / {item.HealthConnectionAggregatedData.pwc.Total}</td>
              <td>{item.HealthConnectionAggregatedData.pwc.recycleWaterLevel} / {item.HealthConnectionAggregatedData.pwc.Total}</td>
            </tr>
            <tr>
            <th scope="row">MUR</th>
              <td>{CalculateMur(item.dashboardChartData.usage)}</td>
              {user?.user?.userRole === "Super Admin" && (
                <>
                  <td>{CalculateCollectionPwc(item.dashboardChartData.collection)}</td>
                  <td>{CalculateUpiPwc(item.dashboardChartData.upiCollection)}</td>
                </>
              )}
              <td>{item.dataSummary.feedback}</td>
              {user?.user?.userRole === "Super Admin" && <td> {item.bwtdataSummary.waterRecycled}</td>}
              <td>{item.HealthConnectionAggregatedData.mur.flushHealth} / {item.HealthConnectionAggregatedData.mur.Total}</td>
              <td>{item.HealthConnectionAggregatedData.mur.floorCleanHealth} / {item.HealthConnectionAggregatedData.mur.Total}</td>
              <td>{item.HealthConnectionAggregatedData.mur.freshWaterLevel} / {item.HealthConnectionAggregatedData.mur.Total}</td>
              <td>{item.HealthConnectionAggregatedData.mur.connection_status} / {item.HealthConnectionAggregatedData.mur.Total}</td>
              <td>{item.HealthConnectionAggregatedData.mur.recycleWaterLevel} / {item.HealthConnectionAggregatedData.mur.Total}</td> 
            </tr>
          </tbody>
          </table> */}
          <Table item={item}/>
        </div>
      ))
    )}

  </Carousel>
  );
};

const Table = (item) => {
  console.log('item', item?.item);
  
  // usage calculation

  function CalculateMwc(item) {
    let sum = 0;
    for (let i = 0; i < item.length; i++) {
      sum += item[i].mwc;
    }
    return sum;
  }

  function CalculateFwc(item) {
    let sum1 = 0;
    for (let i = 0; i < item.length; i++) {
      sum1 += item[i].fwc;
    }
    return sum1;
  }

  function CalculatePwc(item) {
    let sum2 = 0;
    for (let i = 0; i < item.length; i++) {
      sum2 += item[i].pwc;
    }
    return sum2;
  }

  function CalculateMur(item) {
    let sum3 = 0;
    for (let i = 0; i < item.length; i++) {
      sum3 += item[i].mur;
    }
    return sum3;
  }

  // Collection 
  function CalculateCollectionMwc(item) {
    let sum = 0;
    for (let i = 0; i < item.length; i++) {
      sum += item[i].mwc;
    }
    console.log('sumss',sum);
    return sum;
  }

  function CalculateCollectionFwc(item) {
    let sum1 = 0;
    for (let i = 0; i < item.length; i++) {
      sum1 += item[i].fwc;
    }
    return sum1;
  }

  function CalculateCollectionPwc(item) {
    let sum2 = 0;
    for (let i = 0; i < item.length; i++) {
      sum2 += item[i].pwc;
    }
    return sum2;
  }

  function CalculateCollectionMur(item) {
    let sum3 = 0;
    for (let i = 0; i < item.length; i++) {
      sum3 += item[i].mur;
    }
    return sum3;
  }

   // Upi Collection 
   function CalculateUpiMwc(item) {
    let sum = 0;
    for (let i = 0; i < item.length; i++) {
      sum += item[i].mwc;
    }
    console.log('sumss',sum);
    return sum;
  }

  function CalculateUpiFwc(item) {
    let sum1 = 0;
    for (let i = 0; i < item.length; i++) {
      sum1 += item[i].fwc;
    }
    return sum1;
  }

  function CalculateUpiPwc(item) {
    let sum2 = 0;
    for (let i = 0; i < item.length; i++) {
      sum2 += item[i].pwc;
    }
    return sum2;
  }

  function CalculateUpiMur(item) {
    let sum3 = 0;
    for (let i = 0; i < item.length; i++) {
      sum3 += item[i].mur;
    }
    return sum3;
  }
  
  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
             <th></th>
            <th>No. of Uses</th>
            <th>Feedback (Out of 5.0)</th>
            <th colSpan="2">Payment Collection (INR)</th>
            <th colSpan="2">Working Status<br/>(<span style={{ color: 'red' }}>Not Working </span>/ Total)</th>
            <th>Connectivity Status<br/>(<span style={{ color: 'red' }}>OFFLINE</span> | TOTAL)</th>
            <th colSpan="2">Water Availability<br/>(<span style={{ color: 'red' }}>Not Available</span> |Total)</th>
            <th colSpan="1">Amount of Water<br/>Recycled by REWATER<sup>TM</sup>(L)</th>
          </tr>
          <tr>
            <th></th>
            <th></th>
            <th></th>
            <th>Coin</th>
            <th>UPI</th>
            <th>Flush</th>
            <th>Floor</th>
            <th></th>
            <th>Fresh water</th>
            <th>Recycled water</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="table_body">
          <tr>
            <td className="left-align"> <b>Male Toilets</b></td>
            <td>{CalculateMwc(item?.item?.dashboardChartData.usage)}</td>
            <td>{item?.item?.dataSummary?.feedback}</td>
            <td>{CalculateCollectionFwc(item.item.dashboardChartData.collection)}</td>
            <td>{CalculateUpiMwc(item.item.dashboardChartData.upiCollection)}</td>
            <td><span style={{ color: 'red' }}>{item?.item?.HealthConnectionAggregatedData?.mwc?.flushHealth}</span> / {item.item.HealthConnectionAggregatedData?.mwc?.Total}</td>
            <td><span style={{ color: 'red' }}>{item?.item?.HealthConnectionAggregatedData?.mwc?.floorCleanHealth}</span> / {item.item.HealthConnectionAggregatedData?.mwc?.Total}</td>
            <td><span style={{ color: 'red' }}>{item?.item?.HealthConnectionAggregatedData?.mwc?.connection_status}</span> / {item.item.HealthConnectionAggregatedData?.mwc?.Total}</td>
            <td><span style={{ color: 'red' }}>{item?.item?.HealthConnectionAggregatedData?.mwc?.freshWaterLevel}</span> / {item.item.HealthConnectionAggregatedData?.mwc?.Total}</td>
            <td><span style={{ color: 'red' }}>{item?.item?.HealthConnectionAggregatedData?.mwc?.recycleWaterLevel}</span> / {item.item.HealthConnectionAggregatedData?.mwc?.Total}</td>
            <td>N/A</td>
          </tr>
          <tr>
            <td className="left-align"> <b>Female Toilets</b></td>
            <td>{CalculateFwc(item?.item?.dashboardChartData.usage)}</td>
            <td>{item?.item?.dataSummary?.feedback}</td>
            <td>{CalculateCollectionFwc(item.item.dashboardChartData.collection)}</td>
            <td>{CalculateUpiFwc(item.item.dashboardChartData.upiCollection)}</td>
            <td><span style={{ color: 'red' }}>{item?.item?.HealthConnectionAggregatedData?.fwc?.flushHealth}</span> / {item.item.HealthConnectionAggregatedData?.fwc?.Total}</td>
            <td><span style={{ color: 'red' }}>{item?.item?.HealthConnectionAggregatedData?.fwc?.floorCleanHealth}</span> / {item.item.HealthConnectionAggregatedData?.fwc?.Total}</td>
            <td><span style={{ color: 'red' }}>{item?.item?.HealthConnectionAggregatedData?.fwc?.connection_status}</span> / {item.item.HealthConnectionAggregatedData?.fwc?.Total}</td>
            <td><span style={{ color: 'red' }}>{item?.item?.HealthConnectionAggregatedData?.fwc?.freshWaterLevel}</span>  / {item.item.HealthConnectionAggregatedData?.fwc?.Total}</td>
            <td><span style={{ color: 'red' }}>{item?.item?.HealthConnectionAggregatedData?.fwc?.recycleWaterLevel}</span> / {item.item.HealthConnectionAggregatedData?.fwc?.Total}</td>
            <td>N/A</td>
          </tr>
          <tr>
            <td className="left-align"><b>Disabled Toilets</b></td>
            <td>{CalculatePwc(item?.item?.dashboardChartData.usage)}</td>
            <td>{item?.item?.dataSummary?.feedback}</td>
            <td>{CalculateCollectionPwc(item.item.dashboardChartData.collection)}</td>
            <td>{CalculateUpiPwc(item.item.dashboardChartData.upiCollection)}</td>
            <td><span style={{ color: 'red' }}>{item?.item?.HealthConnectionAggregatedData?.pwc?.flushHealth}</span>  / {item.item.HealthConnectionAggregatedData?.pwc?.Total}</td>
            <td><span style={{ color: 'red' }}>{item?.item?.HealthConnectionAggregatedData?.pwc?.floorCleanHealth}</span> / {item.item.HealthConnectionAggregatedData?.pwc?.Total}</td>
            <td><span style={{ color: 'red' }}>{item?.item?.HealthConnectionAggregatedData?.pwc?.connection_status}</span> / {item.item.HealthConnectionAggregatedData?.pwc?.Total}</td>
            <td><span style={{ color: 'red' }}>{item?.item?.HealthConnectionAggregatedData?.pwc?.freshWaterLevel}</span> / {item.item.HealthConnectionAggregatedData?.pwc?.Total}</td>
            <td><span style={{ color: 'red' }}>{item?.item?.HealthConnectionAggregatedData?.pwc?.recycleWaterLevel}</span> / {item.item.HealthConnectionAggregatedData?.pwc?.Total}</td>
            <td>N/A</td>
          </tr>
          <tr>
            <td className="left-align"><b>Male Urinal</b></td>
            <td>{CalculateMur(item?.item?.dashboardChartData.usage)}</td>
            <td>{item?.item?.dataSummary?.feedback}</td>
            <td>{CalculateCollectionMur(item.item.dashboardChartData.collection)}</td>
            <td>{CalculateUpiMur(item.item.dashboardChartData.upiCollection)}</td>
            <td><span style={{ color: 'red' }}>{item?.item?.HealthConnectionAggregatedData?.mur?.flushHealth}</span> / {item.item.HealthConnectionAggregatedData?.mur?.Total}</td>
            <td><span style={{ color: 'red' }}>{item?.item?.HealthConnectionAggregatedData?.mur?.floorCleanHealth}</span> / {item.item.HealthConnectionAggregatedData?.mur?.Total}</td>
            <td><span style={{ color: 'red' }}>{item?.item?.HealthConnectionAggregatedData?.mur?.connection_status}</span> / {item.item.HealthConnectionAggregatedData?.mur?.Total}</td>
            <td><span style={{ color: 'red' }}>{item?.item?.HealthConnectionAggregatedData?.mur?.freshWaterLevel}</span> / {item.item.HealthConnectionAggregatedData?.mur?.Total}</td>
            <td><span style={{ color: 'red' }}>{item?.item?.HealthConnectionAggregatedData?.mur?.recycleWaterLevel}</span> / {item.item.HealthConnectionAggregatedData?.mur?.Total}</td>
            <td>N/A</td>
          </tr>
          <tr>
            <td className="left-align"><b>Total</b></td>
            <td>{item?.item?.dataSummary?.usage}</td>
            <td>{item?.item?.dataSummary?.feedback}</td>
            <td>{item?.item?.dataSummary?.collection}</td>
            <td>{item?.item?.dataSummary?.upiCollection}</td>
            <td><span style={{ color: 'red' }}>{item?.item?.HealthConnectionAggregatedData?.all?.flushHealth}</span> / {item.item.HealthConnectionAggregatedData?.all?.Total}</td>
            <td><span style={{ color: 'red' }}>{item?.item?.HealthConnectionAggregatedData?.all?.floorCleanHealth}</span> / {item.item.HealthConnectionAggregatedData?.all?.Total}</td>
            <td><span style={{ color: 'red' }}>{item?.item?.HealthConnectionAggregatedData?.all?.connection_status}</span> / {item.item.HealthConnectionAggregatedData?.all?.Total}</td>
            <td><span style={{ color: 'red' }}>{item?.item?.HealthConnectionAggregatedData?.all?.freshWaterLevel}</span> / {item.item.HealthConnectionAggregatedData?.all?.Total}</td>
            <td><span style={{ color: 'red' }}>{item?.item?.HealthConnectionAggregatedData?.all?.recycleWaterLevel}</span> / {item.item.HealthConnectionAggregatedData?.all?.Total}</td>
            <td>{item?.item?.bwtdataSummary?.waterRecycled}</td>
          </tr>
          {/* Add more rows as needed */}
        </tbody>
      </table>
    </div>
  );
};

const StatsItem = (props) => {
  return (
    <div
      className={`stats-item`}
      style={{
        marginTop: "10px",
      }}
    >
      <div
        className="row"
        style={{
          color: `white`,
          width: "98%",
          margin: "auto",
          padding: "10px",
          fontSize: "15px", 
          background: colorTheme.primary,
        }}
      >
        {props.name} {"For "}{props.complex}
      </div>

      <div className="row" style={{ width: "100%", margin: "auto" }}>
        <div className="col-md-4">
          <div
            className="col-md-12"
            style={{
              ...whiteSurface,
              background: "white",
              width: "100%",
              height: "220px",
              padding: "10px",
              display: "flexbox",
              alignItems: "center",
            }}
          >
            <div
              style={{
                height: "180px",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "90%",
                  height: "100%",
                  margin: "auto",
                  fontSize: "12px",
                }}
              >
                <HalfPieChart data={props.pieChartData} />
              </div>
            </div>

            <div
              style={{
                ...statsStyle.pieLabel,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "-30px",
              }}
            >
              {props.total}
            </div>

            <div
              style={{
                ...statsStyle.pieLabel,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {props.name}
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div
            className="col-md-12"
            style={{
              ...whiteSurface,
              background: "white",
              width: "100%",
              height: "220px",
              padding: "10px",
              display: "flexbox",
              alignItems: "center",
              fontSize: "12px",
            }}
          >
            <FullLineChart data={props.data} />
          </div>
        </div>
      </div>
    </div>
  );
};

const BWTStatsItem = (props) => {
  return (
    <div
      className={`stats-item`}
      style={{
        marginTop: "20px",
      }}
    >
      <div
        className="row"
        style={{
          ...statsStyle.elementTitle,
          width: "98%",
          margin: "auto",
          padding: "10px",
          background: colorTheme.primary,
        }}
      >
        {props.name} {"For "}{props.complex}
      </div>

      <div className="row" style={{ width: "100%", margin: "auto" }}>
        <div className="col-md-4">
          <div
            className="col-md-12"
            style={{
              ...whiteSurface,
              background: "white",
              width: "100%",
              height: "220px",
              padding: "10px",
              display: "flexbox",
              alignItems: "center",
            }}
          >
            <div
              style={{
                height: "180px",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ width: "90%", height: "100%", margin: "auto" }}>
                <BWTHalfPieChart data={props.pieChartData} />
              </div>
            </div>

            <div
              style={{
                ...statsStyle.pieLabel,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "-30px",
              }}
            >
              {props.total}
            </div>

            <div
              style={{
                ...statsStyle.pieLabel,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {props.name}
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div
            className="col-md-12"
            style={{
              ...whiteSurface,
              background: "white",
              width: "100%",
              height: "220px",
              padding: "10px",
              display: "flexbox",
              alignItems: "center",
            }}
          >
            <BWTFullLineChart data={props.data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCarousel;
