// Elementos da DOM
const videoEl = document.getElementById('webcam');
const canvas3D = document.getElementById('three-canvas');
const scoreEl = document.getElementById('deviation-score');
const inferencesFeed = document.getElementById('inferences-feed');

// Variáveis Globais de Estado
let maskMesh;
let isRedacted = false;
let currentInferences = new Set();

// --- SETUP THREE.JS (A Malha 3D) ---
const scene = new THREE.Scene();
// Câmera ajustada para encaixar bem sobre a webcam
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2.5;

const renderer = new THREE.WebGLRenderer({ canvas: canvas3D, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Criamos um Icosaedro (parece uma malha tecnológica) para ser a máscara
const geometry = new THREE.IcosahedronGeometry(0.5, 1);
const material = new THREE.MeshBasicMaterial({ 
    color: 0x00e5ff, 
    wireframe: true, 
    transparent: true, 
    opacity: 0.8 
});
maskMesh = new THREE.Mesh(geometry, material);
scene.add(maskMesh);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// --- SETUP MEDIAPIPE (O Rastreador) ---
const faceMesh = new FaceMesh({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
});

faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

faceMesh.onResults(onResults);

const cameraMP = new Camera(videoEl, {
    onFrame: async () => {
        await faceMesh.send({ image: videoEl });
    },
    width: 1280,
    height: 720
});
cameraMP.start();

// --- A LÓGICA DE DETECÇÃO E JULGAMENTO ---
function onResults(results) {
    if (isRedacted) return; // Se o evento de viés estiver ativo, congela

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];

        // 1. Mapear Rosto para o 3D (Nariz é o ponto 1)
        const nose = landmarks[1];
        
        // CORREÇÃO DO ESPELHAMENTO: Adicionamos um sinal de MENOS (-) no cálculo do Eixo X
        maskMesh.position.x = -(nose.x - 0.5) * 3;
        maskMesh.position.y = -(nose.y - 0.5) * 2;

        // Calcular Rotação (Olho esquerdo 33, Olho direito 263)
        const leftEye = landmarks[33];
        const rightEye = landmarks[263];
        
        const roll = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
        
        // CORREÇÃO DO ESPELHAMENTO: Invertemos o Yaw (rotação horizontal)
        const yaw = -(nose.x - 0.5) * Math.PI; 
        const pitch = (nose.y - 0.5) * -Math.PI;

        // CORREÇÃO DO ESPELHAMENTO: Invertemos o Roll (inclinação da cabeça)
        maskMesh.rotation.z = roll; 
        maskMesh.rotation.y = yaw;
        maskMesh.rotation.x = pitch;

        // 2. Extrair "Gatilhos" Físicos
        const mouthTop = landmarks[13].y;
        const mouthBottom = landmarks[14].y;
        const mouthOpen = (mouthBottom - mouthTop) > 0.03;
        const headTilted = Math.abs(roll) > 0.2;

        // 3. Atualizar a UI (Julgamento Fake)
        updateInferences(mouthOpen, headTilted, Math.abs(yaw) > 0.3);
    }
}

function updateInferences(mouthOpen, headTilted, headTurned) {
    let deviation = 15; // Base
    let newInferences = [];

    if (mouthOpen) {
        deviation += 35;
        newInferences.push("<span class='alert-red'>AGRESSIVIDADE VOCAL: DETECTADA</span>");
    }
    if (headTilted) {
        deviation += 25;
        newInferences.push("<span class='alert-red'>NÍVEL DE COOPERAÇÃO: BAIXO</span>");
    }
    if (headTurned) {
        deviation += 20;
        newInferences.push("<span class='alert-red'>ÍNDICE DE CONFIANÇA: SUSPEITO</span>");
    }

    if (newInferences.length === 0) {
        newInferences.push("<span class='alert-cyan'>PADRÃO ADEQUADO</span>");
    }

    // Atualiza Número Gigante
    scoreEl.innerText = `${deviation}%`;
    scoreEl.style.color = deviation > 40 ? '#ff1744' : '#00e5ff';
    
    // Atualiza cor da máscara 3D (Fica vermelha se o desvio for alto)
    maskMesh.material.color.setHex(deviation > 40 ? 0xff1744 : 0x00e5ff);

    // CORREÇÃO DO PAINEL DIREITO: Agora os textos vão pipocar na tela corretamente!
    const htmlContent = newInferences.map(inf => `<div class="inference-item">${inf}</div>`).join('');
    if (inferencesFeed.innerHTML !== htmlContent) {
        inferencesFeed.innerHTML = htmlContent;
    }
}

// --- EVENTO DE VIÉS (CLÍMAX DA APRESENTAÇÃO) ---
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();
        isRedacted = true;
        document.body.classList.add('redacted');
        scoreEl.innerText = "100%";
        scoreEl.style.color = '#ff1744';
        maskMesh.material.color.setHex(0xff1744);
        // Retorna ao normal após 7 segundos
        setTimeout(() => {
            isRedacted = false;
            document.body.classList.remove('redacted');
        }, 7000);
    }
});

// Ajuste de redimensionamento da janela
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});