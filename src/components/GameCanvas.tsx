import { useRef, useEffect, useState } from 'react';

interface GameCanvasProps {
  gameStarted: boolean;
  onGameWin: (score: number) => void;
}

export const GameCanvas = ({ gameStarted, onGameWin }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [progress, setProgress] = useState(0);
  const gameStateRef = useRef({
    animationFrame: 0,
    camera: { x: 0, y: 0 },
    particles: [] as any[],
    gameWon: false,
    keys: {} as Record<string, boolean>,
    
    player: {
      x: 100,
      y: 300,
      width: 70,
      height: 55,
      velX: 0,
      velY: 0,
      jumping: false,
      grounded: false,
      direction: 1,
      animFrame: 0,
      invulnerable: 0
    },

    owner: {
      x: 50,
      y: 290,
      width: 45,
      height: 70,
      animFrame: 0
    },

    rose: {
      x: 3200,
      y: 250,
      width: 35,
      height: 45,
      collected: false,
      sparkles: [] as any[]
    },

    platforms: [
      // Ground platforms
      {x: 0, y: 400, width: 250, height: 100, type: 'grass'},
      {x: 300, y: 400, width: 180, height: 100, type: 'grass'},
      {x: 530, y: 400, width: 220, height: 100, type: 'grass'},
      {x: 800, y: 400, width: 180, height: 100, type: 'grass'},
      {x: 1030, y: 400, width: 200, height: 100, type: 'grass'},
      {x: 1280, y: 400, width: 180, height: 100, type: 'grass'},
      {x: 1510, y: 400, width: 220, height: 100, type: 'grass'},
      {x: 1780, y: 400, width: 180, height: 100, type: 'grass'},
      {x: 2010, y: 400, width: 200, height: 100, type: 'grass'},
      {x: 2260, y: 400, width: 180, height: 100, type: 'grass'},
      {x: 2490, y: 400, width: 220, height: 100, type: 'grass'},
      {x: 2760, y: 400, width: 500, height: 100, type: 'grass'},
      
      // Floating platforms
      {x: 350, y: 320, width: 120, height: 25, type: 'wood'},
      {x: 600, y: 280, width: 120, height: 25, type: 'wood'},
      {x: 900, y: 320, width: 100, height: 25, type: 'wood'},
      {x: 1150, y: 250, width: 120, height: 25, type: 'wood'},
      {x: 1400, y: 320, width: 100, height: 25, type: 'wood'},
      {x: 1650, y: 220, width: 130, height: 25, type: 'wood'},
      {x: 1900, y: 290, width: 100, height: 25, type: 'wood'},
      {x: 2150, y: 200, width: 120, height: 25, type: 'wood'},
      {x: 2400, y: 320, width: 100, height: 25, type: 'wood'},
      {x: 2650, y: 280, width: 120, height: 25, type: 'wood'}
    ],

    gummyClusters: [
      {x: 370, y: 290, collected: false, sparkles: []},
      {x: 620, y: 250, collected: false, sparkles: []},
      {x: 920, y: 290, collected: false, sparkles: []},
      {x: 1170, y: 220, collected: false, sparkles: []},
      {x: 1420, y: 290, collected: false, sparkles: []},
      {x: 1670, y: 190, collected: false, sparkles: []},
      {x: 1920, y: 260, collected: false, sparkles: []},
      {x: 2170, y: 170, collected: false, sparkles: []},
      {x: 2420, y: 290, collected: false, sparkles: []},
      {x: 2670, y: 250, collected: false, sparkles: []},
      {x: 2900, y: 370, collected: false, sparkles: []},
      {x: 3000, y: 370, collected: false, sparkles: []}
    ],

    hairGelBottles: [
      {x: 450, y: 370, sparks: []},
      {x: 720, y: 370, sparks: []},
      {x: 1100, y: 370, sparks: []},
      {x: 1580, y: 370, sparks: []},
      {x: 2080, y: 370, sparks: []},
      {x: 2580, y: 370, sparks: []}
    ],

    clouds: [
      {x: 200, y: 50, size: 80, speed: 0.2},
      {x: 500, y: 80, size: 60, speed: 0.15},
      {x: 800, y: 40, size: 100, speed: 0.25},
      {x: 1200, y: 70, size: 70, speed: 0.18},
      {x: 1600, y: 45, size: 90, speed: 0.22},
      {x: 2000, y: 85, size: 65, speed: 0.16},
      {x: 2400, y: 55, size: 85, speed: 0.24}
    ]
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      gameStateRef.current.keys[e.key] = true;
      e.preventDefault();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      gameStateRef.current.keys[e.key] = false;
      e.preventDefault();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (!gameStarted) {
      // Reset game state
      const state = gameStateRef.current;
      setScore(0);
      setLives(3);
      setProgress(0);
      state.gameWon = false;
      state.player.x = 100;
      state.player.y = 300;
      state.player.velX = 0;
      state.player.velY = 0;
      state.player.invulnerable = 0;
      state.camera.x = 0;
      state.rose.collected = false;
      state.rose.sparkles = [];
      state.particles = [];
      state.gummyClusters.forEach(cluster => {
        cluster.collected = false;
        cluster.sparkles = [];
      });
      state.hairGelBottles.forEach(bottle => bottle.sparks = []);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const createParticle = (x: number, y: number, color: string, velX = 0, velY = 0, life = 60) => ({
      x, y, color, velX, velY, life, maxLife: life, size: Math.random() * 4 + 2
    });

    const updateParticles = () => {
      gameStateRef.current.particles = gameStateRef.current.particles.filter(p => {
        p.x += p.velX;
        p.y += p.velY;
        p.velY += 0.1;
        p.life--;
        return p.life > 0;
      });
    };

    const drawParticles = () => {
      gameStateRef.current.particles.forEach(p => {
        const alpha = p.life / p.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    const drawPlayer = () => {
      const { player, animationFrame, camera } = gameStateRef.current;
      
      ctx.save();
      
      if (player.invulnerable > 0 && Math.floor(animationFrame / 5) % 2) {
        ctx.globalAlpha = 0.5;
      }
      
      const centerX = player.x + player.width / 2;
      if (player.direction === -1) {
        ctx.scale(-1, 1);
        ctx.translate(-centerX * 2, 0);
      }

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.beginPath();
      ctx.ellipse(player.x + player.width/2, player.y + player.height + 5, player.width/2, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Body
      ctx.fillStyle = '#daa520';
      ctx.fillRect(player.x, player.y + 25, player.width - 15, 25);
      
      // Head
      ctx.fillStyle = '#8b4513';
      ctx.fillRect(player.x + 40, player.y, 30, 30);
      
      // White markings
      ctx.fillStyle = '#fff';
      ctx.fillRect(player.x + 43, player.y + 3, 24, 20);
      ctx.fillRect(player.x + 5, player.y + 28, 25, 18);
      
      // Nose
      ctx.fillStyle = '#000';
      ctx.fillRect(player.x + 65, player.y + 15, 4, 3);
      
      // Eyes
      ctx.fillRect(player.x + 45, player.y + 8, 3, 3);
      ctx.fillRect(player.x + 58, player.y + 8, 3, 3);
      
      // Legs with animation
      const legOffset = Math.sin(animationFrame * 0.3) * 2;
      ctx.fillStyle = '#daa520';
      ctx.fillRect(player.x + 8, player.y + 40 + legOffset, 10, 15);
      ctx.fillRect(player.x + 25, player.y + 40 - legOffset, 10, 15);
      ctx.fillRect(player.x + 42, player.y + 40 + legOffset, 10, 15);
      ctx.fillRect(player.x + 55, player.y + 40 - legOffset, 10, 15);

      // Tail wagging
      const tailWag = Math.sin(animationFrame * 0.4) * 10;
      ctx.fillStyle = '#8b4513';
      ctx.fillRect(player.x - 8 + tailWag, player.y + 20, 12, 4);

      ctx.restore();
    };

    const drawOwner = () => {
      const { owner, gameWon, camera } = gameStateRef.current;
      if (gameWon && camera.x > 200) return;
      
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.beginPath();
      ctx.ellipse(owner.x + owner.width/2, owner.y + owner.height + 5, owner.width/2, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Dress
      ctx.fillStyle = '#ff69b4';
      ctx.fillRect(owner.x + 5, owner.y + 35, owner.width - 10, 35);
      
      // Head
      ctx.fillStyle = '#ffdbac';
      ctx.fillRect(owner.x + 8, owner.y + 5, 30, 32);
      
      // Hair
      ctx.fillStyle = '#ff6347';
      ctx.fillRect(owner.x + 3, owner.y, 40, 20);
      
      // Eyes
      ctx.fillStyle = '#000';
      ctx.fillRect(owner.x + 13, owner.y + 15, 3, 3);
      ctx.fillRect(owner.x + 28, owner.y + 15, 3, 3);
      
      // Smile
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(owner.x + 23, owner.y + 22, 8, 0.2, Math.PI - 0.2);
      ctx.stroke();
    };

    const drawPlatforms = () => {
      gameStateRef.current.platforms.forEach(platform => {
        if (platform.type === 'grass') {
          ctx.fillStyle = '#228b22';
          ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
          
          // Grass blades
          ctx.fillStyle = '#32cd32';
          for (let i = 0; i < platform.width; i += 10) {
            const grassHeight = Math.sin(i * 0.1 + gameStateRef.current.animationFrame * 0.05) * 3 + 5;
            ctx.fillRect(platform.x + i, platform.y - grassHeight, 2, grassHeight);
          }
        } else {
          ctx.fillStyle = '#deb887';
          ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        }
      });
    };

    const drawGummyClusters = () => {
      gameStateRef.current.gummyClusters.forEach(cluster => {
        if (cluster.collected) return;
        
        // Add sparkles
        if (Math.random() < 0.3) {
          cluster.sparkles.push({
            x: cluster.x + Math.random() * 20,
            y: cluster.y + Math.random() * 20,
            life: 30,
            size: Math.random() * 3 + 1
          });
        }
        
        // Update sparkles
        cluster.sparkles = cluster.sparkles.filter((sparkle: any) => {
          sparkle.life--;
          sparkle.y -= 1;
          return sparkle.life > 0;
        });
        
        // Draw sparkles
        cluster.sparkles.forEach((sparkle: any) => {
          ctx.fillStyle = `rgba(255, 255, 255, ${sparkle.life / 30})`;
          ctx.fillRect(sparkle.x, sparkle.y, sparkle.size, sparkle.size);
        });
        
        // Main cluster
        ctx.fillStyle = '#ff1493';
        ctx.fillRect(cluster.x, cluster.y, 18, 18);
        ctx.fillStyle = '#ff69b4';
        ctx.fillRect(cluster.x + 3, cluster.y + 3, 12, 12);
        ctx.fillStyle = '#ffb6c1';
        ctx.fillRect(cluster.x + 6, cluster.y + 6, 6, 6);
      });
    };

    const drawHairGelBottles = () => {
      gameStateRef.current.hairGelBottles.forEach(bottle => {
        // Add danger sparks
        if (Math.random() < 0.2) {
          bottle.sparks.push({
            x: bottle.x + Math.random() * 25,
            y: bottle.y + Math.random() * 35,
            life: 20,
            velX: (Math.random() - 0.5) * 2,
            velY: Math.random() * -2
          });
        }
        
        // Update sparks
        bottle.sparks = bottle.sparks.filter((spark: any) => {
          spark.x += spark.velX;
          spark.y += spark.velY;
          spark.life--;
          return spark.life > 0;
        });
        
        // Draw sparks
        bottle.sparks.forEach((spark: any) => {
          ctx.fillStyle = `rgba(255, 0, 0, ${spark.life / 20})`;
          ctx.fillRect(spark.x, spark.y, 2, 2);
        });
        
        // Bottle
        ctx.fillStyle = '#4169e1';
        ctx.fillRect(bottle.x, bottle.y, 25, 35);
        
        // Cap
        ctx.fillStyle = '#000080';
        ctx.fillRect(bottle.x + 5, bottle.y - 5, 15, 8);
        
        // Label
        ctx.fillStyle = '#fff';
        ctx.fillRect(bottle.x + 3, bottle.y + 10, 19, 15);
        ctx.fillStyle = '#000';
        ctx.font = '8px Arial';
        ctx.fillText('GEL', bottle.x + 7, bottle.y + 20);
      });
    };

    const drawRose = () => {
      const { rose } = gameStateRef.current;
      if (rose.collected) return;
      
      // Add magical sparkles
      if (Math.random() < 0.4) {
        rose.sparkles.push({
          x: rose.x + Math.random() * 35,
          y: rose.y + Math.random() * 45,
          life: 40,
          size: Math.random() * 4 + 2,
          color: `hsl(${Math.random() * 60 + 300}, 100%, ${Math.random() * 30 + 70}%)`
        });
      }
      
      // Update sparkles
      rose.sparkles = rose.sparkles.filter((sparkle: any) => {
        sparkle.life--;
        sparkle.y -= 2;
        sparkle.x += Math.sin(sparkle.life * 0.1) * 0.5;
        return sparkle.life > 0;
      });
      
      // Draw sparkles
      rose.sparkles.forEach((sparkle: any) => {
        ctx.fillStyle = sparkle.color;
        ctx.globalAlpha = sparkle.life / 40;
        ctx.fillRect(sparkle.x, sparkle.y, sparkle.size, sparkle.size);
      });
      ctx.globalAlpha = 1;
      
      // Stem
      ctx.fillStyle = '#228b22';
      ctx.fillRect(rose.x + 15, rose.y + 20, 8, 30);
      
      // Rose petals
      const petals = 12;
      for (let layer = 0; layer < 3; layer++) {
        const radius = 18 - layer * 4;
        for (let i = 0; i < petals; i++) {
          const angle = (i * Math.PI * 2) / petals + layer * 0.3;
          const x = rose.x + 18 + Math.cos(angle) * radius;
          const y = rose.y + 15 + Math.sin(angle) * radius;
          ctx.fillStyle = `rgba(255, 255, 255, ${0.9 - layer * 0.2})`;
          ctx.fillRect(x, y, 6 - layer, 6 - layer);
        }
      }
      
      // Center
      ctx.fillStyle = '#fffacd';
      ctx.fillRect(rose.x + 15, rose.y + 12, 8, 8);
    };

    const drawClouds = () => {
      gameStateRef.current.clouds.forEach(cloud => {
        cloud.x -= cloud.speed;
        if (cloud.x < -cloud.size) {
          cloud.x = 3500;
        }
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.size / 2, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.size / 3, cloud.y, cloud.size / 3, 0, Math.PI * 2);
        ctx.arc(cloud.x - cloud.size / 3, cloud.y, cloud.size / 3, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const update = () => {
      const state = gameStateRef.current;
      if (state.gameWon) return;
      
      state.animationFrame++;
      
      if (state.player.invulnerable > 0) {
        state.player.invulnerable--;
      }

      // Player movement
      if (state.keys['ArrowLeft']) {
        state.player.velX = Math.max(state.player.velX - 0.8, -7);
        state.player.direction = -1;
      } else if (state.keys['ArrowRight']) {
        state.player.velX = Math.min(state.player.velX + 0.8, 7);
        state.player.direction = 1;
      } else {
        state.player.velX *= 0.85;
      }

      // Jumping
      if (state.keys[' '] && state.player.grounded) {
        state.player.velY = -18;
        state.player.jumping = true;
        state.player.grounded = false;
        
        // Jump particles
        for (let i = 0; i < 8; i++) {
          state.particles.push(createParticle(
            state.player.x + state.player.width / 2 + (Math.random() - 0.5) * 20,
            state.player.y + state.player.height,
            '#90EE90',
            (Math.random() - 0.5) * 4,
            Math.random() * -3 - 1,
            30
          ));
        }
      }

      if (!state.keys[' '] && state.player.velY < 0) {
        state.player.velY *= 0.6;
      }

      // Apply gravity
      state.player.velY = Math.min(state.player.velY + 0.8, 15);

      // Update position
      state.player.x += state.player.velX;
      state.player.y += state.player.velY;

      // Platform collision
      state.player.grounded = false;
      for (let platform of state.platforms) {
        if (state.player.x < platform.x + platform.width &&
            state.player.x + state.player.width > platform.x &&
            state.player.y + state.player.height > platform.y &&
            state.player.y + state.player.height < platform.y + platform.height + 25) {
          
          if (state.player.velY > 0) {
            state.player.y = platform.y - state.player.height;
            state.player.velY = 0;
            state.player.grounded = true;
            state.player.jumping = false;
          }
        }
      }

      // Collect gummy clusters
      let currentScore = score;
      for (let cluster of state.gummyClusters) {
        if (!cluster.collected &&
            state.player.x < cluster.x + 20 &&
            state.player.x + state.player.width > cluster.x &&
            state.player.y < cluster.y + 20 &&
            state.player.y + state.player.height > cluster.y) {
          
          cluster.collected = true;
          currentScore += 10;
          setScore(currentScore);
          
          // Collection particles
          for (let i = 0; i < 15; i++) {
            state.particles.push(createParticle(
              cluster.x + 10,
              cluster.y + 10,
              '#FF69B4',
              (Math.random() - 0.5) * 6,
              (Math.random() - 0.5) * 6,
              40
            ));
          }
        }
      }

      // Hazard collision
      if (state.player.invulnerable <= 0) {
        for (let bottle of state.hairGelBottles) {
          if (state.player.x < bottle.x + 25 &&
              state.player.x + state.player.width > bottle.x &&
              state.player.y < bottle.y + 35 &&
              state.player.y + state.player.height > bottle.y) {
            
            const newLives = lives - 1;
            setLives(newLives);
            state.player.invulnerable = 120;
            
            // Damage particles
            for (let i = 0; i < 20; i++) {
              state.particles.push(createParticle(
                state.player.x + state.player.width / 2,
                state.player.y + state.player.height / 2,
                '#FF0000',
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8,
                50
              ));
            }
            
            // Knockback
            state.player.velX = bottle.x > state.player.x ? -8 : 8;
            state.player.velY = -10;
            
            if (newLives <= 0) {
              // Reset game
              setTimeout(() => {
                setLives(3);
                setScore(0);
                state.player.x = 100;
                state.player.y = 300;
                state.player.velX = 0;
                state.player.velY = 0;
                state.player.invulnerable = 0;
                state.camera.x = 0;
                state.particles = [];
                state.gummyClusters.forEach(cluster => {
                  cluster.collected = false;
                  cluster.sparkles = [];
                });
              }, 1000);
            }
          }
        }
      }

      // Rose collection
      if (!state.rose.collected &&
          state.player.x < state.rose.x + state.rose.width &&
          state.player.x + state.player.width > state.rose.x &&
          state.player.y < state.rose.y + state.rose.height &&
          state.player.y + state.player.height > state.rose.y) {
        
        state.rose.collected = true;
        
        // Rose collection particles
        for (let i = 0; i < 30; i++) {
          state.particles.push(createParticle(
            state.rose.x + state.rose.width / 2,
            state.rose.y + state.rose.height / 2,
            '#FFFFFF',
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            80
          ));
        }
      }

      // Win condition
      if (state.rose.collected && state.player.x <= state.owner.x + 100 && state.player.x >= state.owner.x - 50) {
        state.gameWon = true;
        onGameWin(currentScore);
        
        // Victory particles
        for (let i = 0; i < 50; i++) {
          state.particles.push(createParticle(
            state.player.x + state.player.width / 2,
            state.player.y + state.player.height / 2,
            ['#FFD700', '#FF69B4', '#FFFFFF'][Math.floor(Math.random() * 3)],
            (Math.random() - 0.5) * 12,
            Math.random() * -8 - 2,
            100
          ));
        }
      }

      // Pitfall detection
      if (state.player.y > 550) {
        const newLives = lives - 1;
        setLives(newLives);
        state.player.invulnerable = 60;
        
        if (newLives <= 0) {
          setLives(3);
          setScore(0);
          state.gummyClusters.forEach(cluster => {
            cluster.collected = false;
            cluster.sparkles = [];
          });
        }
        
        // Respawn
        state.player.x = Math.max(100, state.camera.x);
        state.player.y = 200;
        state.player.velX = 0;
        state.player.velY = 0;
      }

      // Camera
      const targetCameraX = state.player.x - 300;
      state.camera.x += (targetCameraX - state.camera.x) * 0.1;
      if (state.camera.x < 0) state.camera.x = 0;
      if (state.camera.x > 2500) state.camera.x = 2500;

      // Update progress
      const progressValue = Math.min((state.player.x / 3200) * 100, 100);
      setProgress(progressValue);

      updateParticles();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Sky gradient
      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGradient.addColorStop(0, '#87CEEB');
      skyGradient.addColorStop(0.3, '#FFD700');
      skyGradient.addColorStop(0.7, '#FF8C42');
      skyGradient.addColorStop(1, '#FF6B35');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Sun
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(150 - gameStateRef.current.camera.x * 0.1, 80, 40, 0, Math.PI * 2);
      ctx.fill();

      // Save context for camera
      ctx.save();
      ctx.translate(-gameStateRef.current.camera.x, 0);

      drawClouds();
      drawPlatforms();
      drawOwner();
      drawPlayer();
      drawGummyClusters();
      drawHairGelBottles();
      drawRose();
      drawParticles();

      ctx.restore();
      
      // Rose trail effect
      if (gameStateRef.current.rose.collected) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        for (let i = 0; i < 10; i++) {
          const x = gameStateRef.current.player.x - gameStateRef.current.camera.x + Math.sin(gameStateRef.current.animationFrame * 0.1 + i) * 20;
          const y = gameStateRef.current.player.y + Math.cos(gameStateRef.current.animationFrame * 0.1 + i) * 10;
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const gameLoop = () => {
      if (!gameStarted || gameStateRef.current.gameWon) return;
      
      update();
      draw();
      
      animationId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [gameStarted, score, lives, onGameWin]);

  return (
    <div className="relative">
      <canvas 
        ref={canvasRef}
        width={900}
        height={500}
        className="block"
      />
      
      {/* Game UI */}
      <div className="absolute top-4 left-4 text-white text-xl font-bold z-10 bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>🍬</span>
            <span>Gummy Clusters: {score}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-400">❤️</span>
            <span>Lives: {lives}</span>
          </div>
        </div>
        <div className="mt-2">
          <div className="bg-white/20 h-2 rounded-full w-48">
            <div 
              className="bg-accent h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};