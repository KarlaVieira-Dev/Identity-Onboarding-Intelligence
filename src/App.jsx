import React, { useMemo, useState } from 'react';
import { feedbackSignals, onboardingEvents } from './data/ecosystemData.js';
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  BarChart3,
  BellRing,
  Brain,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  Fingerprint,
  Gauge,
  GitBranch,
  History,
  Layers3,
  Lightbulb,
  LineChart,
  ListChecks,
  PanelLeft,
  RadioTower,
  Search,
  ShieldAlert,
  Sparkles,
  UserRound,
  UsersRound,
} from 'lucide-react';

const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'contas', label: 'Contas', icon: Layers3 },
  { id: 'usuarios', label: 'Usuarios', icon: UsersRound },
  { id: 'jornadas', label: 'Jornadas', icon: GitBranch },
  { id: 'riscos', label: 'Riscos', icon: ShieldAlert },
  { id: 'sinais', label: 'Sinais', icon: RadioTower },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
  { id: 'auditoria', label: 'Auditoria', icon: History },
];

const scoreWeights = {
  onboardingSemConclusao: 20,
  acessoNegado: 15,
  feedbackNegativo: 15,
  multiplosEventos: 10,
};

const signalLabels = {
  onboardingSemConclusao: 'onboarding iniciado sem conclusao',
  acessoNegado: 'acesso negado',
  feedbackNegativo: 'feedback negativo',
  multiplosEventos: 'multiplos eventos',
};

const explanationLabels = {
  onboardingSemConclusao: 'onboarding iniciado sem conclusao',
  acessoNegado: 'acessos negados recorrentes',
  feedbackNegativo: 'feedback negativo',
  multiplosEventos: 'multiplos eventos simultaneos',
};

const basePriorityByRisk = {
  Critico: 1,
  Alto: 2,
  Medio: 3,
  Baixo: 4,
};

const accountMetadata = {
  'Conta Gestora A': { segment: 'Fintech', users: 128, friction: 'Acesso e credenciais' },
  'Conta Gestora B': { segment: 'Saude', users: 84, friction: 'Cadastro inicial' },
  'Conta Gestora C': { segment: 'SaaS', users: 49, friction: 'Validacao operacional' },
};

const impactedAccounts = [...new Set([...onboardingEvents.map((event) => event.conta), ...feedbackSignals.map((signal) => signal.conta)])];

function getAccountEcosystemSignals(conta) {
  const events = onboardingEvents.filter((event) => event.conta === conta);
  const feedbacks = feedbackSignals.filter((signal) => signal.conta === conta);
  const eventTypes = events.map((event) => event.evento);

  return {
    onboardingSemConclusao: eventTypes.includes('onboarding_iniciado') && !eventTypes.includes('onboarding_concluido'),
    acessoNegado: eventTypes.includes('acesso_negado'),
    feedbackNegativo: feedbacks.some((signal) => signal.sentimento === 'negativo'),
    multiplosEventos: events.length > 1,
  };
}

function getFeedbackTheme(conta) {
  return feedbackSignals.find((signal) => signal.conta === conta && signal.sentimento === 'negativo')?.tema;
}

const accountInputs = impactedAccounts.map((conta) => ({
  name: conta,
  ...(accountMetadata[conta] || { segment: 'Conta B2B', users: 0, friction: 'Sinais do ecossistema' }),
  signals: getAccountEcosystemSignals(conta),
}));

const ecosystemSummary = [
  {
    label: 'Eventos operacionais recebidos',
    value: onboardingEvents.length,
    detail: 'Account Onboarding & Access Governance',
    icon: RadioTower,
    tone: 'text-sky bg-blue-50',
  },
  {
    label: 'Feedbacks recebidos',
    value: feedbackSignals.length,
    detail: 'AI Feedback Intelligence',
    icon: Lightbulb,
    tone: 'text-coral bg-red-50',
  },
  {
    label: 'Contas impactadas',
    value: impactedAccounts.length,
    detail: 'identificadas na camada local',
    icon: Layers3,
    tone: 'text-moss bg-emerald-50',
  },
];

function classifyScore(score) {
  if (score <= 30) return 'Baixo';
  if (score <= 60) return 'Medio';
  if (score <= 80) return 'Alto';
  return 'Critico';
}

