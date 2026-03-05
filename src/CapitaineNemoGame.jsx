import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Anchor,
  Compass,
  Waves,
  Map,
  Wrench,
  Leaf,
  Shield,
  Sparkles,
  KeyRound,
  Crown,
  Trophy,
  BookOpen,
  Send,
  ChevronRight,
} from "lucide-react";

const ROLES = [
  {
    id: "capitaine",
    name: "Capitaine",
    tagline: "Décision, cadence et cohésion.",
    icon: Shield,
    perk: "+2 morale à chaque action d'équipage.",
  },
  {
    id: "navigateur",
    name: "Navigateur",
    tagline: "Routes, cartes, éviter les zones mortes.",
    icon: Compass,
    perk: "+1 précision (réduit la pression).",
  },
  {
    id: "naturaliste",
    name: "Naturaliste",
    tagline: "Comprendre la faune, calmer l'inconnu.",
    icon: Leaf,
    perk: "+2 connaissances à chaque observation.",
  },
  {
    id: "ingenieur",
    name: "Ingénieur",
    tagline: "Machines, énergie et sécurité.",
    icon: Wrench,
    perk: "+2 coque lors des optimisations.",
  },
  {
    id: "cartographe",
    name: "Cartographe",
    tagline: "Dresser la vérité des fonds.",
    icon: Map,
    perk: "+2 XP quand une route est validée.",
  },
  {
    id: "observateur",
    name: "Observateur",
    tagline: "Signaux faibles et anomalies.",
    icon: Waves,
    perk: "+1 moral quand une alerte est anticipée.",
  },
];

const INTERESTS = [
  {
    id: "science",
    label: "Science",
    description: "Fiches espèces, protocoles et découvertes.",
    icon: Sparkles,
  },
  {
    id: "aventure",
    label: "Aventure",
    description: "Action, choix critiques, cap dangereux.",
    icon: Anchor,
  },
  {
    id: "histoire",
    label: "Histoire",
    description: "Archives, contexte, récits de Jules Verne.",
    icon: BookOpen,
  },
  {
    id: "mystere",
    label: "Mystère",
    description: "Anomalies, secrets et signaux des abysses.",
    icon: Shield,
  },
];

const STORY = [
  {
    id: "chap-1",
    unlockLevel: 1,
    title: "Chapitre 1 — Le silence bleu",
    text:
      "Le Nautilus glisse sous la banquise. Vous découvrez un message codé, gravé sur une plaque d'ambre qui pulse faiblement. Nemo vous confie la clef : seule une suite d'actions coordonnées peut révéler l'origine du signal.",
  },
  {
    id: "chap-2",
    unlockLevel: 2,
    title: "Chapitre 2 — La chambre des échos",
    text:
      "Vous plongez dans une cavité qui résonne comme un orgue. Les ondes s'y propagent sans retour et l'équipage murmure l'existence d'une ville engloutie. Votre rôle devient décisif : suivre l'écho ou protéger la mission.",
  },
  {
    id: "chap-3",
    unlockLevel: 3,
    title: "Chapitre 3 — Le pacte des abysses",
    text:
      "Un journal de bord inconnu mentionne un pacte rompu entre un précédent capitaine et une présence abyssale. Nemo hésite : faut-il réveiller un protocole ancien ? Vous devez choisir entre sécurité immédiate et vérité.",
  },
  {
    id: "chap-4",
    unlockLevel: 4,
    title: "Chapitre 4 — L'ombre qui suit",
    text:
      "Le sonar dessine une silhouette gigantesque. Elle n'attaque pas, elle accompagne. Vous sentez que l'ombre attend un signe : un cap, un message, un geste. La décision vous appartient.",
  },
  {
    id: "chap-5",
    unlockLevel: 5,
    title: "Chapitre 5 — La vérité des moteurs",
    text:
      "Un schéma caché sous les turbines révèle une source d'énergie interdite. Qui l'a installée et pourquoi ? Vous découvrez que le Nautilus est plus qu'un navire : c'est une promesse, et vous devez choisir si elle sera tenue.",
  },
];

const GLOBAL_ACTIONS = [
  {
    id: "briefing",
    label: "Briefing d'équipage",
    description: "Aligner l'équipe avant une zone risquée.",
    xp: 12,
    effects: { morale: +6, energy: -3, pressure: -2 },
    reaction: {
      speaker: "Navigateur",
      prompt: "Le Navigateur demande plus de marge de manœuvre.",
      options: [
        {
          label: "Accorder 2 heures",
          effects: { pressure: -4, energy: -2 },
          crewLine: "Merci Capitaine. Je sécurise les routes possibles.",
        },
        {
          label: "Refuser pour garder le rythme",
          effects: { morale: -3, pressure: +3 },
          crewLine: "Compris. On fera au mieux, mais c'est serré.",
        },
      ],
    },
  },
  {
    id: "journal",
    label: "Journal de bord public",
    description: "Publier un récit rassurant pour l'équipage.",
    xp: 10,
    effects: { morale: +5, pressure: -1 },
  },
];

