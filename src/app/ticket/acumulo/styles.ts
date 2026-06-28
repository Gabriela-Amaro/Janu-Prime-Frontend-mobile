import { StyleSheet } from "react-native";
import { colors } from "../../../constants/Colors";
import { FontFamily, FontSize } from "../../../constants/Fonts";

export const styles = StyleSheet.create({
  // ─── Layout ─────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },

  // ─── Header ─────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.separator,
  },
  backButton: {
    backgroundColor: "transparent",
  },
  headerTitle: {
    textAlign: "center",
    flex: 1,
    fontSize: FontSize.subtitle,
    fontFamily: FontFamily.bold,
    color: colors.textPrimary,
  },

  // ─── Info do Estabelecimento ────────────────────────
  establishmentSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  establishmentInfo: {
    flex: 1,
    marginRight: 12,
  },
  establishmentName: {
    fontSize: 18,
    fontFamily: FontFamily.bold,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: FontSize.small,
    fontFamily: FontFamily.medium,
    color: colors.textPrimary,
  },
  ratingStars: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingCount: {
    fontSize: FontSize.small,
    fontFamily: FontFamily.regular,
    color: colors.gray[500],
    marginLeft: 4,
  },
  establishmentLogo: {
    width: 56,
    height: 56,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 99,
    backgroundColor: colors.brown[400],
    justifyContent: "center",
    alignItems: "center",
  },
  logoPlaceholderText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: FontFamily.bold,
  },

  // ─── Ticket Info ────────────────────────────────────
  ticketInfoSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.separator,
  },
  ticketCode: {
    fontSize: FontSize.body,
    fontFamily: FontFamily.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  ticketDate: {
    fontSize: FontSize.description,
    fontFamily: FontFamily.regular,
    color: colors.gray[500],
  },

  // ─── Nota Fiscal Card ──────────────────────────────
  notaCard: {
    flexDirection: "row",
    padding: 20,
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: colors.separator,
  },
  notaImage: {
    width: 80,
    height: 90,
    borderRadius: 8,
  },
  notaImagePlaceholder: {
    width: 80,
    height: 90,
    borderRadius: 8,
    backgroundColor: colors.brown[100],
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: colors.gray[500],
    fontSize: FontSize.small,
    fontFamily: FontFamily.regular,
  },
  notaDetails: {
    flex: 1,
    marginLeft: 16,
  },
  notaNumero: {
    fontSize: FontSize.body,
    fontFamily: FontFamily.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  notaValor: {
    fontSize: FontSize.description,
    fontFamily: FontFamily.regular,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 6,
  },
  notaDataEmissao: {
    fontSize: FontSize.small,
    fontFamily: FontFamily.regular,
    color: colors.gray[500],
  },

  // ─── Valores ───────────────────────────────────────
  valuesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: FontSize.subtitle,
    fontFamily: FontFamily.bold,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  valueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  valueLabel: {
    fontSize: FontSize.body,
    fontFamily: FontFamily.regular,
    color: colors.gray[700],
  },
  valueAmount: {
    fontSize: FontSize.body,
    fontFamily: FontFamily.regular,
    color: colors.textPrimary,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.separator,
  },
  totalLabel: {
    fontSize: FontSize.body,
    fontFamily: FontFamily.bold,
    color: colors.textPrimary,
  },
  totalAmount: {
    fontSize: FontSize.subtitle,
    fontFamily: FontFamily.bold,
    color: colors.textPrimary,
  },

  // ─── Footer ────────────────────────────────────────
  footer: {
    padding: 20,
    position: "absolute",
    bottom: 32,
    right: 0,
  },
  cancelButton: {
    backgroundColor: colors.error,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 28,
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: colors.white,
    fontSize: FontSize.body,
    fontFamily: FontFamily.medium,
  },
  cancelButtonDisabled: {
    backgroundColor: colors.gray[500],
  },

  // ─── Status Bar ────────────────────────────────────
  statusBar: {
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  statusBarText: {
    color: colors.white,
    fontSize: FontSize.description,
    fontFamily: FontFamily.regular,
  },

  // ─── Loading / Error ───────────────────────────────
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundPrimary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.backgroundPrimary,
  },
  errorText: {
    fontSize: FontSize.body,
    fontFamily: FontFamily.regular,
    color: colors.errorDark,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.orange,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  retryButtonText: {
    color: colors.white,
    fontSize: FontSize.body,
    fontFamily: FontFamily.bold,
  },

  // ─── Observação (motivo de recusa) ─────────────────
  observacaoSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  observacaoLabel: {
    fontSize: FontSize.description,
    fontFamily: FontFamily.bold,
    color: colors.errorDark,
    marginBottom: 4,
  },
  observacaoText: {
    fontSize: FontSize.description,
    fontFamily: FontFamily.regular,
    color: colors.gray[700],
    lineHeight: 20,
  },
});