function suggestAction(account) {
  const { signals, risk } = account;
  if (risk === 'Critico') return 'Abrir intervencao executiva e revisar identidade da conta';
  if (signals.onboardingSemConclusao && signals.acessoNegado) return 'Acompanhar onboarding e revisar permissoes';
  if (signals.feedbackNegativo) return 'Agrupar feedbacks e priorizar correcao da etapa reportada';
  if (signals.multiplosEventos) return 'Revisar sequencia operacional e orientar proxima etapa';
  return 'Manter monitoramento preventivo';
}

function explainSignal(key, accountName) {
  const theme = getFeedbackTheme(accountName);
  const label = key === 'feedbackNegativo' && theme ? `${explanationLabels[key]} sobre ${theme}` : explanationLabels[key];
  return `${label} (+${scoreWeights[key]})`;
}

function getPriorityBoosts(signals) {
  return [
    signals.feedbackNegativo && 'feedback negativo',
    signals.acessoNegado && 'acesso negado',
    signals.onboardingSemConclusao && 'onboarding incompleto',
  ].filter(Boolean);
}

function calculatePriority(account) {
  const boosts = getPriorityBoosts(account.signals);
  const basePriority = basePriorityByRisk[account.risk];
  return {
    priority: Math.max(1, basePriority - boosts.length),
    priorityBase: basePriority,
    priorityBoosts: boosts,
  };
}

function buildAccountScore(input) {
  const activeSignals = Object.entries(input.signals)
    .filter(([, enabled]) => enabled)
    .map(([key]) => key);
  const score = Math.min(
    100,
    activeSignals.reduce((total, key) => total + scoreWeights[key], 0)
  );
  const risk = classifyScore(score);
  const reasons = activeSignals.map((key) => signalLabels[key]);
  const motivos = activeSignals.map((key) => explainSignal(key, input.name));
  const account = { ...input, score, risk, nivel: risk, reasons, motivos };
  const acaoSugerida = suggestAction(account);
  return { ...account, ...calculatePriority(account), action: acaoSugerida, acaoSugerida };
}

const accounts = accountInputs.map(buildAccountScore);
const rankedAccounts = [...accounts].sort((a, b) => b.score - a.score);
const priorityAccounts = [...accounts].sort((a, b) => a.priority - b.priority || b.score - a.score || a.name.localeCompare(b.name));
const topPriorityAccounts = priorityAccounts.slice(0, 3);

const users = [
  { name: 'Marina Costa', account: 'Conta Gestora A', role: 'Admin', score: 65, status: 'Critico', signal: 'Acesso negado apos onboarding iniciado' },
  { name: 'Bruno Lima', account: 'Conta Gestora B', role: 'Operador', score: 20, status: 'Estavel', signal: 'Usuario criado com feedback positivo' },
  { name: 'Renan Alves', account: 'Conta Gestora C', role: 'Gestor', score: 60, status: 'Atencao', signal: 'Eventos operacionais em sequencia' },
];

const journeys = [
  { name: 'Cadastro corporativo', conversion: '68%', friction: 'Alta', score: 78, stage: 'Validacao de empresa' },
  { name: 'Verificacao de identidade', conversion: '76%', friction: 'Media', score: 54, stage: 'Upload de documento' },
  { name: 'Ativacao de workspace', conversion: '89%', friction: 'Baixa', score: 24, stage: 'Primeiro acesso' },
  { name: 'Revisao de compliance', conversion: '61%', friction: 'Alta', score: 82, stage: 'Pendencia manual' },
];

const signalGroups = [
  {
    group: 'onboarding',
    items: onboardingEvents
      .filter((event) => event.evento.includes('onboarding') || event.evento === 'usuario_criado')
      .map((event) => ({ signal: event.evento, account: event.conta, volume: 1, severity: event.evento === 'onboarding_iniciado' ? 'Media' : 'Baixa' })),
  },
  {
    group: 'operacao',
    items: onboardingEvents
      .filter((event) => ['acesso_negado', 'perfil_alterado'].includes(event.evento))
      .map((event) => ({ signal: event.evento, account: event.conta, volume: 1, severity: event.evento === 'acesso_negado' ? 'Alta' : 'Media' })),
  },
  {
    group: 'feedback',
    items: feedbackSignals.map((signal) => ({
      signal: `${signal.sentimento} - ${signal.tema}`,
      account: signal.conta,
      volume: 1,
      severity: signal.sentimento === 'negativo' ? 'Alta' : 'Baixa',
    })),
  },
  {
    group: 'comportamento',
    items: impactedAccounts
      .filter((conta) => onboardingEvents.filter((event) => event.conta === conta).length > 1)
      .map((conta) => ({
        signal: 'multiplos eventos operacionais',
        account: conta,
        volume: onboardingEvents.filter((event) => event.conta === conta).length,
        severity: 'Media',
      })),
  },
];

