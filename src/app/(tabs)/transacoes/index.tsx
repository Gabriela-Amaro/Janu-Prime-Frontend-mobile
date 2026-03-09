import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ChevronDown, ChevronRight, Funnel, Star } from "lucide-react-native";
import { ScreenContainer } from "../../../components/ScreenContainer/tabs/ScreenContainer";
import { useAuth } from "../../../contexts/AuthContext";
import { useTransacoes } from "../../../hooks/useTransacoes";
import { colors } from "../../../constants/Colors";
import { styles } from "./styles";
import type { Transacao } from "../../../types";
import { FontSize } from "../../../constants/Fonts";

// ─── Tipos ───────────────────────────────────────────

type SortOption = "menor_pontos" | "maior_pontos" | "mais_recentes" | "mais_antigos";
type FilterOption = "todos" | "em_andamento" | "finalizado" | "resgate" | "acumulo" | "aprovado" | "recusado" | "cancelado";

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: "mais_recentes", label: "Mais Recentes" },
  { key: "mais_antigos", label: "Mais Antigos" },
  { key: "menor_pontos", label: "Menor Pontos" },
  { key: "maior_pontos", label: "Maior Pontos" },
];

const FILTER_OPTIONS: { key: FilterOption; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "em_andamento", label: "Em Andamento" },
  { key: "finalizado", label: "Finalizado" },
  { key: "resgate", label: "Resgate" },
  { key: "acumulo", label: "Acumulo" },
  { key: "aprovado", label: "Aprovado" },
  { key: "recusado", label: "Recusado" },
  { key: "cancelado", label: "Cancelado" },
];

// ─── Helpers ─────────────────────────────────────────

/** Formata data ISO para "Sex, 25 Janeiro 2025" */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];
  return `${dias[date.getDay()]}, ${date.getDate()} ${meses[date.getMonth()]} ${date.getFullYear()}`;
}

function getTransacaoLabel(t: Transacao): string {
  return t.tipo === "credito" ? "Acumulo de Pontos" : "Resgate de Pontos";
}

function getStoreName(t: Transacao): string {
  return t.nome_estabelecimento ?? "Loja";
}

function getPointsText(t: Transacao): string {
  const pontos = t.pontos ?? 0;
  return t.tipo === "credito" ? `+ ${pontos}` : `- ${pontos}`;
}

function getStatusStyle(status: string) {
  switch (status) {
    case "APROVADO":
    case "CONCLUIDO":
      return styles.statusAprovado;
    case "CANCELADO":
      return styles.statusCancelado;
    case "RECUSADO":
      return styles.statusRecusado;
    default:
      return {};
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "APROVADO":
      return "Aprovado";
    case "CONCLUIDO":
      return "Aprovado";
    case "CANCELADO":
      return "Cancelado";
    case "RECUSADO":
      return "Recusado";
    default:
      return status;
  }
}

function getStatusBorderColor(status: string): string {
  switch (status) {
    case "APROVADO":
    case "CONCLUIDO":
      return colors.successDark;
    case "RECUSADO":
      return colors.errorDark;
    case "CANCELADO":
    default:
      return colors.gray[500];
  }
}

// ─── Filtro e Ordenação ──────────────────────────────

function applyFilter(data: Transacao[], filter: FilterOption): Transacao[] {
  switch (filter) {
    case "todos":
      return data;
    case "em_andamento":
      return data.filter((t) => t.status === "ABERTO" || t.status === "APROVADO");
    case "finalizado":
      return data.filter((t) => t.status === "CONCLUIDO" || t.status === "CANCELADO" || t.status === "RECUSADO");
    case "resgate":
      return data.filter((t) => t.tipo === "debito");
    case "acumulo":
      return data.filter((t) => t.tipo === "credito");
    case "aprovado":
      return data.filter((t) => t.status === "APROVADO" || t.status === "CONCLUIDO");
    case "recusado":
      return data.filter((t) => t.status === "RECUSADO");
    case "cancelado":
      return data.filter((t) => t.status === "CANCELADO");
  }
}

