import { useState, useEffect, useRef, useCallback } from "react";

// Persist to localStorage
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        setStoredValue(value);
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(error);
      }
    },
    [key],
  );

  return [storedValue, setValue];
};

// Intersection observer — triggers once when element enters viewport
export const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
};

// Dynamic word cycler
export const useWordCycle = (words, interval = 2800) => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % words.length);
        setVisible(true);
      }, 500);
    }, interval);
    return () => clearInterval(timer);
  }, [words, interval]);

  return [words[index], visible];
};

// Mouse parallax
export const useParallax = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouse({
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
    });
  }, []);

  return [mouse, handleMouseMove];
};

// Scroll position
export const useScrollY = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return scrollY;
};

// Viewport width helper for responsive JS styling
export const useViewport = () => {
  const getWidth = () =>
    typeof window === "undefined" ? 1280 : window.innerWidth;
  const [width, setWidth] = useState(getWidth);

  useEffect(() => {
    const onResize = () => setWidth(getWidth());
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return {
    width,
    isTablet: width <= 1024,
    isMobile: width <= 768,
    isSmallMobile: width <= 480,
  };
};
