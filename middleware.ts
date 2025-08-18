import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define public routes (routes that don't require authentication)
const publicRoutes = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/clerk-webhook',
  '/api/drive-activity/notification',
  '/api/payment/success',
])

// Define ignored routes (specific routes that should not be processed by auth)
const ignoredRoutes = createRouteMatcher([
  '/api/auth/callback/discord',
  '/api/auth/callback/notion',
  '/api/auth/callback/slack',
  '/api/flow',
  '/api/cron/wait',
])

export default clerkMiddleware(async (auth, req) => {
  // Check if the request matches any ignored or public routes
  if (!publicRoutes(req) && !ignoredRoutes(req)) {
    await auth.protect()  // Protect the route if it's neither public nor ignored
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}