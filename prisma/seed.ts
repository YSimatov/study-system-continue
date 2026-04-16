import { PrismaClient, Role } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database with Russian content...')

    // 1. Create Users
    // Admin
    const adminPassword = await hash('admin123', 10)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            name: 'Администратор',
            passwordHash: adminPassword,
            role: Role.ADMIN,
        },
    })
    console.log({ admin })

    // Teacher
    const teacherPassword = await hash('teacher123', 10)
    const teacher = await prisma.user.upsert({
        where: { email: 'teacher@example.com' },
        update: {},
        create: {
            email: 'teacher@example.com',
            name: 'Елена Ивановна',
            passwordHash: teacherPassword,
            role: Role.TEACHER,
        },
    })
    console.log({ teacher })

    // Student
    const studentPassword = await hash('student123', 10)
    const student = await prisma.user.upsert({
        where: { email: 'student@example.com' },
        update: {},
        create: {
            email: 'student@example.com',
            name: 'Иван Петров',
            passwordHash: studentPassword,
            role: Role.STUDENT,
        },
    })
    console.log({ student })


    // 2. Clean up existing content (optional, but good for clean seed)
    await prisma.examAttempt.deleteMany({})
    await prisma.attemptAnswer.deleteMany({})
    await prisma.attempt.deleteMany({})
    await prisma.option.deleteMany({})
    await prisma.question.deleteMany({})
    await prisma.subtopic.deleteMany({})
    await prisma.topic.deleteMany({})


    // 3. Create Topic: "Компьютер и его ПО"
    const mainTopic = await prisma.topic.create({
        data: {
            title: 'Компьютер и его программное обеспечение',
            slug: 'computer-and-software-ru',
            description: 'Полный курс по устройству компьютера и программному обеспечению для 10 класса.',
        }
    })

    // 4. Content Structure
    const subtopics = [
        {
            title: '1. Аппаратное обеспечение ПК',
            slug: 'hardware-components',
            content: '# Аппаратное обеспечение (Hardware)\n\nАппаратное обеспечение — это совокупность всех физических частей компьютера.\n\n### Основные компоненты:\n1. **Центральный процессор (CPU)**: "Мозг" компьютера, выполняет вычисления и инструкции программ.\n2. **Оперативная память (RAM)**: Используется для временного хранения данных работающих программ. Данные стираются при выключении.\n3. **Накопители (HDD/SSD)**: Долговременная память для хранения файлов и ОС.\n4. **Материнская плата**: Плата, которая связывает все компоненты воедино.\n5. **Видеокарта (GPU)**: Обрабатывает графику и вывод изображения на монитор.',
            questions: [
                {
                    text: 'Какой компонент называют "мозгом" компьютера?',
                    options: [
                        { text: 'Жесткий диск (HDD)', isCorrect: false },
                        { text: 'Центральный процессор (CPU)', isCorrect: true },
                        { text: 'Оперативная память (RAM)', isCorrect: false },
                        { text: 'Блок питания', isCorrect: false },
                    ]
                },
                {
                    text: 'Что происходит с данными в оперативной памяти (RAM) при выключении ПК?',
                    options: [
                        { text: 'Они сохраняются навсегда', isCorrect: false },
                        { text: 'Они стираются', isCorrect: true },
                        { text: 'Они перемещаются в облако', isCorrect: false },
                        { text: 'Они сжимаются', isCorrect: false },
                    ]
                },
                {
                    text: 'Какое устройство предназначено для долговременного хранения данных?',
                    options: [
                        { text: 'Процессор', isCorrect: false },
                        { text: 'RAM', isCorrect: false },
                        { text: 'SSD накопитель', isCorrect: true },
                        { text: 'Кулер', isCorrect: false },
                    ]
                },
                {
                    text: 'Для чего нужна видеокарта?',
                    options: [
                        { text: 'Для охлаждения процессора', isCorrect: false },
                        { text: 'Для обработки и вывода изображения', isCorrect: true },
                        { text: 'Для подключения к интернету', isCorrect: false },
                        { text: 'Для хранения паролей', isCorrect: false },
                    ]
                },
                {
                    text: 'Что делает материнская плата?',
                    options: [
                        { text: 'Питает компьютер электричеством', isCorrect: false },
                        { text: 'Связывает все компоненты компьютера между собой', isCorrect: true },
                        { text: 'Выполняет арифметические операции', isCorrect: false },
                        { text: 'Защищает от вирусов', isCorrect: false },
                    ]
                }
            ]
        },
        {
            title: '2. Процессор и его характеристики',
            slug: 'cpu-details',
            content: '# Центральный процессор (CPU)\n\nПроцессор — это главная микросхема компьютера.\n\n### Основные характеристики:\n1. **Тактовая частота**: Измеряется в Гигагерцах (ГГц). Показывает, сколько операций в секунду может выполнить ядро.\n2. **Количество ядер**: Позволяет выполнять несколько задач параллельно. Современные CPU имеют от 4 до 16 и более ядер.\n3. **Кэш-память**: Сверхбыстрая память, встроенная в процессор для ускорения доступа к данным.\n\n### Производители:\nОсновные игроки на рынке — **Intel** и **AMD**.',
            questions: [
                {
                    text: 'В каких единицах измеряется тактовая частота процессора?',
                    options: [
                        { text: 'Гигабайты (ГБ)', isCorrect: false },
                        { text: 'Гигагерцы (ГГц)', isCorrect: true },
                        { text: 'Вольты (В)', isCorrect: false },
                        { text: 'Пиксели', isCorrect: false },
                    ]
                },
                {
                    text: 'Что дает увеличение количества ядер процессора?',
                    options: [
                        { text: 'Увеличивает объем памяти для хранения фото', isCorrect: false },
                        { text: 'Позволяет эффективно выполнять несколько задач одновременно', isCorrect: true },
                        { text: 'Увеличивает диагональ экрана', isCorrect: false },
                        { text: 'Снижает потребление электричества до нуля', isCorrect: false },
                    ]
                },
                {
                    text: 'Что такое кэш-память процессора?',
                    options: [
                        { text: 'Место для хранения денег в компьютере', isCorrect: false },
                        { text: 'Сверхбыстрая память внутри процессора', isCorrect: true },
                        { text: 'Внешний жесткий диск', isCorrect: false },
                        { text: 'Папка с удаленными файлами', isCorrect: false },
                    ]
                },
                {
                    text: 'Какие компании являются основными производителями процессоров для ПК?',
                    options: [
                        { text: 'McDonalds и Burger King', isCorrect: false },
                        { text: 'Intel и AMD', isCorrect: true },
                        { text: 'Coca-Cola и Pepsi', isCorrect: false },
                        { text: 'Nike и Adidas', isCorrect: false },
                    ]
                },
                {
                    text: 'Какую функцию НЕ выполняет процессор?',
                    options: [
                        { text: 'Выполнение программного кода', isCorrect: false },
                        { text: 'Арифметические вычисления', isCorrect: false },
                        { text: 'Долговременное хранение файлов при выключенном питании', isCorrect: true },
                        { text: 'Управление потоками данных', isCorrect: false },
                    ]
                }
            ]
        },
        {
            title: '3. Системное ПО',
            slug: 'system-software',
            content: '# Системное программное обеспечение\n\nСистемное ПО управляет компонентами компьютера и создает среду для работы прикладных программ.\n\n### Операционная система (ОС)\nГлавная программа компьютера. Она загружается при включении и управляет всем остальным.\n\n**Примеры ОС:**\n* Windows\n* macOS\n* Linux\n* Android / iOS (для мобильных)\n\n### Драйверы\nСпециальные программы, которые "учат" операционную систему работать с конкретным оборудованием (например, драйвер видеокарты или принтера).',
            questions: [
                {
                    text: 'Какая из перечисленных программ является Операционной Системой?',
                    options: [
                        { text: 'Microsoft Word', isCorrect: false },
                        { text: 'Windows 10', isCorrect: true },
                        { text: 'Google Chrome', isCorrect: false },
                        { text: 'Adobe Photoshop', isCorrect: false },
                    ]
                },
                {
                    text: 'Какова основная задача драйвера устройства?',
                    options: [
                        { text: 'Очистка экрана от пыли', isCorrect: false },
                        { text: 'Обеспечение взаимодействия ОС с аппаратным устройством', isCorrect: true },
                        { text: 'Создание текстовых документов', isCorrect: false },
                        { text: 'Проигрывание музыки', isCorrect: false },
                    ]
                },
                {
                    text: 'Какое ПО является "фундаментом", без которого не запустятся игры и браузеры?',
                    options: [
                        { text: 'Антивирус', isCorrect: false },
                        { text: 'Операционная система', isCorrect: true },
                        { text: 'Текстовый редактор', isCorrect: false },
                        { text: 'Калькулятор', isCorrect: false },
                    ]
                },
                {
                    text: 'К какому типу ПО относится Linux?',
                    options: [
                        { text: 'Операционная система', isCorrect: true },
                        { text: 'Прикладная программа', isCorrect: false },
                        { text: 'Антивирусная утилита', isCorrect: false },
                        { text: 'Компьютерная игра', isCorrect: false },
                    ]
                }
            ]
        },
        {
            title: '4. Прикладное ПО',
            slug: 'application-software',
            content: '# Прикладное ПО\n\nПрикладное ПО — это программы, предназначенные для решения конкретных задач пользователя.\n\n### Типы прикладного ПО:\n* **Текстовые процессоры**: Microsoft Word, Google Docs.\n* **Табличные процессоры**: Microsoft Excel.\n* **Графические редакторы**: Photoshop, Paint.\n* **Браузеры**: Chrome, Firefox, Edge.\n* **Игры**.\n* **Системы управления базами данных**.',
            questions: [
                {
                    text: 'Какая программа предназначена для работы с электронными таблицами?',
                    options: [
                        { text: 'Microsoft PowerPoint', isCorrect: false },
                        { text: 'Microsoft Excel', isCorrect: true },
                        { text: 'Skype', isCorrect: false },
                        { text: 'WinRAR', isCorrect: false },
                    ]
                },
                {
                    text: 'К какому типу ПО относится Google Chrome?',
                    options: [
                        { text: 'Графический редактор', isCorrect: false },
                        { text: 'Браузер (Web Browser)', isCorrect: true },
                        { text: 'Антивирус', isCorrect: false },
                        { text: 'ОС', isCorrect: false },
                    ]
                },
                {
                    text: 'Для чего используется Photoshop?',
                    options: [
                        { text: 'Для вычислений', isCorrect: false },
                        { text: 'Для редактирования изображений', isCorrect: true },
                        { text: 'Для прослушивания музыки', isCorrect: false },
                        { text: 'Для написания кода', isCorrect: false },
                    ]
                },
                {
                    text: 'Что из перечисленного НЕ является прикладным ПО?',
                    options: [
                        { text: 'Fortnite (Игра)', isCorrect: false },
                        { text: 'Telegram (Мессенджер)', isCorrect: false },
                        { text: 'Драйвер видеокарты', isCorrect: true },
                        { text: 'Блокнот', isCorrect: false },
                    ]
                }
            ]
        },
        {
            title: '5. Организация файловой системы',
            slug: 'file-system',
            content: '# Файловая система\n\nОна определяет, как данные хранятся и организуются на носителе.\n\n### Основные понятия:\n* **Файл**: Именованная область данных.\n* **Папка (Каталог)**: Контейнер для группировки файлов.\n* **Путь к файлу**: Адрес, указывающий местоположение файла (например `C:\\Users\\Admin\\Doc.txt`).\n* **Расширение**: Часть имени файла после точки, указывающая на его тип (например, `.txt`, `.jpg`, `.exe`).',
            questions: [
                {
                    text: 'Что такое расширение файла?',
                    options: [
                        { text: 'Размер файла в байтах', isCorrect: false },
                        { text: 'Часть имени после точки, указывающая тип файла', isCorrect: true },
                        { text: 'Дата создания файла', isCorrect: false },
                        { text: 'Пароль от файла', isCorrect: false },
                    ]
                },
                {
                    text: 'Какой символ обычно разделяет имя файла и расширение?',
                    options: [
                        { text: 'Запятая (,)', isCorrect: false },
                        { text: 'Точка (.)', isCorrect: true },
                        { text: 'Слэш (/)', isCorrect: false },
                        { text: 'Тире (-)', isCorrect: false },
                    ]
                },
                {
                    text: 'Какой путь к файлу в Windows выглядит корректно?',
                    options: [
                        { text: 'C:\\Users\\User\\photo.jpg', isCorrect: true },
                        { text: 'http://mysite.com', isCorrect: false },
                        { text: 'User > Photo > Jpg', isCorrect: false },
                        { text: '#System#Files', isCorrect: false },
                    ]
                },
                {
                    text: 'Для чего нужны папки (каталоги)?',
                    options: [
                        { text: 'Чтобы замедлять работу ПК', isCorrect: false },
                        { text: 'Для логической группировки и организации файлов', isCorrect: true },
                        { text: 'Для красоты', isCorrect: false },
                        { text: 'Чтобы файлы не слиплись', isCorrect: false },
                    ]
                }
            ]
        }
    ]

    for (const sub of subtopics) {
        const subtopicDesc = await prisma.subtopic.create({
            data: {
                topicId: mainTopic.id,
                title: sub.title,
                slug: sub.slug,
                contentMarkdown: sub.content
            }
        })

        // Create questions
        for (const q of sub.questions) {
            await prisma.question.create({
                data: {
                    subtopicId: subtopicDesc.id,
                    text: q.text,
                    options: {
                        create: q.options
                    }
                }
            })
        }
    }

    console.log('Seeding finished successfully!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
