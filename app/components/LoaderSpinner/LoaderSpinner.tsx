import React from "react";

import styles from "./LoaderSpinner.module.css";
import { CircularProgress } from "@mui/material";


function LoaderSpinner() {
  return (
    <div className={styles.loaderContainer}>
      <CircularProgress color="secondary" />
    </div>
  );
}

export default LoaderSpinner;