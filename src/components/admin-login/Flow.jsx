import React, { createContext, useContext, useState } from "react";

const FlowContext = createContext();

export const FlowProvider = ({ children }) => {
  const [flowStep, setFlowStep] = useState("email");
  const [email, setEmail] = useState("");

  const advanceFlow = (nextStep) => {
    setFlowStep(nextStep);
  };

  const saveEmail = (userEmail) => {
    setEmail(userEmail); // Function to save email
  };

  return (
    <FlowContext.Provider value={{ flowStep, advanceFlow, email, saveEmail }}>
      {children}
    </FlowContext.Provider>
  );
};

export const useFlow = () => useContext(FlowContext);
