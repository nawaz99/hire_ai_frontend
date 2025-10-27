import { useState } from "react";

function ReadMoreText({ text, limit = 100 }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => setIsExpanded(!isExpanded);

  const displayText = isExpanded ? text : text.slice(0, limit) + (text.length > limit ? "..." : "");

  return (
    <p>
      {displayText}{" "}
      {text.length > limit && (
        <span
          onClick={toggleReadMore}
          style={{ color: "blue", cursor: "pointer" }}
        >
          {isExpanded ? "Read less" : "Read more"}
        </span>
      )}
    </p>
  );
}


export default ReadMoreText;