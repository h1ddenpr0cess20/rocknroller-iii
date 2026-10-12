/**
 * The machinery of the world tour, as it is drawn, joining machinery.js's:
 * what comes down on the beat at each stop, what Rock rides across the
 * gaps, what he bounces off, and what bursts out of the floor.
 *
 * Drops (`look.crusher`), each built `w` by `d` and `height` tall round its
 * middle, swaying a little as it waits at the top: London's red phone
 * boxes, a row of upright pianos (Paris has a lot of pianos on balconies),
 * Venice's window boxes of geraniums, the Alps' snowballs, Spain's church
 * bells, Egypt's sandstone blocks, Tokyo's vending machines, Rio's surdo
 * drums and New York's safes.
 *
 * Rides (`look.lift`), `w` by `d` with the deck on top: a gondola, a cable
 * car under its cable, a bullet train's flatbed, a flying carpet, a felucca
 * under sail, a carnival float, a surfboard, a harbour ferry.
 *
 * Bumpers (`look` of a bumper): a London bollard, a snowman, a palm, a
 * traffic cone, a stone lantern, a Venetian mooring pole, an amphora.
 *
 * And what bursts out of the floor (`look.pyro`): a snow cannon, a sand
 * spout, a fountain or fireworks, besides machinery.js's flame and steam.
 */

const mat = (GFX, hex, o = {}) => new GFX.MeshStandardMaterial({ color: new GFX.Color(hex), roughness: 0.6, ...o });
const glowMat = (GFX, hex) => new GFX.MeshBasicMaterial({ color: new GFX.Color(hex), toneMapped: false });
const shadow = (m) => { m.castShadow = true; m.receiveShadow = true; return m; };

/** `n` of something along the long side of a `w` by `d` footprint, each made by `one(group, size)` round its own middle. */
function row(GFX, { w, d }, one, per = 1) {
  const group = new GFX.Group();
  const long = w >= d, L = long ? w : d, S = long ? d : w;
  const n = Math.max(1, Math.round(L / per));
  const step = L / n;
  for (let i = 0; i < n; i++) {
    const g = new GFX.Group();
    const a = -L / 2 + step * (i + 0.5);
    g.position.set(long ? a : 0, 0, long ? 0 : a);
    if (!long) g.rotation.y = Math.PI / 2;
    one(g, Math.min(step, S), i);
    group.add(g);
  }
  return { group, long, L, S };
}

/** A rope or a chain up into the dark from the top of a drop, `len` long. */
function hangers(GFX, group, { w, d, height }, colour = '#2a2a30', r = 0.025) {
  const long = w >= d, L = long ? w : d;
  for (const e of L > 1.4 ? [-1, 1] : [0]) {
    const off = e * (L / 2 - 0.2);
    const m = new GFX.Mesh(new GFX.CylinderGeometry(r, r, 8, 6), mat(GFX, colour, { metalness: 0.6 }));
    m.position.set(long ? off : 0, height / 2 + 4, long ? 0 : off);
    group.add(m);
  }
}

// ———————————————————————————————————————————————— drops

function phonebox(GFX, { w, d, height }) {
  const red = mat(GFX, '#c8102e', { roughness: 0.35 });
  const pane = mat(GFX, '#1a2430', { roughness: 0.1, metalness: 0.3 });
  const sign = glowMat(GFX, '#fff4d8');
  const out = row(GFX, { w, d }, (g, s) => {
    const W = Math.min(0.92, s * 0.92), H = height;
    g.add(shadow(new GFX.Mesh(new GFX.BoxGeometry(W, H * 0.86, W), red)));
    const roof = new GFX.Mesh(new GFX.CylinderGeometry(W * 0.56, W * 0.56, W * 1.02, 16, 1, false, 0, Math.PI), red);
    roof.rotation.set(0, 0, Math.PI / 2);
    roof.scale.set(0.35, 1, 1);
    roof.position.y = H * 0.43;
    g.add(shadow(roof));
    for (const side of [-1, 1]) {
      for (const axis of ['x', 'z']) {
        // A grid of little panes in each face, and the TELEPHONE sign over them.
        for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
          const p = new GFX.Mesh(new GFX.BoxGeometry(axis === 'z' ? W * 0.22 : 0.02, H * 0.13, axis === 'z' ? 0.02 : W * 0.22), pane);
          const u = (c - 1) * W * 0.26, y = -H * 0.25 + r * H * 0.16;
          p.position.set(axis === 'z' ? u : side * (W / 2 + 0.005), y, axis === 'z' ? side * (W / 2 + 0.005) : u);
          g.add(p);
        }
        const strip = new GFX.Mesh(new GFX.BoxGeometry(axis === 'z' ? W * 0.7 : 0.02, H * 0.06, axis === 'z' ? 0.02 : W * 0.7), sign);
        strip.position.set(axis === 'z' ? 0 : side * (W / 2 + 0.01), H * 0.36, axis === 'z' ? side * (W / 2 + 0.01) : 0);
        g.add(strip);
      }
    }
  });
  hangers(GFX, out.group, { w, d, height });
  return { group: out.group, update(up, time) { out.group.rotation.y = up > 0.99 ? Math.sin(time * 1.4) * 0.03 : 0; } };
}

