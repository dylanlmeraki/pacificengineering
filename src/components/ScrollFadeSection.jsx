import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

export default function ScrollFadeSection({ children, className = "" }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`transition-opacity duration-700 ${
        isVisible ? "opacity-100" : "opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

ScrollFadeSection.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};