const ROLE_ACTIONS = [
  {
    id: "cap-1",
    role: "capitaine",
    label: "Fixer un cap audacieux",
    description: "Raccourcit la route mais augmente la pression.",
    xp: 18,
    effects: { pressure: +6, morale: +4, energy: -4 },
    reaction: {
      speaker: "Cartographe",
      prompt: "Le Cartographe signale une zone non cartographiée.",
      options: [
        {
          label: "Maintenir le cap",
          effects: { pressure: +4, morale: +2 },
          crewLine: "D'accord. Je note les risques et je trace à vue.",
        },
        {
          label: "Contourner par prudence",
          effects: { pressure: -3, energy: -2 },
          crewLine: "Bien reçu. Route alternative en cours.",
        },
      ],
    },
  },
  {
    id: "cap-2",
    role: "capitaine",
    label: "Rassembler l'équipage",
    description: "Renforce la cohésion mais ralentit le rythme.",
    xp: 14,
    effects: { morale: +8, energy: -5 },
  },
  {
    id: "nav-1",
    role: "navigateur",
    label: "Tracer une route abyssale",
    description: "Trouver un passage sûr sous les 1200 m.",
    xp: 20,
    effects: { pressure: -4, energy: -3, supplies: -2 },
    reaction: {
      speaker: "Ingénieur",
      prompt: "L'Ingénieur demande un arrêt pour vérifier les joints.",
      options: [
        {
          label: "Pause technique",
          effects: { hull: +6, energy: -3 },
          crewLine: "C'est bon. Les joints tiennent mieux que prévu.",
        },
        {
          label: "Continuer",
          effects: { hull: -4, pressure: +3 },
          crewLine: "Je note. Mais les vibrations augmentent.",
        },
      ],
    },
  },
  {
    id: "nav-2",
    role: "navigateur",
    label: "Synchroniser les horloges",
    description: "Réduit la confusion de l'équipage.",
    xp: 12,
    effects: { pressure: -2, morale: +3 },
  },
  {
    id: "nat-1",
    role: "naturaliste",
    label: "Étudier la bioluminescence",
    description: "Calmer l'équipage par la compréhension.",
    xp: 16,
    effects: { morale: +4, pressure: -3, supplies: -2 },
    reaction: {
      speaker: "Observateur",
      prompt: "L'Observateur veut poursuivre le signal lumineux.",
      options: [
        {
          label: "Autoriser la poursuite",
          effects: { pressure: +3, morale: +2 },
          crewLine: "Je tiens le sonar en alerte. On suit la lueur.",
        },
        {
          label: "Limiter l'exploration",
          effects: { pressure: -2, morale: -1 },
          crewLine: "D'accord. Je note la position pour plus tard.",
        },
      ],
    },
  },
  {
    id: "nat-2",
    role: "naturaliste",
    label: "Inventorier la faune",
    description: "Apporter des repères scientifiques.",
    xp: 12,
    effects: { morale: +2, supplies: -1, pressure: -1 },
  },
  {
    id: "ing-1",
    role: "ingenieur",
    label: "Optimiser les turbines",
    description: "Améliorer la poussée pour économiser l'énergie.",
    xp: 18,
    effects: { energy: +8, hull: +4, supplies: -5 },
    reaction: {
      speaker: "Capitaine",
      prompt: "Nemo demande si l'on peut pousser encore les moteurs.",
      options: [
        {
          label: "Oui, mais sur un temps limité",
          effects: { energy: +3, pressure: +3 },
          crewLine: "On peut tenter, mais il faudra refroidir vite.",
        },
        {
          label: "Non, trop risqué",
          effects: { morale: -2, pressure: -1 },
          crewLine: "C'est le mieux pour la sécurité de l'équipage.",
        },
      ],
    },
  },
  {
    id: "ing-2",
    role: "ingenieur",
    label: "Réviser les scaphandres",
    description: "Sécuriser les sorties futures.",
    xp: 12,
    effects: { hull: +3, supplies: -2 },
  },
  {
    id: "cart-1",
    role: "cartographe",
    label: "Cartographier un canyon",
    description: "Réduire les zones inconnues.",
    xp: 20,
    effects: { pressure: -3, energy: -2, supplies: -1 },
    reaction: {
      speaker: "Naturaliste",
      prompt: "Le Naturaliste veut prélever des échantillons.",
      options: [
        {
          label: "Accorder 30 minutes",
          effects: { morale: +2, pressure: +2 },
          crewLine: "Merci, je note les espèces découvertes.",
        },
        {
          label: "Prioriser la carte",
          effects: { pressure: -2, morale: -1 },
          crewLine: "Je comprends. On reviendra plus tard.",
        },
      ],
    },
  },
  {
    id: "cart-2",
    role: "cartographe",
    label: "Valider une route",
    description: "Confirmer une trajectoire sûre.",
    xp: 14,
    effects: { pressure: -4, morale: +2 },
  },
  {
    id: "obs-1",
    role: "observateur",
    label: "Analyser un signal sonar",
    description: "Prévenir une anomalie avant contact.",
    xp: 18,
    effects: { pressure: -5, morale: +2, energy: -2 },
    reaction: {
      speaker: "Navigateur",
      prompt: "Le Navigateur propose d'éviter la zone.",
      options: [
        {
          label: "Contourner",
          effects: { pressure: -3, energy: -3 },
          crewLine: "Route alternative tracée. On reste discrets.",
        },
        {
          label: "Approcher prudemment",
          effects: { morale: +2, pressure: +3 },
          crewLine: "Je prépare les cartes. On avance lentement.",
        },
      ],
    },
  },
  {
    id: "obs-2",
    role: "observateur",
    label: "Veille silencieuse",
    description: "Rassurer l'équipage en restant aux aguets.",
    xp: 10,
    effects: { morale: +3, pressure: -2 },
  },
];

const MAKE_WEBHOOK_URL =
  "https://hook.eu1.make.com/eek98jenyfdixidcetyb9ff3d4rrqcrp";
const CAPTAIN_CABIN_CODE = "186970";

const DIRECTIVES = [
  {
    id: "pressure",
    label: "Stabiliser la pression",
    description: "Favoriser les actions qui réduisent la pression.",
    stat: "pressure",
    direction: -1,
    bonusXp: 6,
  },
  {
    id: "morale",
    label: "Remonter le moral",
    description: "Favoriser les actions qui augmentent le moral.",
    stat: "morale",
    direction: 1,
    bonusXp: 6,
  },
  {
    id: "hull",
    label: "Consolider la coque",
    description: "Prioriser les actions qui renforcent la coque.",
    stat: "hull",
    direction: 1,
    bonusXp: 6,
  },
];

const MISSIONS = [
  {
    id: "mission-1",
    level: 1,
    label: "Stabiliser la pression",
    description: "Terminer un tour avec une pression ≤ 35.",
    rewardXp: 12,
    check: (stats) => stats.pressure <= 35,
  },
  {
    id: "mission-2",
    level: 2,
    label: "Réconforter l'équipage",
    description: "Atteindre un moral ≥ 70.",
    rewardXp: 14,
    check: (stats) => stats.morale >= 70,
  },
  {
    id: "mission-3",
    level: 3,
    label: "Renforcer la coque",
    description: "Monter la coque à ≥ 85.",
    rewardXp: 16,
    check: (stats) => stats.hull >= 85,
  },
  {
    id: "mission-4",
    level: 4,
    label: "Rester opérationnel",
    description: "Maintenir l'énergie ≥ 75.",
    rewardXp: 18,
    check: (stats) => stats.energy >= 75,
  },
  {
    id: "mission-5",
    level: 5,
    label: "Préserver l'équilibre",
    description: "Aucune statistique sous 45.",
    rewardXp: 20,
    check: (stats) =>
      Object.values(stats).every((value) => typeof value === "number" && value >= 45),
  },
];