function piano(GFX, { w, d, height }) {
  const black = new GFX.MeshPhysicalMaterial({ color: new GFX.Color('#0e0e12'), roughness: 0.2, clearcoat: 1 });
  const ivory = mat(GFX, '#f4f0e8', { roughness: 0.3 });
  const out = row(GFX, { w, d }, (g, s) => {
    const W = s * 0.92;
    g.add(shadow(new GFX.Mesh(new GFX.BoxGeometry(W, height, 0.5), black)));
    const keys = new GFX.Mesh(new GFX.BoxGeometry(W * 0.86, 0.05, 0.2), ivory);
    keys.position.set(0, -height * 0.05, 0.33);
    const shelf = new GFX.Mesh(new GFX.BoxGeometry(W, 0.08, 0.24), black);
    shelf.position.set(0, -height * 0.1, 0.33);
    g.add(shelf, keys);
  }, 1.4);
  hangers(GFX, out.group, { w, d, height }, '#b8a888', 0.03);
  return { group: out.group, update(up, time) { out.group.rotation.z = up > 0.99 ? Math.sin(time * 1.6) * 0.03 : 0; } };
}

function flowerpot(GFX, { w, d, height }) {
  const terracotta = mat(GFX, '#c8643a', { roughness: 0.85 });
  const leaf = mat(GFX, '#2a6a2a', { roughness: 0.8 });
  const blooms = ['#e81c3a', '#ff4a6a', '#f4f0e8', '#ff8ab0'].map((c) => mat(GFX, c, { roughness: 0.7 }));
  const out = row(GFX, { w, d }, (g, s, i) => {
    const W = s * 0.94;
    const trough = new GFX.Mesh(new GFX.BoxGeometry(W, height * 0.6, 0.55), terracotta);
    trough.position.y = -height * 0.2;
    g.add(shadow(trough));
    const bush = new GFX.Mesh(new GFX.SphereGeometry(0.5, 12, 8), leaf);
    bush.scale.set(W * 0.95, height * 0.55, 0.6);
    bush.position.y = height * 0.15;
    g.add(bush);
    for (let k = 0; k < 9; k++) {
      const b = new GFX.Mesh(new GFX.SphereGeometry(0.09, 8, 6), blooms[(k + i) % blooms.length]);
      b.position.set((k / 8 - 0.5) * W * 0.85, height * (0.2 + 0.18 * Math.sin(k * 2.1)), 0.18 * Math.cos(k * 1.7));
      g.add(b);
    }
  });
  hangers(GFX, out.group, { w, d, height }, '#4a3a2a', 0.02);
  return { group: out.group, update(up, time) { out.group.rotation.x = up > 0.99 ? Math.sin(time * 1.2) * 0.03 : 0; } };
}

function snowball(GFX, { w, d, height }) {
  const snow = mat(GFX, '#f4f8ff', { roughness: 0.75, emissive: new GFX.Color('#506080'), emissiveIntensity: 0.15 });
  const out = row(GFX, { w, d }, (g, s) => {
    const ball = new GFX.Mesh(new GFX.IcosahedronGeometry(0.5, 2), snow);
    ball.scale.set(s * 0.98, height * 1.05, Math.min(s, height) * 0.98);
    g.add(shadow(ball));
  }, 1.2);
  return { group: out.group, update(up, time) { out.group.children.forEach((c, i) => { c.rotation.x = time * (up < 0.99 ? 6 : 0.2) + i; }); } };
}

function bell(GFX, { w, d, height }) {
  const bronze = mat(GFX, '#a8783a', { metalness: 0.9, roughness: 0.35 });
  const wood = mat(GFX, '#4a2e18', { roughness: 0.8 });
  const out = row(GFX, { w, d }, (g, s) => {
    const r = Math.min(s, 1.2) * 0.48;
    const body = new GFX.Mesh(new GFX.CylinderGeometry(r * 0.55, r, height * 0.8, 20, 1, true), bronze);
    body.material.side = GFX.DoubleSide;
    g.add(shadow(body));
    const crown = new GFX.Mesh(new GFX.SphereGeometry(r * 0.56, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), bronze);
    crown.position.y = height * 0.4;
    const lip = new GFX.Mesh(new GFX.TorusGeometry(r, 0.05, 6, 24), bronze);
    lip.rotation.x = Math.PI / 2;
    lip.position.y = -height * 0.4;
    const clapper = new GFX.Mesh(new GFX.SphereGeometry(r * 0.2, 10, 8), bronze);
    clapper.position.y = -height * 0.3;
    const yoke = new GFX.Mesh(new GFX.BoxGeometry(s * 0.95, 0.16, 0.2), wood);
    yoke.position.y = height * 0.62;
    g.add(crown, lip, clapper, yoke);
  }, 1.4);
  hangers(GFX, out.group, { w, d, height });
  return { group: out.group, update(up, time) { out.group.children.forEach((c, i) => { c.rotation.z = up > 0.99 ? Math.sin(time * 2.4 + i) * 0.18 : 0; }); } };
}

