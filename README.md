# 👁️ O Olhar Normativo XR

🔗 **[Testar o Protótipo Ao Vivo (GitHub Pages)](https://SEU-USUARIO.github.io/olhar-normativo-xr/)**

> *"A tecnologia não é neutra. A Visão Computacional não apenas nos vê, ela nos classifica."*

**O Olhar Normativo XR** é um experimento prático e uma ferramenta de design crítico construída para explorar e denunciar os vieses algorítmicos e a exclusão espacial em sistemas de Realidade Estendida (XR) e Visão Computacional.

Este projeto não é apenas um filtro facial; é uma simulação de como sistemas treinados em *datasets* normativos (frequentemente enviesados por raça, gênero e eurocentrismo) falham ao ler corpos fora do padrão de treinamento e, consequentemente, aplicam julgamentos morais automatizados ou excluem o sujeito do espaço digital.

---

## 🚀 O Conceito

Sistemas de IA modernos frequentemente tentam inferir emoções, profissionalismo ou nível de ameaça com base em heurísticas geométricas simples (ex: inclinação da cabeça, distância entre os lábios). 

Este protótipo expõe essa fragilidade:
1. **O Rastreamento é Real:** Usa Machine Learning local para extrair 468 pontos do rosto em tempo real.
2. **O Julgamento é Falso (Porém Realista):** Aplica "inferências algorítmicas" preconceituosas baseadas em movimentos normais, simulando softwares reais de RH e segurança.
3. **A Exclusão Espacial:** Demonstra o que acontece quando o algoritmo não reconhece a biometria do usuário, causando falha na Computação Gráfica (CG) e censura na Realidade Aumentada (AR).

---

## ⚙️ Funcionalidades

- **Mapeamento Biométrico em Tempo Real:** Rastreamento facial a 60FPS direto no navegador, sem processamento em nuvem (Privacy-by-design).
- **Máscara Normativa 3D:** Um Icosaedro renderizado em WebGL que se acopla ao rosto do usuário, reagindo aos eixos Yaw, Pitch e Roll.
- **Painel de Escrutínio Algorítmico:** Uma interface estilo *cyberpunk/surveillance* que exibe falsas métricas de "Índice de Desvio", "Agressividade" e "Nível de Cooperação".
- **O Evento de Viés (Bias Event):** Um gatilho ativado manualmente para simular uma falha crítica de *dataset*, resultando na exclusão visual do usuário da interface.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído focado em alta performance e arquitetura *client-side* pura, sem necessidade de build steps complexos:

* **HTML5, CSS3 & JavaScript (ES6+)** - Estrutura e lógica Vanilla para máxima fluidez.
* **[MediaPipe Face Mesh](https://developers.google.com/mediapipe/solutions/vision/face_landmarker)** - Rede neural leve da Google para extração topológica de 468 *landmarks* faciais.
* **[Three.js](https://threejs.org/)** - Biblioteca WebGL para renderização e manipulação espacial da malha 3D.

---

## 💻 Como Rodar Localmente

Devido às restrições de segurança dos navegadores modernos para o uso da Webcam, o projeto precisa rodar em um servidor local (HTTP), e não abrindo o arquivo direto no navegador (protocolo `file://`).

1. Clone o repositório:
   ```bash
   git clone [https://github.com/SEU-USUARIO/olhar-normativo-xr.git](https://github.com/SEU-USUARIO/olhar-normativo-xr.git)
