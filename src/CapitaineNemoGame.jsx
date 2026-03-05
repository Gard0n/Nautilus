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

const STORY = [
  {
    id: "chap-1",
    unlockLevel: 1,
    title: "Chapitre 1 — Le silence bleu",
    text:
      "Le Nautilus glisse sous la banquise. Un message codé, gravé sur une plaque d'ambre, clignote dans la salle des cartes.",
  },
  {
    id: "chap-2",
    unlockLevel: 2,
    title: "Chapitre 2 — La chambre des échos",
    text:
      "Une cavité résonne comme un orgue. Des ondes s'y propagent sans retour. L'équipage parle d'une ville engloutie.",
  },
  {
    id: "chap-3",
    unlockLevel: 3,
    title: "Chapitre 3 — Le pacte des abysses",
    text:
      "Un journal de bord inconnu mentionne un pacte rompu. Nemo hésite : faut-il réveiller un protocole ancien ?",
  },
  {
    id: "chap-4",
    unlockLevel: 4,
    title: "Chapitre 4 — L'ombre qui suit",
    text:
      "Le sonar dessine une silhouette gigantesque. Elle n'attaque pas. Elle accompagne. Pourquoi ?",
  },
  {
    id: "chap-5",
    unlockLevel: 5,
    title: "Chapitre 5 — La vérité des moteurs",
    text:
      "Un schéma caché sous les turbines révèle une source d'énergie interdite. Qui l'a installée ?",
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

const getInitialUnlocked = () =>
  STORY.filter((chapter) => chapter.unlockLevel <= 1).map((chapter) => chapter.id);

function RoleCard({ role, active, onSelect }) {
  const Icon = role.icon;
  return (
    <Card className={`rounded-xl border ${active ? "border-foreground" : "border-border"}`}>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <span className="font-medium">{role.name}</span>
        </div>
        <p className="text-sm text-muted-foreground">{role.tagline}</p>
        <Badge variant="secondary" className="rounded-full">
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
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <Progress value={value} className="h-2" />
    </div>
  );
}

function AccessGate({ onSubmit }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const canContinue =
    firstName.trim().length > 1 &&
    lastName.trim().length > 1 &&
    email.includes("@") &&
    email.includes(".");

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Anchor className="h-5 w-5" />
            <span className="font-semibold">Nautilus — Accès sécurisé</span>
          </div>
          <Badge variant="secondary" className="rounded-full">
            Entrée contrôlée
          </Badge>
        </div>
      </div>

      <section className="mx-auto max-w-3xl px-4 py-12 space-y-6">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold">
            Accès à bord
          </h1>
          <p className="text-muted-foreground">
            Le journal du Nautilus exige une identité claire avant d'ouvrir
            l'interface de mission.
          </p>
        </div>

        <Card className="rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder="Ex: Inès"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  placeholder="Ex: Morel"
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
              />
            </div>

            <Button
              className="w-full rounded-xl"
              onClick={() => onSubmit({ firstName, lastName, email })}
              disabled={!canContinue}
            >
              Accéder au Nautilus
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function RoleSelection({ user, onSelect }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Anchor className="h-5 w-5" />
            <span className="font-semibold">Nautilus — Sélection du poste</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {user.firstName} {user.lastName} • {user.email}
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-10 space-y-6">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold">
            Choisissez un rôle et pilotez la mission du Nautilus
          </h1>
          <p className="text-muted-foreground">
            Un hub immersif où chaque action crée des conséquences. Chaque
            niveau débloque un fragment d'histoire.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ROLES.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
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
    pendingReaction: null,
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
      const nextStats = applyEffects(current.stats, action.effects);
      const { newLevel, newXp, unlocks } = resolveLevelUp(
        current.level,
        current.xp,
        action.xp
      );

      const lastUnlock = unlocks.length
        ? STORY.find((chapter) => chapter.id === unlocks[unlocks.length - 1])
            ?.title
        : null;

      return {
        ...current,
        stats: nextStats,
        level: newLevel,
        xp: newXp,
        unlockedChapters: Array.from(
          new Set([...current.unlockedChapters, ...unlocks])
        ),
        pendingReaction: action.reaction
          ? { ...action.reaction, sourceAction: action.label }
          : null,
        lastUnlock,
        turn: current.turn + 1,
        log: [
          {
            id: `${Date.now()}-${Math.random()}`,
            type: "action",
            title: action.label,
            text: action.description,
          },
          ...current.log,
        ].slice(0, 8),
      };
    });
  };

  const handleReaction = (option) => {
    setGame((current) => {
      if (!current.pendingReaction) return current;
      const nextStats = applyEffects(current.stats, option.effects);
      return {
        ...current,
        stats: nextStats,
        pendingReaction: null,
        log: [
          {
            id: `${Date.now()}-${Math.random()}`,
            type: "reaction",
            title: current.pendingReaction.speaker,
            text: option.crewLine,
          },
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
      pendingReaction: null,
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
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Anchor className="h-5 w-5" />
            <span className="font-semibold">Nautilus — Hub de mission</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden text-sm text-muted-foreground md:block">
              {user.firstName} {user.lastName}
            </div>
            <Badge variant="outline" className="rounded-full">
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
          <Card className="rounded-2xl">
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Rôle sélectionné</p>
                  <div className="flex items-center gap-2">
                    {role && <role.icon className="h-4 w-4" />}
                    <span className="text-lg font-semibold">{role?.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Niveau {game.level}</p>
                    <Progress value={levelProgress} className="h-2 w-40" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {game.xp} / {xpNeeded(game.level)} XP
                    </p>
                  </div>
                </div>
              </div>

              {game.lastUnlock && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
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
                  <Badge variant="secondary" className="rounded-full">
                    {availableActions.length} actions
                  </Badge>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {availableActions.map((action) => (
                    <Card key={action.id} className="rounded-xl">
                      <CardContent className="p-4 space-y-2">
                        <p className="font-medium">{action.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {action.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="rounded-full">
                            +{action.xp} XP
                          </Badge>
                          <Button
                            size="sm"
                            className="rounded-xl"
                            onClick={() => handleAction(action)}
                          >
                            Exécuter <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="rounded-2xl">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Équipage</h3>
                  <Badge variant="secondary" className="rounded-full">
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
                        <Badge className="rounded-full">Vous</Badge>
                      ) : (
                        <Badge variant="outline" className="rounded-full">
                          IA
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="p-5 space-y-3">
                <h3 className="font-semibold">Storyline</h3>
                <div className="space-y-2">
                  {unlockedStory.map((chapter) => (
                    <div key={chapter.id} className="rounded-xl border p-3">
                      <p className="text-sm font-medium">{chapter.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {chapter.text}
                      </p>
                    </div>
                  ))}
                  {nextLocked && (
                    <div className="rounded-xl border border-dashed p-3 text-xs text-muted-foreground">
                      Prochain chapitre au niveau {nextLocked.unlockLevel}.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="journal" className="w-full">
          <TabsList>
            <TabsTrigger value="journal">Journal</TabsTrigger>
            <TabsTrigger value="cadence">Cadence</TabsTrigger>
            <TabsTrigger value="histoire">Histoire complète</TabsTrigger>
          </TabsList>
          <TabsContent value="journal">
            <Card className="rounded-2xl">
              <CardContent className="p-6 space-y-4">
                {game.log.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Aucun événement pour l'instant.
                  </p>
                ) : (
                  game.log.map((item) => (
                    <div key={item.id} className="space-y-1">
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.text}</p>
                      <Separator />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="cadence">
            <Card className="rounded-2xl">
              <CardContent className="p-6 space-y-2 text-sm text-muted-foreground">
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
          <TabsContent value="histoire">
            <Card className="rounded-2xl">
              <CardContent className="p-6 space-y-4">
                {STORY.map((chapter) => (
                  <div key={chapter.id} className="rounded-xl border p-4">
                    <p className="font-medium">{chapter.title}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {chapter.text}
                    </p>
                    {game.unlockedChapters.includes(chapter.id) ? (
                      <Badge className="mt-2 rounded-full">Déverrouillé</Badge>
                    ) : (
                      <Badge variant="outline" className="mt-2 rounded-full">
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

      {game.pendingReaction && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4">
          <Card className="w-full max-w-md rounded-2xl">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Réaction de {game.pendingReaction.speaker}
                </p>
                <p className="text-lg font-semibold">
                  {game.pendingReaction.prompt}
                </p>
                {game.pendingReaction.sourceAction && (
                  <p className="text-xs text-muted-foreground">
                    Suite à : {game.pendingReaction.sourceAction}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                {game.pendingReaction.options.map((option) => (
                  <Button
                    key={option.label}
                    variant="outline"
                    className="w-full rounded-xl justify-between"
                    onClick={() => handleReaction(option)}
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
    </div>
  );
}
