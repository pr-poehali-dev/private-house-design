import { useState } from "react";
import Icon from "@/components/ui/icon";

type Tab = "projects" | "foundation" | "drawings" | "calculator";

interface Project {
  id: number;
  name: string;
  area: number;
  status: "planning" | "design" | "construction" | "done";
  progress: number;
  date: string;
}

interface Drawing {
  id: number;
  title: string;
  type: string;
  floor: number;
  updated: string;
  status: "draft" | "approved" | "revision";
}

const PROJECTS: Project[] = [
  { id: 1, name: "Частный дом 150 м²", area: 150, status: "design", progress: 35, date: "Фев 2026" },
  { id: 2, name: "Дача в Подмосковье", area: 80, status: "planning", progress: 10, date: "Мар 2026" },
  { id: 3, name: "Коттедж у озера", area: 220, status: "construction", progress: 72, date: "Янв 2026" },
];

const DRAWINGS: Drawing[] = [
  { id: 1, title: "Генеральный план участка", type: "Генплан", floor: 0, updated: "22 фев", status: "approved" },
  { id: 2, title: "План 1-го этажа", type: "Архитектура", floor: 1, updated: "21 фев", status: "approved" },
  { id: 3, title: "План 2-го этажа", type: "Архитектура", floor: 2, updated: "20 фев", status: "draft" },
  { id: 4, title: "Разрез А-А", type: "Конструктив", floor: 0, updated: "19 фев", status: "revision" },
  { id: 5, title: "Фасад южный", type: "Фасады", floor: 0, updated: "18 фев", status: "approved" },
  { id: 6, title: "Кровля — план", type: "Конструктив", floor: 0, updated: "17 фев", status: "draft" },
];

const MATERIALS = [
  { name: "Кирпич облицовочный", unit: "шт/м²", rate: 52, price: 28 },
  { name: "Газобетонные блоки", unit: "м³", rate: 0.3, price: 4800 },
  { name: "Бетон М300", unit: "м³", rate: 0.12, price: 6200 },
  { name: "Арматура А500", unit: "кг/м²", rate: 18, price: 82 },
  { name: "Утеплитель 100мм", unit: "м²", rate: 1, price: 320 },
  { name: "Черепица керамическая", unit: "м²", rate: 1.1, price: 1850 },
];

// Foundation data
const PILE_DIAMETER = 108; // мм
const PILE_COUNT = 63;
const FOUND_W = 12200; // мм
const FOUND_L = 16000; // мм
const BEAM_SECTION = "200×200";
const BEAM_LEN = 4000; // мм

// Периметр + внутренние пролёты обвязки (упрощённо периметр + перемычки)
const perimeter = 2 * (FOUND_W + FOUND_L); // мм
const perimeterM = perimeter / 1000; // м
// Количество балок на периметр (каждая 4м)
const beamsForPerimeter = Math.ceil(perimeterM / (BEAM_LEN / 1000));
// Внутренние прогоны примерно 1/3 от периметра
const beamsInner = Math.ceil(beamsForPerimeter * 0.4);
const totalBeams = beamsForPerimeter + beamsInner;

const pilePrice = 3200; // ₽ за сваю (под ключ установка)
const beamPrice = 5800; // ₽ за брус 200×200×4000
const capPrice = 320;   // ₽ оголовок на сваю
const antiCorrosionPrice = 180; // ₽ за обработку 1 сваи
const antisepticPrice = 420; // ₽ за обработку 1 бруса

const costPiles = PILE_COUNT * pilePrice;
const costCaps = PILE_COUNT * capPrice;
const costAntiCorrosion = PILE_COUNT * antiCorrosionPrice;
const costBeams = totalBeams * beamPrice;
const costAntiseptic = totalBeams * antisepticPrice;
const costFoundTotal = costPiles + costCaps + costAntiCorrosion + costBeams + costAntiseptic;

