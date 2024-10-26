let cube = document.querySelector('.cube');
let autoRotateBtn = document.getElementById('autoRotate');
let speedControl = document.getElementById('speed');

let rotationX = 0;
let rotationY = 0;
let autoRotateX = 0;
let autoRotateY = 1;
let isAutoRotating = true;
let isHovering = false;
let previousX = 0;
let previousY = 0;
let rotationSpeed = 1;
let currentSpeed = rotationSpeed;
let mouseX = 0;
let mouseY = 0;

function updateCubeRotation() {
    cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
}

function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

function animate() {
    if (isHovering) {
        // Slow down to a stop when hovering
        currentSpeed = lerp(currentSpeed, 0, 0.2);
        
        // Update rotation based on mouse position relative to cube center
        const cubeRect = cube.getBoundingClientRect();
        const cubeCenterX = cubeRect.left + cubeRect.width / 2;
        const cubeCenterY = cubeRect.top + cubeRect.height / 2;
        
        // Calculate mouse offset from center
        const deltaX = mouseX - cubeCenterX;
        const deltaY = mouseY - cubeCenterY;
        
        // Update rotation based on mouse position
        rotationY += deltaX * 0.02;
        rotationX += deltaY * 0.02;
        
        // Store the last movement direction for auto-rotation
        const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (length > 0) {
            autoRotateX = (deltaY * 0.02);
            autoRotateY = (deltaX * 0.02);
        }
    } else if (isAutoRotating) {
        // Smoothly return to full speed
        currentSpeed = lerp(currentSpeed, rotationSpeed, 0.1);
        rotationX += autoRotateX * currentSpeed;
        rotationY += autoRotateY * currentSpeed;
    }
    
    updateCubeRotation();
    requestAnimationFrame(animate);
}

autoRotateBtn.addEventListener('click', () => {
    isAutoRotating = !isAutoRotating;
    autoRotateBtn.textContent = isAutoRotating ? 'Stop Rotation' : 'Auto Rotate';
});

// Track mouse position
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Hover handling
cube.addEventListener('mouseenter', () => {
    isHovering = true;
});

cube.addEventListener('mouseleave', () => {
    isHovering = false;
});

speedControl.addEventListener('input', (e) => {
    rotationSpeed = e.target.value * 0.2;
    if (!isHovering) {
        currentSpeed = rotationSpeed;
    }
});

// Touch support
let touchStartX = 0;
let touchStartY = 0;

cube.addEventListener('touchstart', (e) => {
    isHovering = true;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    mouseX = touchStartX;
    mouseY = touchStartY;
});

document.addEventListener('touchmove', (e) => {
    if (isHovering) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        e.preventDefault();
    }
});

document.addEventListener('touchend', () => {
    isHovering = false;
});

// Initialize animation
requestAnimationFrame(animate);
