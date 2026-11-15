import { useEffect, useState } from "react";
import { MdVerticalAlignTop } from "react-icons/md";

function ScrollToTopButton() {
  const [vidljiv, setVidljiv] = useState(false);

  useEffect(() => {
    const provjeriPomak = () => setVidljiv(window.scrollY > 200);

    provjeriPomak();
    window.addEventListener("scroll", provjeriPomak, { passive: true });
    return () => window.removeEventListener("scroll", provjeriPomak);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      className={`scroll-to-top-btn${vidljiv ? " is-visible" : ""}`}
      onClick={scrollToTop}
      title="Povratak na vrh"
      aria-label="Povratak na vrh"
      aria-hidden={!vidljiv}
      tabIndex={vidljiv ? 0 : -1}>
      <MdVerticalAlignTop color="#1a3580" size={28} />
    </button>
  );
}

export default ScrollToTopButton;
