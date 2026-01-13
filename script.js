document.addEventListener("DOMContentLoaded", () => {

    /* ===================== SCROLL REVEAL ===================== */
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add("active");
        });
    }, { threshold: 0.15 });
    reveals.forEach(el => observer.observe(el));

    /* ===================== THEME TOGGLE ===================== */
    const toggle = document.getElementById("theme-toggle");
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
        document.body.classList.add("light");
        toggle.textContent = "☀️";
    }

    toggle.addEventListener("click", () => {
        document.body.classList.toggle("light");
        const isLight = document.body.classList.contains("light");
        toggle.textContent = isLight ? "☀️" : "🌙";
        localStorage.setItem("theme", isLight ? "light" : "dark");
    });

    /* ===================== SPRINGY FAB CARD + FLOATING CONTENT + SOUND ===================== */
    const cards = document.querySelectorAll(".fab-card");
    const hoverSound = document.getElementById("hover-sound");

    cards.forEach(card => {
        const inner = card.querySelectorAll("h3, p, span");

        // --- Targets and velocity ---
        let targetRotateX = 0, targetRotateY = 0;
        let currentRotateX = 0, currentRotateY = 0;
        let velocityRotateX = 0, velocityRotateY = 0;

        let targetTranslateX = 0, targetTranslateY = 0;
        let currentTranslateX = 0, currentTranslateY = 0;
        let velocityTranslateX = 0, velocityTranslateY = 0;

        let targetInnerX = 0, targetInnerY = 0;
        let currentInnerX = 0, currentInnerY = 0;
        let velocityInnerX = 0, velocityInnerY = 0;

        const stiffness = 0.15; 
        const damping = 0.65; 
        const maxTilt = 12; 
        const maxTranslate = 20; 
        const innerOffset = 6; 

        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const midX = rect.width / 2;
            const midY = rect.height / 2;

            targetRotateX = ((y - midY) / midY) * maxTilt;
            targetRotateY = ((x - midX) / midX) * maxTilt;

            targetTranslateX = ((x / rect.width) - 0.5) * maxTranslate;
            targetTranslateY = ((y / rect.height) - 0.5) * maxTranslate;

            targetInnerX = -((x / rect.width) - 0.5) * innerOffset;
            targetInnerY = -((y / rect.height) - 0.5) * innerOffset;

            card.style.setProperty("--mx", `${(x / rect.width) * 100}%`);
            card.style.setProperty("--my", `${(y / rect.height) * 100}%`);
        });

        card.addEventListener("mouseenter", () => {
            hoverSound.currentTime = 0;
            hoverSound.play();
        });

        card.addEventListener("mouseleave", () => {
            targetRotateX = 0; targetRotateY = 0;
            targetTranslateX = 0; targetTranslateY = 0;
            targetInnerX = 0; targetInnerY = 0;
        });

        function animate() {
            // Tilt
            let forceX = (targetRotateX - currentRotateX) * stiffness;
            velocityRotateX = (velocityRotateX + forceX) * damping;
            currentRotateX += velocityRotateX;

            let forceY = (targetRotateY - currentRotateY) * stiffness;
            velocityRotateY = (velocityRotateY + forceY) * damping;
            currentRotateY += velocityRotateY;

            // Translation
            let forceTX = (targetTranslateX - currentTranslateX) * stiffness;
            velocityTranslateX = (velocityTranslateX + forceTX) * damping;
            currentTranslateX += velocityTranslateX;

            let forceTY = (targetTranslateY - currentTranslateY) * stiffness;
            velocityTranslateY = (velocityTranslateY + forceTY) * damping;
            currentTranslateY += velocityTranslateY;

            // Inner elements
            let forceIX = (targetInnerX - currentInnerX) * stiffness;
            velocityInnerX = (velocityInnerX + forceIX) * damping;
            currentInnerX += velocityInnerX;

            let forceIY = (targetInnerY - currentInnerY) * stiffness;
            velocityInnerY = (velocityInnerY + forceIY) * damping;
            currentInnerY += velocityInnerY;

            card.style.transform = `
                perspective(1000px)
                translateX(${currentTranslateX}px) translateY(${currentTranslateY}px)
                rotateX(${-currentRotateX}deg) rotateY(${currentRotateY}deg)
                translateZ(12px)
            `;

            inner.forEach(el => {
                el.style.transform = `translateX(${currentInnerX}px) translateY(${currentInnerY}px)`;
            });

            requestAnimationFrame(animate);
        }

        animate();
    });
});