function block(GFX, { w, d, height }) {
  const group = new GFX.Group();
  const stone = mat(GFX, '#c8a670', { roughness: 0.95, flatShading: true });
  const body = new GFX.Mesh(new GFX.BoxGeometry(w * 0.98, height, d * 0.98, Math.max(1, Math.round(w * 2)), 2, Math.max(1, Math.round(d * 2))), stone);
  const p = body.geometry.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const k = 0.04 * Math.sin(x * 7.1 + z * 3.3) * Math.cos(y * 5.7 - x * 2.1);
    p.setXYZ(i, x + k, y + k * 0.6, z - k);
  }
  body.geometry.computeVertexNormals();
  group.add(shadow(body));
  const rope = mat(GFX, '#8a6a42', { roughness: 0.95 });
  const long = w >= d;
  for (const e of [-0.3, 0.3]) {
    const sling = new GFX.Mesh(new GFX.TorusGeometry(1, 0.035, 5, 24), rope);
    sling.scale.set(long ? d * 0.52 : w * 0.52, height * 0.55, 1);
    sling.rotation.y = long ? Math.PI / 2 : 0;
    sling.position.set(long ? e * w : 0, 0, long ? 0 : e * d);
    group.add(sling);
  }
  hangers(GFX, group, { w, d, height }, '#8a6a42', 0.04);
  return { group, update() {} };
}

function vending(GFX, { w, d, height }) {
  const bodies = ['#f4f4f0', '#d81c2a', '#2a6ad8'].map((c) => mat(GFX, c, { roughness: 0.3 }));
  const lit = glowMat(GFX, '#e8f4ff');
  const cans = ['#ff3a3a', '#3aa0ff', '#ffd23a', '#3ae88a', '#ff8a2a'].map((c) => glowMat(GFX, c));
  const out = row(GFX, { w, d }, (g, s, i) => {
    const W = s * 0.92;
    g.add(shadow(new GFX.Mesh(new GFX.BoxGeometry(W, height, 0.7), bodies[i % bodies.length])));
    const panel = new GFX.Mesh(new GFX.BoxGeometry(W * 0.8, height * 0.5, 0.02), lit);
    panel.position.set(0, height * 0.18, 0.36);
    g.add(panel);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) {
      const can = new GFX.Mesh(new GFX.CylinderGeometry(0.035, 0.035, 0.1, 8), cans[(r * 6 + c + i) % cans.length]);
      can.position.set((c / 5 - 0.5) * W * 0.68, height * 0.02 + r * height * 0.14, 0.38);
      g.add(can);
    }
  });
  hangers(GFX, out.group, { w, d, height });
  return { group: out.group, update() {} };
}

function surdo(GFX, { w, d, height }) {
  const shells = ['#e8c020', '#2a9a4a', '#2a5ad8'].map((c) => mat(GFX, c, { metalness: 0.5, roughness: 0.3 }));
  const head = mat(GFX, '#f4f0e8', { roughness: 0.6 });
  const chrome = mat(GFX, '#e0e4ec', { metalness: 1, roughness: 0.2 });
  const out = row(GFX, { w, d }, (g, s, i) => {
    const r = Math.min(s, 1.2) * 0.46;
    const drum = new GFX.Mesh(new GFX.CylinderGeometry(r, r, height * 0.9, 20), shells[i % shells.length]);
    drum.rotation.z = Math.PI / 2;
    g.add(shadow(drum));
    for (const e of [-1, 1]) {
      const skin = new GFX.Mesh(new GFX.CircleGeometry(r * 0.95, 20), head);
      skin.rotation.y = e * Math.PI / 2;
      skin.position.x = e * height * 0.451;
      const hoop = new GFX.Mesh(new GFX.TorusGeometry(r, 0.035, 6, 24), chrome);
      hoop.rotation.y = Math.PI / 2;
      hoop.position.x = e * height * 0.44;
      g.add(skin, hoop);
    }
  }, 1.2);
  hangers(GFX, out.group, { w, d, height }, '#c8c8d0', 0.02);
  return { group: out.group, update(up, time) { out.group.children.forEach((c, i) => { c.rotation.x = up > 0.99 ? Math.sin(time * 3 + i) * 0.08 : 0; }); } };
}

function safe(GFX, { w, d, height }) {
  const steel = mat(GFX, '#3a4048', { metalness: 0.8, roughness: 0.4 });
  const brass = mat(GFX, '#d8b050', { metalness: 1, roughness: 0.3 });
  const out = row(GFX, { w, d }, (g, s) => {
    const W = Math.min(s, 1.1) * 0.9;
    g.add(shadow(new GFX.Mesh(new GFX.BoxGeometry(W, height, W), steel)));
    const dial = new GFX.Mesh(new GFX.CylinderGeometry(W * 0.14, W * 0.14, 0.04, 16), brass);
    dial.rotation.x = Math.PI / 2;
    dial.position.set(0, 0, W / 2 + 0.02);
    const handle = new GFX.Mesh(new GFX.TorusGeometry(W * 0.1, 0.02, 6, 12), brass);
    handle.position.set(W * 0.28, 0, W / 2 + 0.02);
    g.add(dial, handle);
  }, 1.2);
  hangers(GFX, out.group, { w, d, height }, '#b8a888', 0.03);
  return { group: out.group, update(up, time) { out.group.rotation.y = up > 0.99 ? Math.sin(time * 1.1) * 0.05 : 0; } };
}

