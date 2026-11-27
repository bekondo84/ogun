import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Tag,
  X,
  Trash2,
} from "lucide-react";
import AllowedViews from "../AllowViews";
import { useTranslation } from "react-i18next";
import FormPagesModal from "@/components/widgets/form/fields/FormPageModal";
import { getNewInstance } from "@/axios/DataService";

const CATEGORY_STYLES = {
  meeting: {
    label: "Réunion",
    badge:
      "bg-[var(--brand-soft)] text-[var(--brand-primary)] border-[var(--brand-border)] dark:bg-[var(--brand-soft-dark)] dark:text-[var(--brand-primary-dark)]",
    dot: "bg-[var(--brand-primary)] dark:bg-[var(--brand-primary-dark)]",
  },
  task: {
    label: "Tâche",
    badge:
      "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950/70 dark:text-sky-300 dark:border-sky-800",
    dot: "bg-sky-500",
  },
  deadline: {
    label: "Échéance",
    badge:
      "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800",
    dot: "bg-rose-500",
  },
  maintenance: {
    label: "Opération",
    badge:
      "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800",
    dot: "bg-amber-500",
  },
};

const START_HOUR = 7;
const END_HOUR = 20;
const HOURS = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => i + START_HOUR); // 07:00 -> 20:00
const HOUR_HEIGHT = 56; // Hauteur en pixels d'une ligne horaire

// Helpers de dates
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const isSameDay = (a, b) =>
  a &&
  b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const startOfWeek = (d) => {
  const base = startOfDay(d);
  const diff = (base.getDay() + 6) % 7; // Lundi = 0
  base.setDate(base.getDate() - diff);
  return base;
};

const addDays = (d, days) => {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + days);
  return copy;
};

