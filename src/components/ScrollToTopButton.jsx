import { MdVerticalAlignTop } from "react-icons/md";

// ScrollToTopButton.jsx example
function ScrollToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button className="scroll-to-top-btn" onClick={scrollToTop}>
     <MdVerticalAlignTop color="#1a3580" size={30}/>
  </button>
  );
}

export default ScrollToTopButton;