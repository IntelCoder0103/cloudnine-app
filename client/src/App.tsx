import React, { useState } from "react";
import FolderSelection from "./FolderSelection";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Report from "./Report";
import { QueryClientProvider, QueryClient } from "react-query";
const client = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Report />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
