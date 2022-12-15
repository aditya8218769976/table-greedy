import React, { useEffect, useState, useRef } from "react";
import "../table/Table.css";
import settingIcon from "../assets/settingIcon.svg";
import axios from "axios";

const Table = () => {
  const [myData, setMyData] = useState([]);

  const [draglist, setDragList] = useState(
    ["Date", "Apps", "Clicks", "Requests", "Revenue", "Fill Rate", "CTR"],
    [myData]
  );

  const dragItem = useRef();
  const dragOverItem = useRef();

  const dragStart = (e, position) => {
    dragItem.current = position;
    console.log(e.target.innerHTML);
  };

  const dragEnter = (e, position) => {
    dragOverItem.current = position;
    console.log(e.target.innerHTML);
  };

  const applyDragandDropHandler = (e) => {
    const copyDragListItem = [...draglist];
    const dragItemContent = copyDragListItem[dragItem.current];
    copyDragListItem.splice(dragItem.current, 1);
    copyDragListItem.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;

    console.log(copyDragListItem, "copyDragListItem...");
    setDragList(copyDragListItem);
  };

  useEffect(() => {
    axios
      .get(
        "http://go-dev.greedygame.com/v3/dummy/report?startDate=2021-05-01&endDate=2021-05-03"
      )
      .then((response) => {
        setMyData(response.data.data);
      })
      .catch((error) => {
        console.log(error, "error..");
      });
  }, []);
  console.log(myData, "myData..");

  const rowDeleteHandler = (index) => {
    setMyData(myData.filter((item, i) => i !== index));
  };

  return (
    <div className="table-container">
      <div className="table-wrapper">
        <div>
          <input type="date" />
        </div>
        <div>
          <div className="settingIcon-style">
            <img src={settingIcon} alt="Error" />
            <p>Setting</p>
          </div>
        </div>
      </div>

      <div className="table-dimensions-style">
        <h6>Dimensions and metrics</h6>
        <div className="table-col-list">
          {draglist &&
            draglist.map((item, index) => (
              <li
                key={index}
                onDragStart={(e) => dragStart(e, index)}
                onDragEnter={(e) => dragEnter(e, index)}
                onDragOver={(e) => e.preventDefault()}
                draggable
              >
                {item}
              </li>
            ))}
        </div>
        <div className="table-dimensions-actions">
          <button className="close">Close</button>
          <button
            onClick={() => applyDragandDropHandler()}
            className="apply-change"
          >
            Apply Changes
          </button>
        </div>
      </div>
      {/* bootstrap table */}
      <br />
      <br />

      <table className="table">
        <thead>
          <tr>
            {draglist.map((item, index) => (
              <th key={index} scope="col">
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {draglist &&
            myData.map((item, index) => (
              <tr key={index}>
                <th scope="col">{item.date}</th>
                <th scope="col">{item.app_id}</th>
                <th scope="col">{item.clicks}</th>
                <th scope="col">{item.requests}</th>
                <th scope="col">{item.revenue}</th>
                <th scope="col">{(item.requests / item.responses) * 100}%</th>
                <th scope="col">{(item.clicks / item.impressions) * 100}%</th>
                <th scope="col">
                  <button
                    onClick={() => rowDeleteHandler(index)}
                    className="btn btn-primary"
                  >
                    Delete
                  </button>
                </th>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
