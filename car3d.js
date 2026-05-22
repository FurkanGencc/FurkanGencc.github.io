import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PLYLoader } from "three/addons/loaders/PLYLoader.js";

const canvas = document.getElementById("carCanvas");

if (!canvas) {
  console.warn("carCanvas bulunamadı");
} else {

  setTimeout(() => {

    function getSize() {
      return {
        w: canvas.offsetWidth  || 400,
        h: canvas.offsetHeight || 300
      };
    }

    const scene = new THREE.Scene();
    const { w, h } = getSize();

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.set(0, 1.5, 3.5);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });

    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 2);
    scene.add(hemi);

    const dir = new THREE.DirectionalLight(0xffffff, 3);
    dir.position.set(5, 10, 7);
    scene.add(dir);

    const fillLight = new THREE.DirectionalLight(0x88aaff, 1);
    fillLight.position.set(-5, 2, -3);
    scene.add(fillLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 1;
    controls.maxDistance = 20;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.5;
    controls.target.set(0, 0, 0);
    controls.update();

    controls.addEventListener("start", () => { controls.autoRotate = false; });
    controls.addEventListener("end",   () => { controls.autoRotate = true; });

    const loader = new PLYLoader();

    loader.load(
      "models/car.ply",
      (geometry) => {
        geometry.computeVertexNormals();
        geometry.center();

        const hasVertexColors = geometry.hasAttribute("color");

        const material = new THREE.MeshStandardMaterial({
          vertexColors: hasVertexColors,
          color: hasVertexColors ? 0xffffff : 0xaaaaaa,
          metalness: 0.4,
          roughness: 0.45
        });

        const mesh = new THREE.Mesh(geometry, material);

        const box = new THREE.Box3().setFromObject(mesh);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxAxis = Math.max(size.x, size.y, size.z);
        mesh.scale.setScalar(3 / maxAxis);

        mesh.rotation.x = -Math.PI;

        scene.add(mesh);
      },
      (xhr) => {
        if (xhr.lengthComputable) {
          console.log(`car.ply yükleniyor: %${(xhr.loaded / xhr.total * 100).toFixed(0)}`);
        }
      },
      (err) => {
        console.error("PLY yüklenemedi:", err);
      }
    );

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }

    animate();

    window.addEventListener("resize", () => {
      const { w: nw, h: nh } = getSize();
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    });

  }, 100);
}