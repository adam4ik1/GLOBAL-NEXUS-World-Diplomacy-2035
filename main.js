
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const wrap = document.getElementById('scene-wrap');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x080f20);
scene.fog = new THREE.FogExp2(0x080f20, 0.018);

const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 300);
camera.position.set(23, 21, 28);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
wrap.prepend(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 12;
controls.maxDistance = 62;
controls.maxPolarAngle = Math.PI / 2.05;
controls.target.set(0, 1, 0);

scene.add(new THREE.HemisphereLight(0x83caff, 0x11152d, 1.65));

const key = new THREE.DirectionalLight(0x8adfff, 2.4);
key.position.set(-12, 24, 12);
key.castShadow = true;
scene.add(key);

const violet = new THREE.PointLight(0x7b43ff, 55, 38);
violet.position.set(8, 8, -8);
scene.add(violet);

const cyanLight = new THREE.PointLight(0x00dfff, 50, 35);
cyanLight.position.set(-10, 7, 9);
scene.add(cyanLight);

const city = new THREE.Group();
scene.add(city);

const clickable = [];

const mat = (color, emissive = 0x000000, roughness = 0.55, metalness = 0.35) =>
    new THREE.MeshStandardMaterial({
        color, emissive,
        emissiveIntensity: emissive ? 0.65 : 0,
        roughness, metalness
    });

const groundMat = mat(0x101d35, 0x071b35, 0.8, 0.25);
const roadMat = mat(0x07101f, 0x06192c, 0.85, 0.2);

const glassMat = new THREE.MeshStandardMaterial({
    color: 0x193b5d,
    metalness: 0.7,
    roughness: 0.22,
    emissive: 0x082b4b,
    emissiveIntensity: 0.6
});

const cyanMat = new THREE.MeshBasicMaterial({ color: 0x1beaff });
const purpleMat = new THREE.MeshBasicMaterial({ color: 0xa66cff });

const whiteMat = new THREE.MeshStandardMaterial({
    color: 0xb9d9ee,
    metalness: 0.6,
    roughness: 0.3
});

function box(parent, w, h, d, material, x, y, z, cast = true) {
    const m = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        material
    );
    m.position.set(x, y, z);
    m.castShadow = cast;
    m.receiveShadow = true;
    parent.add(m);
    return m;
}

function line(points, material, radius = 0.035) {
    const curve = new THREE.CatmullRomCurve3(
        points.map(p => new THREE.Vector3(...p))
    );
    const mesh = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 64, radius, 6, false),
        material
    );
    city.add(mesh);
    return mesh;
}

// CITY ISLAND

const island = new THREE.Mesh(
    new THREE.CylinderGeometry(17.2, 16.1, 1.15, 8, 1),
    groundMat
);

island.position.y = -0.65;
island.receiveShadow = true;
city.add(island);

const rim = new THREE.Mesh(
    new THREE.TorusGeometry(16.8, 0.075, 8, 120),
    cyanMat
);
rim.rotation.x = Math.PI / 2;
rim.position.y = -0.04;
city.add(rim);

const innerRim = new THREE.Mesh(
    new THREE.TorusGeometry(15.9, 0.035, 6, 120),
    purpleMat
);
innerRim.rotation.x = Math.PI / 2;
innerRim.position.y = -0.02;
city.add(innerRim);

// GRID

for (let i = -15; i <= 15; i += 1.5) {
    box(city, 0.012, 0.012, 30,
        new THREE.MeshBasicMaterial({
            color: 0x1a4770,
            transparent: true,
            opacity: 0.36
        }), i, -0.055, 0, false);

    box(city, 30, 0.012, 0.012,
        new THREE.MeshBasicMaterial({
            color: 0x1a4770,
            transparent: true,
            opacity: 0.36
        }), 0, -0.055, i, false);
}

// ROADS

for (let a = 0; a < 8; a++) {
    const road = box(city, 1.35, 0.035, 31, roadMat, 0, 0.01, 0, false);
    road.rotation.y = a * Math.PI / 4;
}

const ringRoad = new THREE.Mesh(
    new THREE.TorusGeometry(11.5, 0.68, 8, 100),
    roadMat
);
ringRoad.rotation.x = Math.PI / 2;
ringRoad.position.y = 0.03;
city.add(ringRoad);

