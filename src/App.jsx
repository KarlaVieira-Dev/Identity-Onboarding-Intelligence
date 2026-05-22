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
  MessageSquareWarning,
  PanelLeft,
  RadioTower,
  Search,
  ShieldAlert,
  Sparkles,
  ClipboardList,
  GraduationCap,
  HelpCircle,
  Info,
  FlaskConical,
  X,
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
  { id: 'alertas', label: 'Alertas', icon: BellRing },
  { id: 'planos', label: 'Planos de Acao', icon: ClipboardList },
  { id: 'simulacoes', label: 'Simulacoes', icon: FlaskConical },
  { id: 'auditoria', label: 'Auditoria', icon: History },
];

const menuHelp = {
  dashboard: {
    objetivo: 'Visao executiva consolidada.',
    pergunta: 'Onde devo agir primeiro?',
  },
  contas: {
    objetivo: 'Visualizar contas monitoradas.',
    pergunta: 'Quais contas exigem atencao?',
  },
  usuarios: {
    objetivo: 'Visualizar comportamento e risco por usuario.',
    pergunta: 'Quais usuarios apresentam comportamento fora do padrao?',
  },
  jornadas: {
    objetivo: 'Identificar friccoes no onboarding.',
    pergunta: 'Em qual etapa existem problemas?',
  },
  riscos: {
    objetivo: 'Mostrar score e classificacao.',
    pergunta: 'O que representa maior risco?',
  },
  sinais: {
    objetivo: 'Exibir eventos interpretados.',
    pergunta: 'Quais comportamentos impactam score?',
  },
  insights: {
    objetivo: 'Gerar analises automaticas.',
    pergunta: 'O que esta acontecendo?',
  },
  alertas: {
    objetivo: 'Notificar problemas importantes.',
    pergunta: 'O que exige atencao imediata?',
  },
  planos: {
    objetivo: 'Transformar risco em tarefas.',
    pergunta: 'O que preciso fazer?',
  },
  simulacoes: {
    objetivo: 'Testar cenarios e observar a resposta automatica.',
    pergunta: 'Como a plataforma reage a um novo cenario?',
  },
  auditoria: {
    objetivo: 'Exibir rastreabilidade.',
    pergunta: 'Como o sistema chegou nessa decisao?',
  },
};

const widgetHelp = {
  'contas em risco': 'Mostra contas com score acima do limite de atencao. E calculado pela classificacao de risco das contas e importa porque aponta onde atuar antes que a friccao cresca.',
  'usuarios criticos': 'Indica usuarios com comportamento sensivel ou score alto. E calculado a partir da base local simulada de usuarios e ajuda a localizar possiveis bloqueios operacionais.',
  'score medio': 'Representa a media dos sinais recebidos pelas contas monitoradas. Quanto maior, maior o potencial de risco operacional.',
  'jornadas com friccao': 'Conta jornadas com etapas problemáticas. E calculado por friccao e score de jornada e importa para encontrar gargalos no onboarding.',
  'explicacoes geradas': 'Conta quantas analises explicaveis foram criadas. E calculado uma vez por conta impactada e ajuda a entender o porquê de cada decisao.',
  'alertas ativos': 'Mostra alertas preventivos abertos. E calculado pelas regras de score, sinais simultaneos e feedbacks e importa para agir antes do problema crescer.',
  'planos ativos': 'Mostra planos de acao gerados automaticamente. E calculado a partir dos riscos, alertas e sinais e transforma inteligencia em tarefas praticas.',
  'Prioridades automaticas': 'Ranking que responde onde agir primeiro. E calculado por prioridade, score e sinais agravantes.',
  'Explicacoes automaticas': 'Narrativas executivas geradas localmente a partir do score, sinais e acao sugerida.',
  'Dados recebidos do Ecossistema': 'Resumo dos eventos e feedbacks simulados recebidos de outros produtos do ecossistema.',
  'Como funciona': 'Mostra o fluxo conceitual que transforma eventos em classificacao e decisao.',
  'Regras aplicadas': 'Explica as regras locais usadas para classificar sinais, scores, alertas e acoes.',
  'Conexão com o Ecossistema': 'Mostra como os produtos do ecossistema contribuem para o Identity & Onboarding Intelligence.',
  'ConexÃ£o com o Ecossistema': 'Mostra como os produtos do ecossistema contribuem para o Identity & Onboarding Intelligence.',
  'Fluxo do ecossistema': 'Mostra como feedbacks, eventos e sinais alimentam score, risco e acao sugerida.',
  'Ranking de contas por prioridade': 'Ordena contas pela urgencia de atuacao, combinando prioridade automatica e score.',
  'Sinais agrupados': 'Agrupa sinais por onboarding, operacao, feedback e comportamento para explicar o impacto no score.',
  'Alertas proativos': 'Lista notificacoes geradas quando sinais indicam risco crescente.',
  'Planos de Acao inteligentes': 'Converte alertas e riscos em passos praticos para resolucao.',
  'Simulacoes Inteligentes': 'Permite testar cenarios locais e visualizar sinais, score, risco, alertas e plano de acao gerados automaticamente.',
  'Insights acionaveis': 'Resume analises geradas automaticamente para apoiar decisao.',
  'Resumo executivo': 'Sintetiza o estado operacional em frases curtas para leitura rapida.',
  'Trilha de auditoria': 'Registra como scores, alertas, prioridades e planos foram produzidos.',
};

