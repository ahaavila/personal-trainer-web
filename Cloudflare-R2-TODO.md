# Cloudflare R2 - Checklist de configuração final

## 1) Criar a conta e obter acesso
- [ ] Criar conta no Cloudflare, se ainda não existir
- [ ] Entrar no dashboard da conta
- [ ] Acessar a área de R2
- [ ] Verificar se o plano/conta permite uso do R2
- [ ] Confirmar que a conta está ativa e acessível

## 2) Criar o bucket
- [ ] Criar um bucket para a aplicação (ex.: `fitforge-exercicios`)
- [ ] Definir nome do bucket
- [ ] Confirmar que será usado para arquivos privados de exercícios
- [ ] Decidir se será usado um bucket dedicado ou um bucket geral com prefixos

## 3) Configurar permissões, CORS e segurança
- [ ] Garantir que o bucket seja privado por padrão
- [ ] Configurar a política de CORS no Cloudflare R2 para permitir uploads do frontend:
  ```json
  [
    {
      "AllowedOrigins": [
        "http://localhost:5173",
        "http://localhost:3000"
      ],
      "AllowedMethods": [
        "GET",
        "PUT",
        "POST",
        "DELETE",
        "HEAD"
      ],
      "AllowedHeaders": [
        "*"
      ],
      "ExposeHeaders": [],
      "MaxAgeSeconds": 3600
    }
  ]
  ```
- [ ] Não expor o bucket publicamente sem necessidade
- [ ] Planejar uso de URLs assinadas para upload/download
- [ ] Confirmar que a app/backend será a única entidade a emitir credenciais
- [ ] Definir política mínima necessária para upload/consulta do bucket

## 4) Obter as credenciais
- [ ] Abrir as chaves de acesso do R2
- [ ] Copiar:
  - [ ] `R2_ACCOUNT_ID`
  - [ ] `R2_ACCESS_KEY_ID`
  - [ ] `R2_SECRET_ACCESS_KEY`
  - [ ] `R2_BUCKET_NAME`
- [ ] Guardar as credenciais em um ambiente seguro
- [ ] Não commitar chaves no repositório
- [ ] Usar `.env` local ou secret manager do deploy

## 5) Configurar variáveis do backend
- [ ] Definir `R2_ENABLED=true`
- [ ] Definir `R2_ACCOUNT_ID`
- [ ] Definir `R2_ACCESS_KEY_ID`
- [ ] Definir `R2_SECRET_ACCESS_KEY`
- [ ] Definir `R2_BUCKET_NAME`
- [ ] Definir `R2_PUBLIC_BASE_URL` apenas se necessário
- [ ] Validar que o backend consegue se conectar ao bucket

## 6) Validar o fluxo da app
- [ ] Testar login como personal
- [ ] Acessar a tela de criação de exercício
- [ ] Selecionar uma imagem válida
- [ ] Validar tamanho e tipo permitidos
- [ ] Confirmar upload direto para o R2
- [ ] Confirmar que o exercício aparece na biblioteca do personal
- [ ] Testar upload de vídeo válido
- [ ] Testar arquivo inválido (tipo ou tamanho fora do esperado)

## 7) Testar privacidade e segurança
- [ ] Verificar que aluno não consegue ver exercícios de outro personal
- [ ] Verificar que personal não consegue acessar media de outro personal
- [ ] Confirmar que a API retorna 404 para recursos de outro owner
- [ ] Confirmar que não há vazamento de credenciais no frontend

## 8) Deploy/finalização
- [ ] Validar a configuração em ambiente de staging
- [ ] Validar acesso real via deploy
- [ ] Confirmar que a app funciona em produção com `R2_ENABLED=true`
- [ ] Registrar as credenciais no ambiente correto do deploy
- [ ] Documentar o fluxo para manutenção futura

## 9) Observações
- [ ] O bucket deve permanecer privado
- [ ] O upload direto deve ser feito via URL assinada emitida pelo backend
- [ ] A criação do exercício deve continuar funcionando mesmo com `R2_ENABLED=false`
- [ ] Os arquivos de mídia são opcionais no MVP
