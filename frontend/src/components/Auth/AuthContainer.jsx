import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Auth.css";

function AuthContainer({ children, isSignIn = false }) {
  const location = useLocation();
  const [transitionStage, setTransitionStage] = useState("enter");
  const [prevLocation, setPrevLocation] = useState(location);

  useEffect(() => {
    if (prevLocation.pathname !== location.pathname) {
      setTransitionStage("exit");
      
      const timer = setTimeout(() => {
        setPrevLocation(location);
        setTransitionStage("enter");
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [location, prevLocation]);

  return (
    <div className={`auth-container ${transitionStage}`}>
      <div className="vintage-corner corner-tl"></div>
      <div className="vintage-corner corner-tr"></div>
      
      <div className="auth-content">
        <div className="auth-background">
          <div className="floating-element floating-1"></div>
          <div className="floating-element floating-2"></div>
          <div className="floating-element floating-3"></div>
        </div>
        
        <div className="auth-box">
          <div className="auth-box-inner">
            {children}
          </div>
        </div>
      </div>
      
      <div className="vintage-corner corner-bl"></div>
      <div className="vintage-corner corner-br"></div>
    </div>
  );
}

export default AuthContainer;