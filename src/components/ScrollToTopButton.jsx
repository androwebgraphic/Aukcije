import { MdOutlineVerticalAlignTop } from "react-icons/md";

function ScrollToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Omogućuje glatko klizanje prema vrhu
    });
  };

  return (
    <button onClick={scrollToTop} style={{backgroundColor:'azure',  position:'fixed', bottom: '2rem', right: '5rem', borderRadius:'50%', border:'none'}}>
      <MdOutlineVerticalAlignTop
        size={35}
        color={'blue'}

      />
    </button>
  );
}

export default ScrollToTopButton;