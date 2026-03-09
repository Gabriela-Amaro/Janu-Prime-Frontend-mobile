import { StyleSheet } from "react-native";
import { colors } from "../../../constants/Colors";
import { FontFamily, FontSize } from "../../../constants/Fonts";

export const styles = StyleSheet.create({
  headerContent: {
    alignItems: "center",
  },
  headerLabel: {
    fontSize: FontSize.description,
    fontFamily: FontFamily.regular,
    color: colors.gray[700],
  },
  headerPoints: {
    fontSize: 28,
    fontFamily: FontFamily.bold,
    color: colors.brown[800],
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  sectionTitle: {
    fontSize: FontSize.title,
    fontFamily: FontFamily.medium,
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 4,
  },
  dateLabel: {
    fontSize: FontSize.small,
    fontFamily: FontFamily.regular,
    color: colors.gray[700],
    marginTop: 12,
    marginBottom: 8,
  },
  // Card de transação (em andamento)
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: FontSize.body,
    fontFamily: FontFamily.bold,
    color: colors.textPrimary,
  },
  cardPoints: {
    fontSize: FontSize.body,
    fontFamily: FontFamily.medium,
  },
  pointsPositive: {
    color: colors.successDark,
  },
  pointsNegative: {
    color: colors.error,
  },
  pointsMuted: {
    color: colors.gray[500],
  },
  // Linha da loja
  storeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  storeLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  storeLogoPlaceholder: {
    backgroundColor: colors.brown[400],
    justifyContent: "center",
    alignItems: "center",
  },
  storeLogoText: {
    fontSize: 10,
    fontFamily: FontFamily.bold,
    color: colors.white,
  },
  storeDetails: {
    flex: 1,
  },
  storeName: {
    fontSize: FontSize.small,
    fontFamily: FontFamily.medium,
    color: colors.textSecondary,
  },
  storeRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  storeRatingText: {
    fontSize: FontSize.small,
    fontFamily: FontFamily.regular,
    color: colors.textPrimary,
  },
  acompanharRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.separator,
    gap: 4,
  },
  acompanharText: {
    fontSize: FontSize.description,
    fontFamily: FontFamily.medium,
    color: colors.brown[800],
  },
  // Card de transação (finalizado)
  cardFinalizado: {
    borderWidth: 1,
    // borderLeftWidth: 2, 
    // borderBottomWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  statusBadge: {
    fontSize: FontSize.small,
    fontFamily: FontFamily.bold,
    marginBottom: 8,
  },
  statusAprovado: {
    color: colors.successDark,
  },
  statusConcluido: {
    color: colors.successDark,
  },
  statusCancelado: {
    color: colors.gray[700],
  },
  statusRecusado: {
    color: colors.errorDark,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  notaText: {
    fontSize: FontSize.small,
    fontFamily: FontFamily.regular,
    color: colors.gray[700],
  },
  avalieRow: {
    paddingTop: 6,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.separator,
  },
  avalieText: {
    fontSize: FontSize.small,
    fontFamily: FontFamily.regular,
    color: colors.gray[700],
    marginBottom: 4,
  },
  starsRow: {
    flexDirection: "row",
    gap: 4,
  },
  detalhesRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.separator,
    gap: 4,
  },
  detalhesText: {
    fontSize: FontSize.description,
    fontFamily: FontFamily.medium,
    color: colors.brown[800],
  },
  emptyText: {
    fontSize: FontSize.body,
    fontFamily: FontFamily.regular,
    color: colors.gray[700],
    textAlign: "center",
    marginTop: 40,
  },
  // Barra Ordenar + Filtro
  toolbarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
    zIndex: 10,
  },
  ordenarBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  ordenarBtnText: {
    fontSize: FontSize.description,
    fontFamily: FontFamily.medium,
    color: colors.textPrimary,
  },
  // Dropdown menu
  dropdownMenu: {
    position: "absolute",
    top: 38,
    left: 0,
    backgroundColor: colors.backgroundPrimary,
    borderRadius: 10,
    paddingVertical: 6,
    minWidth: 160,
    shadowColor: colors.black[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 20,
  },
  dropdownMenuRight: {
    left: undefined as unknown as number,
    right: 0,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  dropdownItemText: {
    fontSize: FontSize.description,
    fontFamily: FontFamily.regular,
    color: colors.textPrimary,
  },
  dropdownItemActive: {
    color: colors.brown[800],
    fontFamily: FontFamily.bold,
  },
});