function applySort(data: Transacao[], sort: SortOption): Transacao[] {
  const sorted = [...data];
  switch (sort) {
    case "menor_pontos":
      return sorted.sort((a, b) => (a.pontos ?? 0) - (b.pontos ?? 0));
    case "maior_pontos":
      return sorted.sort((a, b) => (b.pontos ?? 0) - (a.pontos ?? 0));
    case "mais_recentes":
      return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    case "mais_antigos":
      return sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }
}

// ─── Sub-componentes ─────────────────────────────────

function StoreInfo({ transacao, andamento = false }: { transacao: Transacao; andamento?: boolean }) {
  const storeName = getStoreName(transacao);
  const logoUrl = transacao.logo_estabelecimento;

  return (
    <View style={styles.storeRow}>
      {logoUrl ? (
        <Image source={{ uri: logoUrl }} style={styles.storeLogo} />
      ) : (
        <View style={[styles.storeLogo, styles.storeLogoPlaceholder]}>
          <Text style={styles.storeLogoText}>
            {storeName.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      <View style={styles.storeDetails}>
        <Text style={styles.storeName} numberOfLines={1}>
          {storeName}
        </Text>
        {andamento && 
          <View style={styles.storeRatingRow}>
            {transacao.media_avaliacoes != null ? (
              <>
                <Text style={styles.storeRatingText}>
                  {transacao.media_avaliacoes.toFixed(1)}
                </Text>
                <Star size={10} color={colors.textPrimary} fill={colors.textPrimary} />
                <Text style={styles.storeRatingText}>
                  ({transacao.total_avaliacoes})
                </Text>
              </>
            ) : (
              <Text style={styles.storeRatingText}>Novo</Text>
            )}
          </View>
        }
      </View>
    </View>
  );
}

function CardEmAndamento({ transacao }: { transacao: Transacao }) {
  const isCredito = transacao.tipo === "credito";

  return (
    <>
      <Text style={styles.dateLabel}>{formatDate(transacao.created_at)}</Text>
      <View style={styles.card}>
        {transacao.tipo === "debito" && transacao.status === "APROVADO" && (
          <Text style={[styles.statusBadge, styles.statusAprovado]}>Em preparo</Text>
        )}
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{getTransacaoLabel(transacao)}</Text>
          <Text
            style={[
              styles.cardPoints,
              isCredito ? styles.pointsPositive : styles.pointsNegative,
            ]}
          >
            {getPointsText(transacao)}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <StoreInfo transacao={transacao} andamento={true}/>
          <Text style={styles.notaText}>N° da Nota: {transacao.codigo}</Text>
        </View>
        <TouchableOpacity style={styles.acompanharRow}>
          <Text style={styles.acompanharText}>Acompanhar</Text>
          <ChevronRight size={16} color={colors.brown[800]} />
        </TouchableOpacity>
      </View>
    </>
  );
}

function CardFinalizado({ transacao }: { transacao: Transacao }) {
  const isCredito = transacao.tipo === "credito";
  const borderColor = getStatusBorderColor(transacao.status);

  return (
    <>
      <Text style={styles.dateLabel}>{formatDate(transacao.updated_at)}</Text>
      <View style={[styles.cardFinalizado, {borderColor: borderColor }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.statusBadge, getStatusStyle(transacao.status), {fontSize: FontSize.body}]}>
            {getStatusLabel(transacao.status)}
          </Text>
          <Text
            style={[
              styles.cardPoints,
              transacao.status === "CANCELADO" || transacao.status === "RECUSADO"
                ? styles.pointsMuted
                : isCredito ? styles.pointsPositive : styles.pointsNegative,
            ]}
          >
            {getPointsText(transacao)}
          </Text>
        </View>
        <Text style={[styles.cardTitle, {textAlign: 'center'}]}>{getTransacaoLabel(transacao)}</Text>

        <View style={styles.infoRow}>
          <StoreInfo transacao={transacao}/>
          <Text style={styles.notaText}>N° da Nota: {transacao.codigo}</Text>
        </View>

        <View style={styles.avalieRow}>
          <Text style={styles.avalieText}>Avalie a sua experiência</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={16} color={colors.gray[500]} />
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.detalhesRow}>
          <Text style={styles.detalhesText}>Ver Detalhes</Text>
          <ChevronRight size={16} color={colors.brown[800]} />
        </TouchableOpacity>
      </View>
    </>
  );
}

// ─── Tela principal ──────────────────────────────────

export default function Transacoes() {
  const { user } = useAuth();
  const { data, loading, refetch } = useTransacoes();
  const [refreshing, setRefreshing] = React.useState(false);
  const [sortOption, setSortOption] = React.useState<SortOption>("mais_recentes");
  const [filterOption, setFilterOption] = React.useState<FilterOption>("todos");
  const [showSortMenu, setShowSortMenu] = React.useState(false);
  const [showFilterMenu, setShowFilterMenu] = React.useState(false);

  // Aplica filtro e ordenação
  const filtered = useMemo(() => applySort(applyFilter(data, filterOption), sortOption), [data, filterOption, sortOption]);

  const emAndamento = filtered.filter(
    (t) => t.status === "ABERTO" || t.status === "APROVADO"
  );
  const finalizados = filtered.filter(
    (t) => t.status === "CONCLUIDO" || t.status === "CANCELADO" || t.status === "RECUSADO"
  );

  async function handleRefresh() {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }

  return (
    <ScreenContainer
      headerContent={
        <View style={styles.headerContent}>
          <Text style={styles.headerLabel}>Janu Points</Text>
          <Text style={styles.headerPoints}>{user?.pontos ?? 0}</Text>
        </View>
      }
    >
      {loading && !refreshing ? (
        <ActivityIndicator
          size="large"
          color={colors.brown[800]}
          style={{ marginTop: 40 }}
        />
      ) : (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {/* Barra de Ordenar + Filtro */}
          <View style={styles.toolbarRow}>
            <View>
              <TouchableOpacity
                style={styles.ordenarBtn}
                onPress={() => { setShowSortMenu(!showSortMenu); setShowFilterMenu(false); }}
              >
                <Text style={styles.ordenarBtnText}>Ordenar</Text>
                <ChevronDown size={14} color={colors.textPrimary}/>
              </TouchableOpacity>

              {showSortMenu && (
                <View style={styles.dropdownMenu}>
                  {SORT_OPTIONS.map((opt) => (
                    <TouchableOpacity
                      key={opt.key}
                      style={styles.dropdownItem}
                      onPress={() => { setSortOption(opt.key); setShowSortMenu(false); }}
                    >
                      <Text style={[
                        styles.dropdownItemText,
                        sortOption === opt.key && styles.dropdownItemActive,
                      ]}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View>
              <TouchableOpacity
                onPress={() => { setShowFilterMenu(!showFilterMenu); setShowSortMenu(false); }}
              >
                <Funnel
                  size={22}
                  color={filterOption !== "todos" ? colors.brown[800] : colors.gray[700]}
                />
              </TouchableOpacity>

              {showFilterMenu && (
                <View style={[styles.dropdownMenu, styles.dropdownMenuRight]}>
                  {FILTER_OPTIONS.map((opt) => (
                    <TouchableOpacity
                      key={opt.key}
                      style={styles.dropdownItem}
                      onPress={() => { setFilterOption(opt.key); setShowFilterMenu(false); }}
                    >
                      <Text style={[
                        styles.dropdownItemText,
                        filterOption === opt.key && styles.dropdownItemActive,
                      ]}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Em Andamento */}
          {emAndamento.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Em Andamento</Text>
              {emAndamento.map((t) => (
                <CardEmAndamento key={`${t.tipo}-${t.id}`} transacao={t} />
              ))}
            </>
          )}

          {/* Finalizado */}
          {finalizados.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Finalizado</Text>
              {finalizados.map((t) => (
                <CardFinalizado key={`${t.tipo}-${t.id}`} transacao={t} />
              ))}
            </>
          )}

          {emAndamento.length === 0 && finalizados.length === 0 && (
            <Text style={styles.emptyText}>
              Nenhuma transação encontrada.
            </Text>
          )}

          <View style={{ height: 24 }} />
        </ScrollView>
      )}
    </ScreenContainer>
  );
}
