// =============================================================
// Tipos TypeScript que espelham os modelos do backend Django
// =============================================================

/** Estabelecimento (loja parceira) */
export interface Estabelecimento {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
  descricao: string;
  logotipo: string | null;
  cnpj: string;
  horario_funcionamento: Record<string, string>;
  media_avaliacoes: number | null;
}

/** Anúncio/oferta de um estabelecimento */
export interface Anuncio {
  id: number;
  estabelecimento: number;
  imagem: string | null;
  data_expiracao: string;
}

/** Produto de um estabelecimento */
export interface Produto {
  id: number;
  estabelecimento: number;
  estabelecimento_nome: string;
  estabelecimento_logo: string | null;
  estabelecimento_media_avaliacoes: number | null;
  estabelecimento_total_avaliacoes: number;
  nome: string;
  descricao: string;
  imagem: string | null;
  pontos: number;
}

/** Dados do usuário logado (cliente) retornados por GET /api/me/ */
export interface UserData {
  id: number;
  email: string;
  nome: string;
  cpf: string;
  telefone: string | null;
  pontos: number;
}

/** Par de tokens JWT */
export interface AuthTokens {
  access: string;
  refresh: string;
}

/** Dados para cadastro de cliente */
export interface RegisterData {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  password: string;
  password2: string;
}