const ringGlow = new THREE.Mesh(
    new THREE.TorusGeometry(12.22, 0.025, 5, 100),
    cyanMat
);
ringGlow.rotation.x = Math.PI / 2;
ringGlow.position.y = 0.06;
city.add(ringGlow);

// DIPLOMATIC INSTITUTIONS

const buildings = [
    {
        id: 0,
        name: 'United Nations Forum',
        type: 'MULTILATERAL DIPLOMACY',
        icon: '◎',
        pos: [0, 0, -1.1],
        height: 5.7,
        color: 0x1c86ad,
        desc: 'A central forum for member states to debate global challenges, negotiate resolutions and coordinate collective action.',
        func: 'Multilateral negotiation',
        impact: 'Peace, security & cooperation',
        tags: ['UN SYSTEM', 'DIALOGUE', 'RESOLUTIONS'],
        shape: 'forum'
    },
    {
        id: 1,
        name: 'Embassy Quarter',
        type: 'BILATERAL RELATIONS',
        icon: '⌂',
        pos: [-8.4, 0, -6.2],
        height: 4.2,
        color: 0x2877bd,
        desc: 'A network of diplomatic missions that represent national interests, support citizens abroad and maintain direct relations between governments.',
        func: 'State representation',
        impact: 'Bilateral partnerships',
        tags: ['EMBASSIES', 'CONSULAR', 'PROTOCOL'],
        shape: 'towers'
    },
    {
        id: 2,
        name: 'Peace & Security Council',
        type: 'CONFLICT PREVENTION',
        icon: '✧',
        pos: [8.1, 0, -6.5],
        height: 5.0,
        color: 0x7852c8,
        desc: 'A strategic institution focused on conflict prevention, mediation, peacebuilding and international security cooperation.',
        func: 'Mediation & peacebuilding',
        impact: 'Conflict de-escalation',
        tags: ['SECURITY', 'MEDIATION', 'PEACE'],
        shape: 'council'
    },
    {
        id: 3,
        name: 'Global Trade Exchange',
        type: 'INTERNATIONAL ECONOMY',
        icon: '◇',
        pos: [-8.9, 0, 5.7],
        height: 4.8,
        color: 0x168f9d,
        desc: 'A hub for trade diplomacy, investment dialogue and economic partnerships that connect markets and support predictable international commerce.',
        func: 'Trade & investment diplomacy',
        impact: 'Economic interdependence',
        tags: ['TRADE', 'INVESTMENT', 'WTO'],
        shape: 'exchange'
    },
    {
        id: 4,
        name: 'Climate Action Centre',
        type: 'GLOBAL GOVERNANCE',
        icon: '♧',
        pos: [8.7, 0, 5.6],
        height: 4.5,
        color: 0x299b83,
        desc: 'Coordinates climate negotiations, environmental agreements and cross-border initiatives for sustainable development.',
        func: 'Climate negotiations',
        impact: 'Sustainable development',
        tags: ['CLIMATE', 'COP', 'SDGs'],
        shape: 'green'
    },
    {
        id: 5,
        name: 'International Court',
        type: 'INTERNATIONAL LAW',
        icon: '⚖',
        pos: [0, 0, 9.4],
        height: 4.0,
        color: 0x9a6a42,
        desc: 'A symbolic centre for international justice, legal dialogue and the peaceful settlement of disputes under international law.',
        func: 'Legal dispute settlement',
        impact: 'Rule of law',
        tags: ['JUSTICE', 'ICJ', 'LEGAL ORDER'],
        shape: 'court'
    },
    {
        id: 6,
        name: 'Cultural Exchange Pavilion',
        type: 'PUBLIC DIPLOMACY',
        icon: '✿',
        pos: [-1.3, 0, -10.2],
        height: 3.7,
        color: 0xa34c9a,
        desc: 'Connects societies through education, cultural programs, academic partnerships and people-to-people diplomacy.',
        func: 'Cultural & educational exchange',
        impact: 'Mutual understanding',
        tags: ['CULTURE', 'EDUCATION', 'UNESCO'],
        shape: 'pavilion'
    },
    {
        id: 7,
        name: 'Global Media Centre',
        type: 'STRATEGIC COMMUNICATION',
        icon: '◉',
        pos: [-13, 0, -0.2],
        height: 3.6,
        color: 0x387fc0,
        desc: 'A media and information hub for international communication, press briefings, public diplomacy and countering misinformation.',
        func: 'Diplomatic communication',
        impact: 'Informed global public',
        tags: ['MEDIA', 'BRIEFINGS', 'INFORMATION'],
        shape: 'media'
    },
    {
        id: 8,
        name: 'Development Partnership Bank',
        type: 'GLOBAL DEVELOPMENT FINANCE',
        icon: '▤',
        pos: [13, 0, 0.3],
        height: 4.6,
        color: 0x8762c8,
        desc: 'Supports development cooperation through infrastructure finance, technical assistance and partnerships between countries and institutions.',
        func: 'Development finance',
        impact: 'Inclusive growth',
        tags: ['FINANCE', 'DEVELOPMENT', 'SDGs'],
        shape: 'bank'
    }
];

