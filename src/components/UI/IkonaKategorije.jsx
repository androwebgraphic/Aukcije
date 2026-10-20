// Uvoz ikona za kategorije
import { FaComputer } from "react-icons/fa6";
import { FaArrowTurnUp } from "react-icons/fa6";
import { TbCarSuv } from "react-icons/tb";
import { GiDiamondRing } from "react-icons/gi"; // Ikona za nakit
import { GiPostStamp } from "react-icons/gi";
import { VscTools } from "react-icons/vsc";
import { RiBookShelfLine } from "react-icons/ri";
import { PiHandCoinsBold } from "react-icons/pi";
import { MdWatch } from "react-icons/md";
import { IoImagesOutline } from "react-icons/io5";
import { LiaMotorcycleSolid } from "react-icons/lia";
import { PiVinylRecord } from "react-icons/pi";
import { VscWorkspaceUnknown } from "react-icons/vsc";

export default function IkonaKategorije({nazivIkona}){

    switch(nazivIkona){
        case 'auti':
            return <TbCarSuv size={25} color="#1a3580" />
        case 'satovi':
            return <MdWatch size={25} color="#1a3580" />
        case 'racunala':
        return <FaComputer size={25} color="#473625" />
      case 'nakit':
        return <GiDiamondRing size={25} color="#3a2b09" />
      case 'numizmatika':
        return <PiHandCoinsBold size={25} color="#b2bbb2" />
       case 'beletristika':
        return <RiBookShelfLine size={25} color="#27ec1d" />
       case 'filatelija':
        return <GiPostStamp size={25} color="#27ec1d" />
       case 'lp':
        return <PiVinylRecord size={25} color="#27ec1d" />
      case 'alati':
        return <VscTools size={25} color="#27ec1d" />
          case 'umjetnine':
        return <IoImagesOutline size={25} color="#27ec1d" />
           case 'motori':
        return <LiaMotorcycleSolid size={25} color="#27ec1d" />
     
     
     
     
     
     
        default:
            return <VscWorkspaceUnknown size={25} color="#1a3580" />
    }

  
}