const tourSteps = [
  { page: 'dashboard', title: 'Dashboard', text: 'Comece pela visao executiva: aqui aparecem prioridades, alertas, explicacoes e indicadores principais.' },
  { page: 'contas', title: 'Contas', text: 'Veja quais contas estao monitoradas, seus scores, riscos e sinais ativos.' },
  { page: 'riscos', title: 'Riscos', text: 'Entenda quais contas representam maior risco e por quais motivos.' },
  { page: 'alertas', title: 'Alertas', text: 'Acompanhe notificacoes proativas antes que a friccao operacional aumente.' },
  { page: 'planos', title: 'Planos de Acao', text: 'Transforme risco em passos praticos de resolucao com impacto estimado.' },
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

function getAccountEventCount(conta, eventName) {
  return onboardingEvents.filter((event) => event.conta === conta && event.evento === eventName).length;
}

function getNegativeFeedbackCount(conta) {
  return feedbackSignals.filter((signal) => signal.conta === conta && signal.sentimento === 'negativo').length;
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

function joinText(items) {
  if (items.length === 0) return 'sinais insuficientes';
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(', ')} e ${items[items.length - 1]}`;
}

function generateExplanation({ conta, score, risco, motivos, sinaisEncontrados, acaoSugerida }) {
  const readableSignals = sinaisEncontrados.length > 0 ? joinText(sinaisEncontrados) : joinText(motivos);
  const frictionContext =
    sinaisEncontrados.includes('feedback negativo') || sinaisEncontrados.includes('acesso negado')
      ? 'Esse comportamento indica aumento de friccao operacional e possibilidade de abandono ou retrabalho.'
      : 'Esse comportamento indica necessidade de acompanhamento para evitar atraso operacional.';

  return `${conta} apresenta risco ${risco} com score ${score} devido a combinacao de ${readableSignals}.\n\n${frictionContext}\n\nRecomendacao:\n${acaoSugerida}.`;
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
  const explicacao = generateExplanation({
    conta: input.name,
    score,
    risco: risk,
    motivos,
    sinaisEncontrados: reasons,
    acaoSugerida,
  });
  return { ...account, ...calculatePriority(account), action: acaoSugerida, acaoSugerida, explicacao };
}

const accounts = accountInputs.map(buildAccountScore);
const rankedAccounts = [...accounts].sort((a, b) => b.score - a.score);
const priorityAccounts = [...accounts].sort((a, b) => a.priority - b.priority || b.score - a.score || a.name.localeCompare(b.name));
const topPriorityAccounts = priorityAccounts.slice(0, 3);

function getAlertCriticality(account, type, signalCount = 1) {
  if (account.risk === 'Critico' || signalCount > 2) return 'critica';
  if (account.score > 50 || type === 'onboarding' || type === 'feedback') return 'alta';
  if (type === 'comportamento') return 'media';
  return 'baixa';
}

function createAlert(account, type, reason, action, index, signalCount = 1) {
  return {
    id: `${account.name}-${type}-${index}`,
    tipo: type,
    criticidade: getAlertCriticality(account, type, signalCount),
    conta: account.name,
    motivo: reason,
    mensagem: `${account.name}: ${reason}`,
    acao: action,
    timestamp: index === 0 ? 'Agora' : `Ha ${index * 7} min`,
  };
}

function generateAlerts(account) {
  const alerts = [];
  const deniedAccessCount = getAccountEventCount(account.name, 'acesso_negado');
  const negativeFeedbackCount = getNegativeFeedbackCount(account.name);
  const simultaneousSignals = Object.values(account.signals).filter(Boolean).length;

  if (account.score > 50) {
    alerts.push(createAlert(account, 'risco', `Score ${account.score} acima do limite preventivo.`, account.acaoSugerida, alerts.length, simultaneousSignals));
  }

  if (account.signals.onboardingSemConclusao) {
    alerts.push(createAlert(account, 'onboarding', 'Onboarding iniciado sem conclusao.', 'Acompanhar onboarding imediatamente.', alerts.length, simultaneousSignals));
  }

  if (deniedAccessCount > 1) {
    alerts.push(createAlert(account, 'comportamento', `${deniedAccessCount} acessos negados detectados.`, 'Revisar permissoes e bloqueios de acesso.', alerts.length, simultaneousSignals));
  }

  if (negativeFeedbackCount > 1) {
    alerts.push(createAlert(account, 'feedback', 'Feedback negativo recorrente identificado.', 'Agrupar temas de feedback e acionar responsavel pela conta.', alerts.length, simultaneousSignals));
  }

  if (simultaneousSignals > 2) {
    alerts.push(createAlert(account, 'comportamento', 'Combinacao de mais de 2 sinais simultaneos.', 'Priorizar revisao operacional da conta.', alerts.length, simultaneousSignals));
  }

  return alerts;
}

const alerts = priorityAccounts.flatMap(generateAlerts);
const alertSummary = {
  total: alerts.length,
  critica: alerts.filter((alert) => alert.criticidade === 'critica').length,
  alta: alerts.filter((alert) => alert.criticidade === 'alta').length,
};

function getUniqueSteps(steps) {
  return [...new Set(steps)];
}

function getPlanPriority(account) {
  if (account.priority <= 1 || account.risk === 'Critico') return 'Alta';
  if (account.priority === 2 || account.risk === 'Alto') return 'Alta';
  if (account.priority === 3 || account.risk === 'Medio') return 'Media';
  return 'Baixa';
}

function estimateRiskReduction(account, planAlerts) {
  const signalCount = Object.values(account.signals).filter(Boolean).length;
  return Math.min(45, 15 + signalCount * 6 + planAlerts.length * 2);
}

function generateActionPlan(account) {
  const accountAlerts = alerts.filter((alert) => alert.conta === account.name);
  const negativeFeedbacks = feedbackSignals.filter((signal) => signal.conta === account.name && signal.sentimento === 'negativo');
  const steps = [];

  if (account.signals.onboardingSemConclusao) {
    steps.push('revisar etapas pendentes', 'acompanhar conclusao', 'validar usuarios criados');
  }

  if (account.signals.acessoNegado) {
    steps.push('revisar permissoes', 'validar perfis', 'verificar regras de acesso');
  }

  if (negativeFeedbacks.length > 0) {
    steps.push('revisar feedback', 'identificar tema recorrente', 'validar experiencia do usuario');
  }

  if (account.signals.multiplosEventos) {
    steps.push('revisar sequencia operacional', 'verificar dependencias');
  }

  return {
    conta: account.name,
    risco: account.risk,
    score: account.score,
    objetivo: account.score > 50 ? 'Reduzir risco operacional' : 'Manter monitoramento preventivo',
    acoes: getUniqueSteps(steps.length > 0 ? steps : ['manter acompanhamento preventivo']),
    impacto: estimateRiskReduction(account, accountAlerts),
    prioridade: getPlanPriority(account),
    alertasRelacionados: accountAlerts.length,
    acaoSugerida: account.acaoSugerida,
  };
}

const actionPlans = priorityAccounts.map(generateActionPlan);
const actionPlanSummary = {
  total: actionPlans.length,
  alta: actionPlans.filter((plan) => plan.prioridade === 'Alta').length,
};

const simulationScenarios = [
  {
    id: 'abandono-onboarding',
    label: 'Cliente abandonou onboarding',
    signals: ['onboarding incompleto', 'acessos negados', 'feedback negativo'],
    score: 75,
    risk: 'Alto',
    explanation: 'Conta apresenta onboarding incompleto combinado com feedback negativo.',
    alert: 'acompanhamento necessario',
    plan: ['revisar permissoes', 'acompanhar onboarding', 'revisar feedback'],
  },
  {
    id: 'acessos-negados',
    label: 'Muitos acessos negados',
    signals: ['acessos negados', 'acesso negado recorrente', 'multiplos eventos'],
    score: 70,
    risk: 'Alto',
    explanation: 'Conta apresenta recorrencia de acessos negados com sinais operacionais simultaneos.',
    alert: 'revisao de permissoes necessaria',
    plan: ['revisar permissoes', 'validar perfis', 'verificar regras de acesso'],
  },
  {
    id: 'feedback-negativo',
    label: 'Feedback negativo recorrente',
    signals: ['feedback negativo', 'tema recorrente', 'friccao operacional'],
    score: 60,
    risk: 'Medio',
    explanation: 'Conta apresenta feedback negativo recorrente com potencial impacto na experiencia do usuario.',
    alert: 'feedback recorrente identificado',
    plan: ['revisar feedback', 'identificar tema recorrente', 'validar experiencia do usuario'],
  },
  {
    id: 'baixa-utilizacao',
    label: 'Baixa utilizacao',
    signals: ['baixa utilizacao', 'poucos eventos', 'jornada sem progresso'],
    score: 45,
    risk: 'Medio',
    explanation: 'Conta apresenta baixa utilizacao e pouca progressao operacional no onboarding.',
    alert: 'engajamento abaixo do esperado',
    plan: ['acompanhar conclusao', 'validar usuarios criados', 'revisar sequencia operacional'],
  },
];

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

const executiveSummary = [
  `${priorityAccounts.filter((account) => account.priority <= 2).length} contas exigem acompanhamento imediato.`,
  accounts.some((account) => account.signals.onboardingSemConclusao)
    ? 'Ha indicios de friccao recorrente em onboarding.'
    : 'Onboarding segue sem friccao recorrente relevante.',
  accounts.some((account) => account.signals.feedbackNegativo)
    ? 'Feedback negativo esta impactando score operacional.'
    : 'Feedbacks negativos nao aparecem como fator dominante neste ciclo.',
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
  ...accounts.map((account, index) => ({
    event: `Explicacao gerada para ${account.name}`,
    owner: 'Narrativa executiva local',
    time: `Hoje, 09:${String(18 + index).padStart(2, '0')}`,
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
  ...topPriorityAccounts.map((account, index) => ({
    event: `Recomendacao criada para ${account.name}`,
    owner: 'Narrativa executiva local',
    time: `Hoje, 09:${String(30 + index).padStart(2, '0')}`,
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
  ...alerts.slice(0, 4).map((alert, index) => ({
    event: `Alerta criado para ${alert.conta}: ${alert.tipo}`,
    owner: 'Motor de alertas proativos',
    time: `Hoje, 09:${String(50 + index).padStart(2, '0')}`,
    status: 'Concluido',
  })),
  { event: 'Simulacao executada: Abandono de onboarding', owner: 'Motor de simulacoes local', time: 'Hoje, 10:22', status: 'Concluido' },
  { event: 'Cenario selecionado: Excesso de acessos negados', owner: 'Motor de simulacoes local', time: 'Hoje, 10:24', status: 'Concluido' },
  ...actionPlans.map((plan, index) => ({
    event: `Plano criado para ${plan.conta}`,
    owner: 'Motor de planos de acao',
    time: `Hoje, 10:${String(index).padStart(2, '0')}`,
    status: 'Concluido',
  })),
  ...actionPlans.slice(0, 3).map((plan, index) => ({
    event: `Acao adicionada ao plano de ${plan.conta}: ${plan.acoes[0]}`,
    owner: 'Motor de planos de acao',
    time: `Hoje, 10:${String(5 + index).padStart(2, '0')}`,
    status: 'Concluido',
  })),
  { event: 'Plano atualizado para Conta Gestora A: prioridade alta', owner: 'Motor de planos de acao', time: 'Hoje, 10:12', status: 'Concluido' },
  { event: 'Plano concluido para Conta Gestora B: monitoramento preventivo', owner: 'Motor de planos de acao', time: 'Hoje, 10:18', status: 'Concluido' },
  { event: 'Alerta atualizado para Conta Gestora A: criticidade alta', owner: 'Motor de alertas proativos', time: 'Hoje, 09:55', status: 'Concluido' },
  { event: 'Alerta encerrado para Conta Gestora B: monitoramento preventivo', owner: 'Motor de alertas proativos', time: 'Hoje, 09:58', status: 'Concluido' },
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
  {
    label: 'alertas ativos',
    value: alertSummary.total,
    detail: `${alertSummary.critica} criticos, ${alertSummary.alta} altos`,
    icon: BellRing,
    tone: 'text-coral bg-red-50',
  },
  {
    label: 'planos ativos',
    value: actionPlanSummary.total,
    detail: `${actionPlanSummary.alta} alta prioridade`,
    icon: ClipboardList,
    tone: 'text-amber bg-yellow-50',
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
  if (['Alto', 'Critico', 'Alta', 'alta', 'critica'].includes(value)) return 'bg-red-50 text-red-700 ring-red-100';
  if (['Medio', 'Atencao', 'Media', 'media', 'Revisao'].includes(value)) return 'bg-yellow-50 text-yellow-800 ring-yellow-100';
  return 'bg-emerald-50 text-emerald-700 ring-emerald-100';
}

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [tourIndex, setTourIndex] = useState(null);
  const current = useMemo(() => navigation.find((item) => item.id === activePage), [activePage]);
  const activeTourStep = tourIndex === null ? null : tourSteps[tourIndex];

  function startTour() {
    setHelpOpen(false);
    setTourIndex(0);
    setActivePage(tourSteps[0].page);
  }

  function nextTourStep() {
    const nextIndex = tourIndex + 1;
    if (nextIndex >= tourSteps.length) {
      setTourIndex(null);
      return;
    }
    setTourIndex(nextIndex);
    setActivePage(tourSteps[nextIndex].page);
  }

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
          <div className="flex items-center gap-2">
            <div className="hidden h-10 items-center gap-2 rounded-md border border-black/10 bg-white px-3 text-sm text-moss md:flex">
              <Search size={16} />
              <span>Ambiente local</span>
            </div>
            <button
              className="flex h-10 items-center gap-2 rounded-md border border-black/10 bg-white px-3 text-sm font-medium text-graphite hover:bg-black/5"
              onClick={() => setHelpOpen(true)}
              title="Abrir ajuda"
            >
              <HelpCircle size={16} />
              <span className="hidden sm:inline">Ajuda</span>
            </button>
            <button
              className="flex h-10 items-center gap-2 rounded-md border border-black/10 bg-white px-3 text-sm font-medium text-graphite hover:bg-black/5"
              onClick={startTour}
              title="Fazer tour"
            >
              <GraduationCap size={16} />
              <span className="hidden sm:inline">Fazer Tour</span>
            </button>
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
          {activePage === 'alertas' && <Alerts />}
          {activePage === 'planos' && <ActionPlans />}
          {activePage === 'simulacoes' && <ProductSimulations />}
          {activePage === 'auditoria' && <Audit />}
        </div>
      </main>
      {helpOpen && <HelpPanel onClose={() => setHelpOpen(false)} onStartTour={startTour} />}
      {activeTourStep && <TourOverlay step={activeTourStep} index={tourIndex} onNext={nextTourStep} onClose={() => setTourIndex(null)} />}
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
                <span className="flex items-center gap-1 text-sm text-moss">
                  {metric.label}
                  <TooltipIcon text={widgetHelp[metric.label]} />
                </span>
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
        <SectionTitle icon={Brain} title="Explicacoes automaticas" />
        <div className="mt-5 grid gap-4 xl:grid-cols-3">
          {topPriorityAccounts.map((account) => (
            <article key={account.name} className="rounded-md border border-black/10 bg-[#f9faf7] p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold">{account.name}</h3>
                <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ${statusTone(account.nivel)}`}>{account.nivel}</span>
              </div>
              <p className="mt-4 whitespace-pre-line text-sm leading-6 text-graphite">{account.explicacao}</p>
              <p className="mt-4 rounded-md border border-black/10 bg-white p-3 text-sm font-medium leading-6 text-graphite">"{account.acaoSugerida}"</p>
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

function HelpPanel({ onClose, onStartTour }) {
  return (
    <div className="fixed inset-0 z-40 bg-black/30">
      <aside className="ml-auto flex h-full w-full max-w-xl flex-col overflow-y-auto border-l border-black/10 bg-white shadow-panel">
        <div className="sticky top-0 flex items-center justify-between border-b border-black/10 bg-white p-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-coral">Conheca a Plataforma</p>
            <h2 className="mt-1 text-2xl font-semibold">Help Center</h2>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-md border border-black/10 hover:bg-black/5" onClick={onClose} aria-label="Fechar ajuda" title="Fechar ajuda">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <section className="rounded-md border border-black/10 bg-[#f9faf7] p-4">
            <h3 className="font-semibold">Objetivo</h3>
            <p className="mt-2 text-sm leading-6 text-graphite">
              Transformar sinais operacionais, eventos e feedbacks em inteligencia preditiva para antecipar riscos e sugerir acoes.
            </p>
          </section>

          <section className="rounded-md border border-black/10 bg-[#f9faf7] p-4">
            <h3 className="font-semibold">Fluxo</h3>
            <div className="mt-4 space-y-2 text-center text-sm font-medium text-graphite">
              {['Eventos', 'Sinais', 'Score', 'Risco', 'Prioridade', 'Explicacao', 'Alerta', 'Plano de acao'].map((item, index, items) => (
                <div key={item}>
                  <div className="rounded-md border border-black/10 bg-white px-4 py-2">{item}</div>
                  {index < items.length - 1 && <div className="py-1 text-moss">↓</div>}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-md border border-black/10 bg-[#f9faf7] p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold">Guia dos menus</h3>
              <button className="rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white" onClick={onStartTour}>
                Fazer Tour
              </button>
            </div>
            <div className="mt-4 grid gap-3">
              {navigation.map((item) => {
                const Icon = item.icon;
                const help = menuHelp[item.id];
                return (
                  <article key={item.id} className="rounded-md border border-black/10 bg-white p-3">
                    <div className="flex items-center gap-2 font-semibold">
                      <Icon size={16} />
                      {item.label}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-graphite">Objetivo: {help.objetivo}</p>
                    <p className="text-sm leading-6 text-moss">Pergunta: "{help.pergunta}"</p>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}

function TourOverlay({ step, index, onNext, onClose }) {
  return (
    <div className="fixed bottom-5 right-5 z-50 w-[calc(100%-2.5rem)] max-w-sm rounded-md border border-black/10 bg-white p-5 shadow-panel">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-coral">Tour {index + 1} de {tourSteps.length}</p>
          <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
        </div>
        <button className="flex h-8 w-8 items-center justify-center rounded-md border border-black/10 hover:bg-black/5" onClick={onClose} aria-label="Encerrar tour" title="Encerrar tour">
          <X size={16} />
        </button>
      </div>
      <p className="mt-3 text-sm leading-6 text-graphite">{step.text}</p>
      <div className="mt-4 flex justify-end gap-2">
        <button className="h-10 rounded-md border border-black/10 px-3 text-sm font-medium text-graphite hover:bg-black/5" onClick={onClose}>
          Encerrar
        </button>
        <button className="h-10 rounded-md bg-ink px-3 text-sm font-semibold text-white" onClick={onNext}>
          {index === tourSteps.length - 1 ? 'Concluir' : 'Proximo'}
        </button>
      </div>
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
      <TooltipIcon text={widgetHelp[title]} />
    </div>
  );
}

function TooltipIcon({ text }) {
  if (!text) return null;
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full text-moss" title={text} aria-label={text}>
      <Info size={15} />
    </span>
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

const alertTypeIcons = {
  risco: ShieldAlert,
  onboarding: GitBranch,
  feedback: MessageSquareWarning,
  comportamento: Activity,
};

function Alerts() {
  return (
    <PagePanel title="Alertas proativos" icon={BellRing}>
      <div className="grid gap-4 xl:grid-cols-2">
        {alerts.map((alert) => {
          const Icon = alertTypeIcons[alert.tipo] || BellRing;
          return (
            <article key={alert.id} className="rounded-md border border-black/10 bg-[#f9faf7] p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-coral ring-1 ring-black/10">
                    <Icon size={19} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{alert.conta}</h3>
                    <p className="mt-1 text-sm text-moss">{alert.tipo}</p>
                  </div>
                </div>
                <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ${statusTone(alert.criticidade)}`}>{alert.criticidade}</span>
              </div>

              <div className="mt-5 grid gap-3">
                <div className="rounded-md border border-black/10 bg-white p-4">
                  <p className="text-sm font-semibold">Motivo</p>
                  <p className="mt-2 text-sm leading-6 text-graphite">{alert.motivo}</p>
                </div>
                <div className="rounded-md border border-black/10 bg-white p-4">
                  <p className="text-sm font-semibold">Acao sugerida</p>
                  <p className="mt-2 text-sm leading-6 text-graphite">{alert.acao}</p>
                </div>
                <div className="rounded-md border border-black/10 bg-white p-4">
                  <p className="text-sm font-semibold">Recebido</p>
                  <p className="mt-2 text-sm leading-6 text-graphite">{alert.timestamp}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </PagePanel>
  );
}

function ActionPlans() {
  return (
    <PagePanel title="Planos de Acao inteligentes" icon={ClipboardList}>
      <div className="grid gap-4 xl:grid-cols-2">
        {actionPlans.map((plan) => (
          <article key={plan.conta} className="rounded-md border border-black/10 bg-[#f9faf7] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-moss ring-1 ring-black/10">
                  <ClipboardList size={19} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{plan.conta}</h3>
                  <p className="mt-1 text-sm text-moss">Score {plan.score} · risco {plan.risco}</p>
                </div>
              </div>
              <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ${statusTone(plan.prioridade)}`}>{plan.prioridade}</span>
            </div>

            <div className="mt-5 rounded-md border border-black/10 bg-white p-4">
              <p className="text-sm font-semibold">Objetivo do plano</p>
              <p className="mt-2 text-sm leading-6 text-graphite">{plan.objetivo}</p>
            </div>

            <div className="mt-5 rounded-md border border-black/10 bg-white p-4">
              <p className="text-sm font-semibold">Lista de acoes</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-graphite">
                {plan.acoes.map((step) => (
                  <li key={step} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-moss" size={16} />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border border-black/10 bg-white p-4">
                <p className="text-sm font-semibold">Impacto esperado</p>
                <p className="mt-2 text-2xl font-semibold">↓ {plan.impacto}%</p>
                <p className="mt-1 text-sm text-moss">reducao estimada</p>
              </div>
              <div className="rounded-md border border-black/10 bg-white p-4">
                <p className="text-sm font-semibold">Prioridade</p>
                <p className="mt-2 text-2xl font-semibold">{plan.prioridade}</p>
                <p className="mt-1 text-sm text-moss">{plan.alertasRelacionados} alertas relacionados</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </PagePanel>
  );
}

function Simulations() {
  const [selectedScenarioId, setSelectedScenarioId] = useState(simulationScenarios[0].id);
  const scenario = simulationScenarios.find((item) => item.id === selectedScenarioId);

  return (
    <PagePanel title="Simulacoes Inteligentes" icon={FlaskConical}>
      <div className="rounded-md border border-black/10 bg-[#f9faf7] p-5">
        <p className="text-sm leading-6 text-graphite">Permite testar cenarios e visualizar como a plataforma reage.</p>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-md border border-black/10 bg-[#f9faf7] p-5">
          <h3 className="font-semibold">Cenarios disponiveis</h3>
          <div className="mt-4 space-y-2">
            {simulationScenarios.map((item) => (
              <label
                key={item.id}
                className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm font-medium transition ${
                  selectedScenarioId === item.id ? 'border-ink bg-white text-ink' : 'border-black/10 bg-white/70 text-graphite hover:bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="simulation-scenario"
                  value={item.id}
                  checked={selectedScenarioId === item.id}
                  onChange={() => setSelectedScenarioId(item.id)}
                  className="h-4 w-4 accent-ink"
                />
                {item.label}
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-md border border-black/10 bg-[#f9faf7] p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-coral">Cenario selecionado</p>
              <h3 className="mt-1 text-xl font-semibold">{scenario.label}</h3>
            </div>
            <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ${statusTone(scenario.risk)}`}>{scenario.risk}</span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="rounded-md border border-black/10 bg-white p-4">
              <p className="text-sm font-semibold">Sinais recebidos</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-graphite">
                {scenario.signals.map((signal) => (
                  <li key={signal}>{signal}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-md border border-black/10 bg-white p-4">
              <p className="text-sm font-semibold">Score</p>
              <p className="mt-2 text-4xl font-semibold">{scenario.score}</p>
              <p className="mt-2 text-sm text-moss">Risco: {scenario.risk}</p>
            </div>
          </div>

          <div className="mt-5 rounded-md border border-black/10 bg-white p-4">
            <p className="text-sm font-semibold">Explicacao automatica</p>
            <p className="mt-2 text-sm leading-6 text-graphite">"{scenario.explanation}"</p>
          </div>

          <div className="mt-5 rounded-md border border-black/10 bg-white p-4">
            <p className="text-sm font-semibold">Alerta</p>
            <p className="mt-2 text-sm leading-6 text-graphite">🚨 {scenario.alert}</p>
          </div>

          <div className="mt-5 rounded-md border border-black/10 bg-white p-4">
            <p className="text-sm font-semibold">Plano de acao</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-graphite">
              {scenario.plan.map((step) => (
                <li key={step} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-moss" size={16} />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </PagePanel>
  );
}

function ProductSimulations() {
  const [selectedScenarioId, setSelectedScenarioId] = useState(simulationScenarios[0].id);
  const scenario = simulationScenarios.find((item) => item.id === selectedScenarioId);

  return (
    <PagePanel title="Simulacoes Inteligentes" icon={FlaskConical}>
      <div className="rounded-md border border-black/10 bg-[#f9faf7] p-5">
        <p className="text-sm leading-6 text-graphite">Veja como a plataforma reage a problemas reais.</p>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-md border border-black/10 bg-[#f9faf7] p-5">
          <h3 className="font-semibold">Escolha uma situacao</h3>
          <div className="mt-4 space-y-2">
            {simulationScenarios.map((item) => (
              <label
                key={item.id}
                className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm font-medium transition ${
                  selectedScenarioId === item.id ? 'border-ink bg-white text-ink' : 'border-black/10 bg-white/70 text-graphite hover:bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="product-simulation-scenario"
                  value={item.id}
                  checked={selectedScenarioId === item.id}
                  onChange={() => setSelectedScenarioId(item.id)}
                  className="h-4 w-4 accent-ink"
                />
                {item.label}
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-md border border-black/10 bg-[#f9faf7] p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-coral">Demonstracao ativa</p>
              <h3 className="mt-1 text-xl font-semibold">{scenario.label}</h3>
            </div>
            <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ${statusTone(scenario.risk)}`}>{scenario.risk}</span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="rounded-md border border-black/10 bg-white p-4">
              <p className="text-sm font-semibold">O que a plataforma percebeu</p>
              <p className="mt-3 text-sm text-moss">Sinais encontrados:</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-graphite">
                {scenario.signals.map((signal) => (
                  <li key={signal} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-moss" size={16} />
                    <span>{signal}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-md border border-black/10 bg-white p-4">
              <p className="text-sm font-semibold">Resultado da analise</p>
              <p className="mt-3 text-sm text-moss">Risco identificado</p>
              <p className="mt-1 text-2xl font-semibold">{scenario.risk}</p>
              <p className="mt-3 text-sm text-moss">Score</p>
              <p className="mt-1 text-4xl font-semibold">{scenario.score}</p>
              <p className="mt-3 text-sm font-semibold">Motivo:</p>
              <p className="mt-1 text-sm leading-6 text-graphite">Combinacao de multiplos sinais de friccao operacional</p>
            </div>
          </div>

          <div className="mt-5 rounded-md border border-black/10 bg-white p-4">
            <p className="text-sm font-semibold">Explicacao automatica</p>
            <p className="mt-2 text-sm leading-6 text-graphite">"{scenario.explanation}"</p>
          </div>

          <div className="mt-5 rounded-md border border-black/10 bg-white p-4">
            <p className="text-sm font-semibold">Alerta</p>
            <p className="mt-2 text-sm leading-6 text-graphite">Acompanhamento necessario: {scenario.alert}</p>
          </div>

          <div className="mt-5 rounded-md border border-black/10 bg-white p-4">
            <p className="text-sm font-semibold">Acao sugerida</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-graphite">
              {scenario.plan.map((step) => (
                <li key={step} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-moss" size={16} />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 rounded-md border border-black/10 bg-white p-4">
            <p className="text-sm font-semibold">O valor da plataforma</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <ValueFlow title="Sem inteligencia" steps={['Evento isolado', 'Analise manual', 'Resposta tardia']} />
              <ValueFlow title="Com inteligencia" steps={['Eventos conectados', 'Risco identificado', 'Acao preventiva']} />
            </div>
          </div>
        </section>
      </div>
    </PagePanel>
  );
}

function ValueFlow({ title, steps }) {
  return (
    <div className="rounded-md border border-black/10 bg-[#f9faf7] p-4">
      <p className="font-semibold">{title}</p>
      <div className="mt-3 space-y-2 text-center text-sm text-graphite">
        {steps.map((item, index) => (
          <div key={item}>
            <div className="rounded-md border border-black/10 bg-white px-3 py-2">{item}</div>
            {index < steps.length - 1 && <div className="py-1 text-moss">↓</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function Insights() {
  return (
    <PagePanel title="Insights acionaveis" icon={Lightbulb}>
      <div className="mb-5 rounded-md border border-black/10 bg-[#f9faf7] p-5">
        <SectionTitle icon={ClipboardCheck} title="Resumo executivo" />
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {executiveSummary.map((item) => (
            <div key={item} className="rounded-md border border-black/10 bg-white p-4 text-sm leading-6 text-graphite">
              {item}
            </div>
          ))}
        </div>
      </div>
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
