import { useEffect, useState } from "react";

// Custom hook to track window size
export default function UseWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    })

    useEffect(() => {
        function handleResize() {
           setWindowSize({
              width: window.innerWidth,
              height: window.innerHeight,
            })
        }
        window.addEventListener("resize", handleResize);
        
        handleResize()
        
        return () => window.removeEventListener("resize", handleResize)
    }, [])
    
    return windowSize;
}