import React from "react";
import { useState } from "react";
import Header from "./Header";

const MyComponent = () => {
  const [user, setUser] = useState({ name: "", age: 0 });

  const updateName = (newName) => {
    setUser((prevUser) => ({ ...prevUser, name: newName }));
  };

  return (
    <>
      <Header />
    </>
  );
};

export default MyComponent;
