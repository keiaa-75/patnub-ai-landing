
<script>
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
  import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

  let {
    screens = [],
    phoneHeight = 420,
    baseTop = 0.5,
    onready = () => {},
    onfail = () => {}
  } = $props();

  let host;

  const CAMERA_Z = 6.2;
  const DEG = Math.PI / 180;
  const MODEL_URL = '/models/Samsung_s24_ultra.gltf';
  const SCREEN_MESH_NAME = 'GeometryNode_59';

  // Small offset above the original glass.
  const SCREEN_LIFT_LOCAL = 0.008;

  let renderer;
  let scene;
  let camera;
  let group;
  let environment;
  let pmrem;
  let resizeObserver;
  let screenGeometry;
  let screenA;
  let screenB;
  let materialA;
  let materialB;
  let textures = [];

  let ready = false;
  let disposed = false;
  let failed = false;
  let readyNotified = false;
  let textureLoadId = 0;

  let lastPose = null;
  let lastIndex = -1;
  let lastMix = -1;
  let loadedScreens = null;
  let latestScreens = screens;

  let modelHeight = 4.3;
  let size = { width: 1, height: 1 };

  function fail(error) {
    if (disposed || failed) return;

    failed = true;

    if (error) {
      console.error('Samsung phone setup failed:', error);
    }

    if (host) host.style.opacity = '0';
    onfail();
  }

  function render() {
    if (
      ready &&
      !disposed &&
      renderer &&
      scene &&
      camera
    ) {
      renderer.render(scene, camera);
    }
  }

  function notifyReady() {
    if (
      readyNotified ||
      disposed ||
      failed ||
      !ready ||
      !textures.length
    ) {
      return;
    }

    readyNotified = true;
    render();
    host.style.opacity = '1';
    onready();
  }

  function updateScreen(value) {
    if (!materialA || !materialB || !textures.length) return;

    const maxIndex = Math.max(0, textures.length - 1);

    const index = THREE.MathUtils.clamp(
      Math.floor(value),
      0,
      maxIndex
    );

    const mix = THREE.MathUtils.clamp(
      value - index,
      0,
      1
    );

    if (
      index === lastIndex &&
      Math.abs(mix - lastMix) < 0.004
    ) {
      return;
    }

    lastIndex = index;
    lastMix = mix;

    materialA.map = textures[index] || null;

    materialB.map =
      textures[Math.min(index + 1, maxIndex)] ||
      textures[index] ||
      null;

    materialA.opacity = index === maxIndex ? 1 : 1 - mix;
    materialB.opacity = index === maxIndex ? 0 : mix;

    materialA.needsUpdate = true;
    materialB.needsUpdate = true;
  }

  function applyPose(pose) {
    if (!ready || !group || !renderer || !camera) return;

    const { width, height } = size;
    if (!width || !height) return;

    const fov = THREE.MathUtils.clamp(
      THREE.MathUtils.mapLinear(
        pose.persp || 1180,
        1250,
        900,
        31,
        39
      ),
      31,
      39
    );

    if (
      camera.fov !== fov ||
      camera.aspect !== width / height
    ) {
      camera.fov = fov;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    const visibleHeight =
      2 * CAMERA_Z * Math.tan((fov * DEG) / 2);

    const visibleWidth =
      visibleHeight * (width / height);

    const targetWorldHeight =
      (phoneHeight / height) * visibleHeight;

    group.scale.setScalar(
      (targetWorldHeight / modelHeight) * pose.scale
    );

    group.position.set(
      pose.xVw * visibleWidth,
      -(baseTop - 0.5 + pose.yVh) * visibleHeight,
      (pose.z || 0) / 100
    );

    // The original screen faces -Z.
    // Rotating the phone 180 degrees presents it to the camera.
    group.rotation.set(
      -pose.pitch * DEG,
      Math.PI + pose.yaw * DEG,
      -pose.roll * DEG
    );

    updateScreen(pose.screenF || 0);
    render();
  }

  export function setPose(pose) {
    lastPose = pose;
    applyPose(pose);
  }

  function createScreenGeometry(source) {
    const positions = source.geometry?.attributes?.position;

    if (!positions || positions.count < 4) {
      throw new Error(
        'The Samsung display mesh does not contain the expected screen corners.'
      );
    }

    // Use the actual display mesh's local coordinates.
    const corners = [0, 1, 2, 3].map((index) =>
      new THREE.Vector3().fromBufferAttribute(positions, index)
    );

    const edgeA = corners[1].clone().sub(corners[0]);
    const edgeB = corners[2].clone().sub(corners[0]);

    const normal = edgeA.cross(edgeB).normalize();

    if (
      !Number.isFinite(normal.length()) ||
      normal.lengthSq() < 0.5
    ) {
      throw new Error(
        'Could not determine the Samsung display surface orientation.'
      );
    }

    // Keep the texture slightly above the glass.
    corners.forEach((corner) =>
      corner.addScaledVector(normal, SCREEN_LIFT_LOCAL)
    );

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(
        corners.flatMap((corner) => [
          corner.x,
          corner.y,
          corner.z
        ]),
        3
      )
    );

    // Horizontal UV reversal compensates for the 180-degree
    // Y rotation used to face the device toward the camera.
    // This makes the application text read normally.
    geometry.setAttribute(
      'uv',
      new THREE.Float32BufferAttribute(
        [
          1, 1,
          0, 1,
          1, 0,
          0, 0
        ],
        2
      )
    );

    geometry.setIndex([
      0, 1, 2,
      2, 1, 3
    ]);

    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();

    return geometry;
  }

  function addScreenOverlay(model) {
    const source = model.getObjectByName(SCREEN_MESH_NAME);

    if (!source?.isMesh) {
      throw new Error(
        `Could not find the Samsung display mesh: ${SCREEN_MESH_NAME}`
      );
    }

    screenGeometry = createScreenGeometry(source);

    materialA = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1,

      // Important: retain depth testing so the app
      // cannot appear through the back of the phone.
      depthTest: true,
      depthWrite: false,

      toneMapped: false,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -3,
      polygonOffsetUnits: -3
    });

    materialB = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,

      // Apply the same depth behavior to the next screen.
      depthTest: true,
      depthWrite: false,

      toneMapped: false,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -4,
      polygonOffsetUnits: -4
    });

    screenA = new THREE.Mesh(screenGeometry, materialA);
    screenA.name = 'patnub-app-screen-current';
    screenA.renderOrder = 10000;
    screenA.frustumCulled = false;

    screenB = new THREE.Mesh(
      screenGeometry.clone(),
      materialB
    );

    screenB.name = 'patnub-app-screen-next';
    screenB.renderOrder = 10001;
    screenB.frustumCulled = false;

    // Both display layers inherit the actual Samsung glass transform.
    source.add(screenA, screenB);

    // Preserve the original black glass and bezel.
    source.renderOrder = 0;
  }

  async function loadTextures(urls) {
    if (!renderer || disposed || !urls?.length) return false;

    const requestId = ++textureLoadId;
    loadedScreens = urls;

    const loader = new THREE.TextureLoader();

    try {
      const loaded = await Promise.all(
        urls.map((url) => loader.loadAsync(url))
      );

      if (disposed || requestId !== textureLoadId) {
        loaded.forEach((texture) => texture?.dispose());
        return false;
      }

      textures.forEach((texture) => texture?.dispose());

      textures = loaded.map((texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;

        texture.anisotropy = Math.min(
          8,
          renderer.capabilities.getMaxAnisotropy()
        );

        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = true;
        texture.needsUpdate = true;

        return texture;
      });

      console.info(
        '[patnub.ai] App screen textures loaded:',
        textures.map((texture) => ({
          width: texture.image?.naturalWidth || texture.image?.width,
          height: texture.image?.naturalHeight || texture.image?.height
        }))
      );

      lastIndex = -1;
      lastMix = -1;

      if (lastPose) {
        applyPose(lastPose);
      } else {
        updateScreen(0);
        render();
      }

      notifyReady();
      return true;

    } catch (error) {
      if (requestId === textureLoadId) {
        fail(error);
      }

      return false;
    }
  }

  $effect(() => {
    latestScreens = screens;

    if (
      screens?.length &&
      screens !== loadedScreens &&
      ready
    ) {
      loadTextures(screens);
    }
  });

  onMount(() => {
    try {
      const probe = document
        .createElement('canvas')
        .getContext('webgl2');

      if (!probe) {
        fail(new Error('WebGL 2 is not available in this browser.'));
        return;
      }

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });

      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, 2)
      );

      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;

      host.appendChild(renderer.domElement);

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(
        35,
        1,
        0.1,
        100
      );

      camera.position.set(0, 0, CAMERA_Z);
      camera.lookAt(0, 0, 0);

      pmrem = new THREE.PMREMGenerator(renderer);

      const room = new RoomEnvironment();

      environment = pmrem.fromScene(room, 0.04).texture;
      scene.environment = environment;

      room.dispose();

      const keyLight = new THREE.DirectionalLight(
        0xffffff,
        2.4
      );

      keyLight.position.set(3, 4, 5);

      const tealFill = new THREE.DirectionalLight(
        0xc7eee2,
        1.45
      );

      tealFill.position.set(-4, 1, -3);

      const warmRim = new THREE.DirectionalLight(
        0xffe0c1,
        0.55
      );

      warmRim.position.set(1, -3, -2);

      scene.add(
        keyLight,
        tealFill,
        warmRim,
        new THREE.AmbientLight(0xffffff, 0.38)
      );

      group = new THREE.Group();
      scene.add(group);

      const loader = new GLTFLoader();

      loader.load(
        MODEL_URL,

        (gltf) => {
          if (disposed) return;

          try {
            const model = gltf.scene;

            model.updateMatrixWorld(true);

            const bounds = new THREE.Box3().setFromObject(model);

            const center = bounds.getCenter(new THREE.Vector3());
            const dimensions = bounds.getSize(new THREE.Vector3());

            modelHeight = dimensions.y || 4.3;

            addScreenOverlay(model);

            model.position.sub(center);
            model.updateMatrixWorld(true);

            group.add(model);

            ready = true;

            if (latestScreens?.length) {
              loadTextures(latestScreens);
            } else {
              fail(new Error('No application screen textures were provided.'));
            }

            if (lastPose) {
              applyPose(lastPose);
            }

          } catch (error) {
            fail(error);
          }
        },

        undefined,

        (error) => fail(error)
      );

      resizeObserver = new ResizeObserver(([entry]) => {
        if (!entry || disposed) return;

        const { width, height } = entry.contentRect;

        size = {
          width: Math.max(1, width),
          height: Math.max(1, height)
        };

        renderer.setSize(size.width, size.height, false);

        if (lastPose) {
          applyPose(lastPose);
        } else {
          render();
        }
      });

      resizeObserver.observe(host);

      size = {
        width: host.clientWidth || 1,
        height: host.clientHeight || 1
      };

      renderer.setSize(size.width, size.height, false);

    } catch (error) {
      fail(error);
    }

    return () => {
      disposed = true;
      ready = false;
      textureLoadId += 1;

      resizeObserver?.disconnect();

      textures.forEach((texture) => texture?.dispose());

      screenGeometry?.dispose();
      screenB?.geometry?.dispose();

      materialA?.dispose();
      materialB?.dispose();

      environment?.dispose();
      pmrem?.dispose();

      scene?.traverse((object) => {
        if (
          object.isMesh &&
          object !== screenA &&
          object !== screenB
        ) {
          object.geometry?.dispose();

          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];

          materials.forEach((material) => material?.dispose());
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
    z-index: 7;
    opacity: 0;
    pointer-events: none;
    transition: opacity 220ms ease;
  }

  .canvas-host :global(canvas) {
    display: block;
    width: 100%;
    height: 100%;
  }

  @media (prefers-reduced-motion: reduce) {
    .canvas-host {
      transition: none;
    }
  }
</style>
