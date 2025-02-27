
# IAtest - Ferramenta para geração de testes automatizados usando IA 🚀

**iatest** é uma ferramenta de terminal que gera testes automatizados para seu código JavaScript usando **OpenAI** ou **Groq**. Basta fornecer um arquivo JavaScript, e o iatest criará um arquivo de teste correspondente, pronto para ser usado com **Jest**.

Atualmente, o iatest suporta apenas **Node.js** e gera testes usando o framework **Jest**. No entanto, nosso objetivo é expandir a ferramenta para suportar mais bibliotecas de teste (como Mocha, Ava, etc.) e outras plataformas (como Python, Java, etc.). Contribuições são bem-vindas! Se você quiser ajudar, confira as orientações no final deste README.

---

## Instalação

Instale o globalmente via npm:
```markdown
npm install -g iatest
```

---

## Como Usar

### 1. Configure suas Chaves de API

Crie um arquivo `.env` no diretório onde você deseja usar a ferramenta e adicione sua chave da **OpenAI** ou **Groq**:

```env
OPENAI_API_KEY=sua_chave_aqui
# OU
GROQ_API_KEY=sua_chave_aqui
```

> **Nota:** Se você não tem uma chave da OpenAI, crie uma em [OpenAI](https://platform.openai.com/).  
> Se você não tem uma chave da Groq, crie uma em [Groq](https://console.groq.com/).

### 2. Execute a Ferramenta

Use o comando `iatest` passando o caminho do arquivo JavaScript que deseja testar:

```bash
iatest ./caminho/para/seu/arquivo.js
```

### 3. Resultado

Um arquivo de teste será gerado no mesmo diretório do arquivo original. Por exemplo, se o arquivo for `crud.js`, o arquivo de teste será `crud.test.js`.

---

## Exemplo Prático

### Arquivo de Entrada (`crud.js`)

```javascript
function criar() {
  return { id: 1, nome: "Exemplo" };
}

function ler(id) {
  return { id, nome: "Exemplo" };
}

function atualizar(id, novosDados) {
  return { id, ...novosDados };
}

function deletar(id) {
  return { id, status: "deletado" };
}

module.exports = { criar, ler, atualizar, deletar };
```

### Comando no Terminal

```bash
iatest ./src/crud.js
```

### Arquivo de Saída (`crud.test.js`)

```javascript
const { criar, ler, atualizar, deletar, listar, buscarPorNome } = require('./crud');
const { describe, it, expect } = require('@jest/globals');

describe('CRUD Operations', () => {
  describe('criar', () => {
    it('deve criar um novo item com um nome válido', () => {
      const item = criar('Item 1');
      expect(item).toHaveProperty('id');
      expect(item.nome).toBe('Item 1');
    });

    it('deve lançar um erro ao criar um item sem nome', () => {
      expect(() => criar('')).toThrow('O nome é obrigatório.');
    });
  });

  describe('ler', () => {
    it('deve retornar um item existente pelo id', () => {
      const itemCriado = criar('Item 2');
      const itemLido = ler(itemCriado.id);
      expect(itemLido).toEqual(itemCriado);
    });

    it('deve lançar um erro ao tentar ler um item não existente', () => {
      expect(() => ler(999)).toThrow('Item não encontrado.');
    });
  });

  describe('atualizar', () => {
    it('deve atualizar um item existente com dados válidos', () => {
      const itemCriado = criar('Item 3');
      const itemAtualizado = atualizar(itemCriado.id, { nome: 'Item 3 Atualizado' });
      expect(itemAtualizado.nome).toBe('Item 3 Atualizado');
    });

    it('deve lançar um erro ao tentar atualizar um item não existente', () => {
      expect(() => atualizar(999, { nome: 'NaoExistente' })).toThrow('Item não encontrado.');
    });
  });

  describe('deletar', () => {
    it('deve deletar um item existente pelo id', () => {
      const itemCriado = criar('Item 4');
      const itemDeletado = deletar(itemCriado.id);
      expect(itemDeletado.status).toBe('deletado');
    });

    it('deve lançar um erro ao tentar deletar um item não existente', () => {
      expect(() => deletar(999)).toThrow('Item não encontrado.');
    });
  });

  describe('listar', () => {
    it('deve listar todos os itens', () => {
      criar('Item 5');
      const lista = listar();
      expect(lista.length).toBeGreaterThan(0);
    });
  });

  describe('buscarPorNome', () => {
    it('deve retornar itens que correspondem ao nome fornecido', () => {
      criar('BuscaTeste');
      const resultados = buscarPorNome('Busca');
      expect(resultados.length).toBeGreaterThan(0);
    });

    it('deve retornar uma lista vazia se nenhum item corresponde ao nome', () => {
      const resultados = buscarPorNome('NaoExistente');
      expect(resultados.length).toBe(0);
    });
  });
});
```

---

## Expansão Futura e Contribuições

Atualmente, o **iatest** suporta apenas **Node.js** e gera testes usando o framework **Jest**. No entanto, nosso objetivo é expandir a ferramenta para suportar:

- **Mais bibliotecas de teste:** Mocha, Ava, Tape, Junit, etc.
- **Mais plataformas:** Python, Java, Ruby, etc.

Se você quiser contribuir para o projeto, confira as orientações abaixo na seção **Contribuindo**. Sua ajuda é muito bem-vinda! 🚀

---

## Contribuindo

Contribuições são bem-vindas! Siga os passos abaixo:

1. Faça um fork do repositório.
2. Crie uma branch com sua feature (`git checkout -b feature/nova-feature`).
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`).
4. Faça push para a branch (`git push origin feature/nova-feature`).
5. Abra um Pull Request.

---

## Licença

Este projeto está licenciado sob a **MIT License**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## Contato

Se tiver dúvidas, sugestões ou quiser reportar um problema, entre em contato:

- **Email:** bruno.contatododev@gmail.com
- **GitHub:** [odevbruno](https://github.com/odevbruno)
