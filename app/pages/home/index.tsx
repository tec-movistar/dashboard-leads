import React from "react";
import Nav from "../../components/Nav/Nav";
import LoaderSpinner from "../../components/LoaderSpinner/LoaderSpinner";


function Home() {
  return (
    <div className="container">
      <Nav />
      <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', height: '100vh', width: '90%'}}>
        <LoaderSpinner />
      </div>
    </div>
  );
}

export default Home;