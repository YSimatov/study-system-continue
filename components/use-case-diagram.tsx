export function UseCaseDiagram() {
    const bg = "#1a1a2e"
    const mutedFg = "#8888aa"
    const sg = "#4ade80"   // student green
    const ty = "#facc15"   // teacher yellow
    const ar = "#f87171"   // admin red
    const sh = "#93c5fd"   // shared blue
    const fg = "#ffffff"

    // Vertical bus x-positions
    const LB = 168   // left bus (student side)
    const RB = 1040  // right bus (teacher/admin side)

    // UC box geometry helpers
    // Shared UCs (center)
    const REG  = { cy: 115, lx: 440, rx: 620 }  // Регистрация
    const AUTH = { cy: 175, lx: 440, rx: 620 }  // Авторизация
    const UCD  = { cy: 760, lx: 420, rx: 642 }  // Use Case диаграмма

    // Student UCs (left column) – right edge x=480
    const SLX = 280, SRX = 480
    const S = [
        { cy: 275 }, // теория
        { cy: 345 }, // тест
        { cy: 420 }, // экзамен
        { cy: 493 }, // результаты
        { cy: 560 }, // удаление аккаунта
    ]

    // Teacher UCs (right column) – right edge x=920
    const TLX = 720, TRX = 920
    const T = [{ cy: 275 }, { cy: 340 }, { cy: 405 }]

    // Admin UCs (right column lower)
    const A = [{ cy: 470 }, { cy: 535 }, { cy: 600 }]

    // Arrow marker helper
    const mkArr = (id: string, color: string) => (
        <marker key={id} id={id} markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill={color}/>
        </marker>
    )

    // Horizontal branch line: bus → UC edge  (or actor → bus)
    const branch = (x1: number, cy: number, x2: number, color: string, markerId: string, dashed = false) => (
        <line
            x1={x1} y1={cy} x2={x2} y2={cy}
            stroke={color} strokeWidth="1.5"
            strokeDasharray={dashed ? "7,4" : undefined}
            markerEnd={`url(#${markerId})`}
        />
    )

    return (
        <div className="border rounded-xl overflow-x-auto shadow-lg" style={{ background: bg }}>
            <svg viewBox="0 0 1200 820" xmlns="http://www.w3.org/2000/svg"
                className="w-full min-w-[800px]"
                style={{ fontFamily: "Inter, system-ui, sans-serif", background: bg }}>

                {/* ── Arrow markers ── */}
                <defs>
                    {mkArr("aW", fg)}
                    {mkArr("aG", sg)}
                    {mkArr("aY", ty)}
                    {mkArr("aR", ar)}
                    {mkArr("aB", sh)}
                </defs>

                {/* ── Title ── */}
                <text x="600" y="36" textAnchor="middle" fontSize="17" fontWeight="700" fill={fg}>
                    ИС «InfoSys Learn» — Диаграмма прецедентов (Use Case)
                </text>

                {/* ── Legend ── */}
                {[
                    { color: sh, label: "Общие", x: 30 },
                    { color: sg, label: "Учащийся", x: 95 },
                    { color: ty, label: "Преподаватель", x: 178 },
                    { color: ar, label: "Администратор", x: 302 },
                ].map(l => (
                    <g key={l.label}>
                        <rect x={l.x} y="50" width="13" height="10" fill="none" stroke={l.color} strokeWidth="1.5" rx="2"/>
                        <text x={l.x + 18} y="59" fontSize="10" fill={mutedFg}>{l.label}</text>
                    </g>
                ))}

                {/* ── System boundary ── */}
                <rect x="222" y="68" width="756" height="730" rx="8"
                    fill="none" stroke="#445" strokeWidth="1.5" strokeDasharray="12,6"/>
                <text x="600" y="86" textAnchor="middle" fontSize="12" fill={mutedFg} fontStyle="italic">
                    Система InfoSys Learn
                </text>

                {/* ══════════════════════════════════════════
                    USE CASE BOXES
                ══════════════════════════════════════════ */}
                {/* Shared */}
                <rect x="440" y="95"  width="180" height="40" rx="20" fill="none" stroke={sh} strokeWidth="1.8"/>
                <text x="530" y="120" textAnchor="middle" fontSize="13" fill={fg}>Регистрация</text>

                <rect x="440" y="155" width="180" height="40" rx="20" fill="none" stroke={sh} strokeWidth="1.8"/>
                <text x="530" y="180" textAnchor="middle" fontSize="13" fill={fg}>Авторизация</text>

                <rect x="420" y="740" width="222" height="40" rx="20" fill="none" stroke={sh} strokeWidth="1.8"/>
                <text x="531" y="765" textAnchor="middle" fontSize="12" fill={fg}>Просмотр Use Case диаграммы</text>

                {/* Student UCs */}
                {[
                    { y: 255, label1: "Просмотр теории", label2: null },
                    { y: 320, label1: "Тест самоконтроля", label2: "(с подсветкой ответов)" },
                    { y: 395, label1: "Экзамен по теме", label2: "(без подсветки)" },
                    { y: 468, label1: "Просмотр результатов", label2: "в личном кабинете" },
                    { y: 540, label1: "Удаление своего аккаунта", label2: null },
                ].map((uc, i) => (
                    <g key={i}>
                        <rect x={SLX} y={uc.y} width="200" height={uc.label2 ? 50 : 40} rx={uc.label2 ? 25 : 20}
                            fill="none" stroke={sg} strokeWidth="1.8"/>
                        <text x={SLX + 100} y={uc.y + (uc.label2 ? 22 : 25)} textAnchor="middle" fontSize="12" fill={fg}>{uc.label1}</text>
                        {uc.label2 && <text x={SLX + 100} y={uc.y + 40} textAnchor="middle" fontSize="10" fill={mutedFg}>{uc.label2}</text>}
                    </g>
                ))}

                {/* Teacher UCs */}
                {[
                    { y: 255, label: "Управление темами" },
                    { y: 320, label: "Управление вопросами" },
                    { y: 385, label: "Просмотр успеваемости" },
                ].map((uc, i) => (
                    <g key={i}>
                        <rect x={TLX} y={uc.y} width="200" height="40" rx="20" fill="none" stroke={ty} strokeWidth="1.8"/>
                        <text x={TLX + 100} y={uc.y + 25} textAnchor="middle" fontSize="12" fill={fg}>{uc.label}</text>
                    </g>
                ))}

                {/* Admin UCs */}
                {[
                    { y: 450, label: "Управление пользователями" },
                    { y: 515, label: "Смена ролей пользователей" },
                    { y: 580, label: "Удаление пользователей" },
                ].map((uc, i) => (
                    <g key={i}>
                        <rect x={TLX} y={uc.y} width="200" height="40" rx="20" fill="none" stroke={ar} strokeWidth="1.8"/>
                        <text x={TLX + 100} y={uc.y + 25} textAnchor="middle" fontSize="12" fill={fg}>{uc.label}</text>
                    </g>
                ))}

                {/* ══════════════════════════════════════════
                    ACTOR: Учащийся  (left, arm y=385)
                ══════════════════════════════════════════ */}
                <circle cx="95" cy="335" r="22" fill="none" stroke={fg} strokeWidth="2"/>
                <line x1="95" y1="357" x2="95" y2="415" stroke={fg} strokeWidth="2"/>
                <line x1="63"  y1="385" x2="127" y2="385" stroke={fg} strokeWidth="2"/>
                <line x1="95"  y1="415" x2="68"  y2="455" stroke={fg} strokeWidth="2"/>
                <line x1="95"  y1="415" x2="122" y2="455" stroke={fg} strokeWidth="2"/>
                <text x="95" y="477" textAnchor="middle" fontSize="14" fontWeight="600" fill={sg}>Учащийся</text>

                {/* ══════════════════════════════════════════
                    ACTOR: Преподаватель  (right, arm y=325)
                ══════════════════════════════════════════ */}
                <circle cx="1105" cy="277" r="22" fill="none" stroke={fg} strokeWidth="2"/>
                <line x1="1105" y1="299" x2="1105" y2="357" stroke={fg} strokeWidth="2"/>
                <line x1="1073" y1="325" x2="1137" y2="325" stroke={fg} strokeWidth="2"/>
                <line x1="1105" y1="357" x2="1078" y2="397" stroke={fg} strokeWidth="2"/>
                <line x1="1105" y1="357" x2="1132" y2="397" stroke={fg} strokeWidth="2"/>
                <text x="1105" y="420" textAnchor="middle" fontSize="14" fontWeight="600" fill={ty}>Преподаватель</text>

                {/* ══════════════════════════════════════════
                    ACTOR: Администратор  (right, arm y=550)
                ══════════════════════════════════════════ */}
                <circle cx="1105" cy="503" r="22" fill="none" stroke={ar} strokeWidth="2"/>
                <line x1="1105" y1="525" x2="1105" y2="583" stroke={ar} strokeWidth="2"/>
                <line x1="1073" y1="551" x2="1137" y2="551" stroke={ar} strokeWidth="2"/>
                <line x1="1105" y1="583" x2="1078" y2="623" stroke={ar} strokeWidth="2"/>
                <line x1="1105" y1="583" x2="1132" y2="623" stroke={ar} strokeWidth="2"/>
                <text x="1105" y="645" textAnchor="middle" fontSize="14" fontWeight="600" fill={ar}>Администратор</text>

                {/* ══════════════════════════════════════════
                    INHERITANCE: Teacher → Admin  (x=1105)
                ══════════════════════════════════════════ */}
                <line x1="1105" y1="438" x2="1105" y2="479" stroke={fg} strokeWidth="1.6" strokeDasharray="7,4"/>
                {/* open triangle pointing up at y=438 */}
                <polygon points="1105,420 1095,440 1115,440" fill="none" stroke={fg} strokeWidth="1.6"/>
                <text x="1122" y="458" fontSize="10" fill={mutedFg} fontStyle="italic">extends</text>

                {/* ══════════════════════════════════════════
                    LEFT BUS  (vertical spine at x=LB)
                ══════════════════════════════════════════ */}
                <line x1={LB} y1="115" x2={LB} y2="760" stroke={fg} strokeWidth="1.2" opacity="0.25"/>

                {/* Student arm → bus */}
                <line x1="117" y1="385" x2={LB} y2="385" stroke={fg} strokeWidth="1.4"/>

                {/* Bus → Shared UCs (leftward, blue) */}
                {branch(LB, REG.cy,  REG.lx,  sh, "aB")}
                {branch(LB, AUTH.cy, AUTH.lx, sh, "aB")}

                {/* Bus → Student UCs (green) */}
                {S.map((s, i) => <line key={`s${i}`} x1={LB} y1={s.cy} x2={SLX} y2={s.cy} stroke={sg} strokeWidth="1.5" markerEnd="url(#aG)"/>)}

                {/* Bus → UseCase diagram (blue) */}
                {branch(LB, UCD.cy, UCD.lx, sh, "aB")}

                {/* ══════════════════════════════════════════
                    RIGHT BUS  (vertical spine at x=RB)
                ══════════════════════════════════════════ */}
                <line x1={RB} y1="115" x2={RB} y2="760" stroke={fg} strokeWidth="1.2" opacity="0.25"/>

                {/* Teacher arm → bus */}
                <line x1="1083" y1="325" x2={RB} y2="325" stroke={fg} strokeWidth="1.4"/>

                {/* Admin arm → bus */}
                <line x1="1083" y1="551" x2={RB} y2="551" stroke={ar} strokeWidth="1.4"/>

                {/* Bus → Shared UCs (rightward into right edge, blue) */}
                {branch(RB, REG.cy,  REG.rx,  sh, "aB")}
                {branch(RB, AUTH.cy, AUTH.rx, sh, "aB")}

                {/* Bus → Teacher UCs (leftward, yellow) */}
                {T.map((t, i) => <line key={`t${i}`} x1={RB} y1={t.cy} x2={TRX} y2={t.cy} stroke={ty} strokeWidth="1.5" markerEnd="url(#aY)"/>)}

                {/* Bus → Admin UCs (leftward, red) */}
                {A.map((a, i) => <line key={`a${i}`} x1={RB} y1={a.cy} x2={TRX} y2={a.cy} stroke={ar} strokeWidth="1.5" markerEnd="url(#aR)"/>)}

                {/* Bus → UseCase diagram (blue) */}
                {branch(RB, UCD.cy, UCD.rx, sh, "aB")}

                {/* ── Legend footnote ── */}
                <text x="236" y="714" fontSize="9" fill={mutedFg} fontStyle="italic">
                    ▷ открытый треугольник + пунктир — наследование (Администратор extends Преподаватель)
                </text>
            </svg>
        </div>
    )
}