export const DROPS = { phonebox, piano, flowerpot, snowball, bell, block, vending, surdo, safe };

// ———————————————————————————————————————————————— rides

/** A long boat hull under a deck `w` by `d`, along its long side: a box with a raised, pointed end each way. */
function hull(GFX, group, { w, d, thickness }, colour, { rise = 0.4, beak = 0.6 } = {}) {
  const long = w >= d, L = long ? w : d, S = long ? d : w;
  const paint = new GFX.MeshPhysicalMaterial({ color: new GFX.Color(colour), roughness: 0.3, clearcoat: 0.6 });
  const holder = new GFX.Group();
  if (!long) holder.rotation.y = Math.PI / 2;
  group.add(holder);
  holder.add(shadow(new GFX.Mesh(new GFX.BoxGeometry(L * 0.8, thickness * 1.6, S), paint)));
  for (const e of [-1, 1]) {
    const end = new GFX.Mesh(new GFX.ConeGeometry(S * 0.5, L * 0.2 + beak, 4), paint);
    end.rotation.set(0, Math.PI / 4, e * -Math.PI / 2 + e * -rise * 0.4);
    end.scale.set(1, 1, 0.7);
    end.position.set(e * (L * 0.4 + (L * 0.2 + beak) / 2 - 0.1), rise * 0.3, 0);
    holder.add(end);
  }
  return { holder, long, L, S, paint };
}

function gondola(GFX, { w, d, thickness }) {
  const group = new GFX.Group();
  const { holder, L, S } = hull(GFX, group, { w, d, thickness }, '#0e0e12', { rise: 0.9, beak: 0.5 });
  const gold = mat(GFX, '#d8b050', { metalness: 1, roughness: 0.3 });
  const trim = new GFX.Mesh(new GFX.BoxGeometry(L * 0.82, 0.04, S + 0.04), gold);
  trim.position.y = thickness * 0.5;
  holder.add(trim);
  // The ferro at the prow: a steel blade with its six teeth.
  const steel = mat(GFX, '#c8ccd4', { metalness: 1, roughness: 0.25 });
  const ferro = new GFX.Mesh(new GFX.BoxGeometry(0.06, 0.6, 0.02), steel);
  ferro.position.set(L * 0.5 + 0.55, 0.55, 0);
  holder.add(ferro);
  for (let i = 0; i < 6; i++) {
    const tooth = new GFX.Mesh(new GFX.BoxGeometry(0.16, 0.035, 0.02), steel);
    tooth.position.set(L * 0.5 + 0.63, 0.35 + i * 0.07, 0);
    holder.add(tooth);
  }
  // The oar, in its forcola at the stern.
  const oar = new GFX.Mesh(new GFX.CylinderGeometry(0.03, 0.03, 2.4, 6), mat(GFX, '#c8a070'));
  oar.position.set(-L * 0.4, 0.4, S * 0.45);
  oar.rotation.z = 0.9;
  holder.add(oar);
  return { group, live(time) { group.rotation.z = Math.sin(time * 1.3) * 0.02; } };
}

function cablecar(GFX, { w, d, thickness, lift }) {
  const group = new GFX.Group();
  const red = mat(GFX, '#c8102e', { roughness: 0.35 });
  const glass = mat(GFX, '#3a5a7a', { roughness: 0.05, metalness: 0.4 });
  const steel = mat(GFX, '#9aa0aa', { metalness: 0.9, roughness: 0.3 });
  const top = thickness / 2;
  // The floor of the cabin, its walls low enough to see over, a window band, and the hanger up to the cable.
  group.add(shadow(new GFX.Mesh(new GFX.BoxGeometry(w, thickness, d), red)));
  for (const [sx, sz, lx, lz] of [[0, -1, w, 0.08], [0, 1, w, 0.08], [-1, 0, 0.08, d], [1, 0, 0.08, d]]) {
    const wall = new GFX.Mesh(new GFX.BoxGeometry(lx, 0.36, lz), red);
    wall.position.set(sx * (w / 2 - 0.04), top + 0.18, sz * (d / 2 - 0.04));
    const pane = new GFX.Mesh(new GFX.BoxGeometry(lx + 0.01, 0.12, lz + 0.01), glass);
    pane.position.set(sx * (w / 2 - 0.04), top + 0.24, sz * (d / 2 - 0.04));
    group.add(wall, pane);
  }
  const H = 3.2;
  for (const e of [-1, 1]) {
    const arm = new GFX.Mesh(new GFX.CylinderGeometry(0.05, 0.05, H, 8), steel);
    arm.position.set(e * w * 0.3, top + H / 2, 0);
    arm.rotation.z = -e * 0.12;
    group.add(arm);
  }
  const carriage = new GFX.Mesh(new GFX.BoxGeometry(w * 0.4, 0.22, 0.3), steel);
  carriage.position.y = top + H;
  group.add(carriage);
  // The cable itself, strung the whole way the car goes and well beyond, where it is: it does not move with the car.
  let fixed = null;
  if (lift?.to) {
    const [dx, , dz] = lift.to;
    const len = Math.hypot(dx, dz) + 40;
    fixed = new GFX.Group();
    const cable = new GFX.Mesh(new GFX.CylinderGeometry(0.035, 0.035, len, 6), mat(GFX, '#2a2a30', { metalness: 0.8 }));
    cable.rotation.set(dx ? 0 : Math.PI / 2, 0, dx ? Math.PI / 2 : 0);
    fixed.add(cable);
    fixed.position.set(lift.x + lift.w / 2 + dx / 2, lift.h + H - 0.05 + 0.11, lift.z + lift.d / 2 + dz / 2);
  }
  return { group, fixed, live(time) { group.rotation[lift?.to?.[0] ? 'z' : 'x'] = Math.sin(time * 1.1) * 0.03; } };
}