const insights = [
  ...priorityAccounts
    .filter((account) => account.priority <= 2 && account.priorityBoosts.length > 0)
    .map((account) => `${account.name} deve ser priorizada por combinar ${account.priorityBoosts.join(', ')}.`),
  ...rankedAccounts
    .filter((account) => account.signals.onboardingSemConclusao && account.signals.acessoNegado)
    .map((account) => `${account.name}: Conta com onboarding incompleto e aumento de acessos negados.`),
  ...users
    .filter((user) => user.score >= 61)
    .map((user) => `${user.name}: Usuario com comportamento fora do padrao em ${user.account}.`),
  ...journeys
    .filter((journey) => journey.score >= 61)
    .map((journey) => `${journey.name}: Jornada com possivel friccao na etapa de ${journey.stage.toLowerCase()}.`),
];

const audit = [
  ...accounts.map((account, index) => ({
    event: `Score calculado para ${account.name}: ${account.score}`,
    owner: 'Motor de score local',
    time: `Hoje, 09:${String(10 + index).padStart(2, '0')}`,
    status: 'Concluido',
  })),
  ...accounts.map((account, index) => ({
    event: `Score explicado para ${account.name}: ${account.motivos.length} motivos`,
    owner: 'Camada de explicabilidade',
    time: `Hoje, 09:${String(15 + index).padStart(2, '0')}`,
    status: 'Concluido',
  })),
  ...rankedAccounts
    .filter((account) => ['Alto', 'Critico'].includes(account.risk))
    .map((account, index) => ({
      event: `Risco ${account.risk.toLowerCase()} identificado em ${account.name}`,
      owner: 'Classificador preditivo',
      time: `Hoje, 09:${String(20 + index).padStart(2, '0')}`,
      status: 'Concluido',
    })),
  ...rankedAccounts.map((account, index) => ({
    event: `Acao sugerida gerada para ${account.name}`,
    owner: 'Motor de recomendacao local',
    time: `Hoje, 09:${String(25 + index).padStart(2, '0')}`,
    status: 'Concluido',
  })),
  ...priorityAccounts.map((account, index) => ({
    event: `Prioridade calculada para ${account.name}: P${account.priority}`,
    owner: 'Priorizacao automatica',
    time: `Hoje, 09:${String(35 + index).padStart(2, '0')}`,
    status: 'Concluido',
  })),
  ...topPriorityAccounts.map((account, index) => ({
    event: `Item priorizado #${index + 1}: ${account.name}`,
    owner: 'Ranking automatico',
    time: `Hoje, 09:${String(40 + index).padStart(2, '0')}`,
    status: 'Concluido',
  })),
  ...topPriorityAccounts.map((account, index) => ({
    event: `Acao recomendada para ${account.name}: ${account.acaoSugerida}`,
    owner: 'Motor de recomendacao local',
    time: `Hoje, 09:${String(45 + index).padStart(2, '0')}`,
    status: 'Concluido',
  })),
  { event: 'Insight gerado para comportamento fora do padrao', owner: 'Analise preditiva', time: 'Hoje, 09:31', status: 'Concluido' },
  { event: 'Acao sugerida para contas com onboarding incompleto', owner: 'Regras aplicadas', time: 'Hoje, 09:44', status: 'Revisao' },
];

