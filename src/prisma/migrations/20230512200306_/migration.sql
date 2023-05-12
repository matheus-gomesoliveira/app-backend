-- CreateEnum
CREATE TYPE "status_transfer" AS ENUM ('pendente', 'confirmada', 'recusada');

-- CreateEnum
CREATE TYPE "status_conta" AS ENUM ('ativa', 'inativa', 'bloqueada');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome_completo" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "data_nascimento" DATE NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Endereco" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "cep" TEXT NOT NULL,
    "rua" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "UF" VARCHAR(2) NOT NULL,
    "complemento" TEXT NOT NULL,

    CONSTRAINT "Endereco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conta_Bancaria" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "numero_conta" TEXT NOT NULL,
    "agencia" TEXT NOT NULL DEFAULT '0001',
    "saldo" DOUBLE PRECISION NOT NULL,
    "senha_transacional" VARCHAR(4) NOT NULL,
    "nome_banco" TEXT NOT NULL DEFAULT 'RubBank',
    "status_conta" "status_conta" NOT NULL,

    CONSTRAINT "Conta_Bancaria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transferencia" (
    "id" SERIAL NOT NULL,
    "id_remetente" INTEGER NOT NULL,
    "id_destinatario" INTEGER NOT NULL,
    "data_transferencia" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valor" DOUBLE PRECISION NOT NULL,
    "descricao" TEXT NOT NULL,
    "status" "status_transfer" NOT NULL,

    CONSTRAINT "Transferencia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_telefone_key" ON "Usuario"("telefone");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cpf_key" ON "Usuario"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Endereco_id_usuario_key" ON "Endereco"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Conta_Bancaria_id_usuario_key" ON "Conta_Bancaria"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Conta_Bancaria_numero_conta_key" ON "Conta_Bancaria"("numero_conta");

-- CreateIndex
CREATE UNIQUE INDEX "Transferencia_id_remetente_key" ON "Transferencia"("id_remetente");

-- CreateIndex
CREATE UNIQUE INDEX "Transferencia_id_destinatario_key" ON "Transferencia"("id_destinatario");

-- AddForeignKey
ALTER TABLE "Endereco" ADD CONSTRAINT "Endereco_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conta_Bancaria" ADD CONSTRAINT "Conta_Bancaria_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transferencia" ADD CONSTRAINT "Transferencia_id_remetente_fkey" FOREIGN KEY ("id_remetente") REFERENCES "Conta_Bancaria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transferencia" ADD CONSTRAINT "Transferencia_id_destinatario_fkey" FOREIGN KEY ("id_destinatario") REFERENCES "Conta_Bancaria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
