// Uvoz ikona za kategorije
import { FaComputer } from "react-icons/fa6";
import { TbCarSuv } from "react-icons/tb";
import { GiDiamondRing } from "react-icons/gi"; // Ikona za nakit
import { GiPostStamp } from "react-icons/gi";
import { VscTools } from "react-icons/vsc";
import { RiBookShelfLine } from "react-icons/ri";
import { PiHandCoinsBold } from "react-icons/pi";

export default function IkonaKategorije({nazivIkona}){

    switch(nazivIkona){
        case 'auti':
            return <TbCarSuv size={25} color="#1a3580" />
        case 'box':
            return <VscTools size={25} color="#1a3580" />
        case 'racunala':
        return <FaComputer size={25} color="#ec851d" />
      case 'nakit':
        return <GiDiamondRing size={25 } color="#0fb509"/>
        default:
            return <VscTools size={25} color="#1a3580" />
    }

  
}