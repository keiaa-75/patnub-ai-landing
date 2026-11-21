<script>
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
  import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
  import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
  import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

  let {
    screens = [],
    phoneHeight = 590,
    baseTop = 0.52,
    onready = () => {},
    onfail = () => {}
  } = $props();

  let host;

  const CAM_Z = 5;
  const DEG = Math.PI / 180;

  let renderer, scene, camera, group, env, pmrem, ktx2, resizeObserver;
  let screenA, screenB, matA, matB;
  let textures = [];
  let ready = false;
  let disposed = false;
  let lastPose = null;
  let lastIndex = -1;
  let lastMix = -1;
  let loadedScreens = null;
  let latestScreens = [];
  let modelHeight = 0.15;
  let size = { w: 1, h: 1 };

  function draw() {
    if (ready && !disposed) renderer.render(scene, camera);
  }

  function updateScreen(f) {
    if (!matA || !matB) return;

    const max = Math.max(0, screens.length - 1);
    const i = THREE.MathUtils.clamp(Math.floor(f), 0, max);
    const mix = THREE.MathUtils.clamp(f - i, 0, 1);
    const dip = Math.abs(f - Math.round(f));
    const fade = 1 - dip * 1.7;

    if (i === lastIndex && mix === lastMix) return;
    lastIndex = i;
    lastMix = mix;

    matA.map = textures[i] || null;
    matB.map = textures[i + 1] || textures[i] || null;
    matA.opacity = (1 - mix) * fade;
    matB.opacity = mix * fade;
    matA.needsUpdate = true;
    matB.needsUpdate = true;
  }

  function applyPose(pose) {
    if (!ready || !group) return;
    const { w, h } = size;
    if (!w || !h) return;

    const fov = THREE.MathUtils.clamp(
      THREE.MathUtils.mapLinear(pose.persp, 1200, 900, 30, 42),
      30,
      42
    );
    if (camera.fov !== fov || camera.aspect !== w / h) {
      camera.fov = fov;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    const visibleH = 2 * CAM_Z * Math.tan(fov * DEG / 2);
    const visibleW = visibleH * (w / h);
    const worldH = (phoneHeight / h) * visibleH;

    group.scale.setScalar((worldH / modelHeight) * pose.scale);
    group.position.set(
      pose.xVw * visibleW,
      -(baseTop - 0.5 + pose.yVh) * visibleH,
      pose.z / 100
    );
    group.rotation.set(-pose.pitch * DEG, pose.yaw * DEG, -pose.roll * DEG);

    updateScreen(pose.screenF);
    draw();
  }

  export function setPose(pose) {
    lastPose = pose;
    applyPose(pose);
  }

  function loadTextures(urls) {
    if (!renderer || disposed || !urls?.length) return;
    loadedScreens = urls;

    const loader = new THREE.TextureLoader();
    Promise.all(
      urls.map(
        (url) =>
          new Promise((resolve) => {
            loader.load(url, resolve, undefined, () => resolve(null));
          })
      )
    ).then((loaded) => {
      if (disposed) return;
      textures.forEach((t) => t?.dispose());
      textures = loaded.filter(Boolean).map((t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        return t;
      });
      lastIndex = -1;
      lastMix = -1;
      if (lastPose) applyPose(lastPose);
      else draw();
    });
  }

  $effect(() => {
    latestScreens = screens;
    if (screens?.length && screens !== loadedScreens && ready) loadTextures(screens);
  });

  onMount(() => {
    let probe;
    try {
      probe = document.createElement('canvas').getContext('webgl2');
    } catch {
      probe = null;
    }
    if (!probe) {
      onfail();
      return;
    }

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      host.appendChild(renderer.domElement);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
      camera.position.set(0, 0, CAM_Z);

      pmrem = new THREE.PMREMGenerator(renderer);
      const room = new RoomEnvironment();
      env = pmrem.fromScene(room, 0.04).texture;
      scene.environment = env;
      room.dispose();

      const key = new THREE.DirectionalLight(0xffffff, 2.4);
      key.position.set(3, 4, 5);
      const rim = new THREE.DirectionalLight(0xa9f5e4, 1.5);
      rim.position.set(-4, 1, -3);
      scene.add(key, rim, new THREE.AmbientLight(0xffffff, 0.35));

      group = new THREE.Group();
      group.rotation.order = 'YXZ';
      scene.add(group);

      ktx2 = new KTX2Loader().setTranscoderPath('/basis/');
      ktx2.detectSupport(renderer);
      const gltfLoader = new GLTFLoader();
      gltfLoader.setKTX2Loader(ktx2);
      gltfLoader.setMeshoptDecoder(MeshoptDecoder);

      gltfLoader.load(
        '/models/smartphone-lod1.glb',
        (gltf) => {
          if (disposed) return;
          const model = gltf.scene;

          // The GLB's origin is at the bottom of the phone. Recenter it so the
          // pose position refers to the middle of the device, like the CSS one.
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const dimensions = box.getSize(new THREE.Vector3());
          model.position.sub(center);
          modelHeight = dimensions.y || 0.15;
          group.add(model);

          const source = model.getObjectByName('screen');
          if (source?.isMesh) {
            const geometry = source.geometry;
            geometry.computeBoundingBox();
            const box = geometry.boundingBox;
            const spanX = box.max.x - box.min.x || 1;
            const spanY = box.max.y - box.min.y || 1;
            const pos = geometry.attributes.position;
            const uv = new Float32Array(pos.count * 2);
            for (let i = 0; i < pos.count; i++) {
              uv[i * 2] = (pos.getX(i) - box.min.x) / spanX;
              uv[i * 2 + 1] = (pos.getY(i) - box.min.y) / spanY;
            }
            geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));

            matA = new THREE.MeshBasicMaterial({
              transparent: true,
              opacity: 0,
              depthWrite: false,
              toneMapped: false
            });
            matB = new THREE.MeshBasicMaterial({
              transparent: true,
              opacity: 0,
              depthWrite: false,
              toneMapped: false
            });

            screenA = new THREE.Mesh(geometry, matA);
            screenA.position.copy(source.position);
            screenA.scale.copy(source.scale);
            screenB = new THREE.Mesh(geometry, matB);
            screenB.position.copy(source.position);
            screenB.scale.copy(source.scale);
            screenB.position.z += 0.00004;
            screenB.renderOrder = 1;
            source.parent.add(screenA, screenB);
            source.visible = false;
          }

          ready = true;
          if (latestScreens?.length) loadTextures(latestScreens);
          if (lastPose) applyPose(lastPose);
          onready();
        },
        undefined,
        () => {
          if (!disposed) onfail();
        }
      );

      resizeObserver = new ResizeObserver(([entry]) => {
        const { width, height } = entry.contentRect;
        size = { w: width, h: height };
        renderer.setSize(width, height, false);
        if (lastPose) applyPose(lastPose);
        else draw();
      });
      resizeObserver.observe(host);
      size = { w: host.clientWidth || 1, h: host.clientHeight || 1 };
    } catch {
      if (!disposed) onfail();
    }

    return () => {
      disposed = true;
      ready = false;
      resizeObserver?.disconnect();
      textures.forEach((t) => t?.dispose());
      screenA?.geometry?.dispose();
      matA?.dispose();
      matB?.dispose();
      env?.dispose();
      pmrem?.dispose();
      ktx2?.dispose();
      scene?.traverse((obj) => {
        if (obj.isMesh && obj !== screenA && obj !== screenB) {
          obj.geometry?.dispose();
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => m?.dispose());
        }
      });
      renderer?.dispose();
      renderer?.forceContextLoss();
      renderer?.domElement?.remove();
    };
  });
</script>

<div class="canvas-host" bind:this={host} aria-hidden="true"></div>

<style>
  .canvas-host {
    position: absolute;
    inset: 0;
    z-index: 6;
    pointer-events: none;
  }
  .canvas-host :global(canvas) {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
