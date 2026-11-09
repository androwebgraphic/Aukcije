import { useEffect, useRef } from "react";
import lottie from "lottie-web";
import animationData from "../assets/lottiefiles/menHighFive.json";

export default function MenHighFive(props) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const instance = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: animationData,
    });

    return () => instance.destroy();
  }, []);

  return <div ref={containerRef} style={props.style} />;
}