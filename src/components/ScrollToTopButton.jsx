import { MdOutlineVerticalAlignTop } from "react-icons/md";

function ScrollToTopButton() {
  const scrollToTop = (e) => {
    preventDefault()
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Omogućuje glatko klizanje prema vrhu
    });
  };

  return (
    <button type="button" onClick={scrollToTop} >
      <MdOutlineVerticalAlignTop
        size={35}
        color={'blue'}

      />
    </button>
  );
}

export default ScrollToTopButton;