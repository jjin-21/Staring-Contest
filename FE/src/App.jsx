import Home from "@/pages/Home";
import Lobby from "@/pages/Lobby";
import Game from "@/pages/Game";
import Room from "@/pages/Room";
import WebMobileLayout from "@/layouts/WebMobileLayout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AccessTokenProvider } from "@/context/AccessTokenContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "@/privateRoute/PrivateRoute";
import { WebSocketProvider } from "@/context/WebSocketContext";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <ToastContainer stacked pauseOnFocusLoss={false} />
        <AccessTokenProvider>
          <WebSocketProvider>
            <WebMobileLayout>
              <div className="font-maplestory-bold">
                <Routes>
                  <Route element={<PrivateRoute requireAuth={false} />}>
                    <Route path="/" element={<Home />} />
                  </Route>

                  <Route element={<PrivateRoute requireAuth={true} />}>
                    <Route path="/lobby/*" element={<Lobby />} />
                  </Route>
                  <Route element={<PrivateRoute requireAuth={true} />}>
                    <Route path="/room/:sessionId" element={<Room />} />
                  </Route>
                  <Route element={<PrivateRoute requireAuth={true} />}>
                    <Route path="/game/:sessionId" element={<Game />} />
                  </Route>
                </Routes>
              </div>
            </WebMobileLayout>
          </WebSocketProvider>
        </AccessTokenProvider>
      </BrowserRouter>
    </>
  );
}
