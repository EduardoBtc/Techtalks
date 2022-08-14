import React from "react";
import videoBackgroud from "./assets/background.mp4";

const main = () => {
    return(
        <div className="Main">
             <video src={videoBackgroud} autoPlay loop muted />
        </div>
    )
}
export default main