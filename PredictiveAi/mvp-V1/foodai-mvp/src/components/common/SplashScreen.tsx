import React, { useState, useEffect } from "react";
import "./SplashScreen.css";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out after 3.5 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 3500);

    // Complete after fade animation (3.5s + 0.6s)
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4100);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`splash-screen ${fadeOut ? "fade-out" : ""}`}>
      <div className="splash-content">
        <svg
          className="splash-logo"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 380 84.64"
        >
          {/* K */}
          <path
            className="logo-letter letter-k"
            fill="#1b263b"
            d="M0,83.2V0h12.19v83.2H0ZM7.38,56.72l1.05-11.6c6.01,0,11.21-1.26,15.59-3.78,4.37-2.52,7.98-5.92,10.81-10.2,2.83-4.28,4.94-9.1,6.33-14.47,1.39-5.37,2.08-10.93,2.08-16.67h12.07c0,7.38-1.08,14.47-3.22,21.27-2.15,6.8-5.27,12.86-9.38,18.19s-9.12,9.54-15.06,12.63c-5.94,3.09-12.7,4.63-20.27,4.63ZM45.12,83.2l-21.09-40.55,10.55-5.98,24.73,46.52h-14.18Z"
          />
          {/* First o (with eye) */}
          <path
            className="logo-letter letter-o"
            fill="#1b263b"
            d="M54.73,53.98c0-16.92,12.36-30.12,30.36-30.12s30.36,13.2,30.36,30.12-12.36,30.12-30.36,30.12-30.36-13.08-30.36-30.12ZM85.08,72.46c11.16,0,18.12-8.52,18.12-18.48s-6.96-18.6-18.12-18.6-18.24,8.64-18.24,18.6,7.08,18.48,18.24,18.48Z"
          />
          {/* Second o (without eye) */}
          <path
            className="logo-letter letter-o2"
            fill="#1b263b"
            d="M119.73,53.98c0-16.92,12.36-30.12,30.36-30.12s30.36,13.2,30.36,30.12-12.36,30.12-30.36,30.12-30.36-13.08-30.36-30.12ZM150.08,72.46c11.16,0,18.12-8.52,18.12-18.48s-6.96-18.6-18.12-18.6-18.24,8.64-18.24,18.6,7.08,18.48,18.24,18.48Z"
          />
          {/* k (lowercase) */}
          <g
            className="logo-letter letter-k2"
            transform="translate(185, 23.74) scale(0.72)"
          >
            <path
              fill="#1b263b"
              d="M0,82.46V0h12.19v82.46H0ZM7.38,55.98l1.05-11.6c6.01,0,11.21-1.26,15.59-3.78,4.37-2.52,7.98-5.92,10.81-10.2,2.83-4.28,4.94-9.1,6.33-14.47,1.39-5.37,2.08-10.93,2.08-16.67h12.07c0,7.38-1.08,14.47-3.22,21.27-2.15,6.8-5.27,12.86-9.38,18.19s-9.12,9.54-15.06,12.63c-5.94,3.09-12.7,4.63-20.27,4.63ZM45.12,82.46l-21.09-40.55,10.55-5.98,24.73,46.52h-14.18Z"
            />
          </g>
          {/* i */}
          <path
            className="logo-letter letter-i"
            fill="#1b263b"
            d="M270.77,12.29c0-4.2,3.24-7.2,7.44-7.2s7.44,3,7.44,7.2-3.24,7.2-7.44,7.2-7.44-3-7.44-7.2ZM272.21,27.04h12v57.6h-12V27.04Z"
          />
          {/* A (green) */}
          <path
            className="logo-letter letter-a"
            fill="#00c796"
            d="M326.81,2.33h3.48l38.76,82.32h-13.68l-8.4-18.24h-37.2l-8.28,18.24h-13.44L326.81,2.33ZM341.69,54.88l-13.32-29.16-13.32,29.16h26.64Z"
          />
          {/* Eye group - in first o */}
          <g className="eye-group">
            <circle
              className="eye-pupil"
              fill="#1b263b"
              cx="85.08"
              cy="53.98"
              r="9.7"
            />
            <circle
              className="eye-reflex"
              fill="#f3f4f6"
              cx="87.83"
              cy="50.83"
              r="3.15"
            />
          </g>
        </svg>

        <p className="splash-tagline">L'IA au service de la restauration</p>
      </div>
    </div>
  );
};

export default SplashScreen;
