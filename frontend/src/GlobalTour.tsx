import { Tour } from "antd";
import { useTourStore } from "./tourStore";

const GlobalTour = () => {
  const { open, steps, stopTour } = useTourStore();

  return (
    <Tour open={open} onClose={stopTour} steps={steps} 
      onFinish={() => {
        stopTour();
        window.location.reload();
      }}/>
  );
};

export default GlobalTour;
