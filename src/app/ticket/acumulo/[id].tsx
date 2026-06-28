import { useLocalSearchParams, useRouter } from "expo-router";
import { Star } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackButton } from "../../../components/Buttons/Back";
import { colors } from "../../../constants/Colors";
import { api, ApiError, BASE_URL } from "../../../services/api";
import type { TicketCredito } from "../../../types";
import { styles } from "./styles";

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

/** Formata data ISO para "DD/MM/YYYY" */
function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/** Formata valor decimal (string) para "200,00" */
function formatCurrency(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return num.toFixed(2).replace(".", ",");
}

/** Retorna a config visual da barra de status */
function getStatusConfig(status: string) {
  switch (status) {
    case "ABERTO":
      return { label: "Em Andamento", color: colors.brown[800] };
    case "CONCLUIDO":
      return { label: "Concluído", color: colors.success };
    case "CANCELADO":
      return { label: "Cancelado", color: colors.gray[500] };
    case "RECUSADO":
      return { label: "Recusado", color: colors.error };
    default:
      return { label: status, color: colors.gray[500] };
  }
}

// ─── Tela ────────────────────────────────────────────

export default function AcompanharAcumuloScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [ticket, setTicket] = useState<TicketCredito | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // ─── Fetch ───────────────────────────────────────
  const fetchTicket = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await api.get<TicketCredito>(`/api/tickets/credito/${id}/`);
      setTicket(data);
    } catch (err) {
      console.error("Erro ao buscar ticket de acúmulo:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  // ─── Cancelar ────────────────────────────────────
  const handleCancelar = () => {
    Alert.alert(
      "Cancelar Acúmulo",
      "Tem certeza que deseja cancelar este pedido de acúmulo de pontos?",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim, cancelar",
          style: "destructive",
          onPress: async () => {
            setCancelling(true);
            try {
              await api.post(`/api/tickets/credito/${id}/cancelar/`);
              Alert.alert("Sucesso", "Pedido de acúmulo cancelado.", [
                { text: "OK", onPress: () => router.back() },
              ]);
            } catch (err: any) {
              let message = "Não foi possível cancelar o pedido.";
              if (err instanceof ApiError && err.data) {
                if (err.data.error) message = String(err.data.error);
                else if (err.data.detail) message = String(err.data.detail);
              }
              Alert.alert("Erro", message);
            } finally {
              setCancelling(false);
            }
          },
        },
      ]
    );
  };

  // ─── Loading ─────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.brown[800]} />
      </View>
    );
  }

  // ─── Error ───────────────────────────────────────
  if (error || !ticket) {
    return (
      <View style={[styles.errorContainer, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>Erro ao carregar dados do acúmulo.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ─── URLs das imagens ────────────────────────────
  const logoUrl = ticket.logo_estabelecimento
    ? ticket.logo_estabelecimento.startsWith("http")
      ? ticket.logo_estabelecimento
      : `${BASE_URL}${ticket.logo_estabelecimento}`
    : null;

  const notaImageUrl = ticket.imagem
    ? ticket.imagem.startsWith("http")
      ? ticket.imagem
      : `${BASE_URL}${ticket.imagem}`
    : null;

  const storeName = ticket.nome_estabelecimento ?? "Loja";
  const statusConfig = getStatusConfig(ticket.status);
  const canCancel = ticket.status === "ABERTO";

  // ─── Estrelas ────────────────────────────────────
  const renderStars = (rating: number | null) => {
    const rounded = Math.round(rating ?? 0);
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={12}
        color={colors.textPrimary}
        fill={i < rounded ? colors.textPrimary : "transparent"}
        style={{ marginRight: 2 }}
      />
    ));
  };

  // ─── Render ──────────────────────────────────────
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton color={colors.textPrimary} style={styles.backButton} />
        <Text style={styles.headerTitle}>Acumulo de Pontos</Text>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Info do Estabelecimento */}
        <View style={styles.establishmentSection}>
          <View style={styles.establishmentInfo}>
            <Text style={styles.establishmentName}>{storeName}</Text>
            <View style={styles.ratingRow}>
              {ticket.media_avaliacoes != null ? (
                <>
                  <Text style={styles.ratingText}>
                    {ticket.media_avaliacoes.toFixed(1)}
                  </Text>
                  <View style={styles.ratingStars}>
                    {renderStars(ticket.media_avaliacoes)}
                  </View>
                  <Text style={styles.ratingCount}>
                    {ticket.total_avaliacoes} Avaliações
                  </Text>
                </>
              ) : (
                <Text style={styles.ratingText}>Novo</Text>
              )}
            </View>
          </View>

          {logoUrl ? (
            <Image source={{ uri: logoUrl }} style={styles.establishmentLogo} />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoPlaceholderText}>
                {storeName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        {/* Código do Ticket + Data */}
        <View style={styles.ticketInfoSection}>
          <Text style={styles.ticketCode}>Código do Ticket: {ticket.codigo}</Text>
        </View>
        <View style={{paddingHorizontal: 20, paddingTop: 20}}>
          <Text style={styles.ticketDate}>{formatDate(ticket.created_at)}</Text>
        </View>

        {/* Nota Fiscal Card */}
        <View style={styles.notaCard}>
          {notaImageUrl ? (
            <Image source={{ uri: notaImageUrl }} style={styles.notaImage} />
          ) : (
            <View style={styles.notaImagePlaceholder}>
              <Text style={styles.placeholderText}>Sem Foto</Text>
            </View>
          )}
          <View style={styles.notaDetails}>
            <Text style={styles.notaNumero}>Código da Nota: {ticket.numero_nota}</Text>
            <Text style={styles.notaValor}>Valor: {formatCurrency(ticket.preco)}</Text>
            <Text style={styles.notaDataEmissao}>
              Data de Emissão: {formatShortDate(ticket.data_nota)}
            </Text>
          </View>
        </View>

        {/* Observação (motivo de recusa) */}
        {ticket.observacao && ticket.status === "RECUSADO" && (
          <View style={styles.observacaoSection}>
            <Text style={styles.observacaoLabel}>Motivo da Recusa:</Text>
            <Text style={styles.observacaoText}>{ticket.observacao}</Text>
          </View>
        )}

        {/* Valores */}
        <View style={styles.valuesSection}>
          <Text style={styles.sectionTitle}>Valores</Text>

          <View style={styles.valueRow}>
            <Text style={styles.valueLabel}>Valor da Nota</Text>
            <Text style={styles.valueAmount}>{formatCurrency(ticket.preco)}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total de Pontos</Text>
            <Text style={styles.totalAmount}>JP {ticket.pontos ?? 0}</Text>
          </View>
        </View>
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Footer com botão cancelar */}
      {canCancel && (
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <TouchableOpacity
            style={[styles.cancelButton, cancelling && styles.cancelButtonDisabled]}
            onPress={handleCancelar}
            disabled={cancelling}
          >
            {cancelling ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Barra de status */}
      <View
        style={[
          styles.statusBar,
          { backgroundColor: statusConfig.color, paddingBottom: Math.max(insets.bottom, 8) },
        ]}
      >
        <Text style={styles.statusBarText}>{statusConfig.label}</Text>
      </View>
    </View>
  );
}
