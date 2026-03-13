"use client";

import { Canvas } from "@react-three/fiber";
import { Float, Html, Line, OrbitControls, Stars } from "@react-three/drei";
import { useMemo, useState } from "react";

type ToolNode = {
  name: string;
  logo: string;
  color: string;
  position: [number, number, number];
};

const TOOL_NODES: ToolNode[] = [
  { name: "HTML", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", color: "#f97316", position: [-1.6, 1.8, -0.5] },
  { name: "CSS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", color: "#3b82f6", position: [-0.9, -1.8, 0.65] },
  { name: "JavaScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", color: "#eab308", position: [0.05, 2.0, 1.1] },
  { name: "Next.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", color: "#a1a1aa", position: [0.9, 0.9, -0.95] },
  { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", color: "#22c55e", position: [1.65, -1.35, 0.3] },
  { name: "Express", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg", color: "#d4d4d8", position: [0.3, -2.0, -1.1] },
  { name: "Laravel", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg", color: "#ef4444", position: [-1.3, 2.2, 0.45] },
  { name: "PHP", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg", color: "#8b5cf6", position: [-1.95, 0.0, 0.25] },
  { name: "MySQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg", color: "#0ea5e9", position: [1.2, 2.0, 0.9] },
  { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", color: "#38bdf8", position: [-0.7, -1.6, -0.1] },
  { name: "Docker", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", color: "#06b6d4", position: [0.1, -1.75, 1.0] },
  { name: "GitHub", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", color: "#94a3b8", position: [1.9, 1.5, -0.2] },
  { name: "Bootstrap", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg", color: "#a855f7", position: [-1.05, 0.5, 0.95] },
  { name: "Bulma", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bulma/bulma-plain.svg", color: "#22c55e", position: [-0.25, 1.9, -0.85] },
  { name: "PuTTY", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/putty/putty-original.svg", color: "#facc15", position: [1.7, 0.3, -0.85] },
  { name: "FileZilla", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/filezilla/filezilla-plain.svg", color: "#ef4444", position: [0.55, -0.85, 1.45] },
  { name: "Postman", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg", color: "#fb923c", position: [1.0, -1.6, 1.15] },
];

const CONNECTIONS: Array<[number, number]> = [
  [0, 1],
  [0, 3],
  [0, 6],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 11],
  [3, 8],
  [5, 10],
  [5, 9],
  [6, 7],
  [7, 9],
  [8, 10],
  [1, 7],
  [2, 8],
  [6, 9],
  [3, 7],
  [4, 10],
  [1, 12],
  [0, 12],
  [1, 13],
  [4, 14],
  [10, 15],
  [2, 16],
];

function LogoNodeCard({
  tool,
  index,
  hovered,
  selected,
  setHovered,
  setSelected,
}: {
  tool: ToolNode;
  index: number;
  hovered: number | null;
  selected: number | null;
  setHovered: (v: number | null) => void;
  setSelected: (v: number | null) => void;
}) {
  const isActive = hovered === index || selected === index;

  return (
    <Float speed={1 + (index % 3) * 0.25} rotationIntensity={0.14} floatIntensity={0.85}>
      <group position={tool.position}>
        <Html position={[0, 0, 0.05]} center sprite>
          <div className="pointer-events-none flex flex-col items-center gap-1">
            <div className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-white/28 bg-white/92 shadow-[0_10px_22px_rgba(0,0,0,0.28)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tool.logo}
                alt={`${tool.name} logo`}
                className="h-5 w-5 object-contain"
                draggable={false}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="rounded-md border border-white/20 bg-black/80 px-2.5 py-1 font-mono text-[11px] leading-none tracking-wide text-zinc-100 shadow-[0_6px_16px_rgba(0,0,0,0.32)] backdrop-blur-xl">
              {tool.name}
            </div>
          </div>
        </Html>
      </group>
    </Float>
  );
}

function NodeConstellation() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const lines = useMemo(
    () =>
      CONNECTIONS.map(([a, b], i) => (
        <Line
          key={i}
          points={[TOOL_NODES[a].position, TOOL_NODES[b].position]}
          color="#d4d4d8"
          lineWidth={0.8}
          transparent
          opacity={0.1}
        />
      )),
    [],
  );

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 3, 2]} intensity={0.65} color="#f5f5f5" />
      <directionalLight position={[-2, -2, -1]} intensity={0.28} color="#06b6d4" />

      <group>
        {lines}
        {TOOL_NODES.map((tool, index) => (
          <LogoNodeCard
            key={tool.name}
            tool={tool}
            index={index}
            hovered={hovered}
            selected={selected}
            setHovered={setHovered}
            setSelected={setSelected}
          />
        ))}
      </group>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.7}
        enableDamping
        dampingFactor={0.15}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={(2 * Math.PI) / 3}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
      />
    </>
  );
}

export function TechHub3D() {
  return (
    <div className="relative w-full h-[260px] sm:h-[320px] md:h-[360px] lg:h-[100%]">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 48 }}
        dpr={[1.25, 2]}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <NodeConstellation />
      </Canvas>
    </div>
  );
}

export default TechHub3D;