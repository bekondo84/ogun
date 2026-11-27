import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  AlignLeft,
  X,
  Check,
  Trash2,
} from "lucide-react";

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 07:00 à 20:00

const ACCENT_BADGES = [
  {
    id: "primary",
    labelKey: "accent_primary",
    fallback: "Principal",
    cardClass: "bg-primary/15 text-primary border-primary/40",
    dotClass: "bg-primary",
  },
  {
    id: "forge",
    labelKey: "accent_urgent",
    fallback: "Urgent / Forge",
    cardClass: "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/40",
    dotClass: "bg-orange-500",
  },
  {
    id: "emerald",
    labelKey: "accent_done",
    fallback: "Validé",
    cardClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40",
    dotClass: "bg-emerald-500",
  },
  {
    id: "slate",
    labelKey: "accent_info",
    fallback: "Information",
    cardClass: "bg-muted text-muted-foreground border-border",
    dotClass: "bg-slate-500",
  },
];

export default function OutlookCalendarPage({
  items = [],
  metadata,
  onSave,
  onDelete,
  onSelected,
  isLoading = false,
}) {
  const { t, i18n } = useTranslation();

  // Définition des vues avec traduction dynamique
  const VIEWS = useMemo(
    () => [
      { id: "day", label: t("day_lb") },
      { id: "week", label: t("week_lb") },
      { id: "month", label: t("month_lb") },
      { id: "year", label: t("year_lb") },
    ],
    [t]
  );

  const [activeView, setActiveView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [formState, setFormState] = useState({
    seqnumber: null,
    title: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "10:00",
    location: "",
    attendees: "",
    color: "primary",
    description: "",
  });

  // Normalisation des données ERP
  const events = useMemo(() => {
    return items.map((item) => ({
      seqnumber: item.seqnumber || item.id,
      title: item.title || item.label || item.stringValue || t("untitled_event", "Événement"),
      date: item.date || item.startDate?.split("T")[0] || new Date().toISOString().split("T")[0],
      startTime: item.startTime || "09:00",
      endTime: item.endTime || "10:00",
      location: item.location || "",
      attendees: item.attendees || "",
      color: item.color || "primary",
      description: item.description || "",
      raw: item,
    }));
  }, [items, t]);

  const formatDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const todayKey = formatDateKey(new Date());
  const locale = i18n.language || "fr-FR";

  // Navigation temporelle selon la vue active
  const navigateDate = (direction) => {
    const next = new Date(currentDate);
    if (activeView === "day") next.setDate(next.getDate() + direction);
    else if (activeView === "week") next.setDate(next.getDate() + direction * 7);
    else if (activeView === "month") next.setMonth(next.getMonth() + direction);
    else if (activeView === "year") next.setFullYear(next.getFullYear() + direction);
    setCurrentDate(next);
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(now);
  };

  // Jours de la semaine courante (Lundi -> Dimanche)
  const weekDays = useMemo(() => {
    const start = new Date(currentDate);
    const dayIndex = (start.getDay() + 6) % 7;
    start.setDate(start.getDate() - dayIndex);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [currentDate]);

  // Grille mensuelle (42 cellules)
  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const list = [];

    const prevLast = new Date(year, month, 0).getDate();
    for (let i = startOffset - 1; i >= 0; i--) {
      list.push({ date: new Date(year, month - 1, prevLast - i), isCurrentMonth: false });
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
      list.push({ date: new Date(year, month, d), isCurrentMonth: true });
    }
    const rem = 42 - list.length;
    for (let i = 1; i <= rem; i++) {
      list.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    return list;
  }, [currentDate]);

  // Titre dynamique de la période
  const periodLabel = useMemo(() => {
    if (activeView === "day") {
      return currentDate.toLocaleDateString(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
    if (activeView === "week") {
      const first = weekDays[0];
      const last = weekDays[6];
      return `${first.toLocaleDateString(locale, { day: "numeric", month: "short" })} - ${last.toLocaleDateString(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}`;
    }
    if (activeView === "year") {
      return String(currentDate.getFullYear());
    }
    return currentDate.toLocaleDateString(locale, { month: "long", year: "numeric" });
  }, [activeView, currentDate, weekDays, locale]);

  const openCreateModal = (dateObj = selectedDate, hour = "09:00") => {
    const endHour = `${String(Math.min(23, parseInt(hour.split(":")[0], 10) + 1)).padStart(2, "0")}:00`;
    setSelectedDate(dateObj);
    setFormState({
      seqnumber: null,
      title: "",
      date: formatDateKey(dateObj),
      startTime: hour,
      endTime: endHour,
      location: "",
      attendees: "",
      color: "primary",
      description: "",
    });
    setIsDrawerOpen(true);
  };

  const openEditModal = (e, ev) => {
    e.stopPropagation();
    setFormState({ ...ev });
    setIsDrawerOpen(true);
    if (onSelected && ev.raw) onSelected(ev.raw);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formState.title.trim()) return;
    const mode = formState.seqnumber ? "U" : "C";
    if (onSave) {
      await onSave(mode, { ...(formState.raw || {}), ...formState });
    }
    setIsDrawerOpen(false);
  };

  const getBadgeStyle = (colorId) =>
    ACCENT_BADGES.find((b) => b.id === colorId) || ACCENT_BADGES[0];

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-background text-foreground">
      {/* BARRE DE COMMANDE OUTLOOK-STYLE */}
      <header className="px-5 py-3 bg-card border-b border-border flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* Gauche : Titre + Navigation */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <CalendarIcon className="h-5 w-5"/>
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">
              {metadata?.listViewTitle || t("calendar_lb", "Calendrier")}
            </h1>
            <p className="text-xs text-muted-foreground capitalize">{periodLabel}</p>
          </div>

          <div className="flex items-center gap-1 ml-2 bg-muted/60 p-1 rounded-lg border border-border">
            <button
              type="button"
              onClick={() => navigateDate(-1)}
              className="p-1.5 rounded-md hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4"/>
            </button>
            <button
              type="button"
              onClick={handleToday}
              className="px-2.5 py-1 text-xs font-semibold rounded-md hover:bg-background transition-colors cursor-pointer"
            >
              {t("today_lb", "Aujourd'hui")}
            </button>
            <button
              type="button"
              onClick={() => navigateDate(1)}
              className="p-1.5 rounded-md hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <ChevronRight className="h-4 w-4"/>
            </button>
          </div>
        </div>

        {/* Droite : Sélecteur de vues (Jour / Semaine / Mois / Année) + Bouton Créer */}
        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-lg bg-muted p-1 border border-border">
            {VIEWS.map((view) => {
              const isActive = activeView === view.id;
              return (
                <button
                  key={view.id}
                  type="button"
                  onClick={() => setActiveView(view.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {view.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => openCreateModal(selectedDate)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4"/>
            <span>{t("new_btn", "Nouveau")}</span>
          </button>
        </div>
      </header>

      {/* ZONE D'AFFICHAGE SELON LA VUE */}
      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* --- VUE JOUR & SEMAINE (Grille horaire) --- */}
          {(activeView === "day" || activeView === "week") && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* En-tête des colonnes jours */}
              <div
                className={`grid border-b border-border bg-muted/40 shrink-0 ${
                  activeView === "day" ? "grid-cols-[64px_1fr]" : "grid-cols-[64px_repeat(7,1fr)]"
                }`}
              >
                <div className="border-r border-border" />
                {(activeView === "day" ? [currentDate] : weekDays).map((day, i) => {
                  const key = formatDateKey(day);
                  const isToday = key === todayKey;
                  return (
                    <div
                      key={i}
                      className="py-2 px-2 text-center border-r border-border last:border-r-0 flex flex-col items-center"
                    >
                      <span className="text-[11px] uppercase font-semibold text-muted-foreground">
                        {day.toLocaleDateString(locale, { weekday: "short" })}
                      </span>
                      <span
                        className={`mt-0.5 h-7 w-7 flex items-center justify-center rounded-full text-xs font-bold ${
                          isToday ? "bg-primary text-primary-foreground" : "text-foreground"
                        }`}
                      >
                        {day.getDate()}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Créneaux horaires */}
              <div className="flex-1 overflow-y-auto scrollbar-thin">
                {HOURS.map((hour) => {
                  const hourLabel = `${String(hour).padStart(2, "0")}:00`;
                  const cols = activeView === "day" ? [currentDate] : weekDays;
                  return (
                    <div
                      key={hour}
                      className={`grid min-h-[56px] border-b border-border ${
                        activeView === "day" ? "grid-cols-[64px_1fr]" : "grid-cols-[64px_repeat(7,1fr)]"
                      }`}
                    >
                      <div className="text-[11px] text-muted-foreground font-medium pr-2 pt-1 text-right border-r border-border bg-muted/20">
                        {hourLabel}
                      </div>
                      {cols.map((day, idx) => {
                        const dateKey = formatDateKey(day);
                        const slotEvents = events.filter(
                          (ev) => ev.date === dateKey && ev.startTime.startsWith(String(hour).padStart(2, "0"))
                        );
                        return (
                          <div
                            key={idx}
                            onClick={() => openCreateModal(day, hourLabel)}
                            className="p-1 border-r border-border last:border-r-0 hover:bg-primary/5 transition-colors cursor-pointer space-y-1"
                          >
                            {slotEvents.map((ev) => {
                              const badge = getBadgeStyle(ev.color);
                              return (
                                <div
                                  key={ev.seqnumber || ev.title}
                                  onClick={(e) => openEditModal(e, ev)}
                                  className={`px-2 py-1 rounded border text-[11px] font-medium truncate flex items-center gap-1.5 ${badge.cardClass}`}
                                >
                                  <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${badge.dotClass}`} />
                                  <span className="font-bold">{ev.startTime}</span>
                                  <span className="truncate">{ev.title}</span>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* --- VUE MOIS --- */}
          {activeView === "month" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="grid grid-cols-7 border-b border-border bg-muted/40 shrink-0">
                {weekDays.map((d, i) => (
                  <div
                    key={i}
                    className="py-2 text-center text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    {d.toLocaleDateString(locale, { weekday: "short" })}
                  </div>
                ))}
              </div>
              <div className="flex-1 grid grid-cols-7 grid-rows-6 divide-x divide-y divide-border overflow-y-auto">
                {monthDays.map(({ date, isCurrentMonth }, idx) => {
                  const dateKey = formatDateKey(date);
                  const isToday = dateKey === todayKey;
                  const dayEvents = events.filter((ev) => ev.date === dateKey);

                  return (
                    <div
                      key={idx}
                      onClick={() => openCreateModal(date)}
                      className={`min-h-[90px] p-1.5 flex flex-col transition-colors cursor-pointer group ${
                        isCurrentMonth ? "bg-card hover:bg-primary/5" : "bg-muted/30 text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`h-6 w-6 flex items-center justify-center rounded-full text-xs font-semibold ${
                            isToday ? "bg-primary text-primary-foreground shadow-sm" : ""
                          }`}
                        >
                          {date.getDate()}
                        </span>
                        <span className="opacity-0 group-hover:opacity-100 text-[10px] font-semibold text-primary">
                          +
                        </span>
                      </div>
                      <div className="space-y-1 overflow-y-auto flex-1">
                        {dayEvents.map((ev) => {
                          const badge = getBadgeStyle(ev.color);
                          return (
                            <div
                              key={ev.seqnumber || ev.title}
                              onClick={(e) => openEditModal(e, ev)}
                              className={`px-1.5 py-0.5 rounded border text-[11px] font-medium truncate flex items-center gap-1 ${badge.cardClass}`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${badge.dotClass}`} />
                              <span className="truncate">{ev.title}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* --- VUE ANNÉE (12 Mini-calendriers) --- */}
          {activeView === "year" && (
            <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 scrollbar-thin">
              {Array.from({ length: 12 }, (_, monthIdx) => {
                const year = currentDate.getFullYear();
                const first = new Date(year, monthIdx, 1);
                const last = new Date(year, monthIdx + 1, 0);
                const offset = (first.getDay() + 6) % 7;
                const cells = [
                  ...Array(offset).fill(null),
                  ...Array.from({ length: last.getDate() }, (_, d) => new Date(year, monthIdx, d + 1)),
                ];

                return (
                  <div
                    key={monthIdx}
                    className="p-3 rounded-xl border border-border bg-card shadow-xs flex flex-col"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentDate(new Date(year, monthIdx, 1));
                        setActiveView("month");
                      }}
                      className="text-left text-xs font-bold uppercase tracking-wider text-primary hover:underline mb-2 capitalize cursor-pointer"
                    >
                      {first.toLocaleDateString(locale, { month: "long" })}
                    </button>

                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground font-semibold mb-1">
                      {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
                        <span key={i}>{d}</span>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-[11px]">
                      {cells.map((cellDate, cIdx) => {
                        if (!cellDate) return <span key={cIdx} />;
                        const key = formatDateKey(cellDate);
                        const hasEvent = events.some((ev) => ev.date === key);
                        const isToday = key === todayKey;

                        return (
                          <button
                            key={cIdx}
                            type="button"
                            onClick={() => {
                              setCurrentDate(cellDate);
                              setActiveView("day");
                            }}
                            className={`h-6 w-6 mx-auto rounded-full flex items-center justify-center relative transition-colors cursor-pointer ${
                              isToday
                                ? "bg-primary text-primary-foreground font-bold"
                                : hasEvent
                                ? "bg-primary/15 text-primary font-semibold"
                                : "hover:bg-muted text-foreground"
                            }`}
                          >
                            {cellDate.getDate()}
                            {hasEvent && !isToday && (
                              <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-orange-500" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* TIROIR LATÉRAL DE CRÉATION / ÉDITION */}
        {isDrawerOpen && (
          <aside className="w-full sm:w-96 border-l border-border bg-card flex flex-col shadow-xl z-20 animate-in slide-in-from-right duration-200">
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                <h2 className="text-sm font-bold">
                  {formState.seqnumber ? t("edit_lb", "Modifier") : t("new_btn", "Nouvel événement")}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
              >
                <X className="h-4 w-4"/>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  {t("title_lb", "Titre")} <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formState.title}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">{t("date_lb", "Date")}</label>
                <input
                  type="date"
                  required
                  value={formState.date}
                  onChange={(e) => setFormState({ ...formState, date: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">{t("start_time_lb", "Début")}</label>
                  <div className="relative">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2"/>
                    <input
                      type="time"
                      value={formState.startTime}
                      onChange={(e) => setFormState({ ...formState, startTime: e.target.value })}
                      className="w-full pl-8 pr-2 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">{t("end_time_lb", "Fin")}</label>
                  <div className="relative">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2"/>
                    <input
                      type="time"
                      value={formState.endTime}
                      onChange={(e) => setFormState({ ...formState, endTime: e.target.value })}
                      className="w-full pl-8 pr-2 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5">{t("category_lb", "Catégorie")}</label>
                <div className="grid grid-cols-2 gap-2">
                  {ACCENT_BADGES.map((badge) => {
                    const selected = formState.color === badge.id;
                    return (
                      <button
                        key={badge.id}
                        type="button"
                        onClick={() => setFormState({ ...formState, color: badge.id })}
                        className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                          selected
                            ? `${badge.cardClass} ring-1 ring-primary font-semibold`
                            : "border-border text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full shrink-0 ${badge.dotClass}`} />
                        <span className="truncate">{t(badge.labelKey, badge.fallback)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">{t("location_lb", "Lieu")}</label>
                <div className="relative">
                  <MapPin className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2"/>
                  <input
                    type="text"
                    value={formState.location}
                    onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">{t("attendees_lb", "Participants")}</label>
                <div className="relative">
                  <Users className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2"/>
                  <input
                    type="text"
                    value={formState.attendees}
                    onChange={(e) => setFormState({ ...formState, attendees: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">{t("notes_lb", "Description")}</label>
                <div className="relative">
                  <AlignLeft className="h-4 w-4 text-muted-foreground absolute left-3 top-3"/>
                  <textarea
                    rows={3}
                    value={formState.description}
                    onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                {formState.seqnumber && onDelete ? (
                  <button
                    type="button"
                    onClick={() => {
                      onDelete([formState.seqnumber]);
                      setIsDrawerOpen(false);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-destructive hover:bg-destructive/10 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5"/>
                    <span>{t("delete_btn", "Supprimer")}</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:bg-muted cursor-pointer"
                  >
                    {t("close_btn", "Annuler")}
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 cursor-pointer disabled:opacity-50"
                  >
                    <Check className="h-3.5 w-3.5"/>
                    <span>{t("save_btn", "Enregistrer")}</span>
                  </button>
                </div>
              </div>
            </form>
          </aside>
        )}
      </div>
    </div>
  );
}