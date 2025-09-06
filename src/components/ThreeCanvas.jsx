// src/components/ThreeCanvas.jsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function ThreeCanvas() {
    const mountRef = useRef(null);

    useEffect(() => {
        const currentMount = mountRef.current;

        // --- THE FIX: Use 'let' so we can reassign it in the cleanup function ---
        let renderer;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1e1e1e);

        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        camera.position.set(0, 1.5, 3.5);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        currentMount.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 1, 0);
        controls.enableDamping = true;

        new GLTFLoader().load('/models/character.glb', (gltf) => {
            scene.add(gltf.scene);
        });

        // We need a variable to stop the animation loop on cleanup
        let animationFrameId;

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup function
        return () => {
            cancelAnimationFrame(animationFrameId); // Stop the loop
            window.removeEventListener('resize', handleResize);
            if (renderer) {
                // Safely dispose of the renderer and its context
                renderer.dispose();
                if (renderer.domElement.parentElement) {
                    renderer.domElement.parentElement.removeChild(renderer.domElement);
                }
            }
        };
    }, []);

    return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}

export default ThreeCanvas;