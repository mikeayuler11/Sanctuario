import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Grid, Text } from '@react-three/drei';
import * as THREE from 'three';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Info, 
  Edit, 
  Save,
  Upload
} from 'lucide-react';

// Cemetery Model Component
function CemeteryModel({ url, onClick }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef();
  
  useFrame((state, delta) => {
    if (modelRef.current) {
      // Add subtle rotation or animation if needed
    }
  });

  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={[1, 1, 1]} 
      position={[0, 0, 0]}
      onClick={onClick}
    />
  );
}

// Fallback 3D Cemetery Layout (when no GLB file is provided)
function DefaultCemeteryLayout({ onPlotClick }) {
  const plots = [];
  
  // Generate cemetery sections
  for (let section = 0; section < 4; section++) {
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 8; col++) {
        const x = (section * 25) + (col * 3) - 37.5;
        const z = (row * 3) - 15;
        const plotId = `${String.fromCharCode(65 + section)}-${row + 1}-${col + 1}`;
        
        plots.push({
          id: plotId,
          position: [x, 0.5, z],
          occupied: Math.random() > 0.3,
          section: String.fromCharCode(65 + section)
        });
      }
    }
  }

  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[100, 60]} />
        <meshLambertMaterial color="#4ade80" />
      </mesh>
      
      {/* Cemetery Plots */}
      {plots.map((plot) => (
        <group key={plot.id}>
          <mesh 
            position={plot.position}
            onClick={() => onPlotClick(plot)}
            onPointerEnter={(e) => {
              e.object.material.emissive.setHex(0x444444);
              document.body.style.cursor = 'pointer';
            }}
            onPointerLeave={(e) => {
              e.object.material.emissive.setHex(0x000000);
              document.body.style.cursor = 'default';
            }}
          >
            <boxGeometry args={[2, 1, 2]} />
            <meshLambertMaterial 
              color={plot.occupied ? '#8b5cf6' : '#e5e7eb'} 
              transparent
              opacity={0.8}
            />
          </mesh>
          
          {/* Plot Labels */}
          <Text
            position={[plot.position[0], plot.position[1] + 1, plot.position[2]]}
            fontSize={0.3}
            color="black"
            anchorX="center"
            anchorY="middle"
          >
            {plot.id}
          </Text>
        </group>
      ))}
      
      {/* Section Labels */}
      {['A', 'B', 'C', 'D'].map((section, index) => (
        <Text
          key={section}
          position={[(index * 25) - 37.5, 5, -20]}
          fontSize={2}
          color="#374151"
          anchorX="center"
          anchorY="middle"
        >
          Section {section}
        </Text>
      ))}
      
      {/* Paths */}
      <mesh position={[0, 0.1, 0]}>
        <planeGeometry args={[100, 2]} />
        <meshLambertMaterial color="#6b7280" />
      </mesh>
      <mesh position={[0, 0.1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[60, 2]} />
        <meshLambertMaterial color="#6b7280" />
      </mesh>
    </group>
  );
}

// Camera Controls Component
function CameraControls({ cameraRef, onReset }) {
  const controlsRef = useRef();
  
  const handleZoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.position.multiplyScalar(0.8);
    }
  };
  
  const handleZoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.position.multiplyScalar(1.2);
    }
  };
  
  return (
    <>
      <OrbitControls 
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
        minDistance={5}
        maxDistance={100}
      />
      <div className="absolute top-4 right-4 space-y-2">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={onReset}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </>
  );
}

// Main Map3D Component
const Map3D = ({ glbFile, editable = false, onPlotSelect }) => {
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [showPlotInfo, setShowPlotInfo] = useState(false);
  const [uploadedModel, setUploadedModel] = useState(null);
  const cameraRef = useRef();

  const handlePlotClick = (plot) => {
    setSelectedPlot(plot);
    setShowPlotInfo(true);
    if (onPlotSelect) {
      onPlotSelect(plot);
    }
  };

  const handleModelUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.glb')) {
      const url = URL.createObjectURL(file);
      setUploadedModel(url);
    }
  };

  const resetCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 30, 30);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  useEffect(() => {
    return () => {
      if (uploadedModel) {
        URL.revokeObjectURL(uploadedModel);
      }
    };
  }, [uploadedModel]);

  return (
    <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
      {/* Upload Controls */}
      {editable && (
        <div className="absolute top-4 left-4 z-10">
          <label className="btn-primary cursor-pointer inline-flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            Upload GLB Model
            <input
              type="file"
              accept=".glb"
              onChange={handleModelUpload}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 30, 30], fov: 75 }}
        onCreated={({ camera }) => {
          cameraRef.current = camera;
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        <Suspense fallback={null}>
          {uploadedModel ? (
            <CemeteryModel url={uploadedModel} onClick={handlePlotClick} />
          ) : glbFile ? (
            <CemeteryModel url={glbFile} onClick={handlePlotClick} />
          ) : (
            <DefaultCemeteryLayout onPlotClick={handlePlotClick} />
          )}
        </Suspense>
        
        <Environment preset="park" />
        <Grid infiniteGrid fadeDistance={50} fadeStrength={5} />
        <CameraControls cameraRef={cameraRef} onReset={resetCamera} />
      </Canvas>

      {/* Plot Information Panel */}
      {showPlotInfo && selectedPlot && (
        <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Plot {selectedPlot.id}</h3>
            <button
              onClick={() => setShowPlotInfo(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <p><strong>Section:</strong> {selectedPlot.section}</p>
            <p><strong>Status:</strong> 
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                selectedPlot.occupied 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {selectedPlot.occupied ? 'Occupied' : 'Available'}
              </span>
            </p>
            {selectedPlot.occupied && (
              <>
                <p><strong>Deceased:</strong> John Doe</p>
                <p><strong>Date:</strong> 2023-05-15</p>
              </>
            )}
          </div>
          {editable && (
            <div className="flex space-x-2 mt-3">
              <button className="btn-primary text-xs">
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </button>
              <button className="btn-secondary text-xs">
                <Info className="w-3 h-3 mr-1" />
                Details
              </button>
            </div>
          )}
        </div>
      )}

      {/* Loading Indicator */}
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      }>
        {/* Content loaded by Suspense */}
      </Suspense>
    </div>
  );
};

export default Map3D;