import React, { useMemo } from 'react';

const Particles: React.FC = () => {
  const options = useMemo(() => {
    const isLowEnd = window.navigator.hardwareConcurrency <= 4;
    
    return {
      particles: {
        number: {
          value: isLowEnd ? 20 : 80,
          density: {
            enable: true,
            value_area: isLowEnd ? 800 : 800
          }
        },
        color: {
          value: "#0000FF"
        },
        shape: {
          type: isLowEnd ? "circle" : ["circle", "triangle", "square"],
          stroke: {
            width: 0,
            color: "#000000"
          }
        },
        opacity: {
          value: 0.5,
          random: !isLowEnd,
          anim: {
            enable: !isLowEnd,
            speed: 1,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: {
          value: 3,
          random: !isLowEnd,
          anim: {
            enable: !isLowEnd,
            speed: 2,
            size_min: 0.1,
            sync: false
          }
        },
        line_linked: {
          enable: !isLowEnd,
          distance: 150,
          color: "#0000FF",
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: true,
          speed: isLowEnd ? 1 : 2,
          direction: "none",
          random: !isLowEnd,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: {
            enable: !isLowEnd,
            rotateX: 600,
            rotateY: 1200
          }
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: !isLowEnd,
            mode: "grab"
          },
          onclick: {
            enable: !isLowEnd,
            mode: "push"
          },
          resize: true
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: {
              opacity: 1
            }
          },
          push: {
            particles_nb: 4
          }
        }
      },
      retina_detect: !isLowEnd
    };
  }, []);

  return (
    <div>
      {/* Render your particles component here */}
    </div>
  );
};

export default Particles; 