const metrics = [
  {
    label: 'contas em risco',
    value: accounts.filter((account) => ['Medio', 'Alto', 'Critico'].includes(account.risk)).length,
    detail: 'score acima de 30 pontos',
    icon: AlertTriangle,
    tone: 'text-coral bg-red-50',
  },
  {
    label: 'usuarios criticos',
    value: users.filter((user) => user.status === 'Critico').length,
    detail: `${users.filter((user) => user.score >= 61).length} acima de 60 pontos`,
    icon: UserRound,
    tone: 'text-amber bg-yellow-50',
  },
  {
    label: 'score medio',
    value: Math.round(accounts.reduce((total, account) => total + account.score, 0) / accounts.length),
    detail: 'calculado pelo motor local',
    icon: Gauge,
    tone: 'text-sky bg-blue-50',
  },
  {
    label: 'jornadas com friccao',
    value: journeys.filter((journey) => journey.friction === 'Alta').length,
    detail: `${journeys.filter((journey) => journey.score >= 61).length} com score alto`,
    icon: GitBranch,
    tone: 'text-moss bg-emerald-50',
  },
  {
    label: 'explicacoes geradas',
    value: accounts.length,
    detail: 'uma analise por conta impactada',
    icon: FileSearch,
    tone: 'text-sky bg-blue-50',
  },
];

const flowSteps = [
  { label: 'Eventos', icon: Activity },
  { label: 'Coleta de sinais', icon: RadioTower },
  { label: 'Motor de inteligencia', icon: Brain },
  { label: 'Classificacao', icon: ListChecks },
  { label: 'Sugestao de acao', icon: Sparkles },
  { label: 'Tomada de decisao', icon: ClipboardCheck },
];

const appliedRules = [
  { title: 'classificacao por score', description: '0 a 30 baixo; 31 a 60 medio; 61 a 80 alto; 81 a 100 critico.' },
  { title: 'sinais comportamentais', description: 'Onboarding iniciado sem conclusao, acessos negados e multiplos eventos elevam prioridade.' },
  { title: 'feedbacks recorrentes', description: 'Feedbacks negativos importados do ecossistema agrupam gargalos por tema e por conta.' },
  { title: 'alertas proativos', description: 'Alertas sao gerados quando a combinacao de score, jornada e sinal indica acao imediata.' },
];

const ecosystemConnections = [
  {
    title: 'AI Feedback Intelligence',
    marker: 'AI',
    description: 'fornece sinais de sentimento, criticidade, temas e feedbacks recorrentes',
  },
  {
    title: 'Account Onboarding & Access Governance',
    marker: 'AG',
    description: 'fornece eventos operacionais, vinculos, usuarios, acessos negados e auditoria',
  },
  {
    title: 'Identity & Onboarding Intelligence',
    marker: 'IO',
    description: 'combina esses sinais para calcular score, identificar riscos e sugerir acoes',
  },
];

const ecosystemFlow = [
  { label: 'Feedbacks', connector: '+' },
  { label: 'Eventos operacionais', connector: '+' },
  { label: 'Sinais comportamentais', connector: 'down' },
  { label: 'Motor de Score', connector: 'down' },
  { label: 'Risco', connector: 'down' },
  { label: 'Acao sugerida', connector: null },
];

