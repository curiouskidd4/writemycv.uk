import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

const Header = () => {
  const { resumeId } = useParams();

  const [state, setState] = useState({});

  return <div>Temp</div>;
};


export default Header;