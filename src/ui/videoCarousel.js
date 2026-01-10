export function initVideoCarousel() {
    const videos = document.querySelectorAll('.hero-video');
    if (videos.length < 2) return;

    let currentIndex = 0;
    const intervalTime = 6000; // Switch every 6 seconds

    setInterval(() => {
        // Remove active class from current
        videos[currentIndex].classList.remove('active');

        // Pause prev video to save resources (optional, but good for performance)
        // videos[currentIndex].pause(); 

        // Update index
        currentIndex = (currentIndex + 1) % videos.length;

        // Add active class to new
        videos[currentIndex].classList.add('active');
        videos[currentIndex].play();

    }, intervalTime);
}
