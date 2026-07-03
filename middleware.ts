import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware เบาๆ สำหรับ Hackathon Demo
// การป้องกัน route จริงทำผ่าน useAuth + useEffect ใน Client แทนครับ
export async function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