// BUILDING GENERATOR

function makeTower(parent, x, z, h, color, wide = 1.8) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    parent.add(g);

    const base = mat(color, 0x06152b, 0.28, 0.7);

    box(g, wide * 0.8, 0.35, wide * 0.8, base, 0, 0.18, 0);
    box(g, wide, h, wide, glassMat, 0, h / 2 + 0.3, 0);

    for (let y = 0.75; y < h; y += 0.55) {
        const strip = box(
            g, wide + 0.025, 0.045, wide + 0.025,
            new THREE.MeshBasicMaterial({ color }),
            0, y, 0, false
        );
        strip.material.transparent = true;
        strip.material.opacity = 0.8;
    }

    box(g, wide * 0.7, 0.12, wide * 0.7,
        cyanMat, 0, h + 0.36, 0, false);

    return g;
}

function createBuilding(data) {
    const g = new THREE.Group();
    g.position.set(...data.pos);
    city.add(g);

    const baseColor = new THREE.MeshStandardMaterial({
        color: data.color,
        metalness: 0.62,
        roughness: 0.3,
        emissive: data.color,
        emissiveIntensity: 0.12
    });

    box(g, 4.1, 0.35, 3.5, mat(0x142d49), 0, 0.18, 0);

    if (data.shape === 'forum') {
        const cyl = new THREE.Mesh(
            new THREE.CylinderGeometry(1.65, 2.0, 2.3, 12),
            baseColor
        );
        cyl.position.y = 1.5;
        g.add(cyl);

        const roof = new THREE.Mesh(
            new THREE.CylinderGeometry(2.2, 1.7, 0.42, 12),
            cyanMat
        );
        roof.position.y = 2.85;
        g.add(roof);

        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(1.85, 0.055, 8, 48),
            purpleMat
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 2.3;
        g.add(ring);

        for (let k = 0; k < 8; k++) {
            const a = k * Math.PI / 4;
            box(g, 0.13, 2.4, 0.13, whiteMat,
                Math.cos(a) * 1.78, 1.45, Math.sin(a) * 1.45);
        }
    } else if (data.shape === 'towers') {
        makeTower(g, -0.85, 0, 4.1, data.color, 1.15);
        makeTower(g, 0.75, -0.2, 3.1, 0x367ca9, 0.95);
    } else if (data.shape === 'council') {
        const c = new THREE.Mesh(
            new THREE.CylinderGeometry(1.7, 2.2, 2.8, 8),
            baseColor
        );
        c.position.y = 1.7;
        g.add(c);

        const roof = new THREE.Mesh(
            new THREE.ConeGeometry(2.05, 0.8, 8),
            purpleMat
        );
        roof.position.y = 3.5;
        g.add(roof);
    } else if (data.shape === 'exchange' || data.shape === 'bank') {
        for (let i = 0; i < 3; i++) {
            makeTower(
                g, (i - 1) * 0.95, 0,
                data.height - (Math.abs(i - 1) * 0.8),
                data.color, 0.72
            );
        }
    } else if (data.shape === 'green') {
        const c = new THREE.Mesh(
            new THREE.CylinderGeometry(1.55, 1.8, 2.2, 10),
            baseColor
        );
        c.position.y = 1.35;
        g.add(c);

        for (let i = 0; i < 5; i++) {
            const leaf = new THREE.Mesh(
                new THREE.SphereGeometry(0.55, 10, 8),
                mat(0x27b990, 0x0b573e)
            );
            leaf.scale.set(1.4, 0.35, 0.55);
            leaf.position.set(
                Math.cos(i * 1.25) * 1.25,
                2.6 + Math.sin(i * 1.25) * 0.5,
                Math.sin(i * 1.25) * 1.15
            );
            g.add(leaf);
        }
    } else if (data.shape === 'court') {
        const c = new THREE.Mesh(
            new THREE.CylinderGeometry(1.8, 1.8, 1.5, 12),
            baseColor
        );
        c.position.y = 1;
        g.add(c);

        for (let i = -2; i <= 2; i++) {
            box(g, 0.18, 2.5, 0.18, whiteMat, i * 0.58, 1.9, -0.8);
        }

        box(g, 2.6, 0.18, 1.7, purpleMat, 0, 3.2, 0);
    } else if (data.shape === 'pavilion') {
        const c = new THREE.Mesh(
            new THREE.CylinderGeometry(1.45, 1.8, 1.6, 6),
            baseColor
        );
        c.position.y = 1;
        g.add(c);

        const roof = new THREE.Mesh(
            new THREE.ConeGeometry(2.2, 1.2, 6),
            purpleMat
        );
        roof.position.y = 2.5;
        g.add(roof);
    } else if (data.shape === 'media') {
        makeTower(g, 0, 0, 3.3, data.color, 1.6);

        const dish = new THREE.Mesh(
            new THREE.TorusGeometry(0.65, 0.08, 8, 24),
            whiteMat
        );
        dish.position.set(0, 3.8, 0);
        dish.rotation.x = 0.7;
        g.add(dish);
    }

    // INTERACTIVE BEACON

    const beacon = new THREE.Mesh(
        new THREE.SphereGeometry(0.13, 12, 12),
        cyanMat
    );
    beacon.position.y = data.height + 0.7;
    g.add(beacon);

    const halo = new THREE.Mesh(
        new THREE.TorusGeometry(0.42, 0.025, 6, 32),
        cyanMat
    );
    halo.rotation.x = Math.PI / 2;
    halo.position.y = data.height + 0.7;
    g.add(halo);

    const hit = new THREE.Mesh(
        new THREE.BoxGeometry(4.5, data.height + 2.5, 4.1),
        new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0,
            depthWrite: false
        })
    );

    hit.position.y = (data.height + 1) / 2;
    hit.userData.building = data;
    g.add(hit);
    clickable.push(hit);

    return { g, beacon, halo };
}

const buildingMeshes = buildings.map(createBuilding);

// CITY DETAILS

for (let i = 0; i < 28; i++) {
    const a = i / 28 * Math.PI * 2;
    const r = 14.1;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;

    box(city, 0.09, 0.8, 0.09,
        mat(0x315a83, 0x12304f), x, 0.35, z);

    const lamp = new THREE.Mesh(
        new THREE.SphereGeometry(0.11, 8, 8),
        i % 2 ? cyanMat : purpleMat
    );

    lamp.position.set(x, 0.82, z);
    city.add(lamp);
}

// TREES

for (let i = 0; i < 16; i++) {
    const a = i / 16 * Math.PI * 2;
    const r = 7.6;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;

    box(city, 0.16, 0.7, 0.16,
        mat(0x594c57), x, 0.35, z);

    const crown = new THREE.Mesh(
        new THREE.SphereGeometry(0.48, 8, 8),
        mat(0x125b66, 0x062a35)
    );

    crown.position.set(x, 0.95, z);
    city.add(crown);
}

// INTERNATIONAL FLAGS

const flagColors = [
    0x27d8f2, 0xa66cff, 0xf5d36b,
    0x48e0ae, 0xf47c9d, 0x7eaaff
];

for (let i = 0; i < 6; i++) {
    const a = i * Math.PI / 3;
    const x = Math.cos(a) * 3.2;
    const z = Math.sin(a) * 3.2;

    box(city, 0.045, 1.5, 0.045,
        whiteMat, x, 0.95, z);

    box(city, 0.48, 0.26, 0.025,
        new THREE.MeshBasicMaterial({ color: flagColors[i] }),
        x + 0.23, 1.48, z, false);
}

// DATA PARTICLES

const particles = new THREE.Group();
city.add(particles);

for (let i = 0; i < 75; i++) {
    const p = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 6, 6),
        i % 3 === 0 ? purpleMat : cyanMat
    );

    const a = Math.random() * Math.PI * 2;
    const r = 4 + Math.random() * 11;

    p.position.set(
        Math.cos(a) * r,
        0.35 + Math.random() * 4,
        Math.sin(a) * r
    );

    p.userData = {
        a, r,
        s: 0.001 + Math.random() * 0.002
    };

    particles.add(p);
}

