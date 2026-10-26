import { MdOutlineVerticalAlignTop } from "react-icons/md";

function ScrollToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Omogućuje glatko klizanje prema vrhu
    });
  };

  return (
    <button onClick={scrollToTop} style={{backgroundColor:'azure', borderRadius:'50%', border:'none',float:"right", position:"fixed"}}>
      <MdOutlineVerticalAlignTop
        size={35}
        color={'blue'}

      />
    </button>
  );
}

export default ScrollToTopButton;