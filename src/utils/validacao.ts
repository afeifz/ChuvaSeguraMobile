export function somenteDigitos(valor: string): string {
  return valor.replace(/\D/g, '');
}

function digitoVerificador(base: string): number {
  let soma = 0;
  let peso = base.length + 1;
  for (const caractere of base) {
    soma += Number(caractere) * peso;
    peso -= 1;
  }
  const resto = (soma * 10) % 11;
  return resto === 10 ? 0 : resto;
}

/** Valida CPF (11 dígitos, não repetidos e com dígitos verificadores corretos). */
export function cpfValido(cpf: string): boolean {
  const d = somenteDigitos(cpf);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const primeiro = digitoVerificador(d.slice(0, 9));
  const segundo = digitoVerificador(d.slice(0, 9) + String(primeiro));
  return d[9] === String(primeiro) && d[10] === String(segundo);
}

export function formatarCpf(valor: string): string {
  const d = somenteDigitos(valor).slice(0, 11);
  const p1 = d.slice(0, 3);
  const p2 = d.slice(3, 6);
  const p3 = d.slice(6, 9);
  const p4 = d.slice(9, 11);
  let saida = p1;
  if (p2) saida += `.${p2}`;
  if (p3) saida += `.${p3}`;
  if (p4) saida += `-${p4}`;
  return saida;
}

export function telefoneValido(telefone: string): boolean {
  const tamanho = somenteDigitos(telefone).length;
  return tamanho === 10 || tamanho === 11;
}

export interface ErrosCadastro {
  nome?: string;
  cpf?: string;
  telefone?: string;
  bairro?: string;
  logradouro?: string;
  numero?: string;
}

export interface DadosCadastro {
  nome: string;
  cpf: string;
  telefone: string;
  bairro: string;
  logradouro: string;
  numero: string;
}

/** Valida o formulário de cadastro e devolve uma mensagem simples por campo com problema. */
export function validarCadastro(dados: DadosCadastro): ErrosCadastro {
  const erros: ErrosCadastro = {};
  if (dados.nome.trim().length < 3) erros.nome = 'Informe o nome (mínimo 3 letras).';
  if (!cpfValido(dados.cpf)) erros.cpf = 'CPF inválido. Use um CPF fictício válido.';
  if (!telefoneValido(dados.telefone)) erros.telefone = 'Informe o telefone com DDD (10 ou 11 números).';
  if (dados.bairro.trim().length < 2) erros.bairro = 'Informe o bairro.';
  if (dados.logradouro.trim().length < 3) erros.logradouro = 'Informe a rua ou avenida.';
  if (dados.numero.trim().length < 1) erros.numero = 'Informe o número.';
  return erros;
}

export interface ErrosOcorrencia {
  local?: string;
  descricao?: string;
}

export function validarOcorrencia(local: string, descricao: string): ErrosOcorrencia {
  const erros: ErrosOcorrencia = {};
  if (local.trim().length < 3) erros.local = 'Diga onde foi (ex.: Rua Exemplo, 100).';
  if (descricao.trim().length < 5) erros.descricao = 'Descreva o que aconteceu (mínimo 5 letras).';
  return erros;
}
