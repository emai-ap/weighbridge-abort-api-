import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import useInterval from "./useInterval";
import { useDebouncedEffect } from "./useDebounce";

export const API_URL = "http://192.168.1.57/api/v1/";
export const SOCKET_URL = "http://192.168.1.57";
export const NVR_URL = "http://192.168.1.57/api/v1/nvr/";

const GatePortals = ({ Daily }) => {
  const apiRef = useRef(new AbortController());

  const [isIntervalOn, setisIntervalOn] = useState(true);
  const [PendingDataTable, setPendingDataTable] = useState({
    header_arr: [],
    body_arr: [],
    search: "",
  });

  const getTableData = (search = PendingDataTable.search, date = Daily) => {
    if (!date) return;
    setisIntervalOn(false);
    // console.log(apiRef.current);
    let url =
      SOCKET_URL + ":7021/api/v1/gmr/v2/gate/completed?gate_user=" + "dfc";

    if (search) {
      url += "&search_text=" + search;
    }

    if (date) {
      url += "&date=" + date;
    }
    console.log({ search, date }, "-----");
    axios
      .get(url, {
        signal: apiRef.current.signal,
      })
      .then((res) => {
        // console.log(res);
        setPendingDataTable((prev) => ({
          ...prev,
          body_arr: [...res.data.records[0].totalData],
        }));
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setisIntervalOn(true);
      });
  };

  // useEffect(() => {
  //   apiRef.current = new AbortController();
  //   getTableData();

  //   return () => {
  //     if (apiRef.current) apiRef.current.abort();
  //   };
  // }, [Daily, PendingDataTable.search]);

  useDebouncedEffect(
    () => {
      apiRef.current = new AbortController();
      console.log("called useDebouncedEffect");
      getTableData();
    },
    [Daily, PendingDataTable.search],
    2000,
    () => {
      if (apiRef.current) apiRef.current.abort();
    }
  );

  useInterval(
    () => {
      console.log(apiRef.current);
      if (isIntervalOn) {
        console.log("called useInterval ");
        getTableData();
      } else {
        console.log("interval is stopped");
      }
    },
    isIntervalOn ? 10000 : null
  );

  return (
    <div>
      <input
        value={PendingDataTable.search}
        onChange={(e) => {
          setPendingDataTable((prev) => ({
            ...prev,
            search: e.target.value,
          }));

          // getTableData(e.target.value);
        }}
      />
      <p>{isIntervalOn ? <Running /> : <LoadingIcon />}</p>

      <h4
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1vw",
        }}
      >
        Gate Portal
        <RefreshIcon
          onClick={() => {
            if (isIntervalOn) {
              console.log("api is in running");
              getTableData();
            } else {
              console.log("api is in stopped");
            }
          }}
        />
      </h4>

      <p>
        Data : <b> {PendingDataTable.body_arr.length} </b>
      </p>
      <button
        onClick={() => {
          apiRef.current.abort();
        }}
      >
        cancel
      </button>
    </div>
  );
};

export default GatePortals;

const LoadingIcon = (props) => (
  <svg
    id="L2"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="-10 -10 120 120"
    enableBackground="new 0 0 100 100"
    xmlSpace="preserve"
    width="20px"
    height="20px"
    {...props}
  >
    <circle
      fill="none"
      stroke="orange"
      strokeWidth={12}
      strokeMiterlimit={10}
      cx={50}
      cy={50}
      r={48}
    />
    <line
      fill="none"
      strokeLinecap="round"
      stroke="orange"
      strokeWidth={12}
      strokeMiterlimit={10}
      x1={50}
      y1={50}
      x2={85}
      y2={50.5}
    >
      <animateTransform
        attributeName="transform"
        dur="2s"
        type="rotate"
        from="0 50 50"
        to="360 50 50"
        repeatCount="indefinite"
      />
    </line>
    <line
      fill="none"
      strokeLinecap="round"
      stroke="orange"
      strokeWidth={12}
      strokeMiterlimit={10}
      x1={50}
      y1={50}
      x2={49.5}
      y2={74}
    >
      <animateTransform
        attributeName="transform"
        dur="15s"
        type="rotate"
        from="0 50 50"
        to="360 50 50"
        repeatCount="indefinite"
      />
    </line>
  </svg>
);
const Running = (props) => (
  <svg
    viewBox="-48 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
    fill="lightgreen"
    width="20px"
    height="20px"
    {...props}
  >
    <path d="M272 96c26.51 0 48-21.49 48-48S298.51 0 272 0s-48 21.49-48 48 21.49 48 48 48M113.69 317.47l-14.8 34.52H32c-17.67 0-32 14.33-32 32s14.33 32 32 32h77.45c19.25 0 36.58-11.44 44.11-29.09l8.79-20.52-10.67-6.3c-17.32-10.23-30.06-25.37-37.99-42.61M384 223.99h-44.03l-26.06-53.25c-12.5-25.55-35.45-44.23-61.78-50.94l-71.08-21.14c-28.3-6.8-57.77-.55-80.84 17.14l-39.67 30.41c-14.03 10.75-16.69 30.83-5.92 44.86s30.84 16.66 44.86 5.92l39.69-30.41c7.67-5.89 17.44-8 25.27-6.14l14.7 4.37-37.46 87.39c-12.62 29.48-1.31 64.01 26.3 80.31l84.98 50.17-27.47 87.73c-5.28 16.86 4.11 34.81 20.97 40.09 3.19 1 6.41 1.48 9.58 1.48 13.61 0 26.23-8.77 30.52-22.45l31.64-101.06c5.91-20.77-2.89-43.08-21.64-54.39l-61.24-36.14 31.31-78.28 20.27 41.43c8 16.34 24.92 26.89 43.11 26.89H384c17.67 0 32-14.33 32-32s-14.33-31.99-32-31.99" />
  </svg>
);
const RefreshIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    xmlSpace="preserve"
    width="20px"
    height="20px"
    {...props}
  >
    <path
      style={{
        fill: "#32bea6",
      }}
      d="M0 12C0 5.372 5.373 0 12 0s12 5.372 12 12c0 6.627-5.372 12-12 12-6.627 0-12-5.373-12-12"
    />
    <path
      style={{
        fill: "#f7f7f7",
      }}
      d="M19.388 8.203c-.121-.235-.711-.775-1.706-.285s-.514 1.565-.514 1.565a5.748 5.748 0 1 1-5.771-3.198v1.489s-.004.089.088.145.185 0 .185 0l4.768-2.81s.107-.056.107-.166c0-.091-.107-.155-.107-.155l-4.752-2.794s-.108-.078-.205-.04c-.096.037-.084.168-.084.168v1.596A8.305 8.305 0 0 0 12 20.305a8.306 8.306 0 0 0 7.388-12.102"
    />
  </svg>
);