function bullet(GFX, { w, d, thickness }) {
  const group = new GFX.Group();
  const white = new GFX.MeshPhysicalMaterial({ color: new GFX.Color('#f4f6f8'), roughness: 0.2, clearcoat: 1 });
  const blue = mat(GFX, '#1a3a9a', { roughness: 0.3 });
  const long = w >= d, L = long ? w : d, S = long ? d : w;
  const holder = new GFX.Group();
  if (!long) holder.rotation.y = Math.PI / 2;
  group.add(holder);
  holder.add(shadow(new GFX.Mesh(new GFX.BoxGeometry(L, thickness, S), white)));
  const skirt = new GFX.Mesh(new GFX.BoxGeometry(L, 0.45, S * 0.96), white);
  skirt.position.y = -thickness / 2 - 0.22;
  const stripe = new GFX.Mesh(new GFX.BoxGeometry(L + 0.01, 0.06, S * 0.97), blue);
  stripe.position.y = -thickness / 2 - 0.12;
  holder.add(skirt, stripe);
  // The long nose, at the front.
  const nose = new GFX.Mesh(new GFX.SphereGeometry(0.5, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), white);
  nose.scale.set(S * 0.96, 1.6, 0.6);
  nose.rotation.z = -Math.PI / 2;
  nose.position.set(L / 2, -0.18, 0);
  holder.add(nose);
  const lamp = glowMat(GFX, '#fff4d0');
  for (const e of [-1, 1]) {
    const l = new GFX.Mesh(new GFX.SphereGeometry(0.06, 8, 6), lamp);
    l.position.set(L / 2 + 0.3, -0.22, e * S * 0.25);
    holder.add(l);
  }
  return { group };
}

function carpet(GFX, { w, d, thickness }) {
  const group = new GFX.Group();
  const reds = ['#9a1a2a', '#c8a040', '#1a3a6a', '#e8d8b0'];
  const n = 4;
  const bands = [];
  for (let i = 0; i < n; i++) {
    const inset = i * 0.16;
    const m = new GFX.Mesh(new GFX.BoxGeometry(Math.max(0.1, w - inset * 2), thickness * 0.4 + i * 0.006, Math.max(0.1, d - inset * 2)), mat(GFX, reds[i % reds.length], { roughness: 0.9 }));
    m.position.y = -thickness * 0.2 + i * 0.004;
    bands.push(shadow(m));
    group.add(m);
  }
  // Tassels at the two ends.
  const gold = mat(GFX, '#d8b050', { roughness: 0.6 });
  const long = w >= d;
  for (const e of [-1, 1]) {
    for (let k = 0; k < 7; k++) {
      const t = new GFX.Mesh(new GFX.ConeGeometry(0.04, 0.16, 6), gold);
      const a = (k / 6 - 0.5) * (long ? d : w) * 0.9;
      t.position.set(long ? e * (w / 2 + 0.06) : a, 0, long ? a : e * (d / 2 + 0.06));
      t.rotation.set(long ? 0 : e * Math.PI / 2, 0, long ? -e * Math.PI / 2 : 0);
      group.add(t);
    }
  }
  return { group, live(time) { group.rotation.set(Math.sin(time * 1.7) * 0.04, 0, Math.sin(time * 1.3 + 1) * 0.05); group.position.y = Math.sin(time * 2.1) * 0.03; } };
}

