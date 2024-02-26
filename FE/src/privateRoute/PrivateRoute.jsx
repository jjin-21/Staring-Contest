import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAccessTokenState } from "@/context/AccessTokenContext";
import ForbiddenAuth from "@/pages/ForbiddenAuth";

export function PrivateRoute({ requireAuth }) {
  const accessToken = useAccessTokenState();
  const [routeEle, setRouteEle] = useState(null);

  useEffect(() => {
    if (requireAuth) {
      setRouteEle(accessToken.accessToken ? <Outlet /> : <ForbiddenAuth />);
    } else {
      setRouteEle(accessToken.accessToken ? <ForbiddenAuth /> : <Outlet />);
    }
  }, [accessToken, requireAuth]);

  return routeEle;
}

export default PrivateRoute;