const foundationItems = [
  { label: "Винтовые сваи Ø108мм", qty: `${PILE_COUNT} шт`, unitPrice: pilePrice, total: costPiles, icon: "Drill", color: "from-amber-400 to-orange-500" },
  { label: "Оголовки на сваи", qty: `${PILE_COUNT} шт`, unitPrice: capPrice, total: costCaps, icon: "Layers", color: "from-sky-400 to-blue-500" },
  { label: "Антикоррозийная обработка", qty: `${PILE_COUNT} шт`, unitPrice: antiCorrosionPrice, total: costAntiCorrosion, icon: "Shield", color: "from-emerald-400 to-teal-500" },
  { label: `Брус ${BEAM_SECTION}×4000`, qty: `${totalBeams} шт`, unitPrice: beamPrice, total: costBeams, icon: "AlignJustify", color: "from-violet-500 to-indigo-500" },
  { label: "Антисептик для бруса", qty: `${totalBeams} шт`, unitPrice: antisepticPrice, total: costAntiseptic, icon: "Droplets", color: "from-pink-400 to-rose-500" },
];

const statusLabel = (s: Project["status"]) => {
  const map = { planning: "Планирование", design: "Проектирование", construction: "Строительство", done: "Готово" };
  return map[s];
};
const statusColor = (s: Project["status"]) => {
  const map = {
    planning: "bg-blue-100 text-blue-700",
    design: "bg-violet-100 text-violet-700",
    construction: "bg-amber-100 text-amber-700",
    done: "bg-emerald-100 text-emerald-700",
  };
  return map[s];
};
const drawingStatusLabel = (s: Drawing["status"]) => {
  const map = { draft: "Черновик", approved: "Утверждён", revision: "На правке" };
  return map[s];
};
const drawingStatusColor = (s: Drawing["status"]) => {
  const map = {
    draft: "bg-slate-100 text-slate-600",
    approved: "bg-emerald-100 text-emerald-700",
    revision: "bg-orange-100 text-orange-700",
  };
  return map[s];
};

