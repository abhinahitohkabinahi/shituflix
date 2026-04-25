const fs = require('fs');
const css = fs.readFileSync('./Netflix/animationstyle.css', 'utf8');

// Replace the specific container prefix with our new class
let newCss = css.replace(/#container netflixintro \[class\*=helper-\]/g, '.helper-lumieres');

// We also need to hide the original N brush effects if we are just extracting lumieres.
// Actually, let's just use the entire original CSS, but change #container netflixintro to .netflixintro
newCss = newCss.replace(/#container netflixintro/g, '.netflixintro');

// We'll append our text styles at the bottom
newCss += `
#netflix-intro-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  z-index: 9999;
}

.letter-text {
  font-family: 'Arial', sans-serif;
  font-size: 400px;
  font-weight: 900;
  color: #e40913;
  line-height: 1;
  z-index: 2;
  text-shadow: 0 0 30px rgba(228, 9, 19, 0.4);
}

.helper-lumieres {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  mix-blend-mode: screen;
  pointer-events: none;
}
`;

fs.writeFileSync('./src/components/ui/NetflixIntro.css', newCss);
