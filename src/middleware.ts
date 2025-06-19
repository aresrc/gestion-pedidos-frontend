import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Este middleware se ejecutará para cada ruta que coincida con el "matcher".
// Se cambia a un "export default" para asegurar la compatibilidad.
export default function middleware(request: NextRequest) {
  // 1. Extraer la cookie de autenticación del request.
  const authToken = request.cookies.get('auth_token')?.value;

  // 2. Obtener la URL a la que el usuario intenta acceder.
  const { pathname } = request.nextUrl;

  // 3. Definir las rutas protegidas (en este caso, solo '/dashboard').
  const isProtectedRoute = pathname.startsWith('/dashboard');
  
  // Lógica de redirección:
  // Si el usuario intenta acceder a una ruta protegida y NO tiene un token...
  if (isProtectedRoute && !authToken) {
    // ...redirigirlo a la página de login.
    // Creamos una nueva URL absoluta para la redirección.
    const loginUrl = new URL('/login', request.url);
    console.log('Middleware: No autorizado. Redirigiendo a /login');
    return NextResponse.redirect(loginUrl);
  }

  // Si el usuario ya está autenticado (tiene un token) e intenta ir a /login...
  if (authToken && pathname.startsWith('/login')) {
    // ...redirigirlo directamente al dashboard.
    const dashboardUrl = new URL('/dashboard', request.url);
    console.log('Middleware: Ya autenticado. Redirigiendo a /dashboard');
    return NextResponse.redirect(dashboardUrl);
  }

  // Si ninguna de las condiciones anteriores se cumple, permitir que la petición continúe.
  return NextResponse.next();
}

// El "matcher" le dice a Next.js en qué rutas específicas debe ejecutarse este middleware.
// Esto evita que se ejecute en rutas innecesarias como las de assets (_next/static)
// o archivos de imágenes, mejorando el rendimiento.
export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas de request excepto por las que empiezan con:
     * - api (rutas de API)
     * - _next/static (archivos estáticos)
     * - _next/image (imágenes optimizadas)
     * - favicon.ico (el ícono de la página)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    // Aplicamos el middleware a la raíz y a la ruta de dashboard
    '/', 
    '/dashboard/:path*',
    '/login',
  ],
};
