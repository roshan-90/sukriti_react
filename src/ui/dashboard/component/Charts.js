import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { PieChart, Pie, Sector, Cell } from "recharts";
import { dashboardStyle } from "../../../jsStyles/Style";

export function NoAxisLineChart(props) {
  // Check if props and its required properties exist
  if (!props) {
    return null;
  }
  return (
    <div style={{}}>
      {/* <ResponsiveContainer width="100%" height="100%"> */}
      <LineChart width={200} height={50} data={props.data}>
        <Line
          type="monotone"
          dataKey="all"
          dot={false}
          stroke="#8884d8"
          strokeWidth={2}
        />
      </LineChart>
      {/* </ResponsiveContainer> */}
    </div>
  );
}

const COLORS = [
  dashboardStyle.colorCodes.mwc,
  dashboardStyle.colorCodes.fwc,
  dashboardStyle.colorCodes.pwc,
  dashboardStyle.colorCodes.mur,
];

export function HalfPieChart(props) {
  // Check if props and its required properties exist
  if (!props) {
    return null;
  }

  return (
    <ResponsiveContainer width="95%" height="95%">
      <PieChart>
        <Pie
          data={props?.data}
          cx="50%"
          cy="100%"
          startAngle={180}
          endAngle={0}
          innerRadius={100}
          outerRadius={160}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {props?.data?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

export function FullLineChart(props) {
  // Check if props and its required properties exist
  if (!props) {
    return null;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={910}
        height={200}
        data={props?.data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dot={false}
          dataKey="all"
          stroke={dashboardStyle.colorCodes.total}
        />
        <Line
          type="monotone"
          dot={false}
          dataKey="mwc"
          stroke={dashboardStyle.colorCodes.mwc}
        />
        <Line
          type="monotone"
          dot={false}
          dataKey="fwc"
          stroke={dashboardStyle.colorCodes.fwc}
        />
        <Line
          type="monotone"
          dot={false}
          dataKey="pwc"
          stroke={dashboardStyle.colorCodes.pwc}
        />
        <Line
          type="monotone"
          dot={false}
          dataKey="mur"
          stroke={dashboardStyle.colorCodes.mur}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

const BWTCOLORS = [dashboardStyle.colorCodes.bwt];

export function BWTHalfPieChart(props) {
  // Check if props and its required properties exist
  if (!props) {
    return null;
  }
  return (
    <ResponsiveContainer width="95%" height="95%">
      <PieChart>
        <Pie
          data={props?.data}
          cx="50%"
          cy="100%"
          startAngle={180}
          endAngle={0}
          innerRadius={100}
          outerRadius={160}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {props?.data?.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={BWTCOLORS[index % BWTCOLORS.length]}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

export function BWTFullLineChart(props) {
  // Check if props and its required properties exist
  if (!props) {
    return null;
  }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={910}
        height={200}
        data={props?.data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dot={false}
          dataKey="all"
          stroke={dashboardStyle.colorCodes.total}
        />
        <Line
          type="monotone"
          dot={false}
          dataKey="bwt"
          stroke={dashboardStyle.colorCodes.bwt}
        />
        {/* <Line type="monotone" dot={false} dataKey="fwc" stroke={dashboardStyle.colorCodes.fwc} />
        <Line type="monotone" dot={false} dataKey="pwc" stroke={dashboardStyle.colorCodes.pwc} />
        <Line type="monotone" dot={false} dataKey="mur" stroke={dashboardStyle.colorCodes.mur} /> */}
      </LineChart>
    </ResponsiveContainer>
  );
}
