import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initThreeJS() {
    const canvas = document.querySelector('#bg-canvas');
    if (!canvas) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.02);

    // CAMERA
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 8);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xD32F2F, 5, 100); // Red
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x4444ff, 3, 100); // Tech Blue
    pointLight2.position.set(-5, -2, 5);
    scene.add(pointLight2);

    // GEOMETRY
    const shape = new THREE.Shape();
    const w = 4, h = 6, t = 0.5;
    // I-Beam profile
    shape.moveTo(-w / 2, -h / 2);
    shape.lineTo(w / 2, -h / 2);
    shape.lineTo(w / 2, -h / 2 + t);
    shape.lineTo(t / 2, -h / 2 + t);
    shape.lineTo(t / 2, h / 2 - t);
    shape.lineTo(w / 2, h / 2 - t);
    shape.lineTo(w / 2, h / 2);
    shape.lineTo(-w / 2, h / 2);
    shape.lineTo(-w / 2, h / 2 - t);
    shape.lineTo(-t / 2, h / 2 - t);
    shape.lineTo(-t / 2, -h / 2 + t);
    shape.lineTo(-w / 2, -h / 2 + t);

    const extrudeSettings = { steps: 2, depth: 15, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, bevelSegments: 3 };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();

    const material = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.2,
        metalness: 0.9,
        emissive: 0x111111,
        emissiveIntensity: 0.1
    });

    const profileMesh = new THREE.Mesh(geometry, material);
    profileMesh.rotation.z = Math.PI / 6;
    profileMesh.rotation.x = Math.PI / 10;
    scene.add(profileMesh);

    // ANIMATION LOOP
    const clock = new THREE.Clock();

    // Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    window.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    });

    function animate() {
        requestAnimationFrame(animate);
        const time = clock.getElapsedTime();

        // Idle float
        profileMesh.rotation.y += 0.002;

        // Gentle Parallax
        profileMesh.rotation.x += (mouseY * 0.1 - profileMesh.rotation.x) * 0.05;

        renderer.render(scene, camera);
    }
    animate();

    // SCROLL INTERACTIONS

    // 1. Initial Reveal (Intro)
    const tl = gsap.timeline();
    tl.from(profileMesh.position, { z: -30, duration: 2, ease: "power3.out" })
        .from(profileMesh.rotation, { z: Math.PI, x: Math.PI, duration: 2.5, ease: "power3.out" }, "<");

    // 2. ScrollTrigger - Rotate and Move Away as we scroll
    ScrollTrigger.create({
        trigger: "body", // Whole body tracking for smooth continuous effect
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
            // As user scrolls down, mesh rotates wildly and flies off effectively
            // But let's keep it somewhat visible for the 'Products' section if feasible
            // or just a transition effect.

            // For now, let's just rotate it based on scroll
            const p = self.progress * 5; // Mul 5 for multiple rotations
            profileMesh.rotation.z = (Math.PI / 6) + p;
            profileMesh.rotation.x = (Math.PI / 10) + p * 0.5;

            // Move it slightly to side
            // profileMesh.position.x = Math.sin(p) * 2;
        }
    });

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
