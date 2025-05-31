export default function Logo({ size = "large" }) {
    const dimensions = {
      large: { width: "120", height: "120" },
      small: { width: "60", height: "60" }
    };
    
    const dim = dimensions[size];
    
    return (
      <svg width={dim.width} height={dim.height} viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
        {/* Yellow circle background */}
        <circle cx="40" cy="40" r="35" fill="#F5C842"/>
        
        {/* Grid lines */}
        <line x1="20" y1="20" x2="60" y2="20" stroke="#D4A574" strokeWidth="1"/>
        <line x1="20" y1="40" x2="60" y2="40" stroke="#D4A574" strokeWidth="1"/>
        <line x1="20" y1="60" x2="60" y2="60" stroke="#D4A574" strokeWidth="1"/>
        <line x1="20" y1="20" x2="20" y2="60" stroke="#D4A574" strokeWidth="1"/>
        <line x1="40" y1="20" x2="40" y2="60" stroke="#D4A574" strokeWidth="1"/>
        <line x1="60" y1="20" x2="60" y2="60" stroke="#D4A574" strokeWidth="1"/>
        
        {/* Stones in seki pattern */}
        <circle cx="20" cy="20" r="5" fill="#000000"/>
        <circle cx="40" cy="20" r="5" fill="#FFFFFF" stroke="#000000" strokeWidth="1"/>
        <circle cx="60" cy="20" r="5" fill="#000000"/>
        <circle cx="20" cy="40" r="5" fill="#FFFFFF" stroke="#000000" strokeWidth="1"/>
        <circle cx="40" cy="40" r="5" fill="#000000"/>
        <circle cx="60" cy="40" r="5" fill="#FFFFFF" stroke="#000000" strokeWidth="1"/>
        <circle cx="20" cy="60" r="5" fill="#000000"/>
        <circle cx="40" cy="60" r="5" fill="#FFFFFF" stroke="#000000" strokeWidth="1"/>
        <circle cx="60" cy="60" r="5" fill="#000000"/>
      </svg>
    );
  }