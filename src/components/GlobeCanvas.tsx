import { useEffect, useRef } from "react";

// GeoJSON land: Natural Earth 110m — barcha qit'alar (Yevropa, Osiyo va b.) aniq qirg'oq
const GEOJSON_LAND_URL =
  "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/110m/physical/ne_110m_land.json";
// O'zbekiston davlat chegarasi (faqat UZB border)
const UZBEKISTAN_BORDER_URL =
  "https://raw.githubusercontent.com/glynnbird/countriesgeojson/master/uzbekistan.geojson";
// Janubiy Koreya chegarasi (Natural Earth dan ISO_A2 === "KR" filtrlash)
const COUNTRIES_110M_URL =
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson";

type GeoRing = number[][]; // [lng, lat][]
type GeoPolygon = GeoRing[];
type GeoMultiPolygon = GeoPolygon[];
type LandGeometry = { type: "Polygon"; coordinates: GeoPolygon } | { type: "MultiPolygon"; coordinates: GeoMultiPolygon };
type LandFeature = { type: "Feature"; geometry: LandGeometry };
type LandFeatureCollection = { type: "FeatureCollection"; features: LandFeature[] };

function getRingsFromLandGeometry(geometry: LandGeometry): GeoRing[] {
  if (geometry.type === "Polygon") return geometry.coordinates;
  const rings: GeoRing[] = [];
  for (const polygon of geometry.coordinates) rings.push(...polygon);
  return rings;
}

function getAllRingsFromFeatureCollection(fc: LandFeatureCollection): GeoRing[] {
  const rings: GeoRing[] = [];
  for (const f of fc.features || []) {
    if (f.geometry) rings.push(...getRingsFromLandGeometry(f.geometry));
  }
  return rings;
}

// Lat/Lng for our two offices
const KOREA = { lat: 37.5665, lng: 126.978 }; // Seoul
const UZBEKISTAN = { lat: 41.2995, lng: 69.2401 }; // Tashkent

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function latLngTo3D(lat: number, lng: number, radius: number) {
  const phi = toRad(90 - lat);
  const theta = toRad(-lng + 180);
  return {
    x: -(radius * Math.sin(phi) * Math.cos(theta)),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta),
  };
}

function rotateY(point: { x: number; y: number; z: number }, angle: number) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: point.x * cos + point.z * sin,
    y: point.y,
    z: -point.x * sin + point.z * cos,
  };
}

function rotateX(point: { x: number; y: number; z: number }, angle: number) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: point.x,
    y: point.y * cos - point.z * sin,
    z: point.y * sin + point.z * cos,
  };
}

function project(point: { x: number; y: number; z: number }, cx: number, cy: number, fov: number) {
  const scale = fov / (fov + point.z);
  return { x: cx + point.x * scale, y: cy - point.y * scale, scale, z: point.z };
}

// Subtle lat/lng grid for real-globe feel (more lines)
function generateGridLines(): { lat: number; lng: number }[][] {
  const lines: { lat: number; lng: number }[][] = [];
  for (let lat = -75; lat <= 75; lat += 10) {
    const line: { lat: number; lng: number }[] = [];
    for (let lng = -180; lng <= 180; lng += 2) {
      line.push({ lat, lng });
    }
    lines.push(line);
  }
  for (let lng = -180; lng < 180; lng += 15) {
    const line: { lat: number; lng: number }[] = [];
    for (let lat = -90; lat <= 90; lat += 2) {
      line.push({ lat, lng });
    }
    lines.push(line);
  }
  return lines;
}

const ROTATION_SENSITIVITY = 0.004;
const TILT_SENSITIVITY = 0.003;
const TILT_MIN = -0.5;
const TILT_MAX = 0.3;

type GlobeCanvasProps = {
  markerKorea?: string;
  markerUz?: string;
};

