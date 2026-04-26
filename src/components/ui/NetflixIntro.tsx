import React, { useEffect } from 'react';
import './NetflixIntro.css';

interface NetflixIntroProps {
  onComplete?: () => void;
  letter?: string;
}

export const NetflixIntro: React.FC<NetflixIntroProps> = ({ onComplete, letter = 'S' }) => {
  useEffect(() => {
    // The animation takes about 3.5 seconds.
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Generate the lamps for the lumieres effect (from the original N animation)
  const renderLamps = () => {
    const lamps = [];
    for (let i = 1; i <= 28; i++) {
      lamps.push(<span key={i} className={`lamp-${i}`} />);
    }
    return lamps;
  };

  return (
    <div id="netflix-intro-container">
      {/* 
        You can edit the letter being displayed by changing the 'letter' prop passed to this component, 
        or by modifying the default value 'D' above. 
      */}
      <div className="netflixintro" data-letter={letter}>
        <div className="letter-text">{letter}</div>
        
        {/* We keep the lumieres from the original N animation to sweep across */}
        <div className="helper-lumieres">
          <div className="effect-lumieres">
            {renderLamps()}
          </div>
        </div>
      </div>
    </div>
  );
};
