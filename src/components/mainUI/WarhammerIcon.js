import * as React from "react";
import SvgIcon from "@mui/material/SvgIcon";

// Simple vertical warhammer silhouette (matches BW flavor better than the default gavel icon).
const WarhammerIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    {/* Scale up to read better inside small IconButton */}
    <g transform="translate(0.3,-0.4) scale(1.18)">
      {/* handle */}
      <path d="M11 9h2v9.5c0 .9-.3 1.8-.9 2.4l-1.1 1.1-1.4-1.4 1-1c.3-.3.4-.7.4-1.1V9Z" />
      {/* grip/butt */}
      <path d="M9.5 21.2c0-.7.6-1.2 1.2-1.2h2.6c.7 0 1.2.6 1.2 1.2V22H9.5v-.8Z" />
      {/* hammer head */}
      <path d="M6 5.2C6 4 7 3 8.2 3h7.6C17 3 18 4 18 5.2V8H6V5.2Z" />
      {/* side caps */}
      <path d="M4 5.8C4 4.8 4.8 4 5.8 4H6v4H5.8C4.8 8 4 7.2 4 6.2v-.4Z" />
      <path d="M18 4h.2C19.2 4 20 4.8 20 5.8v.4C20 7.2 19.2 8 18.2 8H18V4Z" />
      {/* center boss */}
      <path d="M11 5.4c0-.8.6-1.4 1.4-1.4h.2c.8 0 1.4.6 1.4 1.4v.2c0 .8-.6 1.4-1.4 1.4h-.2c-.8 0-1.4-.6-1.4-1.4v-.2Z" />
    </g>
  </SvgIcon>
);

export default WarhammerIcon;
