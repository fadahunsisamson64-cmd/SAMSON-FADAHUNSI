import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding initial business data...')

  // Clear existing data
  await prisma.review.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.service.deleteMany()
  await prisma.staff.deleteMany()
  await prisma.availability.deleteMany()
  await prisma.business.deleteMany()
  await prisma.user.deleteMany()

  // 1. Create Business Owner
  const owner = await prisma.user.create({
    data: {
      email: 'owner@lumina.app',
      name: 'Sarah Jenkins',
      role: 'BUSINESS_OWNER'
    }
  })

  // 2. Create Staff Users
  const staff1User = await prisma.user.create({
    data: {
      email: 'alex@lumina.app',
      name: 'Alex Rivera',
      role: 'STAFF'
    }
  })

  const staff2User = await prisma.user.create({
    data: {
      email: 'maya@lumina.app',
      name: 'Maya Lin',
      role: 'STAFF'
    }
  })

  const staff3User = await prisma.user.create({
    data: {
      email: 'david@lumina.app',
      name: 'David Okafor',
      role: 'STAFF'
    }
  })

  // 3. Create Demo Customer
  const customer = await prisma.user.create({
    data: {
      email: 'customer@lumina.app',
      name: 'Sam Fadahunsi',
      role: 'CUSTOMER'
    }
  })

  // 4. Create Lumina Spa & Wellness
  const business1 = await prisma.business.create({
    data: {
      name: 'Lumina Spa & Wellness',
      slug: 'lumina-spa',
      description: 'Luxury holistic spa offering deep tissue massages, facial treatments, and aromatherapy in a serene sanctuary.',
      category: 'Spa & Wellness',
      address: '12 Victoria Island Way, Lagos',
      phone: '+234 801 234 5678',
      isVerified: true,
      ownerId: owner.id,
      services: {
        create: [
          {
            name: 'Deep Tissue Massage',
            description: 'Relieve chronic muscle tension with focused, deep pressure massage techniques.',
            price: 45.00,
            duration: 60
          },
          {
            name: 'Hydrating Glow Facial',
            description: 'Deep cleansing and skin rejuvenation treatment using organic botanical oils.',
            price: 60.00,
            duration: 45
          },
          {
            name: 'Aromatherapy Full Body Therapy',
            description: 'Relaxation session combined with premium essential oils.',
            price: 75.00,
            duration: 90
          }
        ]
      },
      staff: {
        create: [
          {
            userId: staff1User.id,
            role: 'Senior Massage Therapist',
            bio: 'Certified masseuse with 8+ years experience in deep tissue and sports recovery.'
          },
          {
            userId: staff2User.id,
            role: 'Esthetician & Skincare Specialist',
            bio: 'Expert in facial treatments, skin glow therapy, and organic skincare.'
          }
        ]
      },
      availabilities: {
        create: [0, 1, 2, 3, 4, 5, 6].map(day => ({
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '18:00',
          isOpen: day !== 0 // closed on Sunday
        }))
      }
    },
    include: { services: true, staff: true }
  })

  // 5. Create Glow Barbershop
  const business2 = await prisma.business.create({
    data: {
      name: 'Glow Barbershop & Lounge',
      slug: 'glow-barbershop',
      description: 'Premium grooming, precision haircuts, beard sculpting, and hot towel shaves for gentlemen.',
      category: 'Barbershop',
      address: '45 Admiralty Way, Lekki Phase 1',
      phone: '+234 802 987 6543',
      isVerified: true,
      ownerId: owner.id,
      services: {
        create: [
          {
            name: 'Executive Haircut & Styling',
            description: 'Precision haircut with wash, razor line-up, and hair massage.',
            price: 25.00,
            duration: 40
          },
          {
            name: 'Beard Sculpting & Hot Towel',
            description: 'Beard shaping, oil conditioning, and refreshing hot towel shave.',
            price: 18.00,
            duration: 30
          },
          {
            name: 'Full VIP Grooming Package',
            description: 'Haircut, beard sculpt, facial scrub, and shoulder massage.',
            price: 50.00,
            duration: 75
          }
        ]
      },
      staff: {
        create: [
          {
            userId: staff3User.id,
            role: 'Master Barber',
            bio: 'Specialist in modern fades, beard work, and luxury grooming.'
          }
        ]
      },
      availabilities: {
        create: [0, 1, 2, 3, 4, 5, 6].map(day => ({
          dayOfWeek: day,
          startTime: '08:30',
          endTime: '20:00',
          isOpen: true
        }))
      }
    },
    include: { services: true, staff: true }
  })

  // 6. Create Initial Booking
  const service = business1.services[0]
  const staffMem = business1.staff[0]

  const startTime = new Date()
  startTime.setDate(startTime.getDate() + 1)
  startTime.setHours(10, 0, 0, 0)

  const endTime = new Date(startTime)
  endTime.setMinutes(endTime.getMinutes() + service.duration)

  await prisma.booking.create({
    data: {
      customerId: customer.id,
      businessId: business1.id,
      serviceId: service.id,
      staffId: staffMem.id,
      startTime,
      endTime,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      totalPrice: service.price
    }
  })

  console.log('Seeding completed successfully!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
