
// Import styles
import '../style.css';

// Import 3D Scene setup
import { initThreeJS } from './three/scene.js';
import { initUI } from './ui/interactions.js';
import { initVideoCarousel } from './ui/videoCarousel.js';

console.log('Curion Composites App Initialized');

// Initialize 3D Scene (Disabled per user request)
// initThreeJS();

// Initialize UI (Tabs, Animations)
initUI();
initVideoCarousel();
