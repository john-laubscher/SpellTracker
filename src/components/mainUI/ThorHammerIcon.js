import * as React from "react";
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as ThorHammerSvg } from "./thor-hammer.svg";

const ThorHammerIcon = (props) => (
  <SvgIcon {...props} component={ThorHammerSvg} inheritViewBox />
);

export default ThorHammerIcon;

