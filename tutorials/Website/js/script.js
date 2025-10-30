  // Touch toggle for small screens (<=550px)
  function enableTouchToggles() {
    if (window.innerWidth <= 550) {
      const projects = document.querySelectorAll(
        '.project-spectrum, .project-coding, .project-poster, .project-future'
      );

      projects.forEach(project => {
        // Remove existing to avoid duplicates
        project.removeEventListener('click', project._touchToggleHandler);

        const handler = () => {
          // Close any other open boxes
          projects.forEach(p => {
            if (p !== project) p.classList.remove('show-back');
          });

          // Toggle this one
          project.classList.toggle('show-back');
        };

        project.addEventListener('click', handler);
        project._touchToggleHandler = handler; // store reference
      });
    }
  }

  // Enable on load and on resize
  window.addEventListener('load', enableTouchToggles);
  window.addEventListener('resize', enableTouchToggles);