<script>
  import { onMount } from 'svelte';

  import * as THREE from 'three';

  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
  import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

  import {
    createBrewCodeArtworkSurface,
    waitForBrewCodeArtworkFonts
  } from './brewCodeArtwork.js';

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

  const SCREEN_LIFT_LOCAL = 0.008;

  let brewCodeArtworkSurface = null;
  let brewCodeArtworkTexture = null;
  let lastArtworkFrame = 0;
  let prefersReducedMotion = false;
  let reducedMotionQuery = null;
  let reducedMotionHandler = null;

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

  let size = {
    width: 1,
    height: 1
  };

  /*
    Create the final BrewCode artwork texture from the shared 2D renderer.

    The same drawing function is used by the CSS fallback. The texture
    canvas is rotated into the portrait orientation expected by the
    Samsung display mesh, while its drawing coordinates remain landscape.
  */
  async function createBrewCodeTexture() {
    await waitForBrewCodeArtworkFonts();

    if (disposed) return null;

    brewCodeArtworkSurface = createBrewCodeArtworkSurface(null, {
      portraitTexture: true
    });

    brewCodeArtworkSurface.draw(0, false);

    const texture = new THREE.CanvasTexture(
      brewCodeArtworkSurface.canvas
    );

    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(
      8,
      renderer.capabilities.getMaxAnisotropy()
    );
    // This canvas is redrawn while visible; skip per-frame mipmap regeneration.
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;

    texture.userData.isBrewCodeArtwork = true;
    brewCodeArtworkTexture = texture;
    lastArtworkFrame = 0;

    return texture;
  }

  /*
    Animate the shared canvas only while the final display screen is active.
    Hero's GSAP ticker already calls setPose while the phone is in view, so
    this does not require a second render loop or a larger renderer rewrite.
  */
  function updateBrewCodeArtwork(value) {
    if (
      !brewCodeArtworkSurface ||
      !brewCodeArtworkTexture ||
      prefersReducedMotion ||
      !textures.length
    ) {
      return;
    }

    const finalScreenIndex = textures.length - 1;
    const artworkIsVisible = value >= finalScreenIndex - 0.015;

    if (!artworkIsVisible) {
      lastArtworkFrame = 0;
      return;
    }

    const now = performance.now();
    const frameInterval = 1000 / 24;

    if (now - lastArtworkFrame < frameInterval) return;

    brewCodeArtworkSurface.draw(now / 1000, true);
    brewCodeArtworkTexture.needsUpdate = true;
    lastArtworkFrame = now;
  }

  /*
    Error handling.
  */

  function fail(error) {
    if (disposed || failed) return;

    failed = true;

    if (error) {
      console.error(
        '[patnub.ai] Samsung phone setup failed:',
        error
      );
    }

    if (host) {
      host.style.opacity = '0';
    }

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

  /*
    Screen blending.

    A and B are transparent layers placed over the
    original Samsung display glass.
  */

  function updateScreen(value) {
    if (
      !materialA ||
      !materialB ||
      !textures.length
    ) {
      return;
    }

    const maxIndex = Math.max(
      0,
      textures.length - 1
    );

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

    materialA.opacity =
      index === maxIndex ? 1 : 1 - mix;

    materialB.opacity =
      index === maxIndex ? 0 : mix;

    materialA.needsUpdate = true;
    materialB.needsUpdate = true;
  }

  /*
    Apply the GSAP phone pose.
  */

  function applyPose(pose) {
    if (
      !ready ||
      !group ||
      !renderer ||
      !camera
    ) {
      return;
    }

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
      (targetWorldHeight / modelHeight) *
      pose.scale
    );

    group.position.set(
      pose.xVw * visibleWidth,

      -(baseTop - 0.5 + pose.yVh) *
        visibleHeight,

      (pose.z || 0) / 100
    );

    /*
      Preserve the original screen-facing orientation.
    */

    group.rotation.set(
      -pose.pitch * DEG,

      Math.PI + pose.yaw * DEG,

      -pose.roll * DEG
    );

    updateScreen(pose.screenF || 0);
    updateBrewCodeArtwork(pose.screenF || 0);

    render();
  }

  export function setPose(pose) {
    lastPose = pose;

    applyPose(pose);
  }

  /*
    Build a separate display plane using the original
    mesh's first four screen vertices.
  */

  function createScreenGeometry(source) {
    const positions =
      source.geometry?.attributes?.position;

    if (!positions || positions.count < 4) {
      throw new Error(
        'The Samsung display mesh does not contain the expected screen corners.'
      );
    }

    const corners = [0, 1, 2, 3].map((index) =>
      new THREE.Vector3().fromBufferAttribute(
        positions,
        index
      )
    );

    const edgeA = corners[1]
      .clone()
      .sub(corners[0]);

    const edgeB = corners[2]
      .clone()
      .sub(corners[0]);

    const normal = edgeA.cross(edgeB).normalize();

    if (
      !Number.isFinite(normal.length()) ||
      normal.lengthSq() < 0.5
    ) {
      throw new Error(
        'Could not determine the Samsung display surface orientation.'
      );
    }

    /*
      Lift the screen slightly above the original glass.
    */

    corners.forEach((corner) =>
      corner.addScaledVector(
        normal,
        SCREEN_LIFT_LOCAL
      )
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

    /*
      Horizontal UV reversal compensates for the
      180-degree Y rotation used to face the device
      toward the camera.
    */

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

  /*
    Attach the two screen layers to the actual display mesh.
  */

  function addScreenOverlay(model) {
    const source = model.getObjectByName(
      SCREEN_MESH_NAME
    );

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

      depthTest: true,
      depthWrite: false,

      toneMapped: false,

      side: THREE.DoubleSide,

      polygonOffset: true,
      polygonOffsetFactor: -4,
      polygonOffsetUnits: -4
    });

    screenA = new THREE.Mesh(
      screenGeometry,
      materialA
    );

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

    source.add(screenA, screenB);

    source.renderOrder = 0;
  }

  /*
    Load application textures.

    The final "brewcode-artwork" value uses the shared canvas renderer
    rather than requesting a URL.
  */

  async function loadTextures(urls) {
    if (
      !renderer ||
      disposed ||
      !urls?.length
    ) {
      return false;
    }

    const requestId = ++textureLoadId;

    loadedScreens = urls;

    const loader = new THREE.TextureLoader();

    try {
      const loaded = await Promise.all(
        urls.map((url) => {
          if (url === 'brewcode-artwork') {
            return createBrewCodeTexture();
          }

          return loader.loadAsync(url);
        })
      );

      if (
        disposed ||
        requestId !== textureLoadId
      ) {
        loaded.forEach((texture) =>
          texture?.dispose()
        );

        return false;
      }

      textures.forEach((texture) =>
        texture?.dispose()
      );

      textures = loaded.map((texture) => {
        if (!texture) {
          throw new Error(
            'The BrewCode artwork texture could not be created.'
          );
        }

        texture.colorSpace = THREE.SRGBColorSpace;

        texture.anisotropy = Math.min(
          8,
          renderer.capabilities.getMaxAnisotropy()
        );

        const isAnimatedArtwork = Boolean(texture.userData?.isBrewCodeArtwork);

        texture.minFilter = isAnimatedArtwork
          ? THREE.LinearFilter
          : THREE.LinearMipmapLinearFilter;

        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = !isAnimatedArtwork;
        texture.needsUpdate = true;

        return texture;
      });

      console.info(
        '[patnub.ai] App screen textures loaded:',
        textures.map((texture) => ({
          width:
            texture.image?.naturalWidth ||
            texture.image?.width,

          height:
            texture.image?.naturalHeight ||
            texture.image?.height
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

  /*
    Watch for changes to the screen array.
  */

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

  /*
    Initialize WebGL and load the Samsung glTF.
  */

  onMount(() => {
    reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion = reducedMotionQuery.matches;
    reducedMotionHandler = (event) => {
      prefersReducedMotion = event.matches;
      if (prefersReducedMotion && brewCodeArtworkSurface) {
        brewCodeArtworkSurface.draw(0, false);
        if (brewCodeArtworkTexture) brewCodeArtworkTexture.needsUpdate = true;
        render();
      }
      lastArtworkFrame = 0;
    };
    reducedMotionQuery.addEventListener?.('change', reducedMotionHandler);

    try {
      /*
        Verify that WebGL 2 exists.
      */

      const probe = document
        .createElement('canvas')
        .getContext('webgl2');

      if (!probe) {
        fail(
          new Error(
            'WebGL 2 is not available in this browser.'
          )
        );

        return;
      }

      /*
        Renderer.
      */

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });

      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, 2)
      );

      renderer.setClearColor(0x000000, 0);

      renderer.outputColorSpace =
        THREE.SRGBColorSpace;

      renderer.toneMapping =
        THREE.ACESFilmicToneMapping;

      renderer.toneMappingExposure = 1.08;

      host.appendChild(renderer.domElement);

      /*
        Scene and camera.
      */

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(
        35,
        1,
        0.1,
        100
      );

      camera.position.set(0, 0, CAMERA_Z);
      camera.lookAt(0, 0, 0);

      /*
        Environment lighting.
      */

      pmrem = new THREE.PMREMGenerator(renderer);

      const room = new RoomEnvironment();

      environment = pmrem.fromScene(
        room,
        0.04
      ).texture;

      scene.environment = environment;

      room.dispose();

      /*
        Directional lights.
      */

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

      /*
        Device group.
      */

      group = new THREE.Group();

      scene.add(group);

      /*
        Load the model.
      */

      const loader = new GLTFLoader();

      loader.load(
        MODEL_URL,

        (gltf) => {
          if (disposed) return;

          try {
            const model = gltf.scene;

            model.updateMatrixWorld(true);

            const bounds = new THREE.Box3().setFromObject(
              model
            );

            const center = bounds.getCenter(
              new THREE.Vector3()
            );

            const dimensions = bounds.getSize(
              new THREE.Vector3()
            );

            modelHeight = dimensions.y || 4.3;

            /*
              Attach the application display.
            */

            addScreenOverlay(model);

            model.position.sub(center);

            model.updateMatrixWorld(true);

            group.add(model);

            ready = true;

            if (latestScreens?.length) {
              loadTextures(latestScreens);
            } else {
              fail(
                new Error(
                  'No application screen textures were provided.'
                )
              );
            }

            if (lastPose) {
              applyPose(lastPose);
            }

          } catch (error) {
            fail(error);
          }
        },

        undefined,

        (error) => {
          fail(error);
        }
      );

      /*
        Responsive canvas sizing.
      */

      resizeObserver = new ResizeObserver(
        ([entry]) => {
          if (!entry || disposed) return;

          const { width, height } = entry.contentRect;

          size = {
            width: Math.max(1, width),
            height: Math.max(1, height)
          };

          renderer.setSize(
            size.width,
            size.height,
            false
          );

          if (lastPose) {
            applyPose(lastPose);
          } else {
            render();
          }
        }
      );

      resizeObserver.observe(host);

      size = {
        width: host.clientWidth || 1,
        height: host.clientHeight || 1
      };

      renderer.setSize(
        size.width,
        size.height,
        false
      );

    } catch (error) {
      fail(error);
    }

    /*
      Cleanup and resource disposal.
    */

    return () => {
      disposed = true;
      ready = false;

      textureLoadId += 1;

      resizeObserver?.disconnect();
      reducedMotionQuery?.removeEventListener?.('change', reducedMotionHandler);

      textures.forEach((texture) =>
        texture?.dispose()
      );

      brewCodeArtworkTexture = null;
      brewCodeArtworkSurface = null;

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

          const materials = Array.isArray(
            object.material
          )
            ? object.material
            : [object.material];

          materials.forEach((material) =>
            material?.dispose()
          );
        }
      });

      renderer?.dispose();
      renderer?.forceContextLoss();

      renderer?.domElement?.remove();
    };
  });
</script>

<div
  class="canvas-host"
  bind:this={host}
  aria-hidden="true"
></div>

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