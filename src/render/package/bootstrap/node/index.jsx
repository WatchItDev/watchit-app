// Require logged
import React from "react";
import DragBar from "@/render/package/components/DragBar";
import Home from "@/render/package/pages/Home";


export default () => {
  return (
    <React.StrictMode>
      <DragBar>
        <Home />
      </DragBar>
    </React.StrictMode>
  )
};