const GlobeCanvas = ({
  markerKorea = "J-Smart Solution 🇰🇷",
  markerUz = "NEVONA 🇺🇿",
}: GlobeCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(Math.PI - 0.6);
  const tiltRef = useRef(-0.15);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const dragRef = useRef({ isDragging: false, lastX: 0, lastY: 0 });
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });
  const landGeoJsonRef = useRef<GeoRing[] | null>(null);
  const uzbekistanBorderRef = useRef<GeoRing[] | null>(null);
  const southKoreaBorderRef = useRef<GeoRing[] | null>(null);
  const labelsRef = useRef({ markerKorea, markerUz });
  labelsRef.current = { markerKorea, markerUz };

  useEffect(() => {
    fetch(GEOJSON_LAND_URL)
      .then((r) => r.json())
      .then((fc: LandFeatureCollection) => {
        if (fc.type === "FeatureCollection" && fc.features?.length) {
          landGeoJsonRef.current = getAllRingsFromFeatureCollection(fc);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(UZBEKISTAN_BORDER_URL)
      .then((r) => r.json())
      .then((f: LandFeature) => {
        if (f.geometry) {
          uzbekistanBorderRef.current = getRingsFromLandGeometry(f.geometry);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(COUNTRIES_110M_URL)
      .then((r) => r.json())
      .then((fc: { features?: { geometry: LandGeometry; properties?: { ISO_A2?: string } }[] }) => {
        const kr = fc.features?.find((f) => f.properties?.ISO_A2 === "KR");
        if (kr?.geometry) {
          southKoreaBorderRef.current = getRingsFromLandGeometry(kr.geometry);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const gridLines = generateGridLines();

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (w <= 0 || h <= 0) return;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w, h, dpr };
    };

    const draw = () => {
      const { w, h } = sizeRef.current;
      if (w <= 0 || h <= 0) {
        animId = requestAnimationFrame(draw);
        return;
      }
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.38;
      const fov = 600;

      ctx.clearRect(0, 0, w, h);

      // Slow auto-rotate only when not dragging
      if (!dragRef.current.isDragging) {
        rotationRef.current += 0.001;
      }

      const rotY = rotationRef.current;
      const tiltX = tiltRef.current;

      // Globe glow
      const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.5, cx, cy, radius * 1.5);
      glowGrad.addColorStop(0, "rgba(120, 80, 255, 0.08)");
      glowGrad.addColorStop(0.5, "rgba(80, 120, 255, 0.04)");
      glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, w, h);

      // Globe outline
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(130, 100, 255, 0.25)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Atmosphere
      const atmosGrad = ctx.createRadialGradient(cx, cy, radius * 0.9, cx, cy, radius * 1.1);
      atmosGrad.addColorStop(0, "rgba(100, 140, 255, 0)");
      atmosGrad.addColorStop(0.5, "rgba(100, 140, 255, 0.06)");
      atmosGrad.addColorStop(1, "rgba(100, 140, 255, 0)");
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.1, 0, Math.PI * 2);
      ctx.fillStyle = atmosGrad;
      ctx.fill();

      // Helper: transform a lat/lng point
      const transformPoint = (lat: number, lng: number) => {
        const p3d = latLngTo3D(lat, lng, radius);
        const rotated = rotateX(rotateY(p3d, rotY), tiltX);
        return { ...project(rotated, cx, cy, fov), z: rotated.z };
      };

      // Subtle lat/lng grid (real-globe style)
      for (const line of gridLines) {
        ctx.beginPath();
        let started = false;
        for (const pt of line) {
          const projected = transformPoint(pt.lat, pt.lng);
          if (projected.z < 0) {
            if (!started) {
              ctx.moveTo(projected.x, projected.y);
              started = true;
            } else {
              ctx.lineTo(projected.x, projected.y);
            }
          } else {
            started = false;
          }
        }
        ctx.strokeStyle = "rgba(100, 130, 255, 0.06)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Draw land: GeoJSON (Natural Earth 110m — barcha qit'alar)
      const landRings = landGeoJsonRef.current;
      if (landRings?.length) {
        const continentColor = "rgba(150, 130, 255, 0.5)";
        const continentWidth = 1.1;
        for (const ring of landRings) {
          if (ring.length < 2) continue;
          ctx.beginPath();
          let started = false;
          for (let i = 0; i < ring.length; i++) {
            const [lng, lat] = ring[i];
            const projected = transformPoint(lat, lng);
            if (projected.z < 0) {
              if (!started) {
                ctx.moveTo(projected.x, projected.y);
                started = true;
              } else {
                ctx.lineTo(projected.x, projected.y);
              }
            } else {
              started = false;
            }
          }
          ctx.strokeStyle = continentColor;
          ctx.lineWidth = continentWidth;
          ctx.stroke();
        }
      }

      // O'zbekiston davlat chegarasi (faqat UZB border)
      const uzbRings = uzbekistanBorderRef.current;
      if (uzbRings?.length) {
        const uzbBorderColor = "rgba(200, 120, 255, 0.85)";
        const uzbBorderWidth = 1.8;
        for (const ring of uzbRings) {
          if (ring.length < 2) continue;
          ctx.beginPath();
          let started = false;
          for (let i = 0; i < ring.length; i++) {
            const [lng, lat] = ring[i];
            const projected = transformPoint(lat, lng);
            if (projected.z < 0) {
              if (!started) {
                ctx.moveTo(projected.x, projected.y);
                started = true;
              } else {
                ctx.lineTo(projected.x, projected.y);
              }
            } else {
              started = false;
            }
          }
          ctx.strokeStyle = uzbBorderColor;
          ctx.lineWidth = uzbBorderWidth;
          ctx.stroke();
        }
      }

      // Janubiy Koreya davlat chegarasi (faqat KOR border)
      const korRings = southKoreaBorderRef.current;
      if (korRings?.length) {
        const korBorderColor = "rgba(80, 200, 255, 0.85)";
        const korBorderWidth = 1.8;
        for (const ring of korRings) {
          if (ring.length < 2) continue;
          ctx.beginPath();
          let started = false;
          for (let i = 0; i < ring.length; i++) {
            const [lng, lat] = ring[i];
            const projected = transformPoint(lat, lng);
            if (projected.z < 0) {
              if (!started) {
                ctx.moveTo(projected.x, projected.y);
                started = true;
              } else {
                ctx.lineTo(projected.x, projected.y);
              }
            } else {
              started = false;
            }
          }
          ctx.strokeStyle = korBorderColor;
          ctx.lineWidth = korBorderWidth;
          ctx.stroke();
        }
      }

      // Draw location markers
      const koreaP = transformPoint(KOREA.lat, KOREA.lng);
      const uzbekP = transformPoint(UZBEKISTAN.lat, UZBEKISTAN.lng);

      const drawMarker = (
        p: { x: number; y: number; z: number; scale: number },
        label: string,
        color: string,
        pulseColor: string
      ) => {
        if (p.z > 0) return; // behind globe

        const t = Date.now() / 1000;
        const pulseR = 6 + Math.sin(t * 3) * 3;

        // Pulse ring
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulseR * 2, 0, Math.PI * 2);
        ctx.strokeStyle = pulseColor;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Outer glow
        const markerGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 20);
        markerGlow.addColorStop(0, color);
        markerGlow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.arc(p.x, p.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = markerGlow;
        ctx.fill();

        // Center dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Label
        ctx.font = "600 11px 'Space Grotesk', sans-serif";
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.fillText(label, p.x, p.y - 18);
      };

      const { markerKorea: labelKorea, markerUz: labelUz } = labelsRef.current;
      drawMarker(koreaP, labelKorea, "rgba(80, 200, 255, 1)", "rgba(80, 200, 255, 0.3)");
      drawMarker(uzbekP, labelUz, "rgba(200, 120, 255, 1)", "rgba(200, 120, 255, 0.3)");

      // Draw arc connection between the two points
      if (koreaP.z < 0 || uzbekP.z < 0) {
        const arcPoints = 60;
        ctx.beginPath();

        // Animated dash
        const time = Date.now() / 1200;

        for (let i = 0; i <= arcPoints; i++) {
          const frac = i / arcPoints;
          const lat = UZBEKISTAN.lat + (KOREA.lat - UZBEKISTAN.lat) * frac;
          const lng = UZBEKISTAN.lng + (KOREA.lng - UZBEKISTAN.lng) * frac;
          // Arc height
          const arcHeight = 1 + Math.sin(frac * Math.PI) * 0.15;
          const p3d = latLngTo3D(lat, lng, radius * arcHeight);
          const rotated = rotateX(rotateY(p3d, rotY), tiltX);
          if (rotated.z > 0) continue; // behind
          const proj = project(rotated, cx, cy, fov);

          if (i === 0) ctx.moveTo(proj.x, proj.y);
          else ctx.lineTo(proj.x, proj.y);
        }

        // Animated gradient along the arc
        const grad = ctx.createLinearGradient(uzbekP.x, uzbekP.y, koreaP.x, koreaP.y);
        grad.addColorStop(0, "rgba(200, 120, 255, 0.9)");
        grad.addColorStop(0.5, "rgba(140, 160, 255, 0.9)");
        grad.addColorStop(1, "rgba(80, 200, 255, 0.9)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 6]);
        ctx.lineDashOffset = -time * 10;
        ctx.stroke();
        ctx.setLineDash([]);

        // Traveling light dot
        const dotFrac = ((time * 0.3) % 1);
        const dotLat = UZBEKISTAN.lat + (KOREA.lat - UZBEKISTAN.lat) * dotFrac;
        const dotLng = UZBEKISTAN.lng + (KOREA.lng - UZBEKISTAN.lng) * dotFrac;
        const dotArc = 1 + Math.sin(dotFrac * Math.PI) * 0.15;
        const dotP3d = latLngTo3D(dotLat, dotLng, radius * dotArc);
        const dotRotated = rotateX(rotateY(dotP3d, rotY), tiltX);
        if (dotRotated.z < 0) {
          const dotProj = project(dotRotated, cx, cy, fov);
          const dotGlow = ctx.createRadialGradient(dotProj.x, dotProj.y, 0, dotProj.x, dotProj.y, 12);
          dotGlow.addColorStop(0, "rgba(180, 160, 255, 1)");
          dotGlow.addColorStop(1, "rgba(180, 160, 255, 0)");
          ctx.beginPath();
          ctx.arc(dotProj.x, dotProj.y, 12, 0, Math.PI * 2);
          ctx.fillStyle = dotGlow;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(dotProj.x, dotProj.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 1)";
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(draw);
    };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0]?.clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0]?.clientY : e.clientY;
      if (clientX == null || clientY == null) return;
      dragRef.current = { isDragging: true, lastX: clientX, lastY: clientY };
      canvas.style.cursor = "grabbing";
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0]?.clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0]?.clientY : e.clientY;
      if (clientX == null || clientY == null) return;
      mouseRef.current = { x: clientX - rect.left, y: clientY - rect.top, active: true };

      if (dragRef.current.isDragging) {
        e.preventDefault?.();
        const dx = clientX - dragRef.current.lastX;
        const dy = clientY - dragRef.current.lastY;
        rotationRef.current -= dx * ROTATION_SENSITIVITY;
        tiltRef.current = Math.max(TILT_MIN, Math.min(TILT_MAX, tiltRef.current - dy * TILT_SENSITIVITY));
        dragRef.current.lastX = clientX;
        dragRef.current.lastY = clientY;
      }
    };

    const onPointerUp = () => {
      dragRef.current.isDragging = false;
      canvas.style.cursor = "grab";
    };

    const onMouseLeave = () => {
      mouseRef.current.active = false;
      if (dragRef.current.isDragging) {
        dragRef.current.isDragging = false;
        canvas.style.cursor = "grab";
      }
    };

    resize();
    draw();

    const ro = new ResizeObserver(() => {
      resize();
    });
    ro.observe(canvas);

    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", onPointerMove as (e: MouseEvent) => void);
    canvas.addEventListener("mousedown", onPointerDown as (e: MouseEvent) => void);
    window.addEventListener("mouseup", onPointerUp);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("touchstart", onPointerDown as (e: TouchEvent) => void, { passive: true });
    canvas.addEventListener("touchmove", onPointerMove as (e: TouchEvent) => void, { passive: false });
    canvas.addEventListener("touchend", onPointerUp);
    canvas.addEventListener("touchcancel", onPointerUp);
    canvas.style.cursor = "grab";

    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(resize);
    });

    return () => {
      cancelAnimationFrame(animId);
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mouseup", onPointerUp);
      canvas.removeEventListener("mousemove", onPointerMove as (e: MouseEvent) => void);
      canvas.removeEventListener("mousedown", onPointerDown as (e: MouseEvent) => void);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("touchstart", onPointerDown as (e: TouchEvent) => void);
      canvas.removeEventListener("touchmove", onPointerMove as (e: TouchEvent) => void);
      canvas.removeEventListener("touchend", onPointerUp);
      canvas.removeEventListener("touchcancel", onPointerUp);
    };
  }, []);
 
  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
      style={{ pointerEvents: "auto" }}
    />
  );
};

export default GlobeCanvas;
