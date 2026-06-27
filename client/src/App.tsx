"use client";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./lib/apollo";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import WorkspacePage from "./pages/WorkspacePage";
import ReviewDetailPage from "./pages/ReviewDetailPage";
import LoginPage from "./pages/LoginPage";
function Guard({ children }: { children: React.ReactNode }) {
  return localStorage.getItem("token") ? <>{children}</> : <Navigate to="/login" replace/>;
}
export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ style:{background:"#1e293b",color:"#fff",border:"1px solid #334155"} }}/>
        <Routes>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/workspace/:id" element={<Guard><WorkspacePage/></Guard>}/>
          <Route path="/review/:id" element={<Guard><ReviewDetailPage/></Guard>}/>
          <Route path="*" element={<Navigate to="/login" replace/>}/>
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}
