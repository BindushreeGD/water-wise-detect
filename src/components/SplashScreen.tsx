import { useEffect, useState } from "react";
import waterLogo from "@/assets/water-logo.png";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for fade out animation
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 bg-gradient-hero flex items-center justify-center z-50 transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="text-center">
        <div className="mb-8 transform transition-transform duration-1000 scale-100 hover:scale-105">
          <img
            src={waterLogo}
            alt="Water Wise Detect Logo"
            className="w-32 h-32 mx-auto drop-shadow-2xl"
          />
        </div>
        <h1 className="text-4xl font-bold text-primary-foreground mb-4 animate-pulse">
          Water Wise Detect
        </h1>
        <p className="text-primary-foreground/80 text-lg">
          Discover the hidden water footprint of everyday items
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;