const toDateInputValue = (d) => {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const parseEventDate = (val) => (val instanceof Date ? val : new Date(val));

export default function CalendarPage({
  meta,
  viewMode,
  setViewMode,
  allowedViews,
  events = [],
  onAddEvent,
  onDeleteEvent,
  onSelectEvent,
}) {
  const { t } = useTranslation();

  const VIEWS = useMemo(
    () => [
      { id: "day", label: t("day_lb") },
      { id: "week", label: t("week_lb") },
      { id: "month", label: t("month_lb") },
      { id: "year", label: t("year_lb") },
    ],
    [t]
  );

  const [view, setView] = useState("week"); // 'day' | 'week' | 'month' | 'year'
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [quickFormOpen, setQuickFormOpen] = useState(false);
  const [title, setTitle] = useState(null);
  const [item, setItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [draft, setDraft] = useState({
    title: "",
    date: toDateInputValue(new Date()),
    startTime: "09:00",
    endTime: "10:00",
    category: "meeting",
    location: "",
    notes: "",
  });

  const today = useMemo(() => new Date(), []);

  useEffect(() => {
    setTitle(meta?.listViewTitle);
    console.log('CalendarPage.useEffect -------------------- '+JSON.stringify(meta))
  }, [meta]);

  const navigatePeriod = (direction) => {
    const step = direction === "prev" ? -1 : 1;
    setCurrentDate((prev) => {
      if (view === "day") return addDays(prev, step);
      if (view === "week") return addDays(prev, step * 7);
      if (view === "month") return new Date(prev.getFullYear(), prev.getMonth() + step, 1);
      return new Date(prev.getFullYear() + step, prev.getMonth(), 1);
    });
  };

  const periodLabel = useMemo(() => {
    if (view === "day") {
      return currentDate.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
    if (view === "week") {
      const start = startOfWeek(currentDate);
      const end = addDays(start, 6);
      const sFmt = start.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
      const eFmt = end.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      return `${sFmt} – ${eFmt}`;
    }
    if (view === "month") {
      return currentDate.toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
      });
    }
    return String(currentDate.getFullYear());
  }, [currentDate, view]);

  const openQuickCreate = async(targetDate = currentDate, hour = 9) => {
    const pad = (n) => String(n).padStart(2, "0");
    const data  = await getNewInstance(meta);
     console.log('CalendarPage.openQuickCreate ------------------ '+JSON.stringify(data))
    setDraft({
      title: "",
      date: toDateInputValue(targetDate),
      startTime: `${pad(hour)}:00`,
      endTime: `${pad(Math.min(hour + 1, 23))}:00`,
      category: "meeting",
      location: "",
      notes: "",
    });
     setItem(data);
    //setQuickFormOpen(true);
     setModalOpen(true);
  };

  

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!draft.title.trim()) return;

    const [y, m, d] = draft.date.split("-").map(Number);
    const [sh, sm] = draft.startTime.split(":").map(Number);
    const [eh, em] = draft.endTime.split(":").map(Number);

    const start = new Date(y, m - 1, d, sh || 9, sm || 0);
    let end = new Date(y, m - 1, d, eh || 10, em || 0);
    if (end <= start) {
      end = new Date(start.getTime() + 60 * 60 * 1000); // Minimum 1h si fin <= début
    }

    const newEvent = {
      id: `evt-${Date.now()}`,
      title: draft.title.trim(),
      start,
      end,
      category: draft.category,
      location: draft.location.trim(),
      notes: draft.notes.trim(),
    };

    onAddEvent?.(newEvent);
    setQuickFormOpen(false);
  };

  const handleEventClick = (evt, e) => {
    e?.stopPropagation();
    setSelectedEvent(evt);
    onSelectEvent?.(evt);
    console.log('CalendarPage.handleEventClick --------------------------- ')
  };

  const handleDeleteClick = (evt, e) => {
    e?.stopPropagation();
    onDeleteEvent?.(evt);
    if (selectedEvent?.id === evt.id) {
      setSelectedEvent(null);
    }
  };

  const eventsOnDay = (day) =>
    events.filter((evt) => isSameDay(parseEventDate(evt.start), day));

  const formatTimeRange = (evt) => {
    const s = parseEventDate(evt.start);
    const e = evt.end ? parseEventDate(evt.end) : null;
    const sStr = s.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    if (!e) return sStr;
    const eStr = e.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    return `${sStr} – ${eStr}`;
  };

  // Calcul du positionnement vertical proportionnel à la durée de l'événement
  const getEventPositionStyle = (evt) => {
    const s = parseEventDate(evt.start);
    const e = evt.end
      ? parseEventDate(evt.end)
      : new Date(s.getTime() + 60 * 60 * 1000);

    const gridStartMinutes = START_HOUR * 60;
    const gridEndMinutes = (END_HOUR + 1) * 60;

    const startMinutes = Math.max(s.getHours() * 60 + s.getMinutes(), gridStartMinutes);
    const endMinutes = Math.min(
      Math.max(e.getHours() * 60 + e.getMinutes(), startMinutes + 30),
      gridEndMinutes
    );

    const topPx = ((startMinutes - gridStartMinutes) / 60) * HOUR_HEIGHT;
    const heightPx = Math.max(((endMinutes - startMinutes) / 60) * HOUR_HEIGHT, 24);

    return {
      top: `${topPx + 2}px`,
      height: `${heightPx - 4}px`,
    };
  };

  
  const handleSave = (item) => {

  }

  // ==================== VUE JOUR & SEMAINE ====================
  const renderTimeGrid = (days) => {
    const totalGridHeight = HOURS.length * HOUR_HEIGHT;

    return (
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-950">
        {/* En-tête des colonnes jours */}
        <div
          className="grid border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/70"
          style={{ gridTemplateColumns: `68px repeat(${days.length}, minmax(0, 1fr))` }}
        >
          <div className="p-2 text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-end justify-center border-r border-slate-200 dark:border-slate-800">
            GMT+1
          </div>
          {days.map((day) => {
            const isToday = isSameDay(day, today);
            return (
              <div
                key={day.toISOString()}
                onClick={() => openQuickCreate(day, 9)}
                className="px-2.5 py-2 border-r last:border-r-0 border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-100/70 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                    {day.toLocaleDateString("fr-FR", { weekday: "short" })}
                  </div>
                  <div
                    className={`mt-0.5 inline-flex items-center justify-center h-6 min-w-6 px-1.5 rounded-full text-xs font-bold ${
                      isToday
                        ? "bg-[var(--brand-primary)] dark:bg-[var(--brand-primary-dark)] text-white"
                        : "text-slate-800 dark:text-slate-100"
                    }`}
                  >
                    {day.getDate()}
                  </div>
                </div>
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                  {eventsOnDay(day).length || ""}
                </span>
              </div>
            );
          })}
        </div>

        {/* Grille horaire avec superposition des événements multi-heures */}
        <div className="max-h-[540px] overflow-y-auto">
          <div
            className="grid"
            style={{ gridTemplateColumns: `68px repeat(${days.length}, minmax(0, 1fr))` }}
          >
            {/* Colonne des heures */}
            <div className="border-r border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/80 select-none">
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  style={{ height: `${HOUR_HEIGHT}px` }}
                  className="px-2 py-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-500 text-right"
                >
                  {String(hour).padStart(2, "0")}:00
                </div>
              ))}
            </div>

            {/* Colonnes des jours */}
            {days.map((day) => {
              const dayEvents = eventsOnDay(day);

              return (
                <div
                  key={day.toISOString()}
                  style={{ height: `${totalGridHeight}px` }}
                  className="relative border-r last:border-r-0 border-slate-100 dark:border-slate-800/70"
                >
                  {/* Créneaux horaires cliquables en arrière-plan */}
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {HOURS.map((hour) => (
                      <div
                        key={hour}
                        style={{ height: `${HOUR_HEIGHT}px` }}
                        onClick={() => openQuickCreate(day, hour)}
                        className="hover:bg-[var(--brand-soft)]/35 dark:hover:bg-[var(--brand-soft-dark)]/25 transition-colors cursor-pointer"
                      />
                    ))}
                  </div>

                  {/* Événements positionnés sur toute leur durée */}
                  {dayEvents.map((evt) => {
                    const style = CATEGORY_STYLES[evt.category] || CATEGORY_STYLES.meeting;
                    const posStyle = getEventPositionStyle(evt);

                    return (
                      <div
                        key={evt.id}
                        style={posStyle}
                        onClick={(e) => handleEventClick(evt, e)}
                        className={`group absolute left-1 right-1 z-10 px-2 py-1 rounded-md border text-xs overflow-hidden shadow-2xs transition-all hover:z-20 hover:shadow-sm cursor-pointer flex flex-col justify-between ${style.badge}`}
                      >
                        <div className="flex items-start justify-between gap-1 min-w-0">
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold truncate leading-tight">{evt.title}</div>
                            <div className="text-[10px] opacity-80 truncate">
                              {formatTimeRange(evt)}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => handleDeleteClick(evt, e)}
                            title={t("delete_btn") || "Supprimer"}
                            aria-label="Supprimer l'événement"
                            className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-current transition-opacity shrink-0 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {evt.location && parseFloat(posStyle.height) >= 52 && (
                          <div className="text-[10px] opacity-75 truncate flex items-center gap-1">
                            <MapPin className="h-2.5 w-2.5 shrink-0" />
                            <span className="truncate">{evt.location}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // ==================== VUE MOIS ====================
  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const gridStart = startOfWeek(firstDayOfMonth);
    const cells = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
    const weekHeaders = [
      t("monday_lb"),
      t("tuesday_lb"),
      t("wenesday_lb"),
      t("thursday_lb"),
      t("friday_lb"),
      t("saturday_lb"),
      t("sunday_lb"),
    ];

    return (
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-950">
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/70">
          {weekHeaders.map((w) => (
            <div
              key={w}
              className="py-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-r last:border-r-0 border-slate-200 dark:border-slate-800"
            >
              {w}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 divide-x divide-y divide-slate-200 dark:divide-slate-800">
          {cells.map((day) => {
            const inCurrentMonth = day.getMonth() === month;
            const isToday = isSameDay(day, today);
            const dayEvents = eventsOnDay(day);

            return (
              <div
                key={day.toISOString()}
                onClick={() => openQuickCreate(day, 9)}
                className={`min-h-[104px] p-1.5 transition-colors cursor-pointer flex flex-col gap-1 ${
                  inCurrentMonth
                    ? "bg-white dark:bg-slate-950 hover:bg-slate-50/90 dark:hover:bg-slate-900/50"
                    : "bg-slate-50/60 dark:bg-slate-900/25 text-slate-400 dark:text-slate-600"
                }`}
              >
                <div className="flex items-center justify-between px-1">
                  <span
                    className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-semibold ${
                      isToday
                        ? "bg-[var(--brand-primary)] dark:bg-[var(--brand-primary-dark)] text-white font-bold"
                        : inCurrentMonth
                        ? "text-slate-700 dark:text-slate-200"
                        : "text-slate-400 dark:text-slate-600"
                    }`}
                  >
                    {day.getDate()}
                  </span>
                </div>

                <div className="space-y-1 overflow-hidden">
                  {dayEvents.slice(0, 3).map((evt) => {
                    const style = CATEGORY_STYLES[evt.category] || CATEGORY_STYLES.meeting;
                    return (
                      <div
                        key={evt.id}
                        onClick={(e) => handleEventClick(evt, e)}
                        className={`group w-full flex items-center justify-between gap-1 px-1.5 py-0.5 rounded border text-[11px] font-medium cursor-pointer ${style.badge}`}
                      >
                        <span className="truncate">{evt.title}</span>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteClick(evt, e)}
                          title={t("delete_btn") || "Supprimer"}
                          aria-label="Supprimer l'événement"
                          className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-current transition-opacity shrink-0 cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                  {dayEvents.length > 3 && (
                    <div className="px-1.5 text-[10px] font-semibold text-[var(--brand-primary)] dark:text-[var(--brand-primary-dark)]">
                      +{dayEvents.length - 3} autres
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ==================== VUE ANNÉE ====================
  const renderYearView = () => {
    const year = currentDate.getFullYear();
    const months = Array.from({ length: 12 }, (_, mIdx) => new Date(year, mIdx, 1));

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {months.map((mDate) => {
          const monthIdx = mDate.getMonth();
          const firstDay = new Date(year, monthIdx, 1);
          const gridStart = startOfWeek(firstDay);
          const miniDays = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
          const monthEventCount = events.filter((evt) => {
            const d = parseEventDate(evt.start);
            return d.getFullYear() === year && d.getMonth() === monthIdx;
          }).length;

          return (
            <div
              key={monthIdx}
              onClick={() => {
                setCurrentDate(new Date(year, monthIdx, 1));
                setView("month");
              }}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-[var(--brand-border)] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 group-hover:text-[var(--brand-primary)] dark:group-hover:text-[var(--brand-primary-dark)] transition-colors">
                  {mDate.toLocaleDateString("fr-FR", { month: "long" })}
                </h4>
                {monthEventCount > 0 && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[var(--brand-soft)] dark:bg-[var(--brand-soft-dark)] text-[var(--brand-primary)] dark:text-[var(--brand-primary-dark)]">
                    {monthEventCount}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] text-slate-400 mb-1">
                {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
                  <span key={i}>{d}</span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-0.5 text-center">
                {miniDays.map((d) => {
                  const isSameM = d.getMonth() === monthIdx;
                  const isToday = isSameDay(d, today);
                  const hasEvt = isSameM && eventsOnDay(d).length > 0;

                  return (
                    <div
                      key={d.toISOString()}
                      className={`h-6 rounded flex flex-col items-center justify-center text-[11px] relative ${
                        isToday
                          ? "bg-[var(--brand-primary)] dark:bg-[var(--brand-primary-dark)] text-white font-bold"
                          : isSameM
                          ? "text-slate-700 dark:text-slate-300"
                          : "text-slate-300 dark:text-slate-700"
                      }`}
                    >
                      <span>{d.getDate()}</span>
                      {hasEvt && !isToday && (
                        <span className="h-1 w-1 rounded-full bg-[var(--brand-primary)] dark:bg-[var(--brand-primary-dark)]" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Barre supérieure du calendrier */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-[var(--brand-soft)] dark:bg-[var(--brand-soft-dark)] text-[var(--brand-primary)] dark:text-[var(--brand-primary-dark)] flex items-center justify-center shrink-0">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400"></p>
          </div>
        </div>

        {/* Contrôles de navigation & sélecteur de vue */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-0.5">
            <button
              type="button"
              onClick={() => setCurrentDate(new Date())}
              className="px-2.5 py-1 text-xs font-semibold rounded-md text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {t("today_lb")}
            </button>
            <button
              type="button"
              onClick={() => navigatePeriod("prev")}
              aria-label="Période précédente"
              className="p-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => navigatePeriod("next")}
              aria-label="Période suivante"
              className="p-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <span className="min-w-[165px] text-center text-sm font-bold capitalize text-slate-800 dark:text-slate-100 px-1">
            {periodLabel}
          </span>

          {/* Switch Jour / Semaine / Mois / Année */}
          <div className="inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-0.5">
            {VIEWS.map((v) => {
              const active = view === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setView(v.id)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    active
                      ? "bg-[var(--brand-primary)] dark:bg-[var(--brand-primary-dark)] text-white shadow-2xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  {v.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => openQuickCreate(currentDate, 9)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{t("new_event_lb")}</span>
          </button>
          <AllowedViews viewMode={viewMode} setViewMode={setViewMode} allowedViews={allowedViews} />
        </div>
      </div>
   
      {/* Corps selon la vue active */}
      {view === "day" && renderTimeGrid([startOfDay(currentDate)])}
      {view === "week" &&
        renderTimeGrid(Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(currentDate), i)))}
      {view === "month" && renderMonthView()}
      {view === "year" && renderYearView()}
      {<FormPagesModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        metadata={meta}
        initialData={item}
        formData={item}
        setFormData={setItem}
        onSave={handleSave}
        />}
      
     
    </div>
  );
}