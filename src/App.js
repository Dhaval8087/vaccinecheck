import logo from "./logo.svg";
import "./App.css";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormFeedback,
  Badge,
} from "reactstrap";
const App = () => {
  const [count, setCount] = useState(0);
  const [intervalContext] = useState({ interval: null });
  const [pincode, setPincode] = useState("");
  const [intervalSec, setIntervalinSec] = useState(30000);
  const [isIntervalStart, setIsIntervalStart] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [lastSync, setLastSync] = useState("");
  const fetchDate = () => {
    const getDate = new Date();
    const preparedDate = `${getDate.getDate() + 1}-${
      getDate.getMonth() + 1
    }-${getDate.getFullYear()}`;
    fetch(
      `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${pincode}&date=${preparedDate}`
    )
      .then((res) => res.json())
      .then((res) => {
        setLastSync(getLastSync());
        const centers = res.centers;
        if (centers) {
          centers.map(({ address, sessions }) => {
            sessions.map(({ available_capacity, min_age_limit }) => {
              console.log(min_age_limit);
              if (min_age_limit === 18) {
                setCount(available_capacity);
              }
            });
          });
        }
      });
  };

  const getLastSync = () => {
    const currentdate = new Date();
    const datetime =
      "Last Sync: " +
      currentdate.getDate() +
      "/" +
      (currentdate.getMonth() + 1) +
      "/" +
      currentdate.getFullYear() +
      " @ " +
      currentdate.getHours() +
      ":" +
      currentdate.getMinutes() +
      ":" +
      currentdate.getSeconds();
    return datetime;
  };
  const startImterval = () => {
    stopInterval();
    if (pincode) {
      intervalContext.interval = setInterval(fetchDate, intervalSec);
      setInvalid(false);
      setIsIntervalStart(true);
    } else {
      setInvalid(true);
      toast.error("Enter pincode please!");
    }
  };
  const stopInterval = () => {
    if (intervalContext.interval) {
      clearInterval(intervalContext.interval);
      setIsIntervalStart(false);
    }
  };

  return (
    <Container>
      <ToastContainer />
      <Row className="m-5" xs="3">
        <FormGroup>
          <Label for="exampleEmail">Area Code</Label>
          <Input
            placeholder="e.g 390013"
            invalid={invalid}
            onChange={(e) => setPincode(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="exampleEmail">
            Interval in millisecond(default 30 second)
          </Label>
          <Input
            placeholder="1000 ms = 1 second"
            onChange={(e) => setIntervalinSec(e.target.value)}
          />
        </FormGroup>
      </Row>
      <Row xs="3" className="m-5">
        <FormGroup>
          <Button color="primary" onClick={startImterval}>
            Start Interval
          </Button>
          <Button color="danger" className="m-2" onClick={stopInterval}>
            Clear Interval
          </Button>
        </FormGroup>
      </Row>
      <Row xs="3">
        <h1>Total Vaccine Available</h1>
        <Row>
          <h1>{count}</h1>
        </Row>
      </Row>
      <Row>{isIntervalStart && <h3>{lastSync}</h3>}</Row>
    </Container>
  );
};

export default App;
