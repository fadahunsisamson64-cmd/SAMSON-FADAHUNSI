import re

with open("app/actions/booking.ts", "r") as f:
    content = f.read()

# Add overlap check
overlap_check = """
    // Check for conflicting bookings if a staff member is selected
    if (data.staffId) {
      const conflictingBooking = await prisma.booking.findFirst({
        where: {
          staffId: data.staffId,
          status: { notIn: ['CANCELLED', 'NO_SHOW'] },
          OR: [
            { startTime: { lt: data.endTime, gte: data.startTime } },
            { endTime: { gt: data.startTime, lte: data.endTime } },
            { startTime: { lte: data.startTime }, endTime: { gte: data.endTime } }
          ]
        }
      });
      
      if (conflictingBooking) {
        return { success: false, error: 'The selected time slot is no longer available for this staff member.' };
      }
    }
    
    // Upsert customer based on email
"""

content = content.replace("    // Upsert customer based on email", overlap_check.strip())

with open("app/actions/booking.ts", "w") as f:
    f.write(content)
