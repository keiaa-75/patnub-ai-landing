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

  const SCREEN_LIFT_LOCAL = 0.008;

  const TEAM = [
    {
      name: 'Marlon Isaguirre',
      role: 'Project Lead',
      initials: 'MI',
      avatar: 'https://avatars.githubusercontent.com/u/220807597?v=4',
      bg: '#d5f1e9',
      ink: '#145d52'
    },
    {
      name: 'Julian Macato',
      role: 'Full-Stack Developer',
      initials: 'JM',
      avatar: 'https://avatars.githubusercontent.com/u/53817791?v=4',
      bg: '#f8e5d1',
      ink: '#765132'
    },
    {
      name: 'Ravin Aguelo',
      role: 'Runtime Engineer',
      initials: 'RA',
      avatar: 'https://avatars.githubusercontent.com/u/220807681?v=4',
      bg: '#e0eafa',
      ink: '#445f83'
    },
    {
      name: 'Jill Abarte',
      role: 'Backend Developer',
      initials: 'JA',
      avatar: 'https://avatars.githubusercontent.com/u/176262249?v=4',
      bg: '#eee0f1',
      ink: '#74507e'
    }
  ];

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
    GitHub avatar loading.

    The requests use CORS so the images can be drawn
    into a canvas and uploaded as a WebGL texture.

    If an image fails, the profile's initials are used.
  */

  function loadAvatar(url) {
    return new Promise((resolve) => {
      const image = new Image();

      image.crossOrigin = 'anonymous';

      let settled = false;

      const finish = (result) => {
        if (settled) return;

        settled = true;

        clearTimeout(timeout);

        resolve(result);
      };

      const timeout = setTimeout(() => {
        finish(null);
      }, 5000);

      image.onload = () => {
        finish(image);
      };

      image.onerror = () => {
        finish(null);
      };

      image.src = url;
    });
  }

  /*
    Create the team's landscape screen as a canvas texture.

    The canvas is physically portrait-shaped because that is
    how the Samsung screen mesh is mapped.

    Its contents are rotated 90 degrees to remain upright
    when the phone itself rotates into landscape orientation.
  */

  async function createTeamTexture() {
    const avatars = await Promise.all(
      TEAM.map((member) => loadAvatar(member.avatar))
    );

    if (disposed) return null;

    const canvas = document.createElement('canvas');

    canvas.width = 1080;
    canvas.height = 2340;

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not create the team profile canvas.');
    }

    ctx.save();

    /*
      Landscape coordinate system:

      2340 × 1080 logical pixels,
      rotated into a 1080 × 2340 portrait canvas.
    */

    ctx.translate(1080, 0);
    ctx.rotate(Math.PI / 2);

    ctx.fillStyle = '#f5faf8';
    ctx.fillRect(0, 0, 2340, 1080);

    const cardWidth = 500;
    const cardHeight = 910;

    const firstX = 110;
    const cardGap = 540;

    const cardY = 85;

    TEAM.forEach((member, index) => {
      const x = firstX + index * cardGap;

      /*
        Card surface.
      */

      ctx.save();

      ctx.shadowColor = 'rgba(27, 58, 49, 0.045)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 5;

      ctx.beginPath();

      ctx.roundRect(
        x,
        cardY,
        cardWidth,
        cardHeight,
        42
      );

      ctx.fillStyle = '#ffffff';
      ctx.fill();

      ctx.restore();

      ctx.beginPath();

      ctx.roundRect(
        x,
        cardY,
        cardWidth,
        cardHeight,
        42
      );

      ctx.lineWidth = 3;
      ctx.strokeStyle = '#dce9e3';
      ctx.stroke();

      /*
        Profile portrait.

        Each avatar is cropped to a centered square,
        then clipped into a circle.
      */

      const centerX = x + cardWidth / 2;
      const centerY = cardY + 315;

      const avatarSize = 270;
      const radius = avatarSize / 2;

      const avatarX = centerX - radius;
      const avatarY = centerY - radius;

      const avatar = avatars[index];

      ctx.save();

      ctx.beginPath();

      ctx.arc(
        centerX,
        centerY,
        radius,
        0,
        Math.PI * 2
      );

      ctx.clip();

      ctx.fillStyle = member.bg;

      ctx.fillRect(
        avatarX,
        avatarY,
        avatarSize,
        avatarSize
      );

      if (avatar) {
        const width = avatar.naturalWidth || avatar.width;
        const height = avatar.naturalHeight || avatar.height;

        const cropSize = Math.min(width, height);

        const cropX = (width - cropSize) / 2;
        const cropY = (height - cropSize) / 2;

        ctx.drawImage(
          avatar,

          cropX,
          cropY,
          cropSize,
          cropSize,

          avatarX,
          avatarY,
          avatarSize,
          avatarSize
        );
      } else {
        /*
          Initials fallback if GitHub is unavailable.
        */

        ctx.fillStyle = member.ink;

        ctx.font = '600 82px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText(
          member.initials,
          centerX,
          centerY
        );
      }

      ctx.restore();

      /*
        Name.
      */

      ctx.fillStyle = '#192923';

      ctx.font = '700 38px Arial, sans-serif';

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.fillText(
        member.name,
        centerX,
        cardY + 660,
        cardWidth - 42
      );

      /*
        Role.
      */

      ctx.fillStyle = '#62766e';

      ctx.font = '500 27px Arial, sans-serif';

      ctx.fillText(
        member.role,
        centerX,
        cardY + 735,
        cardWidth - 42
      );
    });

    ctx.restore();

    /*
      Convert the completed canvas into a Three.js texture.
    */

    const texture = new THREE.CanvasTexture(canvas);

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
  }

  function fail(error) {
    if (disposed || failed) return;

    failed = true;

    if (error) {
      console.error(
        'Samsung phone setup failed:',
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
    Update the active screen texture and transition
    between consecutive screens.
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
    Apply the GSAP pose to the 3D phone.
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
      The original screen faces -Z.
      Rotating the model 180 degrees presents it to the camera.
    */

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

  /*
    Reconstruct the Samsung display plane using
    the original display mesh's geometry.
  */

  function createScreenGeometry(source) {
    const positions = source.geometry?.attributes?.position;

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
    Attach two transparent layers over the original
    Samsung screen. This allows the screen transition
    to crossfade without replacing the actual glass.
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
    Load all four app screens and the generated team screen.

    The final "team-profiles" entry is generated locally;
    it is not a URL.
  */

  async function loadTextures(urls) {
    if (!renderer || disposed || !urls?.length) {
      return false;
    }

    const requestId = ++textureLoadId;

    loadedScreens = urls;

    const loader = new THREE.TextureLoader();

    try {
      const loaded = await Promise.all(
        urls.map((url) => {
          if (url === 'team-profiles') {
            return createTeamTexture();
          }

          return loader.loadAsync(url);
        })
      );

      if (disposed || requestId !== textureLoadId) {
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
            'The team profile texture could not be created.'
          );
        }

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
          width: texture.image?.naturalWidth ||
            texture.image?.width,

          height: texture.image?.naturalHeight ||
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
    React to screen-array changes.
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
    Initialize Three.js and load the Samsung model.
  */

  onMount(() => {
    try {
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

      environment = pmrem.fromScene(
        room,
        0.04
      ).texture;

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

        (error) => fail(error)
      );

      /*
        Resize handling.
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
      Cleanup.
    */

    return () => {
      disposed = true;
      ready = false;

      textureLoadId += 1;

      resizeObserver?.disconnect();

      textures.forEach((texture) =>
        texture?.dispose()
      );

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