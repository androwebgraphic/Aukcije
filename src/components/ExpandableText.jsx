import { useState } from "react";
export default function ExpandableText({text, maxLength}) {

  const [isExpanded, setIsExpanded] = useState(false)

  if (text.length <= maxLength) {
    return <p>{text}</p>;
  }
  

const displayedText = isExpanded ? text : `${text.substring(0, maxLength)}...`;

  return (
    <p>
      {displayedText}
      <span 
        onClick={() => setIsExpanded(!isExpanded)} 
        style={{ color: 'blue', cursor: 'pointer', marginLeft: '5px' }}
      >
        {isExpanded ? ' Prikaži manje' : '...'}
      </span>
    </p>
  );
}

