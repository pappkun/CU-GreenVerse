import { supabase } from "@/lib/supabase";

// ─── Constants ───────────────────────────────────────────────────────────────
const CREDITS_PER_KM = 10;
const AUTO_CHECKOUT_THRESHOLD_M = 100; // ห่าง > 100m → auto checkout
const GPS_POLL_INTERVAL_MS = 30_000;  // poll ทุก 30 วิ

// ─── Haversine Formula ────────────────────────────────────────────────────────
/** คำนวณระยะทางระหว่าง 2 จุด GPS (ผลลัพธ์เป็น เมตร) */
export function calcDistanceMeters(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6_371_000; // รัศมีโลก (เมตร)
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function calcDistanceKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  return calcDistanceMeters(lat1, lng1, lat2, lng2) / 1000;
}

// ─── Get User Location ────────────────────────────────────────────────────────
export function getUserLocation(): Promise<GeolocationCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation ไม่รองรับบน browser นี้"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos.coords),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10_000 }
    );
  });
}

// ─── Start Trip ───────────────────────────────────────────────────────────────
export async function startTrip(
  userId: string,
  busId: string,
  lat: number,
  lng: number
): Promise<{ tripId: string | null; error: string | null }> {
  if (!supabase) return { tripId: null, error: "Supabase ไม่ได้เชื่อมต่อ" };

  // ตรวจสอบว่ามี trip ที่ ongoing อยู่แล้วไหม
  const { data: existing } = await supabase
    .from("pop_bus_trips")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "ongoing")
    .maybeSingle();

  if (existing) {
    return { tripId: existing.id, error: "คุณกำลังนั่งรถอยู่แล้ว" };
  }

  const { data, error } = await supabase
    .from("pop_bus_trips")
    .insert({
      user_id: userId,
      bus_id: busId,
      boarded_lat: lat,
      boarded_lng: lng,
      status: "ongoing",
    })
    .select("id")
    .single();

  if (error) return { tripId: null, error: error.message };
  return { tripId: data.id, error: null };
}

// ─── End Trip ─────────────────────────────────────────────────────────────────
export async function endTrip(
  tripId: string,
  alightedLat: number,
  alightedLng: number
): Promise<{ distanceKm: number; credits: number; error: string | null }> {
  if (!supabase) return { distanceKm: 0, credits: 0, error: "Supabase ไม่ได้เชื่อมต่อ" };

  // ดึงข้อมูล trip
  const { data: trip, error: fetchErr } = await supabase
    .from("pop_bus_trips")
    .select("boarded_lat, boarded_lng")
    .eq("id", tripId)
    .single();

  if (fetchErr || !trip) {
    return { distanceKm: 0, credits: 0, error: "ไม่พบข้อมูล trip" };
  }

  const distanceKm = calcDistanceKm(
    trip.boarded_lat, trip.boarded_lng,
    alightedLat, alightedLng
  );
  const credits = Math.round(distanceKm * CREDITS_PER_KM);

  const { error: updateErr } = await supabase
    .from("pop_bus_trips")
    .update({
      alighted_lat: alightedLat,
      alighted_lng: alightedLng,
      alighted_at: new Date().toISOString(),
      distance_km: parseFloat(distanceKm.toFixed(3)),
      green_credits: credits,
      status: "completed",
    })
    .eq("id", tripId);

  if (updateErr) return { distanceKm, credits, error: updateErr.message };
  return { distanceKm, credits, error: null };
}

// ─── Get Ongoing Trip ──────────────────────────────────────────────────────────
export async function getOngoingTrip(userId: string) {
  if (!supabase) return null;
  const { data } = await supabase
    .from("pop_bus_trips")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "ongoing")
    .maybeSingle();
  return data;
}

// ─── Get Bus GPS ───────────────────────────────────────────────────────────────
export async function getBusLocation(
  busId: string
): Promise<{ lat: number; lng: number } | null> {
  if (!supabase) return null;
  const { data } = await supabase
    .from("pop_buses")
    .select("current_lat, current_lng")
    .eq("bus_id", busId)
    .eq("is_active", true)
    .single();
  if (!data || data.current_lat == null) return null;
  return { lat: data.current_lat, lng: data.current_lng };
}

// ─── Check & Auto Checkout ────────────────────────────────────────────────────
/**
 * เปรียบเทียบ user GPS กับ bus GPS
 * ถ้าห่างเกิน threshold → auto checkout
 * return true ถ้า checkout แล้ว
 */
export async function checkAndAutoCheckout(
  tripId: string,
  busId: string,
  userLat: number,
  userLng: number
): Promise<boolean> {
  const busLoc = await getBusLocation(busId);
  if (!busLoc) return false; // ไม่มี GPS รถ → ไม่ auto checkout

  const distM = calcDistanceMeters(userLat, userLng, busLoc.lat, busLoc.lng);
  if (distM > AUTO_CHECKOUT_THRESHOLD_M) {
    await endTrip(tripId, userLat, userLng);
    return true;
  }
  return false;
}

export { GPS_POLL_INTERVAL_MS, CREDITS_PER_KM, AUTO_CHECKOUT_THRESHOLD_M };
