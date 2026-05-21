import React, { useMemo, useState } from 'react';
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
  onboardingIncompleto: 25,
  acessosNegadosRecorrentes: 20,
  feedbackNegativoRecorrente: 15,
  baixaUtilizacao: 10,
  alteracoesFrequentesPerfil: 15,
};

const signalLabels = {
  onboardingIncompleto: 'onboarding incompleto',
  acessosNegadosRecorrentes: 'acessos negados recorrentes',
  feedbackNegativoRecorrente: 'feedback negativo recorrente',
  baixaUtilizacao: 'baixa utilizacao',
  alteracoesFrequentesPerfil: 'alteracoes frequentes de perfil',
};

const accountInputs = [
  {
    name: 'Atlas Pay',
    segment: 'Fintech',
    users: 128,
    friction: 'KYC empresarial',
    signals: {
      onboardingIncompleto: true,
      acessosNegadosRecorrentes: true,
      feedbackNegativoRecorrente: true,
      baixaUtilizacao: false,
      alteracoesFrequentesPerfil: true,
    },
  },
  {
    name: 'Nexa Health',
    segment: 'Saude',
    users: 84,
    friction: 'Consentimento LGPD',
    signals: {
      onboardingIncompleto: true,
      acessosNegadosRecorrentes: false,
      feedbackNegativoRecorrente: true,
      baixaUtilizacao: true,
      alteracoesFrequentesPerfil: false,
    },
  },
  {
    name: 'Volt Market',
    segment: 'Marketplace',
    users: 211,
    friction: 'Revisao documental',
    signals: {
      onboardingIncompleto: false,
      acessosNegadosRecorrentes: false,
      feedbackNegativoRecorrente: false,
      baixaUtilizacao: true,
      alteracoesFrequentesPerfil: false,
    },
  },
  {
    name: 'Terra Cloud',
    segment: 'SaaS',
    users: 49,
    friction: 'Convites pendentes',
    signals: {
      onboardingIncompleto: true,
      acessosNegadosRecorrentes: true,
      feedbackNegativoRecorrente: false,
      baixaUtilizacao: true,
      alteracoesFrequentesPerfil: true,
    },
  },
  {
    name: 'Orion Bank',
    segment: 'Banco digital',
    users: 176,
    friction: 'Validacao de perfil',
    signals: {
      onboardingIncompleto: false,
      acessosNegadosRecorrentes: true,
      feedbackNegativoRecorrente: true,
      baixaUtilizacao: false,
      alteracoesFrequentesPerfil: true,
    },
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
  if (signals.onboardingIncompleto && signals.acessosNegadosRecorrentes) return 'Acionar onboarding assistido e validar bloqueios de acesso';
  if (signals.feedbackNegativoRecorrente) return 'Agrupar feedbacks e priorizar correcao da etapa reportada';
  if (signals.baixaUtilizacao) return 'Enviar playbook de ativacao e monitorar uso por 48h';
  return 'Manter monitoramento preventivo';
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
  const account = { ...input, score, risk, reasons };
  return { ...account, action: suggestAction(account) };
}

const accounts = accountInputs.map(buildAccountScore);
const rankedAccounts = [...accounts].sort((a, b) => b.score - a.score);

const users = [
  { name: 'Marina Costa', account: 'Atlas Pay', role: 'Admin', score: 86, status: 'Critico', signal: '3 tentativas falhas de validacao' },
  { name: 'Bruno Lima', account: 'Nexa Health', role: 'Operador', score: 58, status: 'Atencao', signal: 'Tempo alto na etapa de aceite' },
  { name: 'Camila Torres', account: 'Volt Market', role: 'Analista', score: 18, status: 'Estavel', signal: 'Atividade consistente' },
  { name: 'Renan Alves', account: 'Terra Cloud', role: 'Gestor', score: 73, status: 'Critico', signal: 'Convite reenviado 2 vezes' },
  { name: 'Paula Rocha', account: 'Orion Bank', role: 'Admin', score: 67, status: 'Atencao', signal: 'Alteracoes de perfil em sequencia' },
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
    items: [
      { signal: 'onboarding incompleto', account: 'Atlas Pay, Nexa Health, Terra Cloud', volume: 3, severity: 'Alta' },
      { signal: 'cadastro parado na validacao', account: 'Atlas Pay', volume: 11, severity: 'Alta' },
    ],
  },
  {
    group: 'operacao',
    items: [
      { signal: 'acessos negados recorrentes', account: 'Atlas Pay, Terra Cloud, Orion Bank', volume: 18, severity: 'Alta' },
      { signal: 'baixa utilizacao', account: 'Nexa Health, Volt Market, Terra Cloud', volume: 23, severity: 'Media' },
    ],
  },
  {
    group: 'feedback',
    items: [
      { signal: 'feedback negativo recorrente', account: 'Atlas Pay, Nexa Health, Orion Bank', volume: 16, severity: 'Alta' },
      { signal: 'comentarios sobre documento social', account: 'Nexa Health', volume: 7, severity: 'Media' },
    ],
  },
  {
    group: 'comportamento',
    items: [
      { signal: 'alteracoes frequentes de perfil', account: 'Atlas Pay, Terra Cloud, Orion Bank', volume: 14, severity: 'Alta' },
      { signal: 'usuario fora do padrao', account: 'Orion Bank', volume: 5, severity: 'Media' },
    ],
  },
];

const insights = [
  ...rankedAccounts
    .filter((account) => account.signals.onboardingIncompleto && account.signals.acessosNegadosRecorrentes)
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
  ...rankedAccounts
    .filter((account) => ['Alto', 'Critico'].includes(account.risk))
    .map((account, index) => ({
      event: `Risco ${account.risk.toLowerCase()} identificado em ${account.name}`,
      owner: 'Classificador preditivo',
      time: `Hoje, 09:${String(20 + index).padStart(2, '0')}`,
      status: 'Concluido',
    })),
  { event: 'Insight gerado para comportamento fora do padrao', owner: 'Analise preditiva', time: 'Hoje, 09:31', status: 'Concluido' },
  { event: 'Acao sugerida para contas com onboarding incompleto', owner: 'Regras aplicadas', time: 'Hoje, 09:44', status: 'Revisao' },
];

const metrics = [
  {
    label: 'contas em risco',
    value: accounts.filter((account) => ['Alto', 'Critico'].includes(account.risk)).length,
    detail: `${accounts.filter((account) => account.risk === 'Critico').length} em risco critico`,
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
  { title: 'sinais comportamentais', description: 'Acessos negados, baixa utilizacao, mudancas de perfil e abandono de etapa elevam prioridade.' },
  { title: 'feedbacks recorrentes', description: 'Termos repetidos em feedbacks simulados agrupam gargalos por tema e por conta.' },
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
          <p className="mt-5 text-4xl font-semibold">{rankedAccounts.filter((account) => ['Alto', 'Critico'].includes(account.risk)).length}</p>
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
    <DataTable
      title="Ranking de contas por score"
      icon={ShieldAlert}
      columns={['Conta', 'Score', 'Nivel de risco', 'Principais motivos', 'Acao sugerida']}
      rows={rankedAccounts.map((item) => [item.name, item.score, item.risk, item.reasons.join(', ') || 'sem sinal critico', item.action])}
      badgeIndexes={[2]}
    />
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
