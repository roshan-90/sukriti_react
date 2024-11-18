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
    {dashboardData.flatMap((slideData, index) =>
      slideData.map((item, itemIndex) => (
        <div key={`${index}-${itemIndex}`}>
          <div>
            {/* Single Stats Item per Slide */}
            <h4>Slide {itemIndex}</h4>
            {/* <StatsItem
              name="Usage Stats"
              total={item?.dataSummary?.usage}
              data={item?.dashboardChartData?.usage}
              pieChartData={item?.pieChartData?.usage}
            />
            {user?.user?.userRole === "Super Admin" && (
              <>
                <StatsItem
                  name="Collection Stats"
                  total={item?.dataSummary?.collection}
                  data={item?.dashboardChartData?.collection}
                  pieChartData={item?.pieChartData?.collection}
                />
                <StatsItem
                  name="UPI Stats"
                  total={item?.dataSummary?.upiCollection}
                  data={item?.dashboardChartData?.upiCollection}
                  pieChartData={item?.pieChartData?.upiCollection}
                />
              </>
            )}
            {user?.user?.userRole === "Super Admin" ? (
              <BWTStatsItem
                name="Recycled Water"
                total={item?.bwtdataSummary?.waterRecycled}
                data={item?.bwtdashboardChartData?.waterRecycled}
                pieChartData={item?.bwtpieChartData?.usage}
              />
            ) : null}
            <StatsItem
              name="Feedback Stats"
              total={item?.dataSummary?.feedback}
              data={item?.dashboardChartData?.feedback}
              pieChartData={item?.pieChartData?.feedback}
            /> */}

             {/* Child Carousel */}
             <Carousel
                autoPlay
                interval={1000} // Child carousel interval (1 second)
                infiniteLoop
                showThumbs={false}
                showStatus={false}
                swipeable
              >
                {/* Render StatsItems in the child carousel */}
                <div>
                  <StatsItem
                    name="Usage Stats"
                    total={item?.dataSummary?.usage}
                    data={item?.dashboardChartData?.usage}
                    pieChartData={item?.pieChartData?.usage}
                  />
                </div>
                {user?.user?.userRole === 'Super Admin' && (
                    <div>
                      <StatsItem
                        name="Collection Stats"
                        total={item?.dataSummary?.collection}
                        data={item?.dashboardChartData?.collection}
                        pieChartData={item?.pieChartData?.collection}
                      />
                    </div>
                )}
                 {user?.user?.userRole === 'Super Admin' && (
                    <div>
                      <StatsItem
                        name="UPI Stats"
                        total={item?.dataSummary?.upiCollection}
                        data={item?.dashboardChartData?.upiCollection}
                        pieChartData={item?.pieChartData?.upiCollection}
                      />
                    </div>
                  )}
                {user?.user?.userRole === 'Super Admin' && (
                  <div>
                    <BWTStatsItem
                      name="Recycled Water"
                      total={item?.bwtdataSummary?.waterRecycled}
                      data={item?.bwtdashboardChartData?.waterRecycled}
                      pieChartData={item?.bwtpieChartData?.usage}
                    />
                  </div>
                )}
                <div>
                  <StatsItem
                    name="Feedback Stats"
                    total={item?.dataSummary?.feedback}
                    data={item?.dashboardChartData?.feedback}
                    pieChartData={item?.pieChartData?.feedback}
                  />
                </div>
              </Carousel>
              
          </div>
          <br />
          <br />
          {/* <table
          style={{
            width: "100%",
            fontSize: "14px",
          }}
          className="table table-bordered  pdf-section pagebreak"
        >
          <thead>
            <tr></tr>
            <tr>
              <th colSpan="1" scope="colgroup"></th>
              <th colSpan="5" scope="colgroup">
                Usage
              </th>
              {(user?.user?.userRole == "Super Admin") && (
                <>
                  <th colSpan="5" scope="colgroup">
                    Collection
                  </th>
                  <th colSpan="5" scope="colgroup">
                    Upi
                  </th>
                </>
              )}
              <th colSpan="5" scope="colgroup">
                Feedback
              </th>
              {(user?.user?.userRole == "Super Admin") && (
                <th colSpan="1" scope="colgroup">
                  Recycled
                </th>
              )}
            </tr>
            <tr></tr>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">All</th>
              <th scope="col">MWC</th>
              <th scope="col">FWC</th>
              <th scope="col">PWC</th>
              <th scope="col">MUR</th>
              {(user?.user?.userRole == "Super Admin") && (
                <>
                <th scope="col">All</th>
                <th scope="col">MWC</th>
                <th scope="col">FWC</th>
                <th scope="col">PWC</th>
                <th scope="col">MUR</th>
                <th scope="col">All</th>
                <th scope="col">MWC</th>
                <th scope="col">FWC</th>
                <th scope="col">PWC</th>
                <th scope="col">MUR</th>
                </>
              )}
              <th scope="col">All</th>
              <th scope="col">MWC</th>
              <th scope="col">FWC</th>
              <th scope="col">PWC</th>
              <th scope="col">MUR</th>
              {(user?.user?.userRole == "Super Admin") && (
                <th scope="col">BWT</th>
              )}
            </tr>
          </thead>
          <tbody>
            {item?.dashboardChartData?.usage.map((usage, index) => {
              const rowCount = index + 1; // Adding 1 to start the count from 1
              const shouldBreakPage = rowCount % 15 === 0 && rowCount !== 0; // Break page after every 15 rows

              return (
                <React.Fragment key={index}>
                  <tr key={index}>
                    <td style={{ "font-weight": "bold" }}>{usage.date}</td>
                    <td>{usage.all}</td>
                    <td>{usage.mwc}</td>
                    <td>{usage.fwc}</td>
                    <td>{usage.pwc}</td>
                    <td>{usage.mur}</td>
                    {(user?.user?.userRole == "Super Admin") && (
                      <>
                      
                    <td>
                      {
                        item?.dashboardChartData.collection[index]
                          .all
                      }
                    </td>
                    <td>
                      {
                        item?.dashboardChartData.collection[index]
                          .mwc
                      }
                    </td>
                    <td>
                      {
                        item?.dashboardChartData.collection[index]
                          .fwc
                      }
                    </td>
                    <td>
                      {
                        item?.dashboardChartData.collection[index]
                          .pwc
                      }
                    </td>
                    <td>
                      {
                        item?.dashboardChartData.collection[index]
                          .mur
                      }
                    </td>
                    <td>
                      {
                        item?.dashboardChartData.upiCollection[
                          index
                        ].all
                      }
                    </td>
                    <td>
                      {
                        item?.dashboardChartData.upiCollection[
                          index
                        ].mwc
                      }
                    </td>
                    <td>
                      {
                        item?.dashboardChartData.upiCollection[
                          index
                        ].fwc
                      }
                    </td>
                    <td>
                      {
                        item?.dashboardChartData.upiCollection[
                          index
                        ].pwc
                      }
                    </td>
                    <td>
                      {
                        item?.dashboardChartData.upiCollection[
                          index
                        ].mur
                      }
                    </td>
                      </>
                    )}
                    <td>
                      {typeof item?.dashboardChartData.feedback[
                        index
                      ].all === "number"
                        ? item.dashboardChartData.feedback[
                            index
                          ].all.toFixed(1)
                        : Number(
                          item.dashboardChartData.feedback[index]
                              .all
                          ).toFixed(1)}
                    </td>
                    <td>
                      {typeof item?.dashboardChartData.feedback[
                        index
                      ].mwc === "number"
                        ? item.dashboardChartData.feedback[
                            index
                          ].mwc.toFixed(1)
                        : Number(
                          item.dashboardChartData.feedback[index]
                              .mwc
                          ).toFixed(1)}
                    </td>
                    <td>
                      {typeof item?.dashboardChartData.feedback[
                        index
                      ].fwc === "number"
                        ? item.dashboardChartData.feedback[
                            index
                          ].fwc.toFixed(0)
                        : Number(
                          item.dashboardChartData.feedback[index]
                              .fwc
                          ).toFixed(0)}
                    </td>
                    <td>
                      {typeof item?.dashboardChartData.feedback[
                        index
                      ].pwc === "number"
                        ? item.dashboardChartData.feedback[
                            index
                          ].pwc.toFixed(0)
                        : Number(
                          item.dashboardChartData.feedback[index]
                              .pwc
                          ).toFixed(0)}
                    </td>
                    <td>
                      {typeof item?.dashboardChartData.feedback[
                        index
                      ].mur === "number"
                        ? item.dashboardChartData.feedback[
                            index
                          ].mur.toFixed(0)
                        : Number(
                          item.dashboardChartData.feedback[index]
                              .mur
                          ).toFixed(0)}
                    </td>
                    {(user?.user?.userRole == "Super Admin") && (
                      <td>NA</td>
                    )}
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
          </table> */}
        </div>
      ))
    )}

  </Carousel>
  );
};

const StatsItem = (props) => {
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
        {props.name}
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
        {props.name}
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