export default function Index() {
  const [tab, setTab] = useState<Tab>("foundation");
  const [area, setArea] = useState(150);
  const [floors, setFloors] = useState(2);
  const [hasBasement, setHasBasement] = useState(false);
  const [activeProject, setActiveProject] = useState(0);
  const [foundSection, setFoundSection] = useState<"spec" | "estimate">("spec");

  const totalArea = area * floors + (hasBasement ? area * 0.8 : 0);
  const totalCost = Math.round(
    MATERIALS.reduce((sum, m) => sum + m.rate * m.price * totalArea, 0) / 1000
  );

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "projects", label: "Проекты", icon: "FolderOpen" },
    { key: "foundation", label: "Фундамент", icon: "Drill" },
    { key: "drawings", label: "Чертежи", icon: "Layers" },
    { key: "calculator", label: "Калькулятор", icon: "Calculator" },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f14] font-golos text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0f0f14]/80 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Icon name="Home" size={18} className="text-white" />
            </div>
            <span className="font-montserrat font-black text-lg tracking-tight">АрхиПроект</span>
          </div>
          <div className="flex items-center gap-1 bg-white/5 rounded-full px-1 py-1 border border-white/10">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  tab === t.key
                    ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg shadow-violet-500/25"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                <Icon name={t.icon} size={14} />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg shadow-violet-500/30 hover:scale-105 transition-transform">
            <Icon name="Plus" size={15} />
            <span className="hidden sm:inline">Новый</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* ── FOUNDATION ── */}
        {tab === "foundation" && (
          <div className="animate-fade-in">
            {/* Hero */}
            <div className="mb-8 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-400/15 text-amber-400 border border-amber-400/20">
                    Этап 1 · В работе
                  </span>
                </div>
                <h1 className="font-montserrat font-black text-3xl sm:text-4xl text-white mb-2">Фундамент</h1>
                <p className="text-white/40 text-sm">Винтовые сваи + обвязка брусом · Частный дом 150 м²</p>
              </div>
              <div className="hidden sm:flex gap-2">
                <button className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  <Icon name="Download" size={14} />
                  Смета PDF
                </button>
                <button className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  <Icon name="Share2" size={14} />
                  Поделиться
                </button>
              </div>
            </div>

            {/* KPI карточки */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                { label: "Свай", value: `${PILE_COUNT} шт`, sub: `Ø${PILE_DIAMETER} мм`, icon: "Drill", color: "from-amber-400 to-orange-500" },
                { label: "Фундамент", value: `${(FOUND_W/1000).toFixed(1)}×${(FOUND_L/1000).toFixed(1)} м`, sub: `${((FOUND_W/1000)*(FOUND_L/1000)).toFixed(0)} м²`, icon: "Maximize2", color: "from-violet-500 to-indigo-600" },
                { label: "Брус обвязки", value: `${totalBeams} шт`, sub: `${BEAM_SECTION}×${BEAM_LEN} мм`, icon: "AlignJustify", color: "from-sky-400 to-blue-600" },
                { label: "Итого бюджет", value: `${(costFoundTotal/1000).toFixed(0)} тыс`, sub: "материалы + монтаж", icon: "Wallet", color: "from-emerald-400 to-teal-600" },
              ].map((s) => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-lg`}>
                    <Icon name={s.icon} size={16} className="text-white" />
                  </div>
                  <div className="font-montserrat font-black text-lg text-white leading-tight">{s.value}</div>
                  <div className="text-white/35 text-xs mt-0.5">{s.sub}</div>
                  <div className="text-white/50 text-xs mt-1 font-medium">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Tabs внутри раздела */}
            <div className="flex gap-2 mb-6">
              {[{ key: "spec", label: "Характеристики" }, { key: "estimate", label: "Смета" }].map((s) => (
                <button
                  key={s.key}
                  onClick={() => setFoundSection(s.key as "spec" | "estimate")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    foundSection === s.key
                      ? "bg-white/15 text-white border border-white/20"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {foundSection === "spec" && (
              <div className="grid lg:grid-cols-2 gap-5">
                {/* Сваи */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <Icon name="Drill" size={15} className="text-white" />
                    </div>
                    <h2 className="font-montserrat font-bold text-white">Винтовые сваи</h2>
                  </div>
                  <div className="divide-y divide-white/8">
                    {[
                      { label: "Тип", value: "Винтовые сваи" },
                      { label: "Диаметр трубы", value: `${PILE_DIAMETER} мм` },
                      { label: "Количество", value: `${PILE_COUNT} шт` },
                      { label: "Шаг установки", value: `~${((FOUND_W/1000 + FOUND_L/1000) / (PILE_COUNT / 2)).toFixed(2)} м` },
                      { label: "Покрытие", value: "Антикоррозийный грунт" },
                      { label: "Оголовки", value: `Приварные, ${PILE_COUNT} шт` },
                    ].map((r) => (
                      <div key={r.label} className="px-5 py-3 flex justify-between items-center hover:bg-white/5 transition-colors">
                        <span className="text-sm text-white/50">{r.label}</span>
                        <span className="text-sm font-semibold text-white">{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Фундамент + обвязка */}
                <div className="space-y-5">
                  <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                        <Icon name="Maximize2" size={15} className="text-white" />
                      </div>
                      <h2 className="font-montserrat font-bold text-white">Габариты фундамента</h2>
                    </div>
                    <div className="divide-y divide-white/8">
                      {[
                        { label: "Ширина", value: `${(FOUND_W/1000).toFixed(2)} м (${FOUND_W} мм)` },
                        { label: "Длина", value: `${(FOUND_L/1000).toFixed(2)} м (${FOUND_L} мм)` },
                        { label: "Площадь", value: `${((FOUND_W/1000)*(FOUND_L/1000)).toFixed(2)} м²` },
                        { label: "Периметр", value: `${(perimeterM).toFixed(2)} м` },
                      ].map((r) => (
                        <div key={r.label} className="px-5 py-3 flex justify-between items-center hover:bg-white/5 transition-colors">
                          <span className="text-sm text-white/50">{r.label}</span>
                          <span className="text-sm font-semibold text-white">{r.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
                        <Icon name="AlignJustify" size={15} className="text-white" />
                      </div>
                      <h2 className="font-montserrat font-bold text-white">Обвязка брусом</h2>
                    </div>
                    <div className="divide-y divide-white/8">
                      {[
                        { label: "Сечение бруса", value: `${BEAM_SECTION} мм` },
                        { label: "Длина хлыста", value: `${BEAM_LEN} мм (4 м)` },
                        { label: "Количество", value: `${totalBeams} шт` },
                        { label: "Объём", value: `${((0.2*0.2*BEAM_LEN/1000)*totalBeams).toFixed(2)} м³` },
                        { label: "Обработка", value: "Антисептик + огнебиозащита" },
                        { label: "Крепление", value: "Болтовое к оголовку" },
                      ].map((r) => (
                        <div key={r.label} className="px-5 py-3 flex justify-between items-center hover:bg-white/5 transition-colors">
                          <span className="text-sm text-white/50">{r.label}</span>
                          <span className="text-sm font-semibold text-white">{r.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Схема фундамента — точная сетка 9×7 */}
                <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-montserrat font-bold text-white text-sm">Схема расположения свай · Вид сверху</h2>
                    <span className="text-xs text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/10">9 × 7 = 63 сваи</span>
                  </div>

                  <div className="relative bg-[#07070d] rounded-xl border border-white/10 overflow-hidden">
                    <svg
                      width="100%"
                      viewBox="-80 -55 16240 12390"
                      className="block"
                      style={{ maxHeight: 420 }}
                    >
                      {/* Заливка фундамента */}
                      <rect x="0" y="0" width="16000" height="12200" fill="rgba(56,189,248,0.05)" stroke="none"/>

                      {/* Прогоны по X (горизонтальные брусы) — 7 строк */}
                      {[0, 2000, 4000, 6100, 8100, 10200, 12200].map((y) => (
                        <line key={`hb-${y}`} x1="0" y1={y} x2="16000" y2={y}
                          stroke="rgba(56,189,248,0.55)" strokeWidth="90"/>
                      ))}

                      {/* Прогоны по Y (вертикальные брусы) — 9 колонн */}
                      {[0, 1900, 3900, 5900, 7900, 9900, 11900, 13900, 16000].map((x) => (
                        <line key={`vb-${x}`} x1={x} y1="0" x2={x} y2="12200"
                          stroke="rgba(56,189,248,0.55)" strokeWidth="90"/>
                      ))}

                      {/* Периметр */}
                      <rect x="0" y="0" width="16000" height="12200"
                        fill="none" stroke="rgba(139,92,246,0.7)" strokeWidth="120"/>

                      {/* Сваи 9×7 */}
                      {[0, 1900, 3900, 5900, 7900, 9900, 11900, 13900, 16000].map((x) =>
                        [0, 2000, 4000, 6100, 8100, 10200, 12200].map((y) => (
                          <g key={`p-${x}-${y}`}>
                            <circle cx={x} cy={y} r="340" fill="rgba(251,191,36,0.15)" stroke="rgba(251,191,36,0.4)" strokeWidth="60"/>
                            <circle cx={x} cy={y} r="180" fill="rgba(251,191,36,0.9)" stroke="none"/>
                            <circle cx={x} cy={y} r="70" fill="white" opacity="0.9"/>
                          </g>
                        ))
                      )}

                      {/* === РАЗМЕРЫ ПО X (сверху) === */}
                      {/* Общий габарит 16000 */}
                      <line x1="0" y1="-400" x2="16000" y2="-400" stroke="rgba(255,255,255,0.3)" strokeWidth="25"/>
                      <line x1="0" y1="-500" x2="0" y2="-300" stroke="rgba(255,255,255,0.3)" strokeWidth="25"/>
                      <line x1="16000" y1="-500" x2="16000" y2="-300" stroke="rgba(255,255,255,0.3)" strokeWidth="25"/>
                      <text x="8000" y="-200" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="380" fontFamily="Golos Text, sans-serif" fontWeight="600">16 000 мм</text>

                      {/* Шаги по X: 1900, 2000×7, 1900 */}
                      {[
                        [0, 1900, "1900"],
                        [1900, 3900, "2000"],
                        [3900, 5900, "2000"],
                        [5900, 7900, "2000"],
                        [7900, 9900, "2000"],
                        [9900, 11900, "2000"],
                        [11900, 13900, "2000"],
                        [13900, 16000, "1900"],
                      ].map(([x1, x2, label]) => (
                        <g key={`dx-${x1}`}>
                          <line x1={x1} y1="-800" x2={x2} y2="-800" stroke="rgba(255,255,255,0.18)" strokeWidth="20"/>
                          <line x1={x1} y1="-870" x2={x1} y2="-730" stroke="rgba(255,255,255,0.18)" strokeWidth="20"/>
                          <line x1={x2} y1="-870" x2={x2} y2="-730" stroke="rgba(255,255,255,0.18)" strokeWidth="20"/>
                          <text x={(+x1 + +x2) / 2} y="-620" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="270" fontFamily="Golos Text, sans-serif">{label}</text>
                        </g>
                      ))}

                      {/* === РАЗМЕРЫ ПО Y (слева) === */}
                      {/* Общий габарит 12200 */}
                      <line x1="-400" y1="0" x2="-400" y2="12200" stroke="rgba(255,255,255,0.3)" strokeWidth="25"/>
                      <line x1="-500" y1="0" x2="-300" y2="0" stroke="rgba(255,255,255,0.3)" strokeWidth="25"/>
                      <line x1="-500" y1="12200" x2="-300" y2="12200" stroke="rgba(255,255,255,0.3)" strokeWidth="25"/>
                      <text x="-200" y="6100" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="380" fontFamily="Golos Text, sans-serif" fontWeight="600"
                        transform="rotate(-90,-200,6100)">12 200 мм</text>

                      {/* Шаги по Y: 2000, 2000, 2100, 2000, 2100, 2000 */}
                      {[
                        [0, 2000, "2000"],
                        [2000, 4000, "2000"],
                        [4000, 6100, "2100"],
                        [6100, 8100, "2000"],
                        [8100, 10200, "2100"],
                        [10200, 12200, "2000"],
                      ].map(([y1, y2, label]) => (
                        <g key={`dy-${y1}`}>
                          <line x1="-750" y1={y1} x2="-750" y2={y2} stroke="rgba(255,255,255,0.18)" strokeWidth="20"/>
                          <line x1="-820" y1={y1} x2="-680" y2={y1} stroke="rgba(255,255,255,0.18)" strokeWidth="20"/>
                          <line x1="-820" y1={y2} x2="-680" y2={y2} stroke="rgba(255,255,255,0.18)" strokeWidth="20"/>
                          <text x="-580" y={(+y1 + +y2) / 2 + 100} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="270" fontFamily="Golos Text, sans-serif"
                            transform={`rotate(-90,-580,${(+y1 + +y2) / 2})`}>{label}</text>
                        </g>
                      ))}

                      {/* Нумерация свай */}
                      {[0, 1900, 3900, 5900, 7900, 9900, 11900, 13900, 16000].map((x, ci) =>
                        [0, 2000, 4000, 6100, 8100, 10200, 12200].map((y, ri) => (
                          <text key={`n-${x}-${y}`} x={x} y={y + 520} textAnchor="middle"
                            fill="rgba(255,255,255,0.25)" fontSize="230" fontFamily="Golos Text, sans-serif">
                            {ri * 9 + ci + 1}
                          </text>
                        ))
                      )}
                    </svg>

                    {/* Легенда */}
                    <div className="absolute bottom-3 right-4 flex items-center gap-4 text-xs text-white/40 bg-black/40 backdrop-blur px-3 py-2 rounded-xl border border-white/10">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-amber-400"/>
                        <span>Свая Ø108</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-1.5 bg-sky-400/70 rounded"/>
                        <span>Брус 200×200</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 border-2 border-violet-400 rounded-sm"/>
                        <span>Периметр</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {foundSection === "estimate" && (
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/10">
                    <h2 className="font-montserrat font-bold text-white">Сводная смета · Фундамент</h2>
                  </div>
                  <div className="divide-y divide-white/8">
                    {foundationItems.map((item) => (
                      <div key={item.label} className="px-5 py-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0 shadow-md`}>
                          <Icon name={item.icon} size={15} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-white">{item.label}</div>
                          <div className="text-xs text-white/40 mt-0.5">
                            {item.qty} · {item.unitPrice.toLocaleString("ru-RU")} ₽/шт
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-montserrat font-bold text-white">
                            {(item.total / 1000).toFixed(1)} тыс. ₽
                          </div>
                          <div className="text-xs text-white/30 mt-0.5">
                            {Math.round(item.total / costFoundTotal * 100)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Итого */}
                  <div className="px-5 py-4 bg-gradient-to-r from-violet-500/10 to-indigo-500/5 border-t border-violet-500/20 flex items-center justify-between">
                    <div>
                      <div className="font-montserrat font-black text-white text-lg">ИТОГО</div>
                      <div className="text-xs text-white/40 mt-0.5">Все работы и материалы</div>
                    </div>
                    <div className="text-right">
                      <div className="font-montserrat font-black text-2xl text-white">
                        {(costFoundTotal / 1000).toFixed(0)} <span className="text-base text-white/50">тыс. ₽</span>
                      </div>
                      <div className="text-xs text-white/30 mt-0.5">≈ {(costFoundTotal / ((FOUND_W/1000)*(FOUND_L/1000))).toFixed(0)} ₽/м²</div>
                    </div>
                  </div>
                </div>

                {/* Доли в графике */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <h3 className="font-montserrat font-bold text-white text-sm mb-4">Структура затрат</h3>
                  <div className="space-y-3">
                    {foundationItems.map((item) => {
                      const pct = Math.round(item.total / costFoundTotal * 100);
                      return (
                        <div key={item.label}>
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-white/60">{item.label}</span>
                            <span className="text-white font-semibold">{pct}%</span>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-700`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-semibold text-sm hover:scale-[1.02] transition-transform shadow-lg shadow-violet-500/25">
                    <Icon name="Download" size={15} />
                    Скачать смету PDF
                  </button>
                  <button className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white/90 hover:bg-white/10 text-sm transition-all">
                    <Icon name="Pencil" size={15} />
                    Редактировать
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── PROJECTS ── */}
        {tab === "projects" && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <h1 className="font-montserrat font-black text-3xl sm:text-4xl text-white mb-2">Мои проекты</h1>
              <p className="text-white/40 text-sm">Управляйте всеми этапами проектирования</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                { label: "Всего проектов", value: "3", icon: "FolderOpen", color: "from-violet-500 to-indigo-600" },
                { label: "В работе", value: "2", icon: "Zap", color: "from-amber-400 to-orange-500" },
                { label: "Чертежей", value: "24", icon: "FileText", color: "from-sky-400 to-blue-600" },
                { label: "Общая площадь", value: "450 м²", icon: "Maximize2", color: "from-emerald-400 to-teal-600" },
              ].map((s) => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-lg`}>
                    <Icon name={s.icon} size={16} className="text-white" />
                  </div>
                  <div className="font-montserrat font-bold text-xl text-white">{s.value}</div>
                  <div className="text-white/40 text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PROJECTS.map((p, i) => (
                <div
                  key={p.id}
                  onClick={() => setActiveProject(i)}
                  className={`group cursor-pointer rounded-2xl border transition-all duration-300 p-5 ${
                    activeProject === i
                      ? "bg-gradient-to-br from-violet-500/20 to-indigo-500/10 border-violet-500/50 shadow-xl shadow-violet-500/10"
                      : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/8"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/30 to-indigo-500/20 border border-violet-500/20 flex items-center justify-center">
                      <Icon name="Home" size={20} className="text-violet-400" />
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor(p.status)}`}>
                      {statusLabel(p.status)}
                    </span>
                  </div>
                  <h3 className="font-montserrat font-bold text-base text-white mb-1">{p.name}</h3>
                  <p className="text-white/40 text-sm mb-4">{p.area} м² · {p.date}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-white/40">
                      <span>Готовность</span>
                      <span className="text-white font-semibold">{p.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 rounded-full" style={{ width: `${p.progress}%` }} />
                    </div>
                  </div>
                </div>
              ))}
              <button className="rounded-2xl border-2 border-dashed border-white/15 p-5 flex flex-col items-center justify-center gap-3 text-white/30 hover:text-white/60 hover:border-white/30 transition-all duration-200 min-h-[180px]">
                <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-current flex items-center justify-center">
                  <Icon name="Plus" size={20} />
                </div>
                <span className="text-sm font-medium">Добавить проект</span>
              </button>
            </div>
            <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-montserrat font-bold text-white">{PROJECTS[activeProject].name}</h2>
                <div className="flex gap-2">
                  {["Описание", "Команда", "Документы"].map((label) => (
                    <button key={label} className="text-xs text-white/40 hover:text-white/80 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { icon: "MapPin", label: "Площадь участка", value: "12 соток" },
                  { icon: "Layers", label: "Этажность", value: "2 этажа + мансарда" },
                  { icon: "Users", label: "Команда", value: "Архитектор, Конструктор" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center shrink-0">
                      <Icon name={item.icon} size={15} className="text-violet-400" />
                    </div>
                    <div>
                      <div className="text-xs text-white/40">{item.label}</div>
                      <div className="text-sm font-medium text-white">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── DRAWINGS ── */}
        {tab === "drawings" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-montserrat font-black text-3xl sm:text-4xl text-white mb-2">Чертежи</h1>
                <p className="text-white/40 text-sm">Вся проектная документация в одном месте</p>
              </div>
              <button className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-violet-500/25 hover:scale-105 transition-transform">
                <Icon name="Upload" size={15} />
                Загрузить
              </button>
            </div>
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {["Все", "Генплан", "Архитектура", "Конструктив", "Фасады"].map((f) => (
                <button key={f} className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${f === "Все" ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg shadow-violet-500/25" : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80 border border-white/10"}`}>
                  {f}
                </button>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {DRAWINGS.map((d) => (
                <div key={d.id} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300 cursor-pointer">
                  <div className="h-40 bg-gradient-to-br from-slate-800 to-slate-900 border-b border-white/10 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                    <div className="relative flex flex-col items-center gap-2 text-white/20 group-hover:text-violet-400/60 transition-colors">
                      <Icon name="FileText" size={36} />
                      <span className="text-xs font-medium">{d.type}</span>
                    </div>
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-7 h-7 bg-white/10 backdrop-blur rounded-lg flex items-center justify-center hover:bg-white/20">
                        <Icon name="Eye" size={13} className="text-white" />
                      </button>
                      <button className="w-7 h-7 bg-white/10 backdrop-blur rounded-lg flex items-center justify-center hover:bg-white/20">
                        <Icon name="Download" size={13} className="text-white" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-sm text-white leading-snug">{d.title}</h3>
                      <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${drawingStatusColor(d.status)}`}>{drawingStatusLabel(d.status)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/40">
                      <span>{d.floor > 0 ? `${d.floor}-й этаж` : d.type}</span>
                      <span>Обновлён {d.updated}</span>
                    </div>
                  </div>
                </div>
              ))}
              <button className="rounded-2xl border-2 border-dashed border-white/15 flex flex-col items-center justify-center gap-3 text-white/30 hover:text-white/60 hover:border-white/30 transition-all min-h-[240px]">
                <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-current flex items-center justify-center">
                  <Icon name="Plus" size={20} />
                </div>
                <span className="text-sm font-medium">Добавить чертёж</span>
              </button>
            </div>
          </div>
        )}

        {/* ── CALCULATOR ── */}
        {tab === "calculator" && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <h1 className="font-montserrat font-black text-3xl sm:text-4xl text-white mb-2">Калькулятор</h1>
              <p className="text-white/40 text-sm">Расчёт материалов и бюджета проекта</p>
            </div>
            <div className="grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-5">
                  <h2 className="font-montserrat font-bold text-white text-sm uppercase tracking-wider opacity-50">Параметры дома</h2>
                  <div>
                    <div className="flex justify-between mb-3">
                      <label className="text-sm text-white/70">Площадь этажа</label>
                      <span className="font-montserrat font-bold text-white">{area} м²</span>
                    </div>
                    <input type="range" min={50} max={500} step={5} value={area} onChange={(e) => setArea(+e.target.value)} className="w-full h-1.5 rounded-full accent-violet-500 bg-white/15 cursor-pointer" />
                    <div className="flex justify-between text-xs text-white/25 mt-1.5"><span>50 м²</span><span>500 м²</span></div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-3">
                      <label className="text-sm text-white/70">Количество этажей</label>
                      <span className="font-montserrat font-bold text-white">{floors}</span>
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3].map((n) => (
                        <button key={n} onClick={() => setFloors(n)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${floors === n ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg shadow-violet-500/25" : "bg-white/8 text-white/50 hover:bg-white/15 border border-white/10"}`}>
                          {n} {n === 1 ? "этаж" : "этажа"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-white/70">Цокольный этаж</label>
                    <button onClick={() => setHasBasement(!hasBasement)} className={`w-12 h-6 rounded-full transition-all duration-300 relative ${hasBasement ? "bg-violet-500" : "bg-white/15"}`}>
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${hasBasement ? "left-7" : "left-1"}`} />
                    </button>
                  </div>
                  <div className="pt-2 border-t border-white/10">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Общая площадь</span>
                      <span className="font-bold text-white">{Math.round(totalArea)} м²</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-violet-500/20 to-indigo-500/10 border border-violet-500/30 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon name="TrendingUp" size={16} className="text-violet-400" />
                    <span className="text-xs text-violet-300 font-semibold uppercase tracking-wider">Итого материалы</span>
                  </div>
                  <div className="font-montserrat font-black text-3xl text-white mt-2">
                    {totalCost.toLocaleString("ru-RU")} <span className="text-lg text-white/50">тыс. ₽</span>
                  </div>
                  <p className="text-xs text-white/30 mt-2">* Ориентировочная стоимость материалов без работы</p>
                </div>
              </div>
              <div className="lg:col-span-3">
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/10">
                    <h2 className="font-montserrat font-bold text-white">Смета материалов</h2>
                  </div>
                  <div className="divide-y divide-white/8">
                    {MATERIALS.map((m) => {
                      const qty = Math.round(m.rate * totalArea);
                      const cost = Math.round(qty * m.price / 1000);
                      const pct = Math.round((m.rate * m.price) / MATERIALS.reduce((s, x) => s + x.rate * x.price, 0) * 100);
                      return (
                        <div key={m.name} className="px-5 py-3.5 hover:bg-white/5 transition-colors">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-medium text-white">{m.name}</span>
                            <span className="font-montserrat font-bold text-white text-sm">{cost.toLocaleString("ru-RU")} тыс. ₽</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs text-white/35 w-28 text-right shrink-0">{qty.toLocaleString("ru-RU")} {m.unit}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="px-5 py-4 bg-white/5 border-t border-white/10 flex justify-between items-center">
                    <button className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium">
                      <Icon name="Download" size={15} />
                      Скачать смету PDF
                    </button>
                    <button className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors">
                      <Icon name="Share2" size={15} />
                      Поделиться
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}