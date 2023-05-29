import { Usuario } from "@prisma/client";
import { ContaEntrada } from "dtos/AccountDTO";
import { EnderecoEntrada } from "dtos/AddressDTO";
import { FullUsuarioEntrada, UpdateUsuarioDados } from "dtos/UserDTO";

//VERIFICAR NOME
export function validacaoNome(nome: string): boolean {
  var regexNome =
    /^[[a-zA-Z\u00C0-\u00FF ]{3,}(?: [a-zA-Z\u00C0-\u00FF ]+){1,}$/;
  if (!regexNome.test(nome)) {
    return false;
  }
  return true;
}

//VERIFICAR TELEFONE
export function validacaoTelefone(telefone: string): boolean {
  var regexTelefone = /^[0-9]+$/;
  if (!regexTelefone.test(telefone)) {
    return false;
  }
  return true;
}

export function validacaoTelefoneTamanho(telefone: string): boolean {
  if (telefone.length != 11) {
    return false;
  }
  return true;
}

export function validacaoTelefoneDDD(telefone: string): boolean {
  var regexTelefoneDDD =
    /^(11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|48|49|50|51|52|53|54|55|56|57|58|59|60|61|62|63|64|65|66|67|68|69|70|71|72|73|74|75|76|77|78|79|80|81|82|83|84|85|86|87|88|89|90|91|92|93|94|95|96|97|98|99)/;
  if (!regexTelefoneDDD.test(telefone)) {
    return false;
  }
  return true;
}

//VERIFICAR CPF
function validacaoCPFformato(cpf: string): boolean {
  var regexCPF = /^[0-9]+$/;
  if (!regexCPF.test(cpf)) {
    return false;
  }
  return true;
}

function validacaoCPFtamanho(cpf: string): boolean {
  if (cpf.length != 11) {
    return false;
  }
  return true;
}

function validacaoCPFdigito(cpf: string): boolean {
  var cpf: string = cpf.replace(/[.\-|]/g, "");
  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) {
    resto = 0;
  }

  if (resto !== parseInt(cpf.substring(9, 10))) {
    return false;
  }

  soma = 0;

  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) {
    resto = 0;
  }

  if (resto !== parseInt(cpf.substring(10, 11))) {
    return false;
  }

  return true;
}

//VERIFICAR EMAIL
function validacaoEmail(email: string): boolean {
  var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexEmail.test(email);
}

//VERIFICAR SENHA
function validacaoSenha(senha: string): boolean {
  var regexSenha =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!regexSenha.test(senha)) {
    return false;
  }
  return true;
}

//VERIFICACAO DE ENDEREÇO//

function validacaoCEP(cep: string): boolean {
  var regexCEP = /^\d{8}$/;
  if (!regexCEP.test(cep)) {
    return false;
  }
  return true;
}

//VERIFICAÇÃO CONTA//

function validacaoSenhaTransacional(senha_transacional: string): boolean {
  var regexSenhaTransacional = /^\d{4}$/;
  if (!regexSenhaTransacional.test(senha_transacional)) {
    return false;
  }
  return true;
}

