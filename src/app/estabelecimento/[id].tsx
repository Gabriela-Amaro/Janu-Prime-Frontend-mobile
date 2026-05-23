import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, ChevronRight, ClipboardList, Star } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../constants/Colors";
import { api, BASE_URL } from "../../services/api";
import type { Estabelecimento, Produto } from "../../types";
import { styles } from "./styles";

interface FotoEspaco {
  id: number;
  estabelecimento: number;
  foto: string;
}

const SCREEN_WIDTH = Dimensions.get("window").width;

/** Retorna se o estabelecimento está aberto agora */
function getHorarioStatus(horario: Record<string, string>): {
  isOpen: boolean;
  label: string;
} {
  const diasMap: Record<number, string> = {
    0: "domingo",
    1: "segunda",
    2: "terca",
    3: "quarta",
    4: "quinta",
    5: "sexta",
    6: "sabado",
  };

  const now = new Date();
  const diaKey = diasMap[now.getDay()];
  const horarioHoje = horario?.[diaKey];

  if (!horarioHoje || horarioHoje.toLowerCase() === "fechado") {
    return { isOpen: false, label: "Fechado" };
  }

  const match = horarioHoje.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
  if (match) {
    const openH = parseInt(match[1]);
    const openM = parseInt(match[2]);
    const closeH = parseInt(match[3]);
    const closeM = parseInt(match[4]);
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
      return { isOpen: true, label: `Aberto · Fecha às ${match[3]}:${match[4]}` };
    }
    return { isOpen: false, label: `Fechado · Abre às ${match[1]}:${match[2]}` };
  }

  return { isOpen: true, label: horarioHoje };
}

function ProductCard({ produto }: { produto: Produto }) {
  const imageUrl = produto.imagem
    ? produto.imagem.startsWith("http")
      ? produto.imagem
      : `${BASE_URL}${produto.imagem}`
    : null;

  return (
    <View style={styles.productCard}>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{produto.nome}</Text>
        {produto.descricao ? (
          <Text style={styles.productDesc} numberOfLines={2}>
            {produto.descricao}
          </Text>
        ) : null}
        <Text style={styles.productPoints}>JP {produto.pontos}</Text>
      </View>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.productImage} />
      ) : (
        <View style={[styles.productImage, styles.productImagePlaceholder]}>
          <Text style={{ color: colors.gray[500], fontSize: 12 }}>Sem foto</Text>
        </View>
      )}
    </View>
  );
}

export default function EstabelecimentoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [estabelecimento, setEstabelecimento] = useState<Estabelecimento | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [fotosUrls, setFotosUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const est = await api.get<Estabelecimento>(`/api/estabelecimentos/${id}/`);
      setEstabelecimento(est);

      const [prodsResult, fotosResult] = await Promise.allSettled([
        api.get<Produto[]>(`/api/produtos/?estabelecimento=${id}`),
        api.get<FotoEspaco[]>(`/api/fotos-espaco/?estabelecimento=${id}`),
      ]);

      if (prodsResult.status === "fulfilled") {
        setProdutos(prodsResult.value);
      }

      if (fotosResult.status === "fulfilled") {
        setFotosUrls(
          fotosResult.value
            .filter((f) => f.foto)
            .map((f) => (f.foto.startsWith("http") ? f.foto : `${BASE_URL}${f.foto}`))
        );
      }
    } catch (err) {
      console.error("Erro ao buscar estabelecimento:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={colors.brown[800]} />
      </View>
    );
  }

  if (!estabelecimento) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={styles.emptyText}>Estabelecimento não encontrado.</Text>
      </View>
    );
  }

  const logoUrl = estabelecimento.logotipo
    ? estabelecimento.logotipo.startsWith("http")
      ? estabelecimento.logotipo
      : `${BASE_URL}${estabelecimento.logotipo}`
    : null;

  const horarioStatus = getHorarioStatus(estabelecimento.horario_funcionamento ?? {});
  const bannerHeight = 200;

  return (
    
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Banner — carrossel de fotos do espaço */}
        <View style={[styles.bannerContainer, { height: bannerHeight }]}>
          {fotosUrls.length > 0 ? (
            <Carousel
              loop
              autoPlay={fotosUrls.length > 1}
              autoPlayInterval={3000}
              data={fotosUrls}
              width={SCREEN_WIDTH}
              height={bannerHeight}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  style={{ width: SCREEN_WIDTH, height: bannerHeight }}
                  resizeMode="cover"
                />
              )}
            />
          ) : null}
          <TouchableOpacity
            style={[styles.backButton, { top: 12 }]}
            onPress={() => router.back()}
          >
            <ChevronLeft size={20} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Logo circular */}
        <View style={styles.logoWrapper}>
          {logoUrl ? (
            <Image source={{ uri: logoUrl }} style={styles.logo} />
          ) : (
            <View style={[styles.logo, styles.logoPlaceholder]}>
              <Text style={styles.logoText}>
                {estabelecimento.nome.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        {/* Informações */}
        <View style={styles.infoSection}>
          {/* Nome */}
          <TouchableOpacity style={styles.nameRow}>
            <Text style={styles.name}>{estabelecimento.nome}</Text>
            <ChevronRight size={20} color={colors.gray[700]} />
          </TouchableOpacity>

          {/* Avaliação */}
          <TouchableOpacity style={styles.ratingRow}>
            {estabelecimento.media_avaliacoes != null ? (
              <>
                <Text style={styles.ratingText}>
                  {estabelecimento.media_avaliacoes.toFixed(1)}
                </Text>
                <Star size={14} color={colors.textPrimary} fill={colors.textPrimary} />
                <Text style={styles.ratingCount}>
                  ({estabelecimento.total_avaliacoes} Avaliações)
                </Text>
              </>
            ) : (
              <Text style={styles.ratingCount}>Sem avaliações</Text>
            )}
            <View style={{ flex: 1 }} />
            <ChevronRight size={18} color={colors.gray[700]} />
          </TouchableOpacity>

          {/* Horário */}
          <TouchableOpacity style={styles.hoursRow}>
            <Text style={styles.hoursLabel}>Horário de funcionamento: Hoje</Text>
            <View style={{ flex: 1 }} />
            <Text
              style={[
                styles.hoursStatus,
                horarioStatus.isOpen ? styles.hoursOpen : styles.hoursClosed,
              ]}
            >
              {horarioStatus.label}
            </Text>
            <ChevronRight size={18} color={colors.gray[700]} />
          </TouchableOpacity>
        </View>

        {/* Produtos */}
        <View style={styles.productsHeader}>
          <Text style={styles.productsTitle}>Produtos</Text>
        </View>

        {produtos.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum produto disponível.</Text>
        ) : (
          produtos.map((p) => <ProductCard key={p.id} produto={p} />)
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Botão Pontuar */}
      <TouchableOpacity style={styles.pontuarBtn}>
        <ClipboardList size={18} color={colors.white} />
        <Text style={styles.pontuarText}>Pontuar</Text>
      </TouchableOpacity>
    </View>
  );
}
