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
import type { TicketDebito } from "../../../types";
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

/** Retorna a config visual da barra de status */
function getStatusConfig(status: string) {
  switch (status) {
    case "ABERTO":
      return { label: "Em Andamento", color: colors.brown[800] };
    case "APROVADO":
      return { label: "Em Preparo", color: colors.orange };
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

export default function AcompanharResgateScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [ticket, setTicket] = useState<TicketDebito | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // ─── Fetch ───────────────────────────────────────
  const fetchTicket = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await api.get<TicketDebito>(`/api/tickets/debito/${id}/`);
      setTicket(data);
    } catch (err) {
      console.error("Erro ao buscar ticket de resgate:", err);
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
      "Cancelar Resgate",
      "Tem certeza que deseja cancelar este resgate? Seus pontos serão estornados.",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim, cancelar",
          style: "destructive",
          onPress: async () => {
            setCancelling(true);
            try {
              await api.post(`/api/tickets/debito/${id}/cancelar/`);
              Alert.alert("Sucesso", "Resgate cancelado e pontos estornados.", [
                { text: "OK", onPress: () => router.back() },
              ]);
            } catch (err: any) {
              let message = "Não foi possível cancelar o resgate.";
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
        <Text style={styles.errorText}>Erro ao carregar dados do resgate.</Text>
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

  const productImageUrl = ticket.imagem_produto
    ? ticket.imagem_produto.startsWith("http")
      ? ticket.imagem_produto
      : `${BASE_URL}${ticket.imagem_produto}`
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
        <Text style={styles.headerTitle}>Resgate de Pontos</Text>
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

        {/* Produto Card */}
        <View style={styles.productCard}>
          {productImageUrl ? (
            <Image source={{ uri: productImageUrl }} style={styles.productImage} />
          ) : (
            <View style={styles.productImagePlaceholder}>
              <Text style={styles.placeholderText}>Sem Foto</Text>
            </View>
          )}
          <View style={styles.productDetails}>
            <Text style={styles.productName}>{ticket.nome_produto}</Text>
            {ticket.descricao_produto ? (
              <Text style={styles.productDesc} numberOfLines={3}>
                {ticket.descricao_produto}
              </Text>
            ) : null}
            <Text style={styles.quantityText}>Quantidade: 1</Text>
          </View>
        </View>

        {/* Valores */}
        <View style={styles.valuesSection}>
          <Text style={styles.sectionTitle}>Valores</Text>

          <View style={styles.valueRow}>
            <Text style={styles.valueLabel}>Subtotal</Text>
            <Text style={styles.valueAmount}>JP {ticket.pontos}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>JP {ticket.pontos}</Text>
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