export function validacaoDadosUsuario(
  usuario: FullUsuarioEntrada,
  endereco: EnderecoEntrada,
  conta_bancaria: ContaEntrada
) {
  var arrErrors = [];
  // validações de usuário//

  if (!validacaoNome(usuario.nome_completo)) {
    arrErrors.push({ error: "REG-01", message: "Insira seu nome completo" });
  }

  if (!validacaoTelefone(usuario.telefone)) {
    arrErrors.push({ error: "REG-02A", message: "Apenas números" });
  }

  if (!validacaoTelefoneTamanho(usuario.telefone)) {
    arrErrors.push({
      error: "REG-02B",
      message: "Telefone deve possuir 11 dígitos",
    });
  }

  if (!validacaoTelefoneDDD(usuario.telefone)) {
    arrErrors.push({ error: "REG-02C", message: "DDD inválido" });
  }

  if (!validacaoEmail(usuario.email)) {
    arrErrors.push({ error: "REG-O3", message: "Email inválido" });
  }

  if (!validacaoCPFformato(usuario.cpf)) {
    arrErrors.push({ error: "REG-04C", message: "Apenas números" });
  }

  if (!validacaoCPFtamanho(usuario.cpf)) {
    arrErrors.push({ error: "REG-04A", message: "CPF não possui 11 dígitos" });
  }

  if (!validacaoCPFdigito(usuario.cpf)) {
    arrErrors.push({ error: "REG-04B", message: "CPF inválido" });
  }
  if (!validacaoSenha(usuario.senha)) {
    arrErrors.push({
      error: "REG-05",
      message:
        "Sua senha deve ter no mínimo oito dígitos, uma letra maiúscula, uma letra minúscula, um número, um caractere especial(@$!%*?&)",
    });
  }
  if (!validacaoCEP(endereco.cep)) {
    arrErrors.push({
      error: "RE0-06",
      message: "Erro: O CEP deve respeitar o formato 12345-123",
    });
  }

  if (!validacaoSenhaTransacional(conta_bancaria.senha_transacional)) {
    arrErrors.push({
      error: "REG-07",
      message: "Erro: Sua senha deve ter quatro dígitos númericos",
    });
  }

  return arrErrors;
}

//UPDATE VALIDATIONS//

export function updateUserValidations(updateUser: UpdateUsuarioDados, usuarioAlvo: Usuario | null){
  if(usuarioAlvo){
    var arrErrors = []
    
    if(updateUser.nome_completo === usuarioAlvo.nome_completo){
      arrErrors.push({error:"ATT-06",message:"Novo nome não pode ser igual ao atual",})
    }

    if(updateUser.telefone === usuarioAlvo.telefone){
      arrErrors.push({error:"ATT-07",message:"Novo telefone não pode ser igual ao atual",})          
    }

    if(updateUser.email === usuarioAlvo.email){
      arrErrors.push({error:"ATT-08",message:"Novo email não pode ser igual ao atual",})
    }

    if(updateUser.nome_completo != ""){
      var regexNome = /^[[a-zA-Z\u00C0-\u00FF ]{3,}(?: [a-zA-Z\u00C0-\u00FF ]+){1,}$/;
      if (!regexNome.test(updateUser.nome_completo)) {
        arrErrors.push({error: "ATT-03", message: "Insira seu nome completo"})
      }
    } else {
      updateUser.nome_completo = usuarioAlvo?.nome_completo
    }
    
    if(updateUser.email != ""){
      var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!regexEmail.test(updateUser.email)){
        arrErrors.push({ error: "ATT-O4", message: "Email inválido" })
      }
    } else {
      updateUser.email = usuarioAlvo.email
    }

    if(updateUser.telefone != ""){
      var regexTelefone = /^(1[1-9]|[2-9][0-9])\d{9}$/
      if(!regexTelefone.test(updateUser.telefone)){
        arrErrors.push({ error: "ATT-O5", message: "Telefone inválido" })
      }
    } else {
      updateUser.telefone = usuarioAlvo.telefone
    }

    return arrErrors
  }

}

//VALIDACAO UPDATE ENDERECO//

export function updateAddressValidations(enderecoUpdate:EnderecoEntrada, enderecoAlvo: EnderecoEntrada | null ){
  if(enderecoAlvo){
    var regexCEP = /^\d{8}$/;
      if(!regexCEP.test(enderecoUpdate.cep)){
            return{
              error:"ATT-08",
              message:"Seu CEP deve conter apenas 8 caractéres alfanuméricos",
            }
          }
    if(enderecoUpdate.cep == "")
      return {message:"Todos os dados do novo endereço devem estar preenchidos"}
    if(enderecoUpdate.rua == "")
      return {message:"Todos os dados do novo endereço devem estar preenchidos"}
    if(enderecoUpdate.bairro == "")
      return {message:"Todos os dados do novo endereço devem estar preenchidos"}
    if(enderecoUpdate.cidade == "")
      return {message:"Todos os dados do novo endereço devem estar preenchidos"}
    if(enderecoUpdate.numero == null)
      return {message:"Todos os dados do novo endereço devem estar preenchidos"}
  }

}