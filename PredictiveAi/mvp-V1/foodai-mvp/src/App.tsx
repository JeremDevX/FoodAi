import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Stocks from "./pages/Stocks";
import Predictions from "./pages/Predictions";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import Recipes from "./pages/Recipes";

import { ToastProvider } from "./context/ToastContext"; // Added import for ToastProvider

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="stocks" element={<Stocks />} />
            <Route path="predictions" element={<Predictions />} />
            <Route path="recipes" element={<Recipes />} />
            <Route path="settings" element={<Settings />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
