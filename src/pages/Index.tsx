import { useState } from "react";
import Icon from "@/components/ui/icon";

type Tab = "projects" | "drawings" | "calculator";

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
  const [tab, setTab] = useState<Tab>("projects");
  const [area, setArea] = useState(150);
  const [floors, setFloors] = useState(2);
  const [hasBasement, setHasBasement] = useState(false);
  const [activeProject, setActiveProject] = useState(0);

  const totalArea = area * floors + (hasBasement ? area * 0.8 : 0);
  const totalCost = Math.round(
    MATERIALS.reduce((sum, m) => sum + m.rate * m.price * totalArea, 0) / 1000
  );

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "projects", label: "Проекты", icon: "FolderOpen" },
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
            <span className="font-montserrat font-800 text-lg tracking-tight">АрхиПроект</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 rounded-full px-1 py-1 border border-white/10">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  tab === t.key
                    ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg shadow-violet-500/25"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                <Icon name={t.icon} size={15} />
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

        {/* ── PROJECTS ── */}
        {tab === "projects" && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <h1 className="font-montserrat font-black text-3xl sm:text-4xl text-white mb-2">Мои проекты</h1>
              <p className="text-white/40 text-sm">Управляйте всеми этапами проектирования</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                { label: "Всего проектов", value: "3", icon: "FolderOpen", color: "from-violet-500 to-indigo-600" },
                { label: "В работе", value: "2", icon: "Zap", color: "from-amber-400 to-orange-500" },
                { label: "Чертежей", value: "24", icon: "FileText", color: "from-sky-400 to-blue-600" },
                { label: "Общая площадь", value: "450 м²", icon: "Maximize2", color: "from-emerald-400 to-teal-600" },
              ].map((s) => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/8 transition-colors">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-lg`}>
                    <Icon name={s.icon} size={16} className="text-white" />
                  </div>
                  <div className="font-montserrat font-bold text-xl text-white">{s.value}</div>
                  <div className="text-white/40 text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Project cards */}
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
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 rounded-full transition-all duration-700"
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Add new project */}
              <button className="rounded-2xl border-2 border-dashed border-white/15 p-5 flex flex-col items-center justify-center gap-3 text-white/30 hover:text-white/60 hover:border-white/30 transition-all duration-200 min-h-[180px]">
                <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-current flex items-center justify-center">
                  <Icon name="Plus" size={20} />
                </div>
                <span className="text-sm font-medium">Добавить проект</span>
              </button>
            </div>

            {/* Active project detail */}
            <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-montserrat font-bold text-white">{PROJECTS[activeProject].name}</h2>
                <div className="flex gap-2">
                  {["Описание", "Команда", "Документы", "История"].map((label) => (
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

            {/* Filters */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {["Все", "Генплан", "Архитектура", "Конструктив", "Фасады"].map((f) => (
                <button
                  key={f}
                  className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    f === "Все"
                      ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg shadow-violet-500/25"
                      : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80 border border-white/10"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Drawings grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {DRAWINGS.map((d) => (
                <div key={d.id} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300 cursor-pointer">
                  {/* Preview area */}
                  <div className="h-40 bg-gradient-to-br from-slate-800 to-slate-900 border-b border-white/10 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{
                      backgroundImage: "linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)",
                      backgroundSize: "24px 24px"
                    }} />
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
                      <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${drawingStatusColor(d.status)}`}>
                        {drawingStatusLabel(d.status)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/40">
                      <span>{d.floor > 0 ? `${d.floor}-й этаж` : d.type}</span>
                      <span>Обновлён {d.updated}</span>
                    </div>
                  </div>
                </div>
              ))}

              <button className="rounded-2xl border-2 border-dashed border-white/15 flex flex-col items-center justify-center gap-3 text-white/30 hover:text-white/60 hover:border-white/30 transition-all duration-200 min-h-[240px]">
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
              {/* Controls */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-5">
                  <h2 className="font-montserrat font-bold text-white text-sm uppercase tracking-wider opacity-50">Параметры дома</h2>

                  <div>
                    <div className="flex justify-between mb-3">
                      <label className="text-sm text-white/70">Площадь этажа</label>
                      <span className="font-montserrat font-bold text-white">{area} м²</span>
                    </div>
                    <input
                      type="range" min={50} max={500} step={5} value={area}
                      onChange={(e) => setArea(+e.target.value)}
                      className="w-full h-1.5 rounded-full accent-violet-500 bg-white/15 cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-white/25 mt-1.5">
                      <span>50 м²</span><span>500 м²</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-3">
                      <label className="text-sm text-white/70">Количество этажей</label>
                      <span className="font-montserrat font-bold text-white">{floors}</span>
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3].map((n) => (
                        <button
                          key={n}
                          onClick={() => setFloors(n)}
                          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                            floors === n
                              ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg shadow-violet-500/25"
                              : "bg-white/8 text-white/50 hover:bg-white/15 border border-white/10"
                          }`}
                        >
                          {n} {n === 1 ? "этаж" : "этажа"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm text-white/70">Цокольный этаж</label>
                    <button
                      onClick={() => setHasBasement(!hasBasement)}
                      className={`w-12 h-6 rounded-full transition-all duration-300 relative ${hasBasement ? "bg-violet-500" : "bg-white/15"}`}
                    >
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

                {/* Total budget */}
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

              {/* Materials table */}
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
                              <div
                                className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs text-white/35 w-28 text-right shrink-0">
                              {qty.toLocaleString("ru-RU")} {m.unit}
                            </span>
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