// DIPLOMATIC NETWORK CONNECTIONS

const routeMat = new THREE.MeshBasicMaterial({
    color: 0x1ba8d5,
    transparent: true,
    opacity: 0.48
});

const routePairs = [
    [0, 1], [0, 2], [0, 3], [0, 4],
    [0, 5], [0, 6], [0, 7], [0, 8],
    [1, 7], [2, 8], [3, 4]
];

for (const [a, b] of routePairs) {
    const A = buildings[a].pos;
    const B = buildings[b].pos;

    line([
        [A[0], 0.28, A[2]],
        [A[0] * 0.55, 0.8, (A[2] + B[2]) * 0.5],
        [B[0], 0.28, B[2]]
    ], routeMat, 0.018);
}

// BUILDING SELECTION

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let selected = null;

function selectBuilding(data) {
    selected = data;

    document.getElementById('emptyInfo').classList.add('hidden');
    document.getElementById('buildingInfo').classList.remove('hidden');

    document.getElementById('infoIcon').textContent = data.icon;
    document.getElementById('infoType').textContent = data.type;
    document.getElementById('infoTitle').textContent = data.name;
    document.getElementById('infoDescription').textContent = data.desc;
    document.getElementById('infoFunction').textContent = data.func;
    document.getElementById('infoImpact').textContent = data.impact;

    document.getElementById('infoTags').innerHTML =
        data.tags.map(t => `<span>${t}</span>`).join('');

    document.getElementById('objectCount').textContent =
        String(data.id + 1).padStart(2, '0') + ' / 09';

    buildingMeshes.forEach((b, i) => {
        b.halo.material = i === data.id ? purpleMat : cyanMat;
        b.halo.scale.setScalar(i === data.id ? 1.5 : 1);
    });
}

renderer.domElement.addEventListener('pointerdown', e => {
    const rect = renderer.domElement.getBoundingClientRect();

    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    const hits = raycaster.intersectObjects(clickable, false);

    if (hits.length) {
        selectBuilding(hits[0].object.userData.building);
    }
});

// RESIZE

function resize() {
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;

    if (!w || !h) return;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
}

window.addEventListener('resize', resize);
resize();

// RESET CAMERA

document.getElementById('resetBtn').addEventListener('click', () => {
    camera.position.set(23, 21, 28);
    controls.target.set(0, 1, 0);
    controls.update();

    document.getElementById('toast').textContent =
        'VIEW RESET TO GLOBAL DISTRICT';

    showToast();
});

// DAY AND NIGHT MODE

document.getElementById('themeBtn').addEventListener('click', () => {
    document.body.classList.toggle('day');

    const day = document.body.classList.contains('day');

    document.getElementById('themeBtn').textContent =
        day ? '☾ NIGHT MODE' : '☼ DAYLIGHT';

    scene.background.set(day ? 0x182c46 : 0x080f20);
    scene.fog.color.set(day ? 0x182c46 : 0x080f20);

    key.intensity = day ? 3.1 : 2.4;

    showToast(
        day ? 'DAYLIGHT SIMULATION ENABLED' : 'NIGHT MODE ENABLED'
    );
});

// NOTIFICATIONS

function showToast(message) {
    const t = document.getElementById('toast');

    if (message) t.textContent = message;

    t.classList.add('show');

    setTimeout(() => t.classList.remove('show'), 1700);
}

// ANIMATION

let clock = 0;

function animate() {
    requestAnimationFrame(animate);

    clock += 0.01;
    controls.update();

    city.rotation.y = Math.sin(clock * 0.08) * 0.008;

    buildingMeshes.forEach((b, i) => {
        b.beacon.position.y =
            buildings[i].height + 0.7 + Math.sin(clock * 2 + i) * 0.08;

        b.halo.rotation.z += 0.006;
    });

    particles.children.forEach(p => {
        p.userData.a += p.userData.s;

        p.position.x = Math.cos(p.userData.a) * p.userData.r;
        p.position.z = Math.sin(p.userData.a) * p.userData.r;
    });

    renderer.render(scene, camera);
}

animate();

document.getElementById('loading').style.opacity = '0';

setTimeout(() => {
    document.getElementById('loading')?.remove();
}, 550);