const INCIDENTS = [
  {
    id: "condensation",
    title: "Incident — Condensation critique",
    prompt:
      "Une fuite de condensation menace l'atelier. L'eau s'infiltre trop vite.",
    trigger: (stats) => stats.hull <= 55,
    options: [
      {
        label: "Sceller immédiatement",
        effects: { hull: +4, energy: -3, morale: -1 },
        crewLine: "Les joints ont tenu. Quelques pièces seront à remplacer.",
      },
      {
        label: "Isoler le compartiment",
        effects: { pressure: -2, supplies: -3 },
        crewLine: "Zone isolée. La pression se stabilise mais on perd du stock.",
      },
    ],
  },
  {
    id: "chant",
    title: "Incident — Chant abyssal",
    prompt:
      "Un chant grave traverse la coque. Certains membres paniquent.",
    trigger: (stats) => stats.pressure >= 70,
    options: [
      {
        label: "Écouter et analyser",
        effects: { morale: +3, pressure: +2 },
        crewLine: "Le son est enregistré. L'équipage reprend confiance.",
      },
      {
        label: "Ignorer et avancer",
        effects: { pressure: -2, morale: -1 },
        crewLine: "On reste concentrés, mais un malaise persiste.",
      },
    ],
  },
  {
    id: "lumiere",
    title: "Incident — Banc lumineux",
    prompt:
      "Un banc bioluminescent entoure le Nautilus. L'effet est hypnotique.",
    trigger: (stats) => stats.morale <= 45,
    options: [
      {
        label: "Suivre la lueur",
        effects: { morale: +2, pressure: +3 },
        crewLine: "La trajectoire est magnifique, mais la tension monte.",
      },
      {
        label: "Rompre le contact",
        effects: { pressure: -3, energy: -2 },
        crewLine: "La pression chute, mais l'équipage regrette la découverte.",
      },
    ],
  },
  {
    id: "bruit",
    title: "Incident — Bruit dans les turbines",
    prompt:
      "Un cliquetis irrégulier résonne. L'Ingénieur demande une décision rapide.",
    trigger: (stats) => stats.energy <= 45,
    options: [
      {
        label: "Arrêt contrôlé",
        effects: { hull: +5, energy: -4 },
        crewLine: "Inspection terminée. Le bruit venait d'un palier usé.",
      },
      {
        label: "Maintenir la vitesse",
        effects: { energy: +2, hull: -3, pressure: +2 },
        crewLine: "On gagne du temps, mais la mécanique souffre.",
      },
    ],
  },
];

const INITIAL_STATS = {
  energy: 70,
  hull: 80,
  morale: 65,
  pressure: 40,
  supplies: 60,
};

const clamp = (value) => Math.max(0, Math.min(100, value));

const applyEffects = (stats, effects) => {
  const next = { ...stats };
  Object.entries(effects).forEach(([key, delta]) => {
    next[key] = clamp((next[key] ?? 0) + delta);
  });
  return next;
};

const xpNeeded = (level) => 90 + (level - 1) * 45;
const COOLDOWN_TURNS = 2;

const getInitialUnlocked = () =>
  STORY.filter((chapter) => chapter.unlockLevel <= 1).map((chapter) => chapter.id);

const tickCooldowns = (cooldowns) => {
  const next = {};
  Object.entries(cooldowns).forEach(([id, turns]) => {
    if (turns > 1) {
      next[id] = turns - 1;
    }
  });
  return next;
};

const matchesDirective = (action, directive) => {
  const delta = action.effects?.[directive.stat];
  return typeof delta === "number" && delta * directive.direction > 0;
};

const pickIncident = (stats, incidentIndex) => {
  const matching = INCIDENTS.filter((incident) =>
    incident.trigger ? incident.trigger(stats) : true
  );
  const pool = matching.length ? matching : INCIDENTS;
  return pool[incidentIndex % pool.length];
};

const getActiveMission = (level) =>
  MISSIONS.find((mission) => mission.level === level);

const evaluateOutcome = (stats, unlockedChapters) => {
  if (stats.hull <= 0) {
    return {
      status: "lose",
      reason: "La coque a cédé. Le Nautilus doit remonter en urgence.",
    };
  }
  if (stats.energy <= 0) {
    return {
      status: "lose",
      reason: "L'énergie est tombée à zéro. Le Nautilus dérive.",
    };
  }
  if (stats.morale <= 0) {
    return {
      status: "lose",
      reason: "Le moral s'effondre. L'équipage refuse d'avancer.",
    };
  }
  if (stats.pressure >= 100) {
    return {
      status: "lose",
      reason: "La pression atteint un niveau critique. La mission s'arrête.",
    };
  }
  if (unlockedChapters.length >= STORY.length) {
    return {
      status: "win",
      reason: "Tous les fragments sont révélés. Vous terminez la mission.",
    };
  }
  return null;
};

const notifyAccess = async (payload) => {
  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], {
        type: "application/json",
      });
      const queued = navigator.sendBeacon(MAKE_WEBHOOK_URL, blob);
      if (queued) return;
    }
    await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.warn("Webhook Make non disponible", error);
  }
};

function RoleCard({ role, active, onSelect, delay = 0 }) {
  const Icon = role.icon;
  return (
    <Card
      className={`rounded-xl border ${
        active ? "border-cyan-200/60" : "border-white/10"
      } bg-white/5 text-white card-animate`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <span className="font-medium">{role.name}</span>
        </div>
        <p className="text-sm text-white/70">{role.tagline}</p>
        <Badge variant="secondary" className="rounded-full bg-white/10 text-white">
          {role.perk}
        </Badge>
        <Button onClick={() => onSelect(role)} className="w-full rounded-xl">
          Choisir ce rôle
        </Button>
      </CardContent>
    </Card>
  );
}

function StatLine({ label, value }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-white/60">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <Progress value={value} className="h-2" />
    </div>
  );
}

