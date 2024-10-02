import React from "react";
import { useState } from "react";
import 

function ProductPage() {
  const [count, setCount] = useState(0);

  const MyComponent = () => {
    const [user, setUser] = useState({ name: "", age: 0 });

    const updateName = (newName) => {
      setUser((prevUser) => ({ ...prevUser, name: newName }));
    };

    return (
      <div>
        <p>Name: {user.name}</p>
        <button onClick={() => updateName("Alice")}>Set Name to Alice</button>
      </div>
    );
  };
}

export default ProductPage;