function statusTone(value) {
  if (['Alto', 'Critico', 'Alta'].includes(value)) return 'bg-red-50 text-red-700 ring-red-100';
  if (['Medio', 'Atencao', 'Media', 'Revisao'].includes(value)) return 'bg-yellow-50 text-yellow-800 ring-yellow-100';
  return 'bg-emerald-50 text-emerald-700 ring-emerald-100';
}

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const current = useMemo(() => navigation.find((item) => item.id === activePage), [activePage]);

  return (
    <div className="min-h-screen bg-[#f6f7f4] text-ink">
      <aside className={`fixed inset-y-0 left-0 z-30 w-72 border-r border-black/10 bg-white transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-20 items-center gap-3 border-b border-black/10 px-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-ink text-mint">
            <Fingerprint size={23} />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">Identity & Onboarding</p>
            <p className="text-xs text-moss">Intelligence MVP</p>
          </div>
        </div>
        <nav className="space-y-1 p-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            const selected = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setSidebarOpen(false);
                }}
                className={`flex h-11 w-full items-center gap-3 rounded-md px-3 text-left text-sm font-medium transition ${
                  selected ? 'bg-ink text-white' : 'text-graphite hover:bg-black/5'
                }`}
                title={item.label}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {sidebarOpen && <button className="fixed inset-0 z-20 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Fechar menu" />}

      <main className="lg:pl-72">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-black/10 bg-[#f6f7f4]/90 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-md border border-black/10 bg-white lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Abrir menu" title="Abrir menu">
              <PanelLeft size={19} />
            </button>
            <div>
              <h1 className="text-xl font-semibold leading-tight md:text-2xl">{current.label}</h1>
              <p className="text-xs text-moss md:text-sm">Dados simulados locais para decisao preditiva em onboarding B2B.</p>
            </div>
          </div>
          <div className="hidden h-10 items-center gap-2 rounded-md border border-black/10 bg-white px-3 text-sm text-moss md:flex">
            <Search size={16} />
            <span>Ambiente local</span>
          </div>
        </header>

        <div className="px-4 py-6 md:px-8">
          {activePage === 'dashboard' && <Dashboard />}
          {activePage === 'contas' && <Accounts />}
          {activePage === 'usuarios' && <Users />}
          {activePage === 'jornadas' && <Journeys />}
          {activePage === 'riscos' && <Risks />}
          {activePage === 'sinais' && <Signals />}
          {activePage === 'insights' && <Insights />}
          {activePage === 'auditoria' && <Audit />}
        </div>
      </main>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-md border border-black/10 bg-white p-5 shadow-panel">
          <p className="text-sm font-semibold uppercase tracking-normal text-coral">Inteligencia preditiva para onboarding</p>
          <h2 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight md:text-4xl">Antecipe riscos, entenda friccoes e sugira a proxima melhor acao para cada conta.</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <InfoBlock title="Objetivo do projeto" text="Consolidar sinais de onboarding em uma visao executiva para priorizar contas, usuarios e jornadas que precisam de acao." />
            <InfoBlock title="Problema de negocio" text="Times B2B perdem velocidade quando riscos ficam espalhados em planilhas, feedbacks soltos e eventos sem contexto decisorio." />
            <InfoBlock title="Valor da plataforma" text="Transformar dados operacionais simulados em classificacoes, alertas e sugestoes acionaveis para reduzir abandono e retrabalho." />
          </div>
        </div>
        <div className="rounded-md border border-black/10 bg-ink p-5 text-white shadow-panel">
          <div className="flex items-center gap-2 text-mint">
            <BellRing size={18} />
            <span className="text-sm font-semibold">Prioridade do dia</span>
          </div>
          <p className="mt-5 text-4xl font-semibold">{topPriorityAccounts.length}</p>
          <p className="mt-2 text-sm text-white/75">contas exigem intervencao por combinacao de score elevado, friccao e sinais recorrentes.</p>
          <button className="mt-6 h-10 rounded-md bg-mint px-4 text-sm font-semibold text-ink">Revisar riscos</button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="rounded-md border border-black/10 bg-white p-4 shadow-panel">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-moss">{metric.label}</span>
                <span className={`flex h-10 w-10 items-center justify-center rounded-md ${metric.tone}`}>
                  <Icon size={19} />
                </span>
              </div>
              <p className="mt-4 text-3xl font-semibold">{metric.value}</p>
              <p className="mt-1 text-sm text-moss">{metric.detail}</p>
            </div>
          );
        })}
      </section>

      <section className="rounded-md border border-black/10 bg-white p-5 shadow-panel">
        <SectionTitle icon={ShieldAlert} title="Prioridades automaticas" />
        <div className="mt-5 grid gap-4 xl:grid-cols-3">
          {topPriorityAccounts.map((account, index) => (
            <article key={account.name} className="rounded-md border border-black/10 bg-[#f9faf7] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-coral">#{index + 1} no ranking</p>
                  <h3 className="mt-2 text-lg font-semibold">{account.name}</h3>
                </div>
                <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ${statusTone(account.nivel)}`}>{account.nivel}</span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="rounded-md border border-black/10 bg-white px-3 py-2">
                  <p className="text-xs text-moss">Prioridade</p>
                  <p className="text-xl font-semibold">P{account.priority}</p>
                </div>
                <div className="rounded-md border border-black/10 bg-white px-3 py-2">
                  <p className="text-xs text-moss">Score</p>
                  <p className="text-xl font-semibold">{account.score}</p>
                </div>
              </div>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-graphite">
                {account.motivos.slice(0, 3).map((motivo) => (
                  <li key={motivo}>{motivo}</li>
                ))}
              </ul>
              <p className="mt-4 rounded-md border border-black/10 bg-white p-3 text-sm leading-6 text-graphite">"{account.acaoSugerida}"</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-md border border-black/10 bg-white p-5 shadow-panel">
        <SectionTitle icon={RadioTower} title="Dados recebidos do Ecossistema" />
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {ecosystemSummary.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-md border border-black/10 bg-[#f9faf7] p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-moss">{item.label}</span>
                  <span className={`flex h-10 w-10 items-center justify-center rounded-md ${item.tone}`}>
                    <Icon size={19} />
                  </span>
                </div>
                <p className="mt-4 text-3xl font-semibold">{item.value}</p>
                <p className="mt-1 text-sm text-moss">{item.detail}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-md border border-black/10 bg-white p-5 shadow-panel">
          <SectionTitle icon={LineChart} title="Como funciona" />
          <div className="mt-5 space-y-3">
            {flowSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.label}>
                  <div className="flex items-center gap-3 rounded-md border border-black/10 bg-[#f9faf7] p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-moss ring-1 ring-black/10">
                      <Icon size={18} />
                    </div>
                    <span className="font-medium">{step.label}</span>
                  </div>
                  {index < flowSteps.length - 1 && (
                    <div className="flex h-7 items-center justify-center text-moss">
                      <ArrowDown size={18} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-md border border-black/10 bg-white p-5 shadow-panel">
          <SectionTitle icon={FileSearch} title="Regras aplicadas" />
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {appliedRules.map((rule) => (
              <div key={rule.title} className="rounded-md border border-black/10 bg-[#f9faf7] p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-moss" size={18} />
                  <h3 className="font-semibold">{rule.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-6 text-graphite">{rule.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-md border border-black/10 bg-white p-5 shadow-panel">
          <SectionTitle icon={Layers3} title="Conexão com o Ecossistema" />
          <div className="mt-5 grid gap-3">
            {ecosystemConnections.map((item) => (
              <article key={item.title} className="flex gap-3 rounded-md border border-black/10 bg-[#f9faf7] p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-ink text-xs font-semibold text-mint">
                  {item.marker}
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-graphite">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-black/10 bg-white p-5 shadow-panel">
          <SectionTitle icon={Brain} title="Fluxo do ecossistema" />
          <div className="mt-5 space-y-3">
            {ecosystemFlow.map((step) => (
              <div key={step.label}>
                <div className="rounded-md border border-black/10 bg-[#f9faf7] px-4 py-3 text-center font-medium">
                  {step.label}
                </div>
                {step.connector === '+' && <div className="flex h-7 items-center justify-center text-lg font-semibold text-moss">+</div>}
                {step.connector === 'down' && (
                  <div className="flex h-7 items-center justify-center text-moss">
                    <ArrowDown size={18} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoBlock({ title, text }) {
  return (
    <div className="rounded-md border border-black/10 bg-[#f9faf7] p-4">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-graphite">{text}</p>
    </div>
  );
}

function SectionTitle({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-mint text-moss">
        <Icon size={18} />
      </div>
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
  );
}

function Accounts() {
  return (
    <DataTable
      title="Contas monitoradas"
      icon={Layers3}
      columns={['Conta', 'Segmento', 'Score', 'Risco', 'Sinais ativos', 'Friccao principal']}
      rows={accounts.map((item) => [item.name, item.segment, item.score, item.risk, item.reasons.join(', ') || 'sem sinal critico', item.friction])}
      badgeIndexes={[3]}
    />
  );
}

function Users() {
  return <DataTable title="Usuarios criticos" icon={UsersRound} columns={['Usuario', 'Conta', 'Perfil', 'Score', 'Status', 'Sinal dominante']} rows={users.map((item) => [item.name, item.account, item.role, item.score, item.status, item.signal])} badgeIndexes={[4]} />;
}

function Journeys() {
  return <DataTable title="Jornadas de onboarding" icon={GitBranch} columns={['Jornada', 'Conversao', 'Score', 'Friccao', 'Etapa sensivel']} rows={journeys.map((item) => [item.name, item.conversion, item.score, item.friction, item.stage])} badgeIndexes={[3]} />;
}

function Risks() {
  return (
    <PagePanel title="Ranking de contas por prioridade" icon={ShieldAlert}>
      <div className="grid gap-4 xl:grid-cols-2">
        {priorityAccounts.map((account, index) => (
          <article key={account.name} className="rounded-md border border-black/10 bg-[#f9faf7] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-coral">#{index + 1} prioridade P{account.priority}</p>
                <h3 className="text-lg font-semibold">{account.name}</h3>
                <p className="mt-1 text-sm text-moss">{account.segment}</p>
              </div>
              <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ${statusTone(account.nivel)}`}>{account.nivel}</span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border border-black/10 bg-white p-4">
                <p className="text-sm text-moss">Score</p>
                <p className="mt-2 text-3xl font-semibold">{account.score}</p>
              </div>
              <div className="rounded-md border border-black/10 bg-white p-4">
                <p className="text-sm text-moss">Risco</p>
                <p className="mt-2 text-2xl font-semibold">{account.nivel}</p>
              </div>
            </div>

            <div className="mt-5 rounded-md border border-black/10 bg-white p-4">
              <p className="font-semibold">Motivos</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-graphite">
                {account.motivos.length > 0 ? account.motivos.map((motivo) => <li key={motivo}>{motivo}</li>) : <li>sem sinal critico identificado</li>}
              </ul>
            </div>

            <div className="mt-5 rounded-md border border-black/10 bg-white p-4">
              <p className="font-semibold">Sugestao</p>
              <p className="mt-2 text-sm leading-6 text-graphite">"{account.acaoSugerida}"</p>
            </div>
          </article>
        ))}
      </div>
    </PagePanel>
  );
}

function Signals() {
  return (
    <PagePanel title="Sinais agrupados" icon={RadioTower}>
      <div className="grid gap-4 xl:grid-cols-2">
        {signalGroups.map((group) => (
          <section key={group.group} className="rounded-md border border-black/10 bg-[#f9faf7] p-4">
            <h3 className="text-sm font-semibold uppercase tracking-normal text-moss">{group.group}</h3>
            <div className="mt-4 space-y-3">
              {group.items.map((item) => (
                <div key={item.signal} className="rounded-md border border-black/10 bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{item.signal}</p>
                      <p className="mt-1 text-sm text-moss">{item.account}</p>
                    </div>
                    <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ${statusTone(item.severity)}`}>{item.severity}</span>
                  </div>
                  <p className="mt-3 text-sm text-graphite">{item.volume} ocorrencias simuladas</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PagePanel>
  );
}

function Insights() {
  return (
    <PagePanel title="Insights acionaveis" icon={Lightbulb}>
      <div className="grid gap-4 md:grid-cols-2">
        {insights.map((item, index) => (
          <article key={item} className="rounded-md border border-black/10 bg-[#f9faf7] p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-coral ring-1 ring-black/10">{index + 1}</div>
            <p className="mt-4 leading-7 text-graphite">{item}</p>
          </article>
        ))}
      </div>
    </PagePanel>
  );
}

function Audit() {
  return <DataTable title="Trilha de auditoria" icon={History} columns={['Evento', 'Responsavel', 'Horario', 'Status']} rows={audit.map((item) => [item.event, item.owner, item.time, item.status])} badgeIndexes={[3]} />;
}

function PagePanel({ title, icon: Icon, children }) {
  return (
    <section className="rounded-md border border-black/10 bg-white p-5 shadow-panel">
      <SectionTitle icon={Icon} title={title} />
      <div className="mt-5">{children}</div>
    </section>
  );
}

function DataTable({ title, icon, columns, rows, badgeIndexes = [] }) {
  return (
    <PagePanel title={title} icon={icon}>
      <div className="overflow-hidden rounded-md border border-black/10">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-black/10">
            <thead className="bg-[#f9faf7]">
              <tr>
                {columns.map((column) => (
                  <th key={column} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-normal text-moss">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 bg-white">
              {rows.map((row) => (
                <tr key={row.join('-')} className="hover:bg-[#fbfcf8]">
                  {row.map((cell, index) => (
                    <td key={`${cell}-${index}`} className="max-w-md whitespace-normal px-4 py-4 text-sm leading-6 text-graphite">
                      {badgeIndexes.includes(index) ? (
                        <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ${statusTone(cell)}`}>{cell}</span>
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PagePanel>
  );
}

export default App;