function felucca(GFX, { w, d, thickness }) {
  const group = new GFX.Group();
  const { holder, L } = hull(GFX, group, { w, d, thickness }, '#e8dcc0', { rise: 0.5, beak: 0.3 });
  const wood = mat(GFX, '#7a5a38');
  const mast = new GFX.Mesh(new GFX.CylinderGeometry(0.05, 0.06, 3.4, 8), wood);
  mast.position.set(L * 0.15, 1.7, 0);
  holder.add(mast);
  // The lateen sail: a great triangle off a long slanted yard.
  const sail = new GFX.Mesh(new GFX.BufferGeometry(), mat(GFX, '#f4f0e4', { roughness: 0.9, side: GFX.DoubleSide }));
  const v = new Float32Array([L * 0.15, 0.4, 0, -L * 0.45, 0.5, 0, L * 0.5, 3.6, 0]);
  sail.geometry.setAttribute('position', new GFX.BufferAttribute(v, 3));
  sail.geometry.computeVertexNormals();
  holder.add(shadow(sail));
  const yard = new GFX.Mesh(new GFX.CylinderGeometry(0.03, 0.03, 3.6, 6), wood);
  yard.position.set(L * 0.02, 2.05, 0);
  yard.rotation.z = -0.95;
  holder.add(yard);
  return { group, live(time) { group.rotation.z = Math.sin(time * 1.1) * 0.025; } };
}

function float(GFX, { w, d, thickness }) {
  const group = new GFX.Group();
  const gold = mat(GFX, '#e8c040', { metalness: 0.8, roughness: 0.3 });
  group.add(shadow(new GFX.Mesh(new GFX.BoxGeometry(w, thickness, d), mat(GFX, '#2a9a4a', { roughness: 0.4 }))));
  const skirt = new GFX.Mesh(new GFX.BoxGeometry(w * 1.02, 0.5, d * 1.02), gold);
  skirt.position.y = -thickness / 2 - 0.25;
  group.add(skirt);
  // Plumes at the corners, and bulbs round the edge going in turn.
  const plumes = ['#ff3a8a', '#ffd23a', '#2ad0ff', '#3ae88a'].map((c) => mat(GFX, c, { roughness: 0.7 }));
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz], i) => {
    for (let k = 0; k < 5; k++) {
      const f = new GFX.Mesh(new GFX.ConeGeometry(0.06, 0.9, 6), plumes[(i + k) % plumes.length]);
      f.position.set(sx * (w / 2 - 0.1), thickness / 2 + 0.45, sz * (d / 2 - 0.1));
      f.rotation.set(Math.cos(k * 1.3) * 0.5, 0, Math.sin(k * 1.3) * 0.5);
      group.add(f);
    }
  });
  const bulbs = [];
  const perim = 2 * (w + d), n = Math.max(8, Math.round(perim * 3));
  for (let k = 0; k < n; k++) {
    let t = (k / n) * perim, x, z;
    if (t < w) { x = -w / 2 + t; z = -d / 2; } else if ((t -= w) < d) { x = w / 2; z = -d / 2 + t; } else if ((t -= d) < w) { x = w / 2 - t; z = d / 2; } else { t -= w; x = -w / 2; z = d / 2 - t; }
    const b = new GFX.Mesh(new GFX.SphereGeometry(0.04, 6, 4), glowMat(GFX, '#ffe08a'));
    b.position.set(x, -thickness / 2 - 0.08, z);
    group.add(b);
    bulbs.push(b);
  }
  return { group, live(time) { bulbs.forEach((b, k) => { b.visible = (Math.floor(time * 6) + k) % 3 !== 0; }); } };
}

function surfboard(GFX, { w, d, thickness }) {
  const group = new GFX.Group();
  const long = w >= d, L = long ? w : d, S = long ? d : w;
  const holder = new GFX.Group();
  if (!long) holder.rotation.y = Math.PI / 2;
  group.add(holder);
  const board = new GFX.Mesh(new GFX.CylinderGeometry(0.5, 0.5, thickness, 24), new GFX.MeshPhysicalMaterial({ color: new GFX.Color('#f4e8c8'), roughness: 0.2, clearcoat: 1 }));
  board.scale.set(L, 1, S);
  holder.add(shadow(board));
  const stripe = new GFX.Mesh(new GFX.BoxGeometry(L * 0.9, thickness * 1.02, 0.12), mat(GFX, '#e8402a', { roughness: 0.3 }));
  holder.add(stripe);
  const fin = new GFX.Mesh(new GFX.ConeGeometry(0.16, 0.4, 3), mat(GFX, '#2a2a30'));
  fin.rotation.x = Math.PI;
  fin.position.set(-L * 0.4, -thickness / 2 - 0.2, 0);
  holder.add(fin);
  return { group, live(time) { group.rotation.set(Math.sin(time * 1.4) * 0.04, 0, Math.sin(time * 1.9) * 0.05); } };
}

function ferry(GFX, { w, d, thickness }) {
  const group = new GFX.Group();
  const { holder, L, S } = hull(GFX, group, { w, d, thickness }, '#1a3a6a', { rise: 0.3, beak: 0.2 });
  const white = mat(GFX, '#f4f2ee', { roughness: 0.4 });
  for (const e of [-1, 1]) {
    const rail = new GFX.Mesh(new GFX.BoxGeometry(L * 0.8, 0.04, 0.04), white);
    rail.position.set(0, thickness / 2 + 0.4, e * (S / 2 - 0.03));
    holder.add(rail);
    for (let k = 0; k < 6; k++) {
      const post = new GFX.Mesh(new GFX.CylinderGeometry(0.02, 0.02, 0.4, 5), white);
      post.position.set((k / 5 - 0.5) * L * 0.78, thickness / 2 + 0.2, e * (S / 2 - 0.03));
      holder.add(post);
    }
  }
  const ring = new GFX.Mesh(new GFX.TorusGeometry(0.2, 0.06, 6, 16), mat(GFX, '#e8402a'));
  ring.position.set(-L * 0.3, thickness / 2 + 0.3, S / 2 - 0.02);
  holder.add(ring);
  return { group, live(time) { group.rotation.z = Math.sin(time * 1.2) * 0.02; } };
}

