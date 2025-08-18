'use server'

import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

export const onPaymentDetails = async () => {
  const {userId} = await auth()

  if (userId) {
    const connection = await db.user.findFirst({
      where: {
        clerkId: userId,
      },
      select: {
        tier: true,
        credits: true,
      },
    })

    if (userId) {
      return connection
    }
  }
}
