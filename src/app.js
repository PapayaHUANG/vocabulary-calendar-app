import React, { useState, createContext } from "react";
import "./app.css";

export const AppContext = createContext({});
function App({ children }) {
  const [appData, setAppData] = useState({
    listPerDay: 3,
    totalList: 30,
    startDate: "4/5",
    planName: "Demo",
  });

  return (
    <AppContext.Provider value={{ appData, setAppData }}>
      {children}
    </AppContext.Provider>
  );
}

export default App;