function CaptainCabin({ onClose }) {
  return (
    <div className="min-h-screen ocean-skin ocean-bg text-foreground relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-16 h-64 w-64 rounded-full bg-cyan-400/15 blur-[120px]" />
        <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-indigo-400/10 blur-[120px]" />
      </div>

      <div className="relative">
        <div className="border-b border-white/10">
          <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-cyan-200" />
              <span className="font-semibold">Cabine du capitaine Nemo</span>
            </div>
            <Button variant="outline" className="rounded-xl" onClick={onClose}>
              Retour au pont
            </Button>
          </div>
        </div>

        <section className="mx-auto max-w-6xl px-4 py-10 space-y-6">
          <div className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
            <Card className="rounded-3xl ocean-card text-white">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Ordres du capitaine</h2>
                  <Badge
                    variant="outline"
                    className="rounded-full border-white/20 text-white/70"
                  >
                    Prioritaire
                  </Badge>
                </div>
                <div className="space-y-3 text-sm text-white/70">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    Stabiliser la pression avant la zone d'échos.
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    Maintenir l'énergie au-dessus de 60 pendant 2 tours.
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    Préparer un protocole de contact si l'ombre réapparaît.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl ocean-card text-white">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Journal privé</h3>
                  <BookOpen className="h-4 w-4 text-cyan-200" />
                </div>
                <p className="text-sm text-white/70 leading-relaxed">
                  Les abysses répondent à nos décisions. Chaque membre croit
                  tenir sa vérité, mais l'histoire complète se cache derrière
                  une suite d'actes cohérents.
                </p>
                <p className="text-xs text-white/50">
                  Dernière mise à jour : 06:40
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="rounded-2xl ocean-card text-white">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-cyan-200" />
                  <h4 className="font-semibold">Classement secret</h4>
                </div>
                <div className="space-y-2 text-sm">
                  {[
                    { name: "Officier R.", score: 1220 },
                    { name: "Navigateur I.", score: 1114 },
                    { name: "Capitaine N.", score: 1098 },
                  ].map((entry, index) => (
                    <div
                      key={entry.name}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                    >
                      <span>
                        {index + 1}. {entry.name}
                      </span>
                      <span className="text-white/70">{entry.score}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl ocean-card text-white">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-cyan-200" />
                  <h4 className="font-semibold">Carte secrète</h4>
                </div>
                <p className="text-sm text-white/70">
                  Un corridor abyssal s'ouvre au sud. Nemo recommande une
                  approche lente pour observer les signaux faibles.
                </p>
                <Badge
                  variant="outline"
                  className="rounded-full border-white/20 text-white/70"
                >
                  Accès niveau 4
                </Badge>
              </CardContent>
            </Card>

            <Card className="rounded-2xl ocean-card text-white">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Waves className="h-4 w-4 text-cyan-200" />
                  <h4 className="font-semibold">Fragments scellés</h4>
                </div>
                <p className="text-sm text-white/70">
                  Trois fragments restent verrouillés. L'équilibre du Nautilus
                  déterminera l'accès final.
                </p>
                <Button variant="outline" className="rounded-xl">
                  Déverrouiller
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}

function AccessGate({ onSubmit }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [rolePreference, setRolePreference] = useState("capitaine");
  const [interests, setInterests] = useState(["aventure"]);
  const [curiosity, setCuriosity] = useState(4);
  const [cabinOpen, setCabinOpen] = useState(false);
  const [cabinCode, setCabinCode] = useState("");
  const [cabinError, setCabinError] = useState("");
  const [cabinUnlocked, setCabinUnlocked] = useState(false);

  const canContinue =
    firstName.trim().length > 1 &&
    lastName.trim().length > 1 &&
    email.includes("@") &&
    email.includes(".");

  const canOpenCabin = cabinCode.length === 6;
  const curiosityLabel =
    curiosity <= 2 ? "Prudent" : curiosity === 3 ? "Curieux" : curiosity === 4 ? "Intrépide" : "Abyssal";
  const preferredRole = ROLES.find((role) => role.id === rolePreference) ?? ROLES[0];

  const toggleInterest = (key) => {
    setInterests((prev) => {
      if (prev.includes(key)) {
        const next = prev.filter((value) => value !== key);
        return next.length ? next : prev;
      }
      return [...prev, key];
    });
  };

  const handleSubmit = () => {
    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      roleId: rolePreference,
      interests,
      curiosity,
      createdAt: new Date().toISOString(),
      source: "nautilus-web",
    };
    notifyAccess(payload);
    onSubmit(payload);
  };

  const handleCabinSubmit = () => {
    if (cabinCode === CAPTAIN_CABIN_CODE) {
      setCabinUnlocked(true);
      setCabinOpen(false);
      setCabinError("");
      setCabinCode("");
      return;
    }
    setCabinError("Code invalide. Vérifiez les 6 chiffres.");
  };

  if (cabinUnlocked) {
    return <CaptainCabin onClose={() => setCabinUnlocked(false)} />;
  }

  return (
    <div className="min-h-screen ocean-skin ocean-bg text-foreground relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-[120px]" />
        <div className="absolute top-24 right-16 h-28 w-28 rounded-full border border-cyan-200/30 float-slow" />
        <div className="absolute bottom-20 left-12 h-16 w-16 rounded-full border border-teal-200/30 float-slower" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-slate-950/80 to-transparent" />
      </div>

      <div className="relative">
        <div className="border-b border-white/10">
          <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-2">
              <Anchor className="h-5 w-5" />
              <span className="font-semibold">Nautilus — Protocole Nemo</span>
            </div>
            <nav className="hidden items-center gap-4 text-xs text-white/60 md:flex">
              <a className="hover:text-white" href="#concept">
                Concept
              </a>
              <a className="hover:text-white" href="#roles">
                Rôles
              </a>
              <a className="hover:text-white" href="#game">
                Jeu
              </a>
              <a className="hover:text-white" href="#embarquer">
                Embarquer
              </a>
            </nav>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="rounded-full bg-white/10 text-white"
              >
                Accès narratif
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-white/30 text-white"
                onClick={() => {
                  setCabinOpen(true);
                  setCabinError("");
                }}
              >
                <KeyRound className="h-4 w-4" />
                Cabine du capitaine Nemo
              </Button>
            </div>
          </div>
        </div>

        <main className="mx-auto max-w-6xl px-4 py-10 space-y-12">
          <section
            id="hero"
            className="grid gap-8 lg:grid-cols-2 lg:items-center"
          >
            <div className="space-y-6">
              <Badge className="rounded-full bg-cyan-200/20 text-cyan-50">
                Expédition 20 000 lieues
              </Badge>
              <h1 className="text-4xl font-semibold leading-tight">
                Vivez Vingt Mille Lieues comme si vous y étiez.
              </h1>
              <p className="text-lg text-white/70">
                Recevez des rapports secrets, prenez des décisions critiques et
                dévoilez l'histoire chapitre après chapitre. Un format mobile,
                immersif et quotidien.
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href="#embarquer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-950"
                >
                  Rejoindre l'expédition <ChevronRight className="h-4 w-4" />
                </a>
                <a
                  href="#roles"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-4 py-2 text-sm text-white"
                >
                  Trouver mon rôle
                </a>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Card className="rounded-2xl ocean-card-soft text-white">
                  <CardContent className="p-3">
                    <p className="text-xs text-white/60">Membres</p>
                    <p className="text-lg font-semibold">4 207</p>
                  </CardContent>
                </Card>
                <Card className="rounded-2xl ocean-card-soft text-white">
                  <CardContent className="p-3">
                    <p className="text-xs text-white/60">Rapport #1</p>
                    <p className="text-lg font-semibold">Instantané</p>
                  </CardContent>
                </Card>
                <Card className="rounded-2xl ocean-card-soft text-white">
                  <CardContent className="p-3">
                    <p className="text-xs text-white/60">Mode</p>
                    <p className="text-lg font-semibold">Solo</p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  <Compass className="h-4 w-4 text-cyan-200" />
                  6 rôles complémentaires
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  <Waves className="h-4 w-4 text-cyan-200" />
                  Rapports immersifs
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  <Sparkles className="h-4 w-4 text-cyan-200" />
                  Progression narrative
                </div>
              </div>
            </div>

            <Card className="rounded-3xl ocean-card text-white shadow-xl shadow-black/30 backdrop-blur card-animate">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>Aperçu — Rapport du Nautilus</span>
                  <span>Jour 1</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-semibold">
                    Bienvenue à bord, {preferredRole.name}.
                  </p>
                  <Badge
                    variant="outline"
                    className="rounded-full border-white/20 text-white/80"
                  >
                    Curiosité : {curiosityLabel}
                  </Badge>
                </div>
                <p className="text-sm text-white/70 leading-relaxed font-mono">
                  À 1320 mètres, nos capteurs ont détecté un signal lumineux.
                  {preferredRole.name}, calculez une route d'évitement et
                  préparez l'équipe. Mission : identifier l'origine du signal.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                    <p className="text-xs text-white/60">Classement</p>
                    <p className="font-semibold">Top 22%</p>
                    <p className="text-xs text-white/50">Basé sur la curiosité</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                    <p className="text-xs text-white/60">Progression</p>
                    <p className="font-semibold">Moussaillon → Officier</p>
                    <p className="text-xs text-white/50">3 missions restantes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="concept" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-3">
              {[
                {
                  title: "Le twist",
                  text:
                    "Vous ne recevez pas un PDF. Vous vivez l'histoire en temps réel.",
                  icon: BookOpen,
                },
                {
                  title: "Rapports quotidiens",
                  text:
                    "Narratif + mission courte. Une routine immersive et claire.",
                  icon: Send,
                },
                {
                  title: "IA & personnalisation",
                  text:
                    "Rapports, créatures et voix Nemo générés pour votre rôle.",
                  icon: Sparkles,
                },
              ].map((item) => (
                <Card key={item.title} className="rounded-3xl ocean-card text-white">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 text-cyan-200" />
                      <h3 className="font-semibold">{item.title}</h3>
                    </div>
                    <p className="text-sm text-white/70">{item.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                "Embarquer + rôle + intérêts",
                "Rapport #1 immédiat",
                "Progression & chapitres débloqués",
              ].map((step, index) => (
                <Card key={step} className="rounded-2xl ocean-card-soft text-white">
                  <CardContent className="p-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-950 text-xs font-semibold">
                        {index + 1}
                      </span>
                      <span className="font-medium">{step}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section id="roles" className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Rôles de l'équipage</h2>
                <p className="text-sm text-white/60">
                  Le même événement, des perspectives différentes.
                </p>
              </div>
              <Badge
                variant="outline"
                className="rounded-full border-white/20 text-white/70"
              >
                6 postes
              </Badge>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ROLES.map((role, index) => (
                <RoleCard
                  key={role.id}
                  role={role}
                  active={rolePreference === role.id}
                  delay={index * 80}
                  onSelect={() => setRolePreference(role.id)}
                />
              ))}
            </div>
          </section>

          <section id="game" className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
            <Card className="rounded-3xl ocean-card text-white">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Gamification (aperçu)</h3>
                  <Badge
                    variant="outline"
                    className="rounded-full border-white/20 text-white/70"
                  >
                    Débloquez l'histoire
                  </Badge>
                </div>
                <p className="text-sm text-white/70">
                  Chaque mission complétée vous fait progresser et révèle des
                  fragments narratifs.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    "Badges de progression",
                    "Grades et rangs",
                    "Classement saisonnier",
                    "Récompenses narratives",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm"
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
                  Mission du jour : identifier l'origine du signal et choisir
                  entre faune / faille / artefact.
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl ocean-card text-white">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-cyan-200" />
                    <h3 className="font-semibold">Top explorateurs</h3>
                  </div>
                  <span className="text-xs text-white/50">maquette</span>
                </div>
                <div className="space-y-2 text-sm">
                  {[
                    { name: "Commandant S.", score: 1242 },
                    { name: "Naturaliste A.", score: 1178 },
                    { name: "Navigateur J.", score: 1104 },
                    { name: "Cartographe M.", score: 1036 },
                  ].map((member, index) => (
                    <div
                      key={member.name}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                    >
                      <span>
                        {index + 1}. {member.name}
                      </span>
                      <span className="text-white/70">{member.score}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="embarquer" className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
            <Card className="rounded-3xl ocean-card text-white">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-cyan-100/80">Embarquer maintenant</p>
                  <h2 className="text-2xl font-semibold">
                    Recevoir le premier rapport
                  </h2>
                  <p className="text-sm text-white/60">
                    Votre profil personnalise les rapports et les missions.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      placeholder="Ex: Inès"
                      className="bg-white/10 text-white placeholder:text-white/50 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      placeholder="Ex: Morel"
                      className="bg-white/10 text-white placeholder:text-white/50 border-white/10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="votre@email.com"
                    className="bg-white/10 text-white placeholder:text-white/50 border-white/10"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Centres d'intérêt</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {INTERESTS.map((item) => {
                      const active = interests.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleInterest(item.id)}
                          className={`rounded-2xl border p-3 text-left text-sm transition ${
                            active
                              ? "border-cyan-200/60 bg-cyan-200/10"
                              : "border-white/10 bg-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <item.icon className="h-4 w-4 text-cyan-200" />
                            <div>
                              <div className="font-medium">{item.label}</div>
                              <div className="text-xs text-white/60">
                                {item.description}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span>Niveau de curiosité</span>
                    <span>
                      {curiosityLabel} • {curiosity}/5
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={curiosity}
                    onChange={(event) => setCuriosity(Number(event.target.value))}
                    className="w-full"
                  />
                </div>

                <Button
                  className="w-full rounded-xl"
                  onClick={handleSubmit}
                  disabled={!canContinue}
                >
                  Recevoir le premier rapport
                </Button>

                <p className="text-xs text-white/50">
                  Aucun spam. Vous recevez uniquement les fragments narratifs
                  liés à la mission.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl ocean-card text-white">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Votre profil (aperçu)</h3>
                  <Badge
                    variant="outline"
                    className="rounded-full border-white/20 text-white/70"
                  >
                    {preferredRole.name}
                  </Badge>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                    <p className="text-xs text-white/60">Rôle</p>
                    <p className="font-semibold">{preferredRole.name}</p>
                    <p className="text-xs text-white/50">{preferredRole.perk}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                    <p className="text-xs text-white/60">Curiosité</p>
                    <p className="font-semibold">{curiosityLabel}</p>
                    <p className="text-xs text-white/50">
                      Impacte les missions
                    </p>
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                  <p className="text-xs text-white/60">Aperçu rapport #1</p>
                  <p className="text-sm text-white/70 mt-2">
                    Une anomalie lumineuse se manifeste à 1320 mètres. Votre
                    rôle conditionne les données transmises et les choix à
                    faire.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>

      {cabinOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4">
          <Card className="w-full max-w-md rounded-2xl ocean-card text-white">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-cyan-100/80">Accès sécurisé</p>
                <h3 className="text-xl font-semibold">
                  Cabine du capitaine Nemo
                </h3>
                <p className="text-sm text-white/60">
                  Saisissez le code à 6 chiffres pour accéder aux archives.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cabin-code">Code</Label>
                <Input
                  id="cabin-code"
                  inputMode="numeric"
                  value={cabinCode}
                  onChange={(event) => {
                    const digits = event.target.value.replace(/\D/g, "").slice(0, 6);
                    setCabinCode(digits);
                    setCabinError("");
                  }}
                  placeholder="000000"
                  className="bg-white/10 text-white placeholder:text-white/50 border-white/10 tracking-[0.3em] text-center"
                />
                {cabinError && (
                  <p className="text-xs text-rose-200">{cabinError}</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1 rounded-xl"
                  onClick={handleCabinSubmit}
                  disabled={!canOpenCabin}
                >
                  Ouvrir la cabine
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={() => {
                    setCabinOpen(false);
                    setCabinCode("");
                    setCabinError("");
                  }}
                >
                  Annuler
                </Button>
              </div>
              <p className="text-xs text-white/50">
                Accès réservé au capitaine et à l'état-major.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function RoleSelection({ user, onSelect }) {
  return (
    <div className="min-h-screen ocean-skin ocean-bg text-foreground">
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Anchor className="h-5 w-5" />
            <span className="font-semibold">Nautilus — Sélection du poste</span>
          </div>
          <div className="text-sm text-white/60">
            {user.firstName} {user.lastName} • {user.email}
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-10 space-y-6 relative">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold">
            Choisissez un rôle et pilotez la mission du Nautilus
          </h1>
          <p className="text-white/70">
            Un hub immersif où chaque action crée des conséquences. Chaque
            niveau débloque un fragment d'histoire.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ROLES.map((role, index) => (
            <RoleCard
              key={role.id}
              role={role}
              delay={index * 80}
              onSelect={() => onSelect(role)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default function CapitaineNemoGame() {
  const [user, setUser] = useState(null);
  const [game, setGame] = useState(() => ({
    level: 1,
    xp: 0,
    stats: INITIAL_STATS,
    unlockedChapters: getInitialUnlocked(),
    log: [],
    pendingChoice: null,
    cooldowns: {},
    directiveIndex: 0,
    incidentIndex: 0,
    gameOver: null,
    completedMissions: [],
    lastUnlock: null,
    turn: 1,
  }));

  const role = user?.roleId ? ROLES.find((r) => r.id === user.roleId) : null;
  const availableActions = useMemo(() => {
    if (!role) return [];
    return [
      ...GLOBAL_ACTIONS,
      ...ROLE_ACTIONS.filter((action) => action.role === role.id),
    ];
  }, [role]);

  const levelProgress = Math.round((game.xp / xpNeeded(game.level)) * 100);

  const unlockedStory = STORY.filter((chapter) =>
    game.unlockedChapters.includes(chapter.id)
  );
  const nextLocked = STORY.find(
    (chapter) => !game.unlockedChapters.includes(chapter.id)
  );
  const directive = DIRECTIVES[game.directiveIndex];
  const isGameOver = Boolean(game.gameOver);
  const activeMission = getActiveMission(game.level);
  const isMissionCompleted = activeMission
    ? game.completedMissions.includes(activeMission.id)
    : false;

  const resolveLevelUp = (currentLevel, currentXp, gainedXp) => {
    let newLevel = currentLevel;
    let newXp = currentXp + gainedXp;
    let unlocks = [];

    while (newXp >= xpNeeded(newLevel)) {
      newXp -= xpNeeded(newLevel);
      newLevel += 1;
      unlocks = unlocks.concat(
        STORY.filter((chapter) => chapter.unlockLevel === newLevel).map(
          (chapter) => chapter.id
        )
      );
    }

    return { newLevel, newXp, unlocks };
  };

  const handleAction = (action) => {
    setGame((current) => {
      if (current.pendingChoice || current.gameOver) return current;
      if (current.cooldowns[action.id]) return current;
      const directive = DIRECTIVES[current.directiveIndex];
      const directiveHit = matchesDirective(action, directive);
      const bonusXp = directiveHit ? directive.bonusXp : 0;

      const activeMission = getActiveMission(current.level);

      const nextStats = applyEffects(current.stats, action.effects);
      const missionCompleted =
        activeMission &&
        !current.completedMissions.includes(activeMission.id) &&
        activeMission.check(nextStats);
      const missionBonus = missionCompleted ? activeMission.rewardXp : 0;
      const gainedXp = action.xp + bonusXp + missionBonus;

      const { newLevel, newXp, unlocks } = resolveLevelUp(
        current.level,
        current.xp,
        gainedXp
      );

      const lastUnlock = unlocks.length
        ? STORY.find((chapter) => chapter.id === unlocks[unlocks.length - 1])
            ?.title
        : null;

      const nextTurn = current.turn + 1;
      const nextCooldowns = tickCooldowns(current.cooldowns);
      nextCooldowns[action.id] = COOLDOWN_TURNS;

      let directiveIndex = current.directiveIndex;
      if (nextTurn % 3 === 0) {
        directiveIndex = (directiveIndex + 1) % DIRECTIVES.length;
      }

      let pendingChoice = null;
      let incidentIndex = current.incidentIndex;

      if (action.reaction) {
        pendingChoice = {
          kind: "reaction",
          title: action.reaction.speaker,
          prompt: action.reaction.prompt,
          options: action.reaction.options,
          sourceAction: action.label,
        };
      } else if (nextTurn % 2 === 0) {
        const incident = pickIncident(nextStats, incidentIndex);
        pendingChoice = {
          kind: "incident",
          title: incident.title,
          prompt: incident.prompt,
          options: incident.options,
        };
        incidentIndex += 1;
      }

      const nextUnlocked = Array.from(
        new Set([...current.unlockedChapters, ...unlocks])
      );
      const gameOver = evaluateOutcome(nextStats, nextUnlocked);
      const nextCompletedMissions = missionCompleted
        ? [...current.completedMissions, activeMission.id]
        : current.completedMissions;

      return {
        ...current,
        stats: nextStats,
        level: newLevel,
        xp: newXp,
        unlockedChapters: nextUnlocked,
        pendingChoice: gameOver ? null : pendingChoice,
        cooldowns: nextCooldowns,
        directiveIndex,
        incidentIndex,
        gameOver,
        completedMissions: nextCompletedMissions,
        lastUnlock,
        turn: nextTurn,
        log: [
          {
            id: `${Date.now()}-${Math.random()}`,
            type: "action",
            title: action.label,
            text: action.description,
          },
          ...(directiveHit
            ? [
                {
                  id: `${Date.now()}-${Math.random()}`,
                  type: "directive",
                  title: directive.label,
                  text: `Bonus de +${directive.bonusXp} XP appliqué.`,
                },
              ]
            : []),
          ...(missionCompleted
            ? [
                {
                  id: `${Date.now()}-${Math.random()}`,
                  type: "mission",
                  title: activeMission.label,
                  text: `Mission accomplie : +${activeMission.rewardXp} XP.`,
                },
              ]
            : []),
          ...current.log,
        ].slice(0, 8),
      };
    });
  };

  const handleChoice = (option) => {
    setGame((current) => {
      if (!current.pendingChoice || current.gameOver) return current;
      const nextStats = applyEffects(current.stats, option.effects);
      const activeMission = getActiveMission(current.level);
      const missionCompleted =
        activeMission &&
        !current.completedMissions.includes(activeMission.id) &&
        activeMission.check(nextStats);
      const missionBonus = missionCompleted ? activeMission.rewardXp : 0;
      const { newLevel, newXp, unlocks } = resolveLevelUp(
        current.level,
        current.xp,
        missionBonus
      );
      const nextUnlocked = Array.from(
        new Set([...current.unlockedChapters, ...unlocks])
      );
      const gameOver = evaluateOutcome(nextStats, nextUnlocked);
      return {
        ...current,
        stats: nextStats,
        pendingChoice: null,
        level: newLevel,
        xp: newXp,
        unlockedChapters: nextUnlocked,
        gameOver,
        completedMissions: missionCompleted
          ? [...current.completedMissions, activeMission.id]
          : current.completedMissions,
        log: [
          {
            id: `${Date.now()}-${Math.random()}`,
            type: current.pendingChoice.kind,
            title: current.pendingChoice.title,
            text: option.crewLine,
          },
          ...(missionCompleted
            ? [
                {
                  id: `${Date.now()}-${Math.random()}`,
                  type: "mission",
                  title: activeMission.label,
                  text: `Mission accomplie : +${activeMission.rewardXp} XP.`,
                },
              ]
            : []),
          ...current.log,
        ].slice(0, 8),
      };
    });
  };

  const resetGame = () => {
    setUser(null);
    setGame({
      level: 1,
      xp: 0,
      stats: INITIAL_STATS,
      unlockedChapters: getInitialUnlocked(),
      log: [],
      pendingChoice: null,
      cooldowns: {},
      directiveIndex: 0,
      incidentIndex: 0,
      gameOver: null,
      completedMissions: [],
      lastUnlock: null,
      turn: 1,
    });
  };

  if (!user) {
    return <AccessGate onSubmit={(data) => setUser(data)} />;
  }

  if (!user.roleId) {
    return (
      <RoleSelection
        user={user}
        onSelect={(roleData) => setUser({ ...user, roleId: roleData.id })}
      />
    );
  }

  return (
    <div className="min-h-screen ocean-skin ocean-bg text-foreground">
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Anchor className="h-5 w-5" />
            <span className="font-semibold">Nautilus — Hub de mission</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden text-sm text-white/60 md:block">
              {user.firstName} {user.lastName}
            </div>
            <Badge variant="outline" className="rounded-full border-white/30 text-white">
              Tour {game.turn}
            </Badge>
            <Button variant="outline" className="rounded-xl" onClick={resetGame}>
              Recommencer
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
          <Card className="rounded-2xl ocean-card">
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-white/60">Rôle sélectionné</p>
                  <div className="flex items-center gap-2">
                    {role && <role.icon className="h-4 w-4" />}
                    <span className="text-lg font-semibold">{role?.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-white/60">Niveau {game.level}</p>
                    <Progress value={levelProgress} className="h-2 w-40" />
                    <p className="text-xs text-white/60 mt-1">
                      {game.xp} / {xpNeeded(game.level)} XP
                    </p>
                  </div>
                </div>
              </div>

              {game.lastUnlock && (
                <div className="rounded-xl border border-emerald-200/40 bg-emerald-200/10 p-3 text-sm text-emerald-100">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span>Nouveau chapitre débloqué : {game.lastUnlock}</span>
                  </div>
                </div>
              )}

              <div className="grid gap-3 md:grid-cols-2">
                <StatLine label="Énergie" value={game.stats.energy} />
                <StatLine label="Coque" value={game.stats.hull} />
                <StatLine label="Moral" value={game.stats.morale} />
                <StatLine label="Pression" value={game.stats.pressure} />
                <StatLine label="Ressources" value={game.stats.supplies} />
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Actions disponibles</h3>
                  <Badge variant="secondary" className="rounded-full bg-white/10 text-white">
                    {availableActions.length} actions
                  </Badge>
                </div>
                <div className="rounded-xl ocean-card-soft p-3 text-sm">
                  <p className="text-xs text-white/60">Directive du quart</p>
                  <p className="font-medium">{directive.label}</p>
                  <p className="text-xs text-white/60">{directive.description}</p>
                </div>
                <div className="rounded-xl ocean-card-soft p-3 text-sm">
                  <p className="text-xs text-white/60">Mission active</p>
                  <p className="font-medium">{activeMission?.label ?? "Aucune mission"}</p>
                  <p className="text-xs text-white/60">
                    {activeMission?.description ?? "Nouvelle mission en préparation."}
                  </p>
                  {activeMission && (
                    <p className="text-xs text-cyan-100/80">
                      Récompense : +{activeMission.rewardXp} XP
                    </p>
                  )}
                  {isMissionCompleted && (
                    <Badge className="mt-2 rounded-full bg-cyan-200/20 text-cyan-50">
                      Mission accomplie
                    </Badge>
                  )}
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {availableActions.map((action, index) => {
                    const cooldown = game.cooldowns[action.id] ?? 0;
                    const directiveHit = matchesDirective(action, directive);
                    const isDisabled =
                      cooldown > 0 || Boolean(game.pendingChoice) || isGameOver;
                    return (
                      <Card
                        key={action.id}
                        className="rounded-xl ocean-card-soft card-animate"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <CardContent className="p-4 space-y-2">
                          <p className="font-medium">{action.label}</p>
                          <p className="text-sm text-white/70">
                            {action.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge
                              variant="outline"
                              className="rounded-full border-white/30 text-white"
                            >
                              +{action.xp} XP
                            </Badge>
                            {directiveHit && (
                              <Badge
                                variant="outline"
                                className="rounded-full border-cyan-200/40 bg-cyan-200/10 text-cyan-50"
                              >
                                Directive +{directive.bonusXp} XP
                              </Badge>
                            )}
                            {cooldown > 0 && (
                              <Badge
                                variant="outline"
                                className="rounded-full border-white/20 text-white/70"
                              >
                                Cooldown {cooldown} tour{cooldown > 1 ? "s" : ""}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-white/50">
                              {cooldown > 0
                                ? "Repos tactique requis."
                                : "Disponible maintenant."}
                            </span>
                            <Button
                              size="sm"
                              className="rounded-xl"
                              onClick={() => handleAction(action)}
                              disabled={isDisabled}
                            >
                              Exécuter <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="rounded-2xl ocean-card">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Équipage</h3>
                  <Badge variant="secondary" className="rounded-full bg-white/10 text-white">
                    6 postes
                  </Badge>
                </div>
                <div className="space-y-3">
                  {ROLES.map((r) => (
                    <div key={r.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <r.icon className="h-4 w-4" />
                        <span className="text-sm">{r.name}</span>
                      </div>
                      {r.id === role?.id ? (
                        <Badge className="rounded-full bg-cyan-200/20 text-cyan-50">Vous</Badge>
                      ) : (
                        <Badge variant="outline" className="rounded-full border-white/30 text-white">
                          IA
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl ocean-card">
              <CardContent className="p-5 space-y-3">
                <h3 className="font-semibold">Storyline</h3>
                <div className="space-y-2">
                  {unlockedStory.map((chapter) => (
                    <div
                      key={chapter.id}
                      className="rounded-xl border border-white/10 bg-white/5 p-3"
                    >
                      <p className="text-sm font-medium">{chapter.title}</p>
                      <p className="text-xs text-white/60 mt-1">
                        {chapter.text}
                      </p>
                    </div>
                  ))}
                  {nextLocked && (
                    <div className="rounded-xl border border-dashed border-white/20 p-3 text-xs text-white/50">
                      Prochain chapitre au niveau {nextLocked.unlockLevel}.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="journal" className="w-full">
          <TabsList className="bg-white/10">
            <TabsTrigger value="journal">Journal</TabsTrigger>
            <TabsTrigger value="cadence">Cadence</TabsTrigger>
            <TabsTrigger value="tutoriel">Tutoriel</TabsTrigger>
            <TabsTrigger value="histoire">Histoire complète</TabsTrigger>
          </TabsList>
          <TabsContent value="journal">
            <Card className="rounded-2xl ocean-card">
              <CardContent className="p-6 space-y-4">
                {game.log.length === 0 ? (
                  <p className="text-sm text-white/60">
                    Aucun événement pour l'instant.
                  </p>
                ) : (
                  game.log.map((item) => (
                    <div key={item.id} className="space-y-1">
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-sm text-white/70">{item.text}</p>
                      <Separator />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="cadence">
            <Card className="rounded-2xl ocean-card">
              <CardContent className="p-6 space-y-2 text-sm text-white/70">
                <p>
                  Chaque action déclenche une réaction d'un autre poste. Vous
                  choisissez la réponse pour maintenir l'équilibre du Nautilus.
                </p>
                <p>
                  Objectif : monter de niveau pour débloquer la vérité sur le
                  pacte des abysses.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tutoriel">
            <Card className="rounded-2xl ocean-card">
              <CardContent className="p-6 space-y-4 text-white/70 text-sm">
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-white">
                    Comment jouer
                  </h3>
                  <p>
                    Choisissez une action, puis répondez aux réactions de
                    l'équipage ou aux incidents. Chaque décision modifie les
                    statistiques et fait progresser l'histoire.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-white">Gagner</h4>
                  <p>
                    Débloquez tous les chapitres en atteignant les niveaux
                    requis. Votre objectif est de révéler l'histoire complète
                    du Nautilus.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-white">Perdre</h4>
                  <p>
                    La mission s'arrête si l'énergie ou le moral tombent à 0, si
                    la coque cède, ou si la pression atteint 100.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-white">Conseil</h4>
                  <p>
                    Suivez les directives du quart pour gagner un bonus d'XP et
                    adaptez vos choix quand un incident survient.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="histoire">
            <Card className="rounded-2xl ocean-card">
              <CardContent className="p-6 space-y-4">
                {STORY.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="font-medium">{chapter.title}</p>
                    {game.unlockedChapters.includes(chapter.id) && (
                      <p className="text-sm text-white/70 mt-2">
                        {chapter.text}
                      </p>
                    )}
                    {game.unlockedChapters.includes(chapter.id) ? (
                      <Badge className="mt-2 rounded-full bg-cyan-200/20 text-cyan-50">
                        Déverrouillé
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="mt-2 rounded-full border-white/30 text-white">
                        Niveau {chapter.unlockLevel}
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {game.pendingChoice && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4">
          <Card className="w-full max-w-md rounded-2xl ocean-card">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-white/60">
                  {game.pendingChoice.kind === "incident"
                    ? "Incident en cours"
                    : `Réaction de ${game.pendingChoice.title}`}
                </p>
                <p className="text-lg font-semibold">
                  {game.pendingChoice.prompt}
                </p>
                {game.pendingChoice.sourceAction && (
                  <p className="text-xs text-white/60">
                    Suite à : {game.pendingChoice.sourceAction}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                {game.pendingChoice.options.map((option) => (
                  <Button
                    key={option.label}
                    variant="outline"
                    className="w-full rounded-xl justify-between"
                    onClick={() => handleChoice(option)}
                  >
                    {option.label}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {game.gameOver && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4">
          <Card className="w-full max-w-md rounded-2xl ocean-card">
            <CardContent className="p-6 space-y-4 text-white">
              <p className="text-xs text-white/60">
                {game.gameOver.status === "win" ? "Victoire" : "Fin de mission"}
              </p>
              <h3 className="text-xl font-semibold">
                {game.gameOver.status === "win"
                  ? "Mission accomplie"
                  : "Mission interrompue"}
              </h3>
              <p className="text-sm text-white/70">{game.gameOver.reason}</p>
              <Button className="w-full rounded-xl" onClick={resetGame}>
                Recommencer
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