export const RIDES = { gondola, cablecar, bullet, carpet, felucca, float, surfboard, ferry };

// ———————————————————————————————————————————————— bumpers

/** Each gives what it adds (`objects`), which of them cast shadows (`parts`), and its ring's colours at rest and in a flash. */
export const BUMPERS = {
  bollard(GFX, { radius, ringMat }) {
    const black = mat(GFX, '#16161a', { roughness: 0.4, metalness: 0.4 });
    const gold = mat(GFX, '#d8b050', { metalness: 1, roughness: 0.3 });
    const post = new GFX.Mesh(new GFX.CylinderGeometry(radius * 0.42, radius * 0.5, 0.7, 14), black);
    post.position.y = 0.35;
    const cap = new GFX.Mesh(new GFX.SphereGeometry(radius * 0.44, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), black);
    cap.position.y = 0.7;
    const band = new GFX.Mesh(new GFX.TorusGeometry(radius * 0.45, 0.025, 6, 18), gold);
    band.rotation.x = Math.PI / 2;
    band.position.y = 0.58;
    const ring = new GFX.Mesh(new GFX.TorusGeometry(radius * 0.6, 0.025, 6, 20), ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.04;
    return { objects: [post, cap, band, ring], parts: [post, cap], rest: [1, 0.8, 0.4], flash: [1, 1, 1] };
  },
  snowman(GFX, { radius, ringMat }) {
    const snow = mat(GFX, '#f4f8ff', { roughness: 0.8 });
    const low = new GFX.Mesh(new GFX.SphereGeometry(radius * 0.7, 16, 10), snow);
    low.position.y = radius * 0.6;
    const mid = new GFX.Mesh(new GFX.SphereGeometry(radius * 0.5, 16, 10), snow);
    mid.position.y = radius * 1.5;
    const head = new GFX.Mesh(new GFX.SphereGeometry(radius * 0.36, 14, 10), snow);
    head.position.y = radius * 2.2;
    const nose = new GFX.Mesh(new GFX.ConeGeometry(0.04, 0.2, 8), mat(GFX, '#ff7a1a'));
    nose.rotation.x = Math.PI / 2;
    nose.position.set(0, radius * 2.2, radius * 0.42);
    const scarf = new GFX.Mesh(new GFX.TorusGeometry(radius * 0.36, 0.05, 6, 16), mat(GFX, '#d81c2a'));
    scarf.rotation.x = Math.PI / 2;
    scarf.position.y = radius * 1.9;
    const hat = new GFX.Mesh(new GFX.CylinderGeometry(radius * 0.22, radius * 0.24, radius * 0.4, 12), mat(GFX, '#16161a'));
    hat.position.y = radius * 2.6;
    const ring = new GFX.Mesh(new GFX.TorusGeometry(radius * 0.8, 0.025, 6, 20), ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.04;
    return { objects: [low, mid, head, nose, scarf, hat, ring], parts: [low, mid, head], rest: [0.6, 0.85, 1], flash: [1, 1, 1] };
  },
  palm(GFX, { radius, ringMat }) {
    const bark = mat(GFX, '#8a6a42', { roughness: 0.9 });
    const leaf = mat(GFX, '#2a8a3a', { roughness: 0.7, side: GFX.DoubleSide });
    const trunk = new GFX.Mesh(new GFX.CylinderGeometry(radius * 0.22, radius * 0.32, 2.6, 10), bark);
    trunk.position.y = 1.3;
    trunk.rotation.z = 0.08;
    const objects = [trunk];
    for (let k = 0; k < 7; k++) {
      const a = (k / 7) * Math.PI * 2;
      const frond = new GFX.Mesh(new GFX.ConeGeometry(0.16, 1.4, 4), leaf);
      frond.scale.set(1, 1, 0.2);
      frond.position.set(Math.sin(a) * 0.55 + 0.1, 2.5, Math.cos(a) * 0.55);
      frond.rotation.set(Math.cos(a) * 1.9, 0, -Math.sin(a) * 1.9);
      objects.push(frond);
    }
    const ring = new GFX.Mesh(new GFX.TorusGeometry(radius * 0.6, 0.025, 6, 20), ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.04;
    objects.push(ring);
    return { objects, parts: [trunk], rest: [0.4, 1, 0.6], flash: [1, 1, 0.7] };
  },
  cone(GFX, { radius, ringMat }) {
    const orange = mat(GFX, '#ff6a1a', { roughness: 0.5 });
    const white = mat(GFX, '#f4f4f0', { roughness: 0.5 });
    const cone = new GFX.Mesh(new GFX.ConeGeometry(radius * 0.5, 0.75, 16), orange);
    cone.position.y = 0.41;
    const band = new GFX.Mesh(new GFX.CylinderGeometry(radius * 0.26, radius * 0.33, 0.12, 16), white);
    band.position.y = 0.45;
    const base = new GFX.Mesh(new GFX.BoxGeometry(radius * 1.2, 0.05, radius * 1.2), orange);
    base.position.y = 0.025;
    const ring = new GFX.Mesh(new GFX.TorusGeometry(radius * 0.75, 0.025, 6, 20), ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.06;
    return { objects: [cone, band, base, ring], parts: [cone], rest: [1, 0.5, 0.1], flash: [1, 1, 0.8] };
  },
  lantern(GFX, { radius, ringMat }) {
    const stone = mat(GFX, '#9a968a', { roughness: 0.95 });
    const objects = [];
    const add = (geo, y) => { const m = new GFX.Mesh(geo, stone); m.position.y = y; objects.push(m); return m; };
    add(new GFX.CylinderGeometry(radius * 0.5, radius * 0.6, 0.12, 6), 0.06);
    add(new GFX.CylinderGeometry(radius * 0.18, radius * 0.22, 0.5, 8), 0.37);
    add(new GFX.CylinderGeometry(radius * 0.45, radius * 0.35, 0.1, 6), 0.67);
    const box = add(new GFX.BoxGeometry(radius * 0.6, 0.3, radius * 0.6), 0.87);
    const light = new GFX.Mesh(new GFX.BoxGeometry(radius * 0.62, 0.14, radius * 0.3), glowMat(GFX, '#ffc070'));
    light.position.y = 0.87;
    objects.push(light);
    add(new GFX.ConeGeometry(radius * 0.7, 0.3, 6), 1.17);
    const ring = new GFX.Mesh(new GFX.TorusGeometry(radius * 0.7, 0.025, 6, 20), ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.04;
    objects.push(ring);
    return { objects, parts: [box], rest: [1, 0.7, 0.4], flash: [1, 1, 0.8] };
  },
  pole(GFX, { radius, ringMat }) {
    // A mooring pole out of the canal: striped like a barber's, a gilded cap.
    const red = mat(GFX, '#c8203a', { roughness: 0.45 });
    const white = mat(GFX, '#f4f0e8', { roughness: 0.45 });
    const objects = [];
    for (let k = 0; k < 6; k++) {
      const band = new GFX.Mesh(new GFX.CylinderGeometry(radius * 0.3, radius * 0.32, 0.3, 12), k % 2 ? white : red);
      band.position.y = 0.15 + k * 0.3;
      objects.push(band);
    }
    const cap = new GFX.Mesh(new GFX.SphereGeometry(radius * 0.36, 12, 8), mat(GFX, '#d8b050', { metalness: 1, roughness: 0.3 }));
    cap.position.y = 1.85;
    objects.push(cap);
    const ring = new GFX.Mesh(new GFX.TorusGeometry(radius * 0.6, 0.025, 6, 20), ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.04;
    objects.push(ring);
    return { objects, parts: objects.slice(0, 6), rest: [1, 0.4, 0.5], flash: [1, 1, 1] };
  },
  amphora(GFX, { radius, ringMat }) {
    const clay = mat(GFX, '#b8643a', { roughness: 0.85 });
    const pts = [[0.05, 0], [radius * 0.3, 0.05], [radius * 0.62, 0.35], [radius * 0.55, 0.6], [radius * 0.22, 0.85], [radius * 0.2, 0.98], [radius * 0.28, 1.02]].map(([x, y]) => new GFX.Vector2(x, y));
    const body = new GFX.Mesh(new GFX.LatheGeometry(pts, 16), clay);
    const objects = [body];
    for (const e of [-1, 1]) {
      const handle = new GFX.Mesh(new GFX.TorusGeometry(0.1, 0.025, 6, 12, Math.PI), clay);
      handle.position.set(e * radius * 0.28, 0.85, 0);
      handle.rotation.z = e * Math.PI / 2;
      objects.push(handle);
    }
    const ring = new GFX.Mesh(new GFX.TorusGeometry(radius * 0.7, 0.025, 6, 20), ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.04;
    objects.push(ring);
    return { objects, parts: [body], rest: [1, 0.6, 0.3], flash: [1, 1, 0.8] };
  },
};

// ———————————————————————————————————————————————— bursts

/**
 * What bursts out of the floor, by `look.pyro`, beyond flame and steam: its
 * colours, and whether it billows (as steam does) rather than licks up.
 */
export const BURSTS = {
  snow: { flame: '#e8f0ff', core: '#ffffff', halo: '#dce8ff', billow: true, plate: 'round' },
  sand: { flame: '#d8b070', core: '#f4dca8', halo: '#e8c890', billow: true, plate: 'round' },
  water: { flame: '#5ab4ff', core: '#d8f0ff', halo: '#8ac8ff', billow: true, plate: 'round' },
  fireworks: { flame: '#ff3a8a', core: '#ffe08a', halo: '#ff8ae8', billow: false, plate: 'grate' },
};
