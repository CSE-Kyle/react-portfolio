import React from "react";
import contactPagePicture from "../../../static/assets/images/auth/login.jpg";

export default function () {
  return (
    <div className="content-page-wrapper">
      <div
        className="left-column"
        style={{
          background: "url(" + contactPagePicture + ") no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <div className="right-column">
        My name is Kyle Deguzman and I'm an aspiring Front-End Developer. I've
        built projects mainly focusing on React.js with a variety of npm
        packages (moment.js, react-modal, etc.). I'm currently searching for an
        opportunity for making a difference wherever I can!
      </div>
    </div>
  );
}
