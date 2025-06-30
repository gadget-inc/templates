import { useState, useEffect } from "react";

export const LoadingIcon = () => {
  const [step, setStep] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(prevStep => (prevStep < 3 ? prevStep + 1 : 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <svg className="kebab-icon" viewBox="0 0 32 32" width="20" height="20">
      {step >= 1 && <circle cx="8" cy="16" r="2" fill="white"></circle>}
      {step >= 2 && <circle cx="16" cy="16" r="2" fill="white"></circle>}
      {step >= 3 && <circle cx="24" cy="16" r="2" fill="white"></circle>}
    </svg>
  )
}