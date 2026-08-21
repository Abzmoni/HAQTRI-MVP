import { useEffect, useState } from "react";
import "./Preloader.css";

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hide preloader when the page is fully loaded
    const handleLoad = () => {
      setTimeout(() => setLoading(false), 300); // small delay so progress bar finishes nicely
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  return (
    <div className={`preloader ${loading ? "" : "hidden"}`} id="preloader">
      <div className="preloader-logo">
        <div className="preloader-logo-icon">H</div>
        <div className="preloader-logo-text">Haqtri</div>
      </div>
      <div className="preloader-progress"></div>
      <p className="preloader-text">Crafting your premium real estate experience</p>
    </div>
  );
}
