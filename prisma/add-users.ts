import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    // Remove old non-email users if they exist
    await prisma.user.deleteMany({ where: { email: { in: ['admin', 'teacher'] } } })

    const adminHash = await hash('adminadmin', 10)
    const teacherHash = await hash('teacherteacher', 10)

    const admin = await prisma.user.upsert({
        where: { email: 'admin@mail.ru' },
        update: { passwordHash: adminHash, role: 'ADMIN', name: 'Администратор' },
        create: { email: 'admin@mail.ru', name: 'Администратор', passwordHash: adminHash, role: 'ADMIN' }
    })

    const teacher = await prisma.user.upsert({
        where: { email: 'teacher@mail.ru' },
        update: { passwordHash: teacherHash, role: 'TEACHER', name: 'Преподаватель' },
        create: { email: 'teacher@mail.ru', name: 'Преподаватель', passwordHash: teacherHash, role: 'TEACHER' }
    })

    console.log('✅ Admin:', admin.email, '|', admin.role)
    console.log('✅ Teacher:', teacher.email, '|', teacher.role